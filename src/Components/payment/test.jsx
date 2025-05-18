// src/pages/PaymentPage.js
import React from 'react';
import PayPalButton from './PayPalButton';

const PaymentPage = () => {
  const handleSuccess = (details) => {
    alert(`Thank you ${details.payer.name.given_name}! Payment successful ✅`);
    // Here you can add the payment process to Firebase Firestore if you want
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto'  , backgroundColor:"red"}}>
      <h2>Course Payment</h2>
      <PayPalButton amount="19.99" onSuccess={handleSuccess} />
    </div>
  );
};

export default PaymentPage;
