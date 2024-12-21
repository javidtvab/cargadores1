from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Invoice, Session as ChargingSession
from app.utils.pdf_generator import generate_invoice_pdf
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/invoices", response_model=list)
def get_all_invoices(db: Session = Depends(get_db)):
    """
    Obtener todas las facturas.
    """
    try:
        invoices = db.query(Invoice).all()
        return invoices
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving invoices: {str(e)}")

@router.get("/invoices/{invoice_id}", response_model=dict)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Obtener los detalles de una factura específica.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {
        "id": invoice.id,
        "session_id": invoice.session_id,
        "total_cost": invoice.total_cost,
        "created_at": invoice.created_at
    }

@router.post("/invoices/generate/{session_id}", response_model=dict)
def generate_invoice(session_id: int, db: Session = Depends(get_db)):
    """
    Generar una factura para una sesión de carga específica.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db.query(Invoice).filter(Invoice.session_id == session_id).first():
        raise HTTPException(status_code=400, detail="Invoice already exists for this session")

    try:
        invoice = Invoice(
            session_id=session.id,
            total_cost=session.total_cost
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        return {
            "message": "Invoice generated successfully",
            "invoice_id": invoice.id,
            "total_cost": invoice.total_cost,
            "created_at": invoice.created_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating invoice: {str(e)}")

@router.get("/invoices/download/{invoice_id}")
def download_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Descargar una factura en formato PDF.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    session = db.query(ChargingSession).filter(ChargingSession.id == invoice.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Associated session not found")

    # Generar el PDF de la factura
    pdf_file = generate_invoice_pdf(invoice, session)

    if not os.path.exists(pdf_file):
        raise HTTPException(status_code=500, detail="Error generating PDF")

    return FileResponse(pdf_file, media_type="application/pdf", filename=f"invoice_{invoice.id}.pdf")
