import { Box, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cart-context";
import { auth } from "../Firebase/firebase";
import PayPalButton from "../Components/payment/PayPalButton";
import { updateEnrollments } from "../Firebase/courses";
import { addOrder, emptyCart } from "../services/enrollments";
import { errorModal, successModal } from "../services/swal";
import { useNavigate } from "react-router-dom";

const CheckoutComponent = () => {

  const navigate = useNavigate();
  const handleSuccess = async (userid,details, cartItems) => {
  
    
    try {
      
      await addOrder(userid, cartItems, total, details);
      await updateEnrollments( userid, cartItems );
      await emptyCart(userid);
      successModal("Payment Successful!","Courses have been added to your account",)
      navigate("/");
    } catch ({ message }) {

      console.error("Error saving payment:", message);
      errorModal("Error","An error occurred while saving the payment in Firestore. Please try again");
    }
  };

  const { cartItems, getCartTotal } = useContext(CartContext);

  let [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(getCartTotal());
  }, [getCartTotal]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left Panel - Billing and Payment */}
        <Box sx={{ width: "50%", padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Checkout
          </Typography>

          {/* Billing address */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
              Billing address
            </Typography>
            <TextField
              select
              label="Country"
              defaultValue="United States"
              fullWidth
              margin="normal"
              SelectProps={{ native: true }}
              variant="outlined"
            >
              <option value="United States">United States</option>
              <option value="Greece">Greece</option>
            </TextField>
            <TextField
              label="ZIP code"
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="5 or 9 digit"
            />
            <Typography variant="caption" display="block" gutterBottom>
              Udemy is required by law to collect applicable transaction taxes
              for purchases made in certain tax jurisdictions.
            </Typography>
          </Box>

          {/* Payment method */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment method{" "}
              <Box component="span" sx={{ color: "green", fontSize: "0.8em" }}>
                Secure and encrypted
              </Box>
            </Typography>

            <PayPalButton
              amountval={total.toFixed(2)}
              onSuccess={(details) => handleSuccess(auth?.currentUser?.uid,details, cartItems)}
            />
          </Box>

          {/* Order details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Order details ({cartItems.length} course)
            </Typography>

            {cartItems.map((course) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt="Course"
                  sx={{
                    marginRight: 1,
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography>{course.title}</Typography>
                </Box>
                <Typography>${course.price.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Order Summary */}
        <Box sx={{ width: "50%", padding: 3, backgroundColor: "#f8f8f8" }}>
          <Typography variant="h5" gutterBottom>
            Order summary
          </Typography>
          <Box sx={{ marginBottom: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Original Price:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Discounts (0% Off):
              </Typography>
              <Typography variant="body2" color="text.secondary">
                -$0.00
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginTop: 1,
              }}
            >
              <Typography variant="h6">
                Total ({cartItems.length}{" "}
                {cartItems.length === 1 ? "course" : "courses"}):
              </Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
            <Typography variant="caption" display="block" sx={{ marginTop: 2 }}>
              By completing your purchase, you agree to these{" "}
              <Box
                component="span"
                sx={{ color: "purple", textDecoration: "underline" }}
              >
                Terms of Use.
              </Box>
            </Typography>
          </Box>

          {/* 30-Day Guarantee */}
          <Box
            sx={{
              marginTop: 3,
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography fontWeight="bold">
              30-Day Money-Back Guarantee
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Not satisfied? Get a full refund within 30 days. Simple and
              straightforward!
            </Typography>
          </Box>

          {/* Tap into Success */}
          <Box
            sx={{
              marginTop: 3,
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 1,
              textAlign: "center",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component="span" sx={{ marginRight: 1, color: "#f59e0b" }}>
                💡
              </Box>{" "}
              Tap into Success Now
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join 5 people in your country who've recently enrolled in this
              course within last 24 hours.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutComponent;
