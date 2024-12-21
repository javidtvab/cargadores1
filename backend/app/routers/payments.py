
from fastapi import APIRouter, HTTPException
from app.utils.razorpay_config import razorpay_client

router = APIRouter()

@router.post("/create-order")
def create_order(amount: int, currency: str = "INR"):
    try:
        # Create a Razorpay order
        order = razorpay_client.order.create({
            "amount": amount * 100,  # Amount in paise (smallest currency unit)
            "currency": currency,
            "payment_capture": 1,  # Auto capture the payment
        })
        return {"order_id": order["id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-payment")
def verify_payment(payload: dict):
    try:
        razorpay_client.utility.verify_payment_signature(payload)
        return {"status": "success", "message": "Payment verified"}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
