from sqlalchemy import create_engine, inspect

DATABASE_URL = "postgresql://aleloianatra_user:M3OE967G7h9LN8TTSiTYBdNwHVJ9fnZh@dpg-d525ht7fte5s73cuo6kg-a.oregon-postgres.render.com/aleloianatra"

engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

# On récupère le nom de toutes les tables existantes
tables = inspector.get_table_names()

if tables:
    print("✅ Tables trouvées dans la base :", tables)
    for table in tables:
        # On regarde quelles colonnes il y a dans chaque table
        columns = inspector.get_columns(table)
        print(f"\nStructure de la table '{table}':")
        for column in columns:
            print(f" - {column['name']} ({column['type']})")
else:
    print("⚪ La base est vide, aucune table trouvée.")