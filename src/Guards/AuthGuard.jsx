import { Box, CircularProgress, Typography } from '@mui/material';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AuthGuard = ({ children, allowedRoles = [] }) => {
  const { user,  loading } = useContext(UserContext);
  console.log('AuthGuard:', { user, loading, allowedRoles });

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: '#8000ff',
            mb: 2
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#333',
            fontWeight: 500
          }}
        >
          Loading.....
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthGuard; 