import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  Snackbar
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { grey } from '@mui/material/colors';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "../../Firebase/firebase"; 
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function Login() {
  const [firebaseError, setFirebaseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFirebaseError("");

    if (!data.email || !data.password) {
      setFirebaseError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
 
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      console.log("User logged in: ", userCredential.user);
      navigate("/Userprofile", { state: { email: data.email } });

    } catch (error) {
      setSnackbarMessage("Error logging in. Please check your credentials.");
      setOpenSnackbar(true);
      setFirebaseError(error.message); 
      console.error(error);
    }

    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


   const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} alignItems="center" justifyContent={'space-around'}>
        <Grid item xs={12} lg={6} sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src="https://frontends.udemycdn.com/components/auth/desktop-illustration-x1.webp"
            alt="Illustration"
            sx={{
              width: '100%',
              maxWidth: 600,
              height: 'auto',
              mx: 'auto'
            }}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box sx={{ maxWidth: 500, mx: 'auto', px: 2 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
             {t('Log in to continue your learning journey')}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
               label={t("Email")}
                  variant="outlined"
                  error={!!errors.email}
                  helperText={
                    errors.email?.type === "required"
                      ? "Email is required."
                      : errors.email?.type === "pattern"
                        ? "Email is not valid."
                        : ""
                  }
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                />

                <TextField
                  fullWidth
                   label={t("Password")}
                  type="password"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={
                    errors.password?.type === "required"
                      ? "Password is required."
                      : ""
                  }
                  {...register("password", { required: true })}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<MailOutlineIcon fontSize="small" />}
                  sx={{
                    backgroundColor: '#8000ff',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    py: 1.2,
                    mt: 1,
                    '&:hover': { backgroundColor: '#6a1b9a' },
                  }}
                  disabled={loading}
                >
               {loading ? t("Loading...") : t("Continue with email")}
                </Button>

                {firebaseError && (
                  <Typography color="error" textAlign="center">
                    {firebaseError}
                  </Typography>
                )}
              </Stack>
            </form>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={snackbarMessage}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            />

            <Typography
              variant="body1"
              align="center"
              sx={{ mt: 4, fontWeight: 'bold' }}
            >
             {t('Other sign up options')}
            </Typography>

            <Stack
              direction="row"
              gap={2}
              justifyContent="center"
              mt={2}
              mb={3}
            >
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  borderColor: '#8000ff',
                }}
              >
                <img
                  src="https://static.cdnlogo.com/logos/g/38/google-icon.svg"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
              </Button>

              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  borderColor: '#8000ff',
                }}
              >
                <img
                  src="https://i.pinimg.com/736x/42/75/49/427549f6f22470ff93ca714479d180c2.jpg"
                  alt="Facebook"
                  style={{ width: 20, height: 20 }}
                />
              </Button>

              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  borderColor: '#8000ff',
                }}
              >
                <img
                  src="https://pixsector.com/cache/56f2646e/avd5cee2ff5ea9da4d328.png"
                  alt="Apple"
                  style={{ width: 20, height: 20 }}
                />
              </Button>
            </Stack>

            <Typography
              variant="subtitle2"
              align="center"
              sx={{ mb: 3 }}
            >
              {t('By signing up, you agree to our')}{' '}
              <a href="#" style={{ color: '#8000ff' }}>
                {t('Terms of Use')}
              </a>{' '}
              {t('and')}{' '}
              <a href="#" style={{ color: '#8000ff' }}>
                {t('Privacy Policy')}
              </a>
              .
            </Typography>

            <Box
              sx={{
                p: 2,
                backgroundColor: grey[100],
                textAlign: 'center',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                {t('Don’t have an account?')}{' '}
                <Link to="/signup" style={{ color: '#8000ff', fontWeight: 'bold' }}>
                  {t('Sign up')}
                </Link>
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                backgroundColor: grey[100],
                textAlign: 'center',
                borderRadius: 1,
                borderTopColor: grey[100],
                borderTop: 1,
              }}
            >
              <Typography variant="body2">
                <a href="#" style={{ color: '#8000ff', fontWeight: 'bold' }}>
                 {t('Log in with your organization')}
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
