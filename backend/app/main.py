
from fastapi import FastAPI
from app.routers import chargers, sessions, rates, invoices, users, statistics, payments
from app.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI instance
app = FastAPI()

# Include routers
app.include_router(chargers.router, prefix="/api", tags=["chargers"])
app.include_router(sessions.router, prefix="/api", tags=["sessions"])
app.include_router(rates.router, prefix="/api", tags=["rates"])
app.include_router(invoices.router, prefix="/api", tags=["invoices"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(statistics.router, prefix="/api", tags=["statistics"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
