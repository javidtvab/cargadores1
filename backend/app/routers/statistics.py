from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database import get_db
from app.models import Session as ChargingSession, User, Charger

router = APIRouter()

@router.get("/summary", response_model=dict)
def get_summary_statistics(db: Session = Depends(get_db)):
    """
    Obtener estadísticas resumidas del sistema.
    """
    try:
        total_users = db.query(func.count(User.id)).scalar()
        total_chargers = db.query(func.count(Charger.id)).scalar()
        total_sessions = db.query(func.count(ChargingSession.id)).scalar()
        total_energy_consumed = db.query(func.sum(ChargingSession.energy_consumed)).scalar() or 0.0
        total_revenue = db.query(func.sum(ChargingSession.total_cost)).scalar() or 0.0

        return {
            "total_users": total_users,
            "total_chargers": total_chargers,
            "total_sessions": total_sessions,
            "total_energy_consumed": round(total_energy_consumed, 2),
            "total_revenue": round(total_revenue, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving summary statistics: {str(e)}")

@router.get("/user/{user_id}", response_model=dict)
def get_user_statistics(user_id: int, db: Session = Depends(get_db)):
    """
    Obtener estadísticas para un usuario específico.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        user_sessions = db.query(ChargingSession).filter(ChargingSession.user_id == user_id).all()
        total_sessions = len(user_sessions)
        total_energy = sum(session.energy_consumed for session in user_sessions)
        total_spent = sum(session.total_cost for session in user_sessions)

        return {
            "user_id": user.id,
            "username": user.username,
            "total_sessions": total_sessions,
            "total_energy_consumed": round(total_energy, 2),
            "total_spent": round(total_spent, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user statistics: {str(e)}")

@router.get("/charger/{charger_id}", response_model=dict)
def get_charger_statistics(charger_id: int, db: Session = Depends(get_db)):
    """
    Obtener estadísticas para un cargador específico.
    """
    charger = db.query(Charger).filter(Charger.id == charger_id).first()
    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    try:
        charger_sessions = db.query(ChargingSession).filter(ChargingSession.charger_id == charger_id).all()
        total_sessions = len(charger_sessions)
        total_energy = sum(session.energy_consumed for session in charger_sessions)
        total_revenue = sum(session.total_cost for session in charger_sessions)

        return {
            "charger_id": charger.id,
            "charger_name": charger.name,
            "total_sessions": total_sessions,
            "total_energy_consumed": round(total_energy, 2),
            "total_revenue_generated": round(total_revenue, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving charger statistics: {str(e)}")
