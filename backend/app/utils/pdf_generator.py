from fpdf import FPDF
import os

class PDFInvoice(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Charging Station Invoice", border=False, ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_invoice_pdf(invoice, session):
    """
    Genera un archivo PDF para una factura específica.

    Args:
        invoice: Objeto de factura con información como id, total_cost, etc.
        session: Objeto de sesión con información como user, charger, energy_consumed, etc.

    Returns:
        str: Ruta del archivo PDF generado.
    """
    pdf = PDFInvoice()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Información de la factura
    pdf.cell(0, 10, f"Invoice ID: {invoice.id}", ln=True)
    pdf.cell(0, 10, f"Session ID: {session.id}", ln=True)
    pdf.cell(0, 10, f"User: {session.user.username} (ID: {session.user_id})", ln=True)
    pdf.cell(0, 10, f"Charger: {session.charger.name} (ID: {session.charger_id})", ln=True)
    pdf.cell(0, 10, f"Energy Consumed: {session.energy_consumed:.2f} kWh", ln=True)
    pdf.cell(0, 10, f"Total Cost: ${invoice.total_cost:.2f}", ln=True)
    pdf.cell(0, 10, f"Date: {invoice.created_at.strftime('%Y-%m-%d %H:%M:%S')}", ln=True)

    # Guardar el PDF
    output_dir = "invoices"
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, f"invoice_{invoice.id}.pdf")
    pdf.output(file_path)

    return file_path
