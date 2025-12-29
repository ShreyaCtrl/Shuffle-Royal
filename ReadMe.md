# Technologies Used
- Frontend: React, Vite, Supabase Auth, React Router, reapop Notifications
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
 6. Create the database tables by running the following commands in a Python shell:
   ```python
   from app.extensions import db
   db.create_all()
   ```  
   7. Create the required Supabase functions and triggers as per the documentation.
    8. Start the Redis server.
    9. Start Celery (In Progress)
    10. Run the Flask server:
    ```bash 
    flask run
    ```
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