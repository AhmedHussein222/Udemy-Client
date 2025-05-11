import React, { useEffect, useState } from 'react';
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
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { db } from './firebaseConfig'; 
import { doc, setDoc ,getDoc } from "firebase/firestore";
import { auth } from './firebaseConfig';



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
    const { user } = useContext(UserContext);
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  headline: "",
  biography: "",
  language: "English",
  links: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  },
  gender: "female"
});

useEffect(() => {
  const fetchUserProfile = async () => {
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setFormData((prev) => ({
          ...prev,
          ...docSnap.data(),
          links: {
            ...prev.links,
            ...(docSnap.data().links || {}) 
          }
        }));
      }
    }
  };

  fetchUserProfile();
}, [user]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (["facebook", "instagram", "linkedin", "youtube"].includes(name)) {
    setFormData((prevData) => ({
      ...prevData,
      links: {
        ...prevData.links,
        [name]: value
      }
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }
};



const saveProfileData = async () => {
  try {
    const user = auth.currentUser; 

    if (user) {
      await setDoc(doc(db, "Users", user.uid), formData);
      alert("Profile saved successfully");
    } else {
      alert("No user is logged in");
    }
  } catch (error) {
    console.error("Error saving profile data: ", error);
    alert("Error saving profile data");
  }
};
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
          <Box >
          <Typography variant="h4" gutterBottom>Public profile</Typography>
            <Typography variant="subtitle1" gutterBottom>Basics:</Typography>

<TextField
  fullWidth
  label="First Name"
  margin="normal"
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
/>

<TextField
  fullWidth
  label="Last Name"
  margin="normal"
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
/>
<TextField
  fullWidth
  label="Biography"
  placeholder="Write your biography here"
  multiline
  rows={4}
  margin="normal"
  name="biography"
  value={formData.biography}
  onChange={handleChange}
/>


<TextField
  fullWidth
  label="Headline"
  margin="normal"
  name="headline"
  value={formData.headline}
  onChange={handleChange}
/>

<TextField
  select
  fullWidth
  name="language"
  value={formData.language}
  onChange={handleChange}
  margin="normal"
>
  <MenuItem value="English">English</MenuItem>
  <MenuItem value="عربي">عربي</MenuItem>
</TextField>


            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Links:</Typography>

{['facebook', 'instagram', 'linkedin', 'youtube'].map((platform) => (
  <FormControl fullWidth margin="normal" key={platform}>
    <InputLabel htmlFor={`${platform}-username`}>{platform}</InputLabel>
    <OutlinedInput
      id={`${platform}-username`}
      name={platform}
      value={formData.links[platform]}
      onChange={handleChange}
      startAdornment={
        <InputAdornment position="start">
          {platform}.com/
        </InputAdornment>
      }
    />
  </FormControl>
))}

<FormControl>
  <FormLabel id="gender-radio-buttons-group-label" mt={2}>Gender</FormLabel>
  <RadioGroup
    aria-labelledby="gender-radio-buttons-group-label"
    name="gender"
    value={formData.gender}
    onChange={handleChange}
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
  size="large"
  onClick={saveProfileData} 
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
