import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <LockOutlinedIcon 
          sx={{ 
            fontSize: 100, 
            color: '#8000ff',
            mb: 3
          }} 
        />
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: '#333',
            mb: 2
          }}
        >
          {t('Unauthorized')}
        </Typography>

        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            mb: 4,
            maxWidth: '600px'
          }}
        >
          {t('Sorry, you do not have sufficient permissions to access this page.')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#8000ff',
              '&:hover': {
                backgroundColor: '#6a1b9a'
              },
              px: 4
            }}
          >
            {t('Back to Home')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              borderColor: '#8000ff',
              color: '#8000ff',
              '&:hover': {
                borderColor: '#6a1b9a',
                backgroundColor: 'rgba(128, 0, 255, 0.04)'
              },
              px: 4
            }}
          >
            {t('Login')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized; 