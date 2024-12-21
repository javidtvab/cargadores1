from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# URL de la base de datos: cambiar según el entorno
DATABASE_URL = "sqlite:///./test.db"  # Para SQLite
# DATABASE_URL = "postgresql://user:password@localhost/dbname"  # Para PostgreSQL

# Crear el motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    poolclass=StaticPool if "sqlite" in DATABASE_URL else None
)

# Configurar la sesión de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos de SQLAlchemy
Base = declarative_base()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    """
    Proporciona una sesión de la base de datos para usar en rutas.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
