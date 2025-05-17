// src/components/PayPalButton.js
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider options={{ 
      clientId: "ARfyc-VRZv-5RiesckFXXs-l3Ux9hI3_HohhnA6Jfw9YgxjOrO_jBFMQ1NIevpUEzIQcHOGzV1x7AdRa",
      currency: "USD"
    }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Transaction completed:', details);
            onSuccess(details);
          });
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
