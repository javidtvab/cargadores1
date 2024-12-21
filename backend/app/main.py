from fastapi import FastAPI
from app.routers import chargers, sessions, rates, invoices, users, statistics, payments
from app.database import Base, engine

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear instancia de la aplicación FastAPI
app = FastAPI(
    title="Charging Station Management API",
    description="API para gestionar estaciones de carga de vehículos eléctricos, incluyendo usuarios, sesiones, tarifas y facturación.",
    version="1.0.0",
)

# Incluir los routers
app.include_router(chargers.router, prefix="/api/chargers", tags=["Chargers"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(rates.router, prefix="/api/rates", tags=["Rates"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(statistics.router, prefix="/api/statistics", tags=["Statistics"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

# Ruta de prueba
@app.get("/", tags=["Root"])
def read_root():
    """
    Endpoint raíz para verificar que el servicio esté activo.
    """
    return {"message": "Charging Station Management API is running"}
