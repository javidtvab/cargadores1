
import React from "react";
import axios from "axios";

function RazorpayCheckout() {
  const handlePayment = async () => {
    try {
      // Request a Razorpay order ID from the backend
      const { data } = await axios.post("http://localhost:8000/api/payments/create-order", {
        amount: 500, // Amount in INR
        currency: "INR",
      });

      const options = {
        key: "rzp_test_your_api_key",
        amount: 50000, // Amount in paise
        currency: "INR",
        name: "Charging Station",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: async function (response) {
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verification = await axios.post("http://localhost:8000/api/payments/verify-payment", verifyPayload);
          alert(verification.data.message);
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment", error);
    }
  };

  return (
    <div>
      <h1>Razorpay Checkout</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default RazorpayCheckout;
