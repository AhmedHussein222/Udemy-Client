// src/components/PayPalButton.js
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';
import Swal from 'sweetalert2';

const PayPalButton = ({ onSuccess, amountval  }) => {
  return (
    <PayPalScriptProvider options={{ 
      clientId:"AdOX28IIBHA4i5bo-amDpVDoUOlxN5kgjHK4cK5MpHZdTDnH24craCYEGfAwAgIO1gu_slz-mfu4lveE",
      currency: "USD",
      components: "buttons",
      intent: "capture",
      


    }}>
      <PayPalButtons  
        style={{ layout: 'vertical', color: "blue" }}

        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amountval.toString(),
              },
            }],
          });
        }}

        onApprove={async (data, actions) => {
          console.log("PayPal Button Approved:", data, actions);
          try {
            const details = await actions.order.capture();
            await Swal.fire({
              icon: "success",
              title: "Payment Confirmed!",
              text: "Processing your order...",
              showConfirmButton: false,
              timer: 1500
            });
            onSuccess(details);
          } catch (error) {
            console.error("PayPal Button Approval Error:", error);
            await Swal.fire({
              icon: "error",
              title: "Payment Confirmation Error",
              text: "An error occurred while confirming the payment",
              confirmButtonText: "OK"
            });
          }
        }}

        onError={async (err) => {
          console.error("PayPal Button Error:", err.message);
          await Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "An error occurred while processing the payment. Please try again",
            confirmButtonText: "OK"
          });
        }}

        onCancel={async () => {
          await Swal.fire({
            icon: "info",
            title: "Payment Cancelled",
            text: "Payment process was cancelled successfully",
            confirmButtonText: "OK"
          });
        }}
        onSuccess
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
