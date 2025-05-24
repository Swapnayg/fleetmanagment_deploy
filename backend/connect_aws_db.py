import psycopg2

db_user='postgres', 
db_password='Ajax24x7#365', 
db_host="database-1.ctogk8s4eyyp.ap-south-1.rds.amazonaws.com", 
db_database='test_db'

conn = psycopg2.connect(
            host=db_host,
            database=db_database,
            user=db_user,
            password=db_password
        )

print("db connected")
cursor = conn.cursor()
cursor.execute("SELECT version();")
db_version = cursor.fetchone()
print(db_version)
cursor.close()

