# Technologies Used
- Frontend: React, Vite, Google Auth, React Router, reapop Notifications
- Backend: Flask, SQLAlchemy, Supabase Database, Flask-CORS, Redis, Celery
- Deployment: Supabase, Ngrok

# Setup Instructions
1. Clone the repository.
2. Navigate to the `client` directory and install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Create a `.env` file in the `client` directory with the following variables:
   ```
   VITE_GOOGLE_CLIENT_ID='your_google_client_id_here'
VITE_GOOGLE_CLIENT_SECRET='your_google_client_secret_here'
VITE_API_URL= 'your_ngrok_or_dev_url_here'
    ```
4. Navigate to the `server` directory and install dependencies:
   ```bash  
    cd ../server
    pip install -r requirements.txt
    ```
5. Set up the server .env file.
```bash
REDIS_HOST='your_redis_host_here'
REDIS_PORT='your_redis_port_here'
REDIS_USERNAME='your_redis_username_here'
REDIS_PASSWORD='your_redis_password_here'
REDIS_URI='your_redis_uri_here'

SUPABASE_DB_NAME='your_database_name_here'
SUPABASE_DB_PASSWORD='your_database_password_here'
SUPABASE_DATABASE_URL='your_database_url_here'
SUPABASE_HOST='your_host_here'
SUPABASE_PORT='your_port_here'
SUPABASE_USER='your_username_here'
SUPABASE_DATABASE='your_database_name_here'

GOOGLE_CLIENT_ID='your_google_client_id_here'
GOOGLE_CLIENT_SECRET='your_google_client_secret_here'

CLOUDINARY_CLOUD_NAME='your_cloudinary_cloud_name_here'
CLOUDINARY_API_KEY='your_cloudinary_api_key_here'
CLOUDINARY_API_SECRET='your_cloudinary_api_secret_here'

OPENSSH_PRIVATE_KEY='your_openssh_private_key_here'
OPENSSH_PUBLIC_KEY='your_openssh_public_key_here'
OPENSSH_JWT_ALGORITHM='HS256'
```
6. Create the database tables by running the following commands for the first flask api run:
   ```python
   from app.extensions import db
   db.create_all()
   ```  
7. Create the required Supabase functions and triggers as per the documentation.
8. Start the Redis server.
9. Start Celery (In Progress)
10. Run the Flask server
11. Start the React development server:
```bash
npm run dev
```
12. Access the application at `http://localhost:5173` (or the port specified by Vite).
13. Use Ngrok to expose your local server for testing webhooks and external API calls.
ngrok.yml specifies the configuration for Ngrok.
Run the command:
```bash
ngrok start --all --config=ngrok.yml
```
14. Update the `VITE_API_URL` in the client `.env` file with the Ngrok URL for the Flask server.
15. Add the frontend URL to CORS allowed origins in the Flask server configuration.
16. Add the frontend URL to the Google OAuth 2.0 credentials in the Google Cloud Console in the client in authorized origins.
17. Add the backend url to the Google OAuth 2.0 credentials in the Google Cloud Console in the server in authorized redirect URIs.
# Notes
- Ensure that all environment variables are correctly set up in both the client and server `.env` files.
- Make sure to handle any additional configurations required for deployment if deploying to a production environment.

# Triggers and Functions in Supabase
- Create the following functions and triggers in your Supabase database to handle game state changes and notifications.
1. Function: manage_game_total_scores
```sql
CREATE OR REPLACE FUNCTION manage_game_total_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- CASE 1: Game is inserted as 'completed' or updated to 'completed'
    IF (TG_OP = 'INSERT' AND NEW.status = 'completed') OR 
       (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
        
        -- Aggregate round scores and insert into game_total_scores
        INSERT INTO game_total_scores (game_id, user_id, total_score)
        SELECT 
            r.game_id, 
            prs.user_id, 
            SUM(prs.score) as total_score
        FROM rounds r
        JOIN player_round_scores prs ON r.round_id = prs.round_id
        WHERE r.game_id = NEW.game_id
        GROUP BY r.game_id, prs.user_id
        ON CONFLICT (game_id, user_id) 
        DO UPDATE SET total_score = EXCLUDED.total_score;

    -- CASE 2: Game is deleted
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM game_total_scores WHERE game_id = OLD.game_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```
Trigger: trg_manage_game_totals
```sql
CREATE TRIGGER trg_manage_game_totals
AFTER INSERT OR UPDATE OR DELETE ON games
FOR EACH ROW
EXECUTE FUNCTION manage_game_total_scores();
```

2. Function: sync_player_round_to_total
```sql 
CREATE OR REPLACE FUNCTION sync_player_round_to_total()
RETURNS TRIGGER AS $$
DECLARE
    v_game_id UUID;
    v_user_id UUID;
BEGIN
    -- 1. Identify the user and the game involved
    -- Use OLD for DELETE, NEW for INSERT/UPDATE
    IF (TG_OP = 'DELETE') THEN
        v_user_id := OLD.user_id;
        SELECT game_id INTO v_game_id FROM rounds WHERE round_id = OLD.round_id;
    ELSE
        v_user_id := NEW.user_id;
        SELECT game_id INTO v_game_id FROM rounds WHERE round_id = NEW.round_id;
    END IF;

    -- 2. Update the total_score in game_total_scores
    -- We recalculate the sum of all rounds for this game and user
    UPDATE game_total_scores
    SET total_score = (
        SELECT COALESCE(SUM(score), 0)
        FROM player_round_scores prs
        JOIN rounds r ON prs.round_id = r.round_id
        WHERE r.game_id = v_game_id AND prs.user_id = v_user_id
    )
    WHERE game_id = v_game_id AND user_id = v_user_id;

    -- Return result
    IF (TG_OP = 'DELETE') THEN RETURN OLD; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
Trigger: trg_sync_round_to_total
```sql
CREATE TRIGGER trg_sync_round_to_total
AFTER INSERT OR UPDATE OR DELETE ON player_round_scores
FOR EACH ROW
EXECUTE FUNCTION sync_player_round_to_total();
```
3. Function: update_user_games_played
```sql
CREATE OR REPLACE FUNCTION update_user_games_played()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Determine which user_id to update
    IF (TG_OP = 'DELETE') THEN
        target_user_id := OLD.user_id;
    ELSE
        target_user_id := NEW.user_id;
    END IF;

    -- Update the users table with the fresh count
    UPDATE users
    SET games_played = (
        SELECT COUNT(*) 
        FROM game_total_scores 
        WHERE user_id = target_user_id
    )
    WHERE user_id = target_user_id;
    
    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql;
```
Trigger: trigger_update_games_played
```sql
CREATE TRIGGER trigger_update_games_played
AFTER INSERT OR UPDATE OR DELETE ON game_total_scores
FOR EACH ROW
EXECUTE FUNCTION update_user_games_played();
```
4. Function: update_user_games_won
```sql
CREATE OR REPLACE FUNCTION update_user_games_won()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Handle both INSERT/UPDATE (NEW) and DELETE (OLD)
    IF (TG_OP = 'DELETE') THEN
        target_user_id := OLD.user_id;
    ELSE
        target_user_id := NEW.user_id;
    END IF;

    -- Update games_won for that user
    UPDATE users
    SET games_won = (
        SELECT COUNT(*) 
        FROM game_total_scores 
        WHERE user_id = target_user_id 
        AND rank <= 3  -- Logic for Top 3
    )
    WHERE user_id = target_user_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```
Trigger: trigger_update_games_won
```sql
CREATE TRIGGER trigger_update_games_won
AFTER INSERT OR UPDATE OR DELETE ON game_total_scores
FOR EACH ROW
EXECUTE FUNCTION update_user_games_won();
```

5. Function: update_room_scores_logic
```sql
CREATE OR REPLACE FUNCTION update_room_overall_score()
RETURNS TRIGGER AS $$

BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.status = 'completed' THEN
            UPDATE room_members
            SET overall_room_score = overall_room_score + gts.total_score
            FROM game_total_scores gts
            WHERE room_members.room_id = NEW.room_id 
              AND room_members.user_id = gts.user_id
              AND gts.game_id = NEW.game_id;
        END IF;

    ELSIF (TG_OP = 'UPDATE') THEN
        IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
            UPDATE room_members
            SET overall_room_score = overall_room_score + gts.total_score
            FROM game_total_scores gts
            WHERE room_members.room_id = NEW.room_id 
              AND room_members.user_id = gts.user_id
              AND gts.game_id = NEW.game_id;
        
        ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
             UPDATE room_members
             SET overall_room_score = overall_room_score - gts.total_score
             FROM game_total_scores gts
             WHERE room_members.room_id = OLD.room_id 
               AND room_members.user_id = gts.user_id
               AND gts.game_id = OLD.game_id;
        END IF;

    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.status = 'completed' THEN
            UPDATE room_members
            SET overall_room_score = overall_room_score - gts.total_score
            FROM game_total_scores gts
            WHERE room_members.room_id = OLD.room_id 
              AND room_members.user_id = gts.user_id
              AND gts.game_id = OLD.game_id;
        END IF;
    END IF;

    IF (TG_OP = 'DELETE') THEN RETURN OLD; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
Trigger: update_room_overall_score
```sql
CREATE TRIGGER update_room_overall_score
AFTER INSERT OR UPDATE OR DELETE ON games
FOR EACH ROW
EXECUTE FUNCTION update_room_overall_score();
```
6. Function: update_game_ranks_on_status_change
```sql 
CREATE OR REPLACE FUNCTION update_game_ranks_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- CASE 1: Game inserted as 'completed' OR updated from 'pending' to 'completed'
    IF (TG_OP = 'INSERT' AND NEW.status = 'completed') OR 
       (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
        
        -- Use a Common Table Expression (CTE) to calculate ranks for this specific game
        WITH ranked_players AS (
            SELECT 
                game_id, 
                user_id,
                RANK() OVER (PARTITION BY game_id ORDER BY total_score DESC) as new_rank
            FROM game_total_scores
            WHERE game_id = NEW.game_id
        )
        UPDATE game_total_scores gts
        SET rank = rp.new_rank
        FROM ranked_players rp
        WHERE gts.game_id = rp.game_id 
          AND gts.user_id = rp.user_id;

    -- CASE 2: Game is deleted
    -- Note: If you have ON DELETE CASCADE, the total_scores might disappear automatically.
    -- If not, you may want to clear the ranks or handle cleanup here.
    ELSIF (TG_OP = 'DELETE') THEN
        -- Standard practice is to let foreign keys handle the deletion of score records,
        -- but you can add custom cleanup logic here if necessary.
        NULL; 
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```
Trigger: trg_update_ranks_on_game_completion
```sql
CREATE TRIGGER trg_update_ranks_on_game_completion
AFTER INSERT OR UPDATE OR DELETE ON games
FOR EACH ROW
EXECUTE FUNCTION update_game_ranks_on_status_change();
```
7. Function: update_room_member_ranks
```sql
CREATE OR REPLACE FUNCTION update_room_member_ranks()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate ranks for ALL members in the specific room where a score just changed
    WITH ranked_members AS (
        SELECT 
            room_id, 
            user_id,
            RANK() OVER (
                PARTITION BY room_id 
                ORDER BY overall_room_score DESC
            ) as new_rank
        FROM room_members
        WHERE room_id = NEW.room_id
    )
    UPDATE room_members rm
    SET rank = ra.new_rank
    FROM ranked_members ra
    WHERE rm.room_id = ra.room_id 
      AND rm.user_id = ra.user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```
Trigger: trg_sync_room_ranks
```sql 
CREATE TRIGGER trg_sync_room_ranks
AFTER UPDATE OF overall_room_score ON room_members
FOR EACH ROW
EXECUTE FUNCTION update_room_member_ranks();
```

# Loading icons
- https://lottiefiles.com/free-animations/hourglass - Quest
- https://lottiefiles.com/free-animations/growing-ivy - Woodland
- https://lottiefiles.com/free-animations/pixellated-card-flip - Arcade
- https://lottiefiles.com/free-animation/globe-A37pxTwfZY - Space

# Redis 
The JSON structure you've provided is a great **conceptual model** for the data you want to track, but as a direct **Redis schema**, it needs some flattening to be performant. In Redis, storing one giant nested JSON object (a "Blob") makes it very difficult to update just one player's card or prediction without rewriting the whole thing.

Here is how to map your JSON structure to **native Redis data types** to ensure your game is fast and scalable.

---

### 1. Room Context (Redis Hashes & Sets)

Instead of a nested JSON, split the room metadata from the player list.

* **Metadata (Hash):** `room:{room_id}:meta`
* Fields: `status`, `created_at`, `admin_id`.


* **Players (Set):** `room:{room_id}:players`
* Values: `user_id_1`, `user_id_2`.
* *Note:* Keep the "names" in a global `user:{id}` hash so you don't duplicate them.



### 2. Game Totals (Redis Sorted Set)

Your JSON shows a list of standings. In Redis, use a **Sorted Set** (`ZSET`).

* **Key:** `game:{game_id}:standings`
* **Member:** `user_id`
* **Score:** `total_score`
* **Command:** `ZINCRBY game:123:standings 10 user_1` (adds 10 points to their current total).

### 3. Rounds (The "Live" Data)

This is where your JSON has a lot of nesting. In Redis, you should create a specific key for each round to allow concurrent updates.

#### A. Predictions & Round Scores (Hash)

* **Key:** `game:{game_id}:round:{r_num}:stats`
* **Fields:**
* `user:{id}:prediction`
* `user:{id}:score` (score for just this round)



#### B. Card Deals / Tricks (List or Hash)

Your JSON uses `deal1`, `deal2`, etc. In card games, these are often called "tricks."

* **Trick History (List):** `game:{game_id}:round:{r_num}:trick:{t_num}:cards`
* Store a JSON string of `{ "user_id": "...", "card": "..." }` in a list as they are played.


* **Trick Winner (String):** `game:{game_id}:round:{r_num}:trick:{t_num}:winner`
* Value: `user_id`



---

### Comparison: Your JSON vs. Redis Best Practices

| Feature | Your JSON Approach | Redis Native Approach (Better) |
| --- | --- | --- |
| **Updating 1 Card** | Must fetch, parse, update, and re-save the whole JSON. | `RPUSH game:1:round:1:trick:1:cards "..."` (Instant) |
| **Calculating Rank** | Loop through the array and sort in your API code. | `ZREVRANGE game:1:standings 0 -1` (Redis sorts it for you) |
| **Data Safety** | High risk of "Race Conditions" (two players playing at once). | Atomic commands ensure no data is lost. |

---

### Recommended Data Mapping Table

| Data Point | Redis Key Pattern | Redis Type |
| --- | --- | --- |
| **Room Info** | `room:{room_id}:meta` | **Hash** |
| **Current Players** | `room:{room_id}:players` | **Set** |
| **Total Scores** | `game:{game_id}:leaderboard` | **Sorted Set** |
| **Predictions** | `game:{game_id}:round:{n}:predictions` | **Hash** |
| **Cards Played** | `game:{game_id}:round:{n}:trick:{m}:cards` | **List** |
| **Trick Result** | `game:{game_id}:round:{n}:trick:{m}:winner` | **String** |

### Next Step

Your JSON is a perfect format for **sending the final result to your PostgreSQL database** once the game ends.

Would you like me to write a **Node.js/JavaScript function** that gathers all these separate Redis keys and formats them back into the exact JSON you just shared?