import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Stack,
    TextField,
    Typography,
  } from '@mui/material';
  import MailOutlineIcon from '@mui/icons-material/MailOutline';
  import React from 'react';
import { grey } from '@mui/material/colors';
import { useForm } from "react-hook-form";

  
  function Login() {

 const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
        console.log(data);
  };

    
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
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
      >
    Log in to continue your learning journey
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
  <Stack spacing={2}>
    <TextField
       fullWidth
       size="medium"
       label="Email"
       variant="outlined"
       {...register("email", {
         required: true,
         pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
       })}
     />
     {errors.email?.type === "required" && (
       <Typography color='error'>Email is required.</Typography>
     )}
     {errors.email?.type === "pattern" && (
       <Typography color='error'>Email is not valid.</Typography>
     )}



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
    >
      Continue with email
    </Button>
  </Stack>
</form>


      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 4, fontWeight: 'bold' }}
      >
        Other sign up options
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
        By signing up, you agree to our{' '}
        <a href="#" style={{ color: '#8000ff' }}>
          Terms of Use
        </a>{' '}
        and{' '}
        <a href="#" style={{ color: '#8000ff' }}>
          Privacy Policy
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
          Already have an account?{' '}
          <a href="#" style={{ color: '#8000ff', fontWeight: 'bold' }}>
            Sign up
          </a>
        </Typography>
      </Box>
      <Box
        sx={{
          p: 2,
          backgroundColor: grey[100],
          textAlign: 'center',
          borderRadius: 1,
          borderTopColor:grey[100],
          borderTop:1,
        }}
      >
        <Typography variant="body2">
          <a href="#" style={{ color: '#8000ff', fontWeight: 'bold' }}>
          Log in with your organization
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
  