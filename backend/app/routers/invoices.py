from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from app.database import get_db
from app.models import Invoice, Session as ChargingSession
from app.schemas import InvoiceBase, InvoiceCreate, InvoiceResponse
from app.utils.pdf_generator import generate_invoice_pdf
import os

router = APIRouter()

@router.get("/", response_model=list[InvoiceResponse])
def get_all_invoices(db: Session = Depends(get_db)):
    """
    Obtener todas las facturas.
    """
    try:
        invoices = db.query(Invoice).all()
        return invoices
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving invoices: {str(e)}")

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Obtener una factura específica por su ID.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva factura para una sesión de carga.
    """
    session = db.query(ChargingSession).filter(ChargingSession.id == invoice_data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if db.query(Invoice).filter(Invoice.session_id == invoice_data.session_id).first():
        raise HTTPException(status_code=400, detail="Invoice already exists for this session")
    
    try:
        new_invoice = Invoice(
            session_id=invoice_data.session_id,
            total_cost=invoice_data.total_cost
        )
        db.add(new_invoice)
        db.commit()
        db.refresh(new_invoice)
        return new_invoice
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating invoice: {str(e)}")

@router.get("/download/{invoice_id}")
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
    
    try:
        # Generar PDF de la factura
        pdf_path = generate_invoice_pdf(invoice, session)
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Error generating PDF file")
        return FileResponse(pdf_path, media_type="application/pdf", filename=f"invoice_{invoice.id}.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating or retrieving PDF: {str(e)}")

@router.delete("/{invoice_id}", response_model=dict)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """
    Eliminar una factura específica por su ID.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    try:
        db.delete(invoice)
        db.commit()
        return {"message": "Invoice deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting invoice: {str(e)}")
