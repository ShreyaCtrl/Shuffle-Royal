import psycopg2
from app.core.config import db_url, db_name, db_password, db_host, db_port, db_user, db_database

def supabase_connect():
    try:
        connection = psycopg2.connect(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
            dbname=db_database
        )
        print("Connection successful!")

        # Create a cursor to execute SQL queries
        cursor = connection.cursor()

        # Example query
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        print("Current Time:", result)
        return cursor
        # Close the cursor and connection
        cursor.close()
        connection.close()
        print("Connection closed.")


    except Exception as e:
        print(f"Failed to connect: {e}")