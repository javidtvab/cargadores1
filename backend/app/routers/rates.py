from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DynamicRate

router = APIRouter()

@router.get("/rates", response_model=list)
def get_all_rates(db: Session = Depends(get_db)):
    """
    Obtener todas las tarifas dinámicas configuradas.
    """
    try:
        rates = db.query(DynamicRate).all()
        return rates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving rates: {str(e)}")

@router.get("/rates/{rate_id}", response_model=dict)
def get_rate(rate_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de una tarifa específica.
    """
    rate = db.query(DynamicRate).filter(DynamicRate.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    return rate

@router.post("/rates", response_model=dict)
def create_rate(rate: dict, db: Session = Depends(get_db)):
    """
    Crear una nueva tarifa dinámica.
    Parámetros:
    - rate (dict): Información de la tarifa (inicio, fin, costo por kWh y minuto).
    """
    try:
        new_rate = DynamicRate(
            charger_id=rate["charger_id"],
            start_time=rate["start_time"],
            end_time=rate["end_time"],
            rate_per_kwh=rate["rate_per_kwh"],
            rate_per_minute=rate["rate_per_minute"],
            description=rate.get("description", None),
        )
        db.add(new_rate)
        db.commit()
        db.refresh(new_rate)
        return {
            "message": "Rate created successfully",
            "rate_id": new_rate.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating rate: {str(e)}")

@router.put("/rates/{rate_id}", response_model=dict)
def update_rate(rate_id: int, updates: dict, db: Session = Depends(get_db)):
    """
    Actualizar una tarifa existente.
    """
    rate = db.query(DynamicRate).filter(DynamicRate.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    try:
        for key, value in updates.items():
            setattr(rate, key, value)
        db.commit()
        db.refresh(rate)
        return {
            "message": "Rate updated successfully",
            "rate_id": rate.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating rate: {str(e)}")

@router.delete("/rates/{rate_id}", response_model=dict)
def delete_rate(rate_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una tarifa específica.
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
