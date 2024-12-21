from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

# Modelo para Usuarios
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")  # Roles: user, admin

    sessions = relationship("Session", back_populates="user")

# Modelo para Cargadores
class Charger(Base):
    __tablename__ = "chargers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False)
    power = Column(Float, nullable=False)  # Potencia en kW
    status = Column(String, default="available")  # Estados: available, in_use, maintenance
    rate_per_kwh = Column(Float, nullable=False)
    rate_per_minute = Column(Float, nullable=False)

    sessions = relationship("Session", back_populates="charger")

# Modelo para Sesiones de Carga
class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    charger_id = Column(Integer, ForeignKey("chargers.id"), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    energy_consumed = Column(Float, default=0.0)  # Energía consumida en kWh
    total_cost = Column(Float, default=0.0)
    status = Column(String, default="active")  # Estados: active, completed, canceled

    user = relationship("User", back_populates="sessions")
    charger = relationship("Charger", back_populates="sessions")

# Modelo para Tarifas Dinámicas
class DynamicRate(Base):
    __tablename__ = "dynamic_rates"
    id = Column(Integer, primary_key=True, index=True)
    charger_id = Column(Integer, ForeignKey("chargers.id"), nullable=False)
    start_time = Column(String, nullable=False)  # Horario de inicio (formato HH:MM)
    end_time = Column(String, nullable=False)    # Horario de fin (formato HH:MM)
    rate_per_kwh = Column(Float, nullable=False)
    rate_per_minute = Column(Float, nullable=False)
    description = Column(String, nullable=True)

# Modelo para Facturas
class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    total_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("Session")
