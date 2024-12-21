from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Session as ChargingSession, Charger, User
from app.schemas import SessionBase, SessionCreate, SessionUpdate, SessionResponse

router = APIRouter()

@router.get("/", response_model=list[SessionResponse])
def get_all_sessions(db: Session = Depends(get_db)):
    """
    Obtener todas las sesiones de carga.
    """
    try:
        sessions = db.query(ChargingSession).all()
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sessions: {str(e)}")

@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de una sesión específica.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/", response_model=SessionResponse)
def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva sesión de carga.
    """
    charger = db.query(Charger).filter(Charger.id == session_data.charger_id).first()
    user = db.query(User).filter(User.id == session_data.user_id).first()

    if not charger:
        raise HTTPException(status_code=404, detail="Charger not found")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if charger.status != "available":
        raise HTTPException(status_code=400, detail="Charger is not available")

    try:
        # Crear la sesión
        session = ChargingSession(
            user_id=session_data.user_id,
            charger_id=session_data.charger_id,
            start_time=session_data.start_time or None,
            status="active"
        )
        charger.status = "in_use"
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")

@router.put("/{session_id}", response_model=SessionResponse)
def update_session(session_id: int, updates: SessionUpdate, db: Session = Depends(get_db)):
    """
    Actualizar una sesión existente.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    try:
        for key, value in updates.dict(exclude_unset=True).items():
            setattr(session, key, value)
        if session.status == "completed":
            charger = db.query(Charger).filter(Charger.id == session.charger_id).first()
            if charger:
                charger.status = "available"
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating session: {str(e)}")

@router.delete("/{session_id}", response_model=dict)
def delete_session(session_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una sesión específica.
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
