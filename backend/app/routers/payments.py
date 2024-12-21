from fastapi import APIRouter, HTTPException
from app.utils.razorpay_config import razorpay_client

router = APIRouter()

@router.post("/create-order")
def create_order(amount: int, currency: str = "INR"):
    """
    Crear una orden en Razorpay.
    
    Parámetros:
    - amount (int): Monto de la transacción en la moneda menor (por ejemplo, centavos para USD, paise para INR).
    - currency (str): Moneda de la transacción (por defecto, INR).
    
    Respuesta:
    - order_id (str): ID único de la orden generada por Razorpay.
    """
    try:
        # Crear una orden en Razorpay
        order = razorpay_client.order.create({
            "amount": amount * 100,  # Razorpay requiere el monto en la moneda menor
            "currency": currency,
            "payment_capture": 1,   # Captura automática del pago
        })
        return {"order_id": order["id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-payment")
def verify_payment(payload: dict):
    """
    Verificar la firma del pago recibido de Razorpay.
    
    Parámetros:
    - payload (dict): Contiene los datos necesarios para la verificación:
        - razorpay_order_id
        - razorpay_payment_id
        - razorpay_signature
    
    Respuesta:
    - status (str): Estado de la verificación ("success" o "error").
    - message (str): Mensaje informativo sobre el resultado de la verificación.
    """
    try:
        # Verificar la firma del pago
        razorpay_client.utility.verify_payment_signature(payload)
        return {"status": "success", "message": "Payment verified"}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
