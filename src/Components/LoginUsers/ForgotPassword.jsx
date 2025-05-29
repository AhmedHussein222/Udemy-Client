import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { auth, db } from "../../Firebase/firebase";
import { successModal, warningModal } from "../../services/swal";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const checkEmailExists = async (email) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const emailExists = await checkEmailExists(data.email);

      if (!emailExists) {
        warningModal(
          t("Account Not Found"),
          t("No account found with this email address.")
        );
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, data.email);
      successModal(
        t("Email Sent"),
        t("Password reset email sent. Please check your inbox.")
      );
    } catch (error) {
      warningModal(
        t("Error"),
        t("Error sending reset email. Please try again.")
      );
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 500, mx: "auto", px: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight="bold"
              textAlign="center"
            >
              {t("Reset your password")}
            </Typography>

            <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
              {t(
                "Enter your email address and we'll send you a link to reset your password."
              )}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label={t("Email")}
                  variant="outlined"
                  error={!!errors.email}
                  helperText={
                    errors.email?.type === "required"
                      ? t("Email is required.")
                      : errors.email?.type === "pattern"
                      ? t("Email is not valid.")
                      : ""
                  }
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#8000ff",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    py: 1.2,
                    "&:hover": { backgroundColor: "#6a1b9a" },
                  }}
                  disabled={loading}
                >
                  {loading ? t("Sending...") : t("Send reset link")}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Link
                    to="/login"
                    style={{
                      color: "#8000ff",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("Back to login")}
                  </Link>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ForgotPassword;
