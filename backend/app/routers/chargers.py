from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Charger
from app.schemas import ChargerBase, ChargerCreate, ChargerUpdate, ChargerResponse

router = APIRouter()

@router.get("/", response_model=list[ChargerResponse])
def get_all_chargers(db: Session = Depends(get_db)):
    """
    Obtener todos los cargadores.
    """
    try:
        chargers = db.query(Charger).all()
        return chargers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chargers: {str(e)}")

@router.get("/{charger_id}", response_model=ChargerResponse)
def get_charger(charger_id: int, db: Session = Depends(get_db)):
    """
    Obtener un cargador específico por su ID.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    return charger

@router.post("/", response_model=ChargerResponse)
def create_charger(charger: ChargerCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo cargador.
    """
    try:
        new_charger = Charger(
            name=charger.name,
            location=charger.location,
            power=charger.power,
            rate_per_kwh=charger.rate_per_kwh,
            rate_per_minute=charger.rate_per_minute,
            status="available"
        )
        db.add(new_charger)
        db.commit()
        db.refresh(new_charger)
        return new_charger
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating charger: {str(e)}")

@router.put("/{charger_id}", response_model=ChargerResponse)
def update_charger(charger_id: int, updates: ChargerUpdate, db: Session = Depends(get_db)):
    """
    Actualizar un cargador existente.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    try:
        for key, value in updates.dict(exclude_unset=True).items():
            setattr(charger, key, value)
        db.commit()
        db.refresh(charger)
        return charger
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating charger: {str(e)}")

@router.delete("/{charger_id}", response_model=dict)
def delete_charger(charger_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un cargador por su ID.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    try:
        db.delete(charger)
        db.commit()
        return {"message": "Charger deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting charger: {str(e)}")
