// src/components/PayPalButton.js
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';
import Swal from 'sweetalert2';

const PayPalButton = ({ onSuccess, amount }) => {
  return (
    <PayPalScriptProvider options={{ 
      // Sandbox client ID for testing
      clientId: "AfAzcshoJZDuHc90ECpCFIQ_dKozR3g8fkTvkpwEJtMf-f2ioiQZeemKyRYuzZ3CkG_f_xw-PVvU2v4Z",
      // Live client ID for production
      // clientId:"AcNF0moyW2h8-HgXtAz_qT9sT4M6mQfXTZD4ukFE7M66-GR8eRwV5DhScA1EZBx78SC43z6MmkLQGEH1",
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
                value: amount.toString(),
              },
            }],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            await Swal.fire({
              icon: "success",
              title: "تم تأكيد الدفع!",
              text: "جاري معالجة طلبك...",
              showConfirmButton: false,
              timer: 1500
            });
            onSuccess(details);
          } catch (error) {
            console.error("PayPal Button Approval Error:", error);
            await Swal.fire({
              icon: "error",
              title: "خطأ في تأكيد الدفع",
              text: "حدث خطأ أثناء تأكيد عملية الدفع",
              confirmButtonText: "حسناً"
            });
          }
        }}
        onError={async (err) => {
          console.error("PayPal Button Error:", err.message);
          await Swal.fire({
            icon: "error",
            title: "فشلت عملية الدفع",
            text: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى",
            confirmButtonText: "حسناً"
          });
        }}
        onCancel={async () => {
          await Swal.fire({
            icon: "info",
            title: "تم إلغاء الدفع",
            text: "تم إلغاء عملية الدفع بنجاح",
            confirmButtonText: "حسناً"
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
