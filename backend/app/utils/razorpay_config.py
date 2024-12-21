import razorpay
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde un archivo .env
load_dotenv()

# Configuración de Razorpay a partir de las variables de entorno
RAZORPAY_API_KEY = os.getenv("RAZORPAY_API_KEY", "rzp_test_your_api_key")
RAZORPAY_API_SECRET = os.getenv("RAZORPAY_API_SECRET", "your_api_secret")

# Inicializar el cliente de Razorpay
razorpay_client = razorpay.Client(auth=(RAZORPAY_API_KEY, RAZORPAY_API_SECRET))

# Configuración opcional para el cliente Razorpay
razorpay_client.set_app_details({"title": "Charging Station", "version": "1.0.0"})
