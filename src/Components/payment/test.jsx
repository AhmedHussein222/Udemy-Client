// src/pages/PaymentPage.js
import React from 'react';
import PayPalButton from './PayPalButton';

const PaymentPage = () => {
  const handleSuccess = (details) => {
    alert(`شكراً ${details.payer.name.given_name}! تم الدفع بنجاح ✅`);
    // هنا تقدر تضيف عملية الدفع لـ Firebase Firestore لو حبيت
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto'  , backgroundColor:"red"}}>
      <h2>دفع قيمة الكورس</h2>
      <PayPalButton amount="19.99" onSuccess={handleSuccess} />
    </div>
  );
};

export default PaymentPage;
