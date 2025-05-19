import React, { useEffect, useState, useContext } from 'react';
import {
  Avatar, Box, List, ListItem, ListItemText, Typography, Divider, Paper,
  MenuItem, FormControl, InputLabel, OutlinedInput, InputAdornment, Button,
  TextField, RadioGroup, FormLabel, FormControlLabel, Radio, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import { UserContext } from '../../context/UserContext';
import { db,  storage } from '../../Firebase/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const drawerWidth = 250;

const profileSections = [
  { id: 'profile', label: 'profile' },
  { id: 'photo', label: 'photo' },
  { id: 'security', label: 'security' },
  { id: 'close', label: 'close' },
];

const Userprofile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    headline: '',
    bio: '',
    language: 'English',
    links: { facebook: '', instagram: '', linkedin: '', youtube: '' },
    gender: 'female',
    profile_picture: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        setSnackbarMessage(t('Please select an image in JPEG, PNG, or GIF format.'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage(t('Image size is too large. Please select an image less than 5MB.'));
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData((prev) => ({
              ...prev,
              ...data,
              links: { ...prev.links, ...(data.links || {}) },
              profile_picture: data.profile_picture || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile: ', error);
          setSnackbarMessage(t('Error fetching profile data.'));
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      };
      fetchUserProfile();
    }
  }, [user, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['facebook', 'instagram', 'linkedin', 'youtube'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        links: { ...prevData.links, [name]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const saveProfileData = async () => {
    if (!formData.first_name || !formData.last_name) {
      setSnackbarMessage(t('Please fill in all required fields.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    if (!user) {
      setSnackbarMessage(t('User not logged in.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'Users', user.uid), {
        ...formData,
        user_id: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });

      setSnackbarMessage(t('Profile saved successfully.'));
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving profile data: ', error);
      setSnackbarMessage(t('Error saving profile data.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };


const handleSavePhoto = async () => {
  if (!imageFile) {
    setSnackbarMessage(t('Please select an image.'));
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }
  if (!user) {
    setSnackbarMessage(t('User not logged in.'));
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }

  setLoading(true);
  let oldImagePath = null;

  try {

    if (formData.profile_picture) {
      try {
   
        const urlParts = formData.profile_picture.split('/profile_picture/');
        oldImagePath = urlParts.length > 1 ? `profile_picture/${urlParts[1]}` : null;
        
        if (oldImagePath) {
          const oldImageRef = ref(storage, oldImagePath);
          await deleteObject(oldImageRef);
        }
      } catch (deleteError) {
        console.warn('Failed to delete old image:', deleteError.message);
      }
    }

  
    const fileExtension = imageFile.name.split('.').pop();
    const newImageRef = ref(storage, `profile_picture/${user.uid}-${Date.now()}.${fileExtension}`);
    await uploadBytes(newImageRef, imageFile);
    const imageUrl = await getDownloadURL(newImageRef);

  
    await setDoc(
      doc(db, 'Users', user.uid),
      { profile_picture: imageUrl },
      { merge: true }
    );

   
    setFormData((prev) => ({ ...prev, profile_picture: imageUrl }));
    setSnackbarMessage(t('Profile photo updated successfully.'));
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setImageFile(null);
    setImagePreview(null);

  } catch (error) {
    console.error('Error updating profile photo:', error);
    setSnackbarMessage(t('Error updating profile photo: ') + error.message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);

    if (oldImagePath) {
      try {
        const oldImageUrl = await getDownloadURL(ref(storage, oldImagePath));
        await setDoc(
          doc(db, 'Users', user.uid),
          { profile_picture: oldImageUrl },
          { merge: true }
        );
      } catch (restoreError) {
        console.error('Failed to restore old image:', restoreError);
      }
    }
  } finally {
    setLoading(false);
  }
};

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbarMessage(t('Please fill in all fields.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbarMessage(t('New passwords do not match.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSnackbarMessage(t('Password updated successfully.'));
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setSnackbarMessage(t('Failed to update password. Please check your current password.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Close user account and delete data
  const closeAccount = async () => {
    if (!user) {
      setSnackbarMessage(t('User not logged in.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'Users', user.uid));
      await deleteUser(user);
      setSnackbarMessage(t('Account closed and data deleted successfully.'));
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/');
    } catch (error) {
      console.error('Error closing account:', error);
      setSnackbarMessage(t('There was an error closing your account.'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <Typography variant="h4" gutterBottom>{t('Public profile')}</Typography>
            <TextField
              fullWidth
              label={t('First Name')}
              margin="normal"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label={t('Last Name')}
              margin="normal"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label={t('Biography')}
              multiline
              rows={4}
              margin="normal"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label={t('Headline')}
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
              label={t('Language')}
            >
              <MenuItem value="English">{t('English')}</MenuItem>
              <MenuItem value="عربي">{t('عربي')}</MenuItem>
            </TextField>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>{t('Links:')}</Typography>
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
              <FormLabel id="gender-radio-buttons-group-label" sx={{ mt: 2 }}>
                {t('Gender')}
              </FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group-label"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="female" control={<Radio />} label={t('Female')} />
                <FormControlLabel value="male" control={<Radio />} label={t('Male')} />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              sx={{ backgroundColor: '#8000ff', color: '#fff', mt: 2, mb: 3, mx: 'auto', display: 'block' }}
              onClick={saveProfileData}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('Save')}
            </Button>
          </>
        );
      case 'photo':
        return (
          <>
            <Typography variant="h4" gutterBottom>{t('Upload Photo')}</Typography>
            <Button variant="outlined" component="label" sx={{ mt: 2  ,mx:5}}>
              {t('Choose Image')}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{t('Image Preview')}:</Typography>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </Box>
            )}
            <Button
              variant="contained"
              sx={{  backgroundColor: '#8000ff', color: '#fff', mt: 2 }}
              onClick={handleSavePhoto}
              disabled={loading || !imageFile}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('Save')}
            </Button>
          </>
        );
      case 'security':
        return (
          <>
            <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
              {t('Account')}
            </Typography>
            <TextField
              fullWidth
              label={t('Current Password')}
              type="password"
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label={t('New Password')}
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label={t('Confirm New Password')}
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: '#8000ff', color: '#fff', mt: 2 }}
              onClick={handlePasswordChange}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('Change Password')}
            </Button>
          </>
        );
      case 'close':
        return (
          <>
            <Typography variant="h4" gutterBottom>{t('Close Account')}</Typography>
            <Typography color="error" gutterBottom>
              {t('Warning: This will permanently delete your account.')}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={closeAccount}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : t('Close My Account')}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', mt: 5, px: 2 }}>
      <Paper
        elevation={3}
        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: 1300, minHeight: 600 }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: drawerWidth },
            borderRight: { md: '1px solid #ccc' },
            borderBottom: { xs: '1px solid #ccc', md: 'none' },
            p: 2,
            textAlign: 'center',
          }}
        >
          <Avatar
            alt="User Profile"
            src={formData.profile_picture || ''}
            sx={{ width: 150, height: 150, margin: '0 auto', mb: 1 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            {formData.first_name} {formData.last_name}
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
                <ListItemText primary={t(section.label)} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
          {renderSectionContent()}
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Userprofile;