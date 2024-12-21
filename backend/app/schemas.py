from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Esquemas para Usuarios
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]

class UserResponse(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        orm_mode = True

# Esquemas para Cargadores
class ChargerBase(BaseModel):
    name: str
    location: str
    power: float
    rate_per_kwh: float
    rate_per_minute: float

class ChargerCreate(ChargerBase):
    pass

class ChargerUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str]
    power: Optional[float]
    rate_per_kwh: Optional[float]
    rate_per_minute: Optional[float]
    status: Optional[str]

class ChargerResponse(ChargerBase):
    id: int
    status: str

    class Config:
        orm_mode = True

# Esquemas para Sesiones de Carga
class SessionBase(BaseModel):
    user_id: int
    charger_id: int
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    energy_consumed: Optional[float]
    total_cost: Optional[float]

class SessionCreate(BaseModel):
    user_id: int
    charger_id: int

class SessionUpdate(BaseModel):
    end_time: Optional[datetime]
    energy_consumed: Optional[float]
    total_cost: Optional[float]
    status: Optional[str]

class SessionResponse(SessionBase):
    id: int
    status: str

    class Config:
        orm_mode = True

# Esquemas para Tarifas Dinámicas
class DynamicRateBase(BaseModel):
    charger_id: int
    start_time: str
    end_time: str
    rate_per_kwh: float
    rate_per_minute: float
    description: Optional[str]

class DynamicRateCreate(DynamicRateBase):
    pass

class DynamicRateUpdate(BaseModel):
    start_time: Optional[str]
    end_time: Optional[str]
    rate_per_kwh: Optional[float]
    rate_per_minute: Optional[float]
    description: Optional[str]

class DynamicRateResponse(DynamicRateBase):
    id: int

    class Config:
        orm_mode = True

# Esquemas para Facturas
class InvoiceBase(BaseModel):
    session_id: int
    total_cost: float

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
