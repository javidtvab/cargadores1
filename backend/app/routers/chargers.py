from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Charger

router = APIRouter()

@router.get("/chargers", response_model=list)
def get_all_chargers(db: Session = Depends(get_db)):
    """
    Obtener todos los cargadores.
    """
    try:
        chargers = db.query(Charger).all()
        return chargers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chargers: {str(e)}")

@router.get("/chargers/{charger_id}", response_model=dict)
def get_charger(charger_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de un cargador específico.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    return charger

@router.post("/chargers", response_model=dict)
def create_charger(charger_data: dict, db: Session = Depends(get_db)):
    """
    Crear un nuevo cargador.
    """
    try:
        new_charger = Charger(
            name=charger_data["name"],
            status=charger_data.get("status", "available"),
            power=charger_data["power"],
            location=charger_data["location"],
            is_active=charger_data.get("is_active", True),
            rate_per_kwh=charger_data["rate_per_kwh"],
            rate_per_minute=charger_data["rate_per_minute"],
        )
        db.add(new_charger)
        db.commit()
        db.refresh(new_charger)
        return {
            "message": "Charger created successfully",
            "charger_id": new_charger.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating charger: {str(e)}")

@router.put("/chargers/{charger_id}", response_model=dict)
def update_charger(charger_id: int, updates: dict, db: Session = Depends(get_db)):
    """
    Actualizar los detalles de un cargador específico.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    try:
        for key, value in updates.items():
            setattr(charger, key, value)
        db.commit()
        db.refresh(charger)
        return {
            "message": "Charger updated successfully",
            "charger_id": charger.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating charger: {str(e)}")

@router.delete("/chargers/{charger_id}", response_model=dict)
def delete_charger(charger_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un cargador específico.
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
