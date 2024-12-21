import React from "react";
import axios from "axios";
import API_BASE_URL from "../config";

function RazorpayCheckout() {
  const handlePayment = async () => {
    try {
      // Crear orden de pago en el backend
      const { data } = await axios.post(`${API_BASE_URL}/payments/create-order`, {
        amount: 500, // Monto en INR (500 INR = 50000 paisa)
        currency: "INR",
      });

      // Configuración del modal de Razorpay
      const options = {
        key: "rzp_test_your_api_key", // Reemplazar con tu API Key de Razorpay
        amount: data.amount, // Monto en paisa (100 INR = 10000 paisa)
        currency: data.currency,
        name: "Charging Station Manager",
        description: "Payment for Charging Session",
        order_id: data.order_id, // ID de orden generado por el backend
        handler: async function (response) {
          // Verificar el pago
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const verification = await axios.post(
              `${API_BASE_URL}/payments/verify-payment`,
              verifyPayload
            );
            alert("Payment Successful: " + verification.data.message);
          } catch (error) {
            alert("Payment Verification Failed");
          }
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
      console.error("Error during payment creation", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <div>
      <h2>Razorpay Checkout</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default RazorpayCheckout;
