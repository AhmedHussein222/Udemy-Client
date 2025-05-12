import React, { useEffect, useState, useContext } from 'react';
import {
  Avatar, Box, List, ListItem, ListItemText, Typography, Divider, Paper,
  MenuItem, FormControl, InputLabel, OutlinedInput, InputAdornment, Button,
  TextField, RadioGroup, FormLabel, FormControlLabel, Radio, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import { UserContext } from "../../context/UserContext";
import { db, auth } from "../../Firebase/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 250;

const profileSections = [
  { id: 'profile', label: 'Profile' },
  { id: 'photo', label: 'Photo' },
  { id: 'security', label: 'Account Security' },
  { id: 'close', label: 'Close account' },
];

const Userprofile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", headline: "", bio: "", language: "English",
    links: { facebook: "", instagram: "", linkedin: "", youtube: "" },
    gender: "female"
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

useEffect(() => {
  if (user) {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            ...data,
            links: { ...prev.links, ...(data.links || {}) },
            profile_picture: data.profile_picture || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };
    fetchUserProfile();
  }
}, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["facebook", "instagram", "linkedin", "youtube"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        links: { ...prevData.links, [name]: value }
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const saveProfileData = async () => {
    if (!formData.first_name || !formData.last_name) {
      setSnackbarMessage("Please fill in all required fields.");
      setOpenSnackbar(true);
      return;
    }
    if (!user) {
      setSnackbarMessage("User not logged in");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "Users", user.uid), {
        ...formData,
        user_id: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      });

      setSnackbarMessage("Profile saved successfully.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving profile data: ", error);
      setSnackbarMessage("Error saving profile data");
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

 const handleSavePhoto = async () => {
  if (!imageUrl) {
    setSnackbarMessage("Please enter a valid image URL.");
    setOpenSnackbar(true);
    return;
  }
  try {
    if (user) {
      await setDoc(doc(db, "Users", user.uid), {
        ...formData,
        profile_picture: imageUrl
      }, { merge: true });

      setFormData((prev) => ({ ...prev, profile_picture: imageUrl }));
      setSnackbarMessage("Profile photo updated successfully.");
      setOpenSnackbar(true);
      setImageUrl('');
    }
  } catch (error) {
    console.error("Error updating profile photo:", error);
    setSnackbarMessage("Error updating profile photo");
    setOpenSnackbar(true);
  }
};


  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbarMessage("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbarMessage("New passwords do not match.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSnackbarMessage("Password updated successfully.");
      setOpenSnackbar(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      setSnackbarMessage("Failed to update password. Please check your current password.");
      setOpenSnackbar(true);
    }
  };

  const closeAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteDoc(doc(db, "Users", currentUser.uid));
        await deleteUser(currentUser);
        setSnackbarMessage("Account closed and data deleted successfully.");
        setOpenSnackbar(true);
        navigate('/');
      }
    } catch (error) {
      console.error("Error closing account:", error);
      setSnackbarMessage("There was an error closing your account.");
      setOpenSnackbar(true);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <Typography variant="h4" gutterBottom>Public profile</Typography>
            <TextField fullWidth label="First Name" margin="normal" name="first_name" value={formData.first_name} onChange={handleChange} />
            <TextField fullWidth label="Last Name" margin="normal" name="last_name" value={formData.last_name} onChange={handleChange} />
            <TextField fullWidth label="Biography" multiline rows={4} margin="normal" name="bio" value={formData.bio} onChange={handleChange} />
            <TextField fullWidth label="Headline" margin="normal" name="headline" value={formData.headline} onChange={handleChange} />
            <TextField select fullWidth name="language" value={formData.language} onChange={handleChange} margin="normal">
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
                  startAdornment={<InputAdornment position="start">{platform}.com/</InputAdornment>}
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

            <Button variant="contained" sx={{ backgroundColor: "#8000ff", color: "#fff", mt: 2, mb: 3, mx: "auto", display: "block" }} onClick={saveProfileData} disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save"}
            </Button>
          </>
        );
      case 'photo':
        return (
          <>
            <Typography variant="h4" gutterBottom>Upload Photo</Typography>
            <TextField fullWidth label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} margin="normal" />
            <Button variant="contained" sx={{ backgroundColor: "#8000ff", color: "#fff", mt: 2 }} onClick={handleSavePhoto}>Save</Button>
          </>
        );
      case 'security':
        return (
          <>
            <Typography variant="h4" gutterBottom textAlign={'center'} fontWeight={'bold'}>Account</Typography>
            <TextField fullWidth label="Current Password" type="password" margin="normal" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <TextField fullWidth label="New Password" type="password" margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField fullWidth label="Confirm New Password" type="password" margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button variant="contained" sx={{ backgroundColor: "#8000ff", color: "#fff", mt: 2 }} onClick={handlePasswordChange}>Change Password</Button>
          </>
        );
      case 'close':
        return (
          <>
            <Typography variant="h4" gutterBottom>Close Account</Typography>
            <Typography color="error" gutterBottom>Warning: This will permanently delete your account.</Typography>
            <Button variant="contained" color="error" onClick={closeAccount}>Close My Account</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', mt: 5, px: 2 }}>
      <Paper elevation={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: 1300, minHeight: 600 }}>
        <Box sx={{ width: { xs: '100%', md: drawerWidth }, borderRight: { md: '1px solid #ccc' }, borderBottom: { xs: '1px solid #ccc', md: 'none' }, p: 2, textAlign: 'center' }}>
        <Avatar alt="User Profile" src={formData.profile_picture || ''} sx={{ width: 150, height: 150, margin: '0 auto', mb: 1 }} />
<Typography variant="subtitle1" gutterBottom>
  {formData.first_name} {formData.last_name}
</Typography>

          <Divider sx={{ my: 2 }} />
          <List>
            {profileSections.map((section) => (
              <ListItem button key={section.id} selected={activeSection === section.id} onClick={() => setActiveSection(section.id)}>
                <ListItemText primary={section.label} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
          {renderSectionContent()}
        </Box>
      </Paper>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Userprofile;
