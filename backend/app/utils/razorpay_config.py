
import razorpay

# Razorpay configuration
RAZORPAY_API_KEY = "rzp_test_your_api_key"
RAZORPAY_API_SECRET = "your_api_secret"

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_API_KEY, RAZORPAY_API_SECRET))
