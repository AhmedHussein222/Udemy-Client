import React, { useState } from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  TextField,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from '@mui/material';


const drawerWidth = 250;

const profileSections = [
  { id: 'profile', label: 'Profile' },
  { id: 'photo', label: 'Photo' },
  { id: 'security', label: 'Account Security' },
  { id: 'close', label: 'Close account' },
];

const EditProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [imageUrl, setImageUrl] = useState('');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
          <Box >
          <Typography variant="h4" gutterBottom>Public profile</Typography>
            <Typography variant="subtitle1" gutterBottom>Basics:</Typography>

            <TextField fullWidth label="First Name" margin="normal" />
            <TextField fullWidth label="Last Name" margin="normal" />
            <TextField fullWidth label="Headline" margin="normal" />
            <TextField
              fullWidth
              label="Biography"
              placeholder="Write your biography here"
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              defaultValue="English"
              margin="normal"
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="عربي">عربي</MenuItem>
            </TextField>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Links:</Typography>

            {['Facebook', 'Instagram', 'Linkedin', 'Youtube'].map((platform) => (
              <FormControl fullWidth margin="normal" key={platform}>
                <InputLabel htmlFor={`${platform.toLowerCase()}-username`}>{platform}</InputLabel>
                <OutlinedInput
                  id={`${platform.toLowerCase()}-username`}
                  label={platform}
                  startAdornment={
                    <InputAdornment position="start">
                      {platform.toLowerCase()}.com/
                    </InputAdornment>
                  }
                />
              </FormControl>
            ))}
            <FormControl>
  <FormLabel id="demo-radio-buttons-group-label" mt={2}>Gender</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="female"
    name="radio-buttons-group"
  >
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
  </RadioGroup>
</FormControl>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#8000ff",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "4px",
                py: 1,
                mt: 2,
                mb: 3,
                display: "block",
                mx: "auto",
                "&:hover": { backgroundColor: "#6a1b9a" },
              }}
              size='large'
            >
              Save
            </Button>
          </Box>

          </>
        );
      case 'photo':
        return (
          <>
      <Typography variant="h4" gutterBottom>Upload Photo</Typography>
      <Typography variant="body1" gutterBottom>
        Paste the URL of your profile picture below.
      </Typography>

      <TextField
        fullWidth
        label="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        margin="normal"
      />
        <Button
              variant="contained"
              sx={{
                backgroundColor: "#8000ff",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "4px",
                py: 1,
                mt: 2,
                mb: 3,
                display: "block",
                mx: "auto",
                "&:hover": { backgroundColor: "#6a1b9a" },
              }}
              size='large'
            >
              Save
            </Button>

          </>
        );
      case 'security':
        return (
          <>
            <Typography variant="h4" gutterBottom textAlign={'center'} fontWeight={'bold'}>Account </Typography>
        <Typography textAlign={'center'} gutterBottom  variant='body1'>  Edit your account settings and change your password here.  </Typography>  
           
            <TextField fullWidth label="Current Password" type="password" margin="normal" />
            <TextField fullWidth label="New Password" type="password" margin="normal" />
            <TextField fullWidth label="Confirm New Password" type="password" margin="normal" />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#8000ff",
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "4px",
                py: 1,
                mt: 2,
                mb: 3,
                display: "block",
                mx: "auto",
                "&:hover": { backgroundColor: "#6a1b9a" },
              }}
              size='large'
            >
              change password
            </Button>
          </>
        );
      case 'close':
        return (
          <>
            <Typography variant="h4" gutterBottom>Close Account</Typography>
            <Typography color="error" gutterBottom>
              Warning: This will permanently delete your account.
            </Typography>
            <Button variant="contained" color="error">Close My Account</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      mt: 5,
      px: 2, 
    }}
  >
<Paper
  elevation={3}
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, 
    width: '100%',
    maxWidth: 1300,
    minHeight: 600,
    mx: 'auto',
    height: 'auto',
  }}
>

      {/* Sidebar */}
      <Box
  sx={{
    width: { xs: '100%', md: drawerWidth },
    borderRight: { md: '1px solid #ccc' },
    borderBottom: { xs: '1px solid #ccc', md: 'none' },
    p: 2,
    backgroundColor: 'white',
    textAlign: 'center',
  }}
>

        <Avatar
          alt="User Profile"
          src=""
          sx={{ width: 150, height: 150, margin: '0 auto', mb: 1 }}
        />
        <Typography variant="subtitle1" gutterBottom>
          User Name
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          {profileSections.map((section) => (
            <ListItem
              button
              key={section.id}
              selected={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            >
              <ListItemText primary={section.label} />
            </ListItem>
          ))}
        </List>
      </Box>
  
      {/* Main Content */}
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    width: '100%', 
    p: { xs: 2, sm: 3, md: 4 },
  }}
>

        {renderSectionContent()}
      </Box>
    </Paper>
  </Box>
  
  );
};

export default EditProfilePage;
