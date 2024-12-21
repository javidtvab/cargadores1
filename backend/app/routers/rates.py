from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DynamicRate, Charger
from app.schemas import DynamicRateBase, DynamicRateCreate, DynamicRateUpdate, DynamicRateResponse

router = APIRouter()

@router.get("/", response_model=list[DynamicRateResponse])
def get_all_rates(db: Session = Depends(get_db)):
    """
    Obtener todas las tarifas dinámicas configuradas.
    """
    try:
        rates = db.query(DynamicRate).all()
        return rates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving rates: {str(e)}")

@router.get("/{rate_id}", response_model=DynamicRateResponse)
def get_rate(rate_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de una tarifa específica.
    """
    rate = db.query(DynamicRate).filter(DynamicRate.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    return rate

@router.post("/", response_model=DynamicRateResponse)
def create_rate(rate: DynamicRateCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva tarifa dinámica.
    """
    charger = db.query(Charger).filter(Charger.id == rate.charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    try:
        new_rate = DynamicRate(
            charger_id=rate.charger_id,
            start_time=rate.start_time,
            end_time=rate.end_time,
            rate_per_kwh=rate.rate_per_kwh,
            rate_per_minute=rate.rate_per_minute,
            description=rate.description
        )
        db.add(new_rate)
        db.commit()
        db.refresh(new_rate)
        return new_rate
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating rate: {str(e)}")

@router.put("/{rate_id}", response_model=DynamicRateResponse)
def update_rate(rate_id: int, updates: DynamicRateUpdate, db: Session = Depends(get_db)):
    """
    Actualizar una tarifa existente.
    """
    rate = db.query(DynamicRate).filter(DynamicRate.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    try:
        for key, value in updates.dict(exclude_unset=True).items():
            setattr(rate, key, value)
        db.commit()
        db.refresh(rate)
        return rate
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating rate: {str(e)}")

@router.delete("/{rate_id}", response_model=dict)
def delete_rate(rate_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una tarifa dinámica por su ID.
    """
    rate = db.query(DynamicRate).filter(DynamicRate.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    try:
        db.delete(rate)
        db.commit()
        return {"message": "Rate deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting rate: {str(e)}")
