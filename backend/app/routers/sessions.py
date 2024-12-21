from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Session as ChargingSession, Charger, User

router = APIRouter()

@router.get("/sessions", response_model=list)
def get_all_sessions(db: Session = Depends(get_db)):
    """
    Obtener todas las sesiones de carga.
    """
    try:
        sessions = db.query(ChargingSession).all()
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sessions: {str(e)}")

@router.get("/sessions/{session_id}", response_model=dict)
def get_session(session_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de una sesión específica.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions", response_model=dict)
def create_session(session_data: dict, db: Session = Depends(get_db)):
    """
    Crear una nueva sesión de carga.
    """
    try:
        charger = db.query(Charger).filter(Charger.id == session_data["charger_id"]).first()
        user = db.query(User).filter(User.id == session_data["user_id"]).first()

        if not charger:
            raise HTTPException(status_code=404, detail="Charger not found")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if charger.status != "available":
            raise HTTPException(status_code=400, detail="Charger is not available")

        # Crear una nueva sesión
        session = ChargingSession(
            charger_id=session_data["charger_id"],
            user_id=session_data["user_id"],
            start_time=session_data["start_time"],
            energy_consumed=0.0,
            total_cost=0.0,
            status="active"
        )
        charger.status = "in_use"
        db.add(session)
        db.commit()
        db.refresh(session)
        return {
            "message": "Session created successfully",
            "session_id": session.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")

@router.put("/sessions/{session_id}", response_model=dict)
def end_session(session_id: int, updates: dict, db: Session = Depends(get_db)):
    """
    Finalizar una sesión de carga.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != "active":
        raise HTTPException(status_code=400, detail="Session is not active")

    try:
        session.end_time = updates.get("end_time")
        session.energy_consumed = updates.get("energy_consumed", session.energy_consumed)
        session.total_cost = updates.get("total_cost", session.total_cost)
        session.status = "completed"

        # Actualizar el estado del cargador
        charger = db.query(Charger).filter(Charger.id == session.charger_id).first()
        if charger:
            charger.status = "available"

        db.commit()
        db.refresh(session)
        return {
            "message": "Session ended successfully",
            "session_id": session.id,
            "total_cost": session.total_cost
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ending session: {str(e)}")

@router.delete("/sessions/{session_id}", response_model=dict)
def delete_session(session_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una sesión de carga.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        db.delete(session)
        db.commit()
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")
