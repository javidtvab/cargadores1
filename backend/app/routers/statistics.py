from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database import get_db
from app.models import Session, Charger, AppliedRate

router = APIRouter()

@router.get("/summary")
def get_statistics(db: Session = Depends(get_db)):
    """
    Obtener estadísticas generales de las sesiones de carga.

    Respuesta:
    - total_sessions (int): Número total de sesiones de carga.
    - total_energy (float): Energía total consumida en kWh.
    - total_revenue (float): Ingresos totales generados.
    """
    try:
        total_sessions = db.query(func.count(Session.id)).scalar()
        total_energy = db.query(func.sum(Session.energy_consumed)).scalar() or 0.0
        total_revenue = db.query(func.sum(Session.total_cost)).scalar() or 0.0

        return {
            "total_sessions": total_sessions,
            "total_energy": total_energy,
            "total_revenue": total_revenue,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving statistics: {str(e)}")

@router.get("/chargers")
def get_charger_statistics(db: Session = Depends(get_db)):
    """
    Obtener estadísticas detalladas por cargador.

    Respuesta:
    - Lista de cargadores con sus estadísticas:
      - charger_id (int): ID del cargador.
      - charger_name (str): Nombre del cargador.
      - total_sessions (int): Número total de sesiones en ese cargador.
      - total_energy (float): Energía total consumida por ese cargador en kWh.
      - total_revenue (float): Ingresos generados por ese cargador.
    """
    try:
        chargers_stats = (
            db.query(
                Charger.id.label("charger_id"),
                Charger.name.label("charger_name"),
                func.count(Session.id).label("total_sessions"),
                func.sum(Session.energy_consumed).label("total_energy"),
                func.sum(Session.total_cost).label("total_revenue"),
            )
            .join(Session, Charger.id == Session.charger_id)
            .group_by(Charger.id)
            .all()
        )

        return chargers_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving charger statistics: {str(e)}")

@router.get("/rates")
def get_rate_statistics(db: Session = Depends(get_db)):
    """
    Obtener estadísticas detalladas por tarifas aplicadas.

    Respuesta:
    - Lista de tarifas con sus estadísticas:
      - rate_id (int): ID de la tarifa.
      - description (str): Descripción de la tarifa.
      - total_sessions (int): Número total de sesiones con esta tarifa.
      - total_revenue (float): Ingresos generados por esta tarifa.
    """
    try:
        rate_stats = (
            db.query(
                AppliedRate.rate_id.label("rate_id"),
                AppliedRate.description.label("description"),
                func.count(AppliedRate.id).label("total_sessions"),
                func.sum(AppliedRate.total_cost).label("total_revenue"),
            )
            .group_by(AppliedRate.rate_id, AppliedRate.description)
            .all()
        )

        return rate_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving rate statistics: {str(e)}")
