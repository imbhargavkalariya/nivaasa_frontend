import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { residentApi, authApi } from 'src/api/nivaasa';

export default function AccountSettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [photoFile, setPhotoFile] = useState(null);
  
  const [form, setForm] = useState({
    phone: '',
    alternativePhone: '',
    occupation: '',
    dob: '',
    gender: 'MALE',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success) {
        setForm({
          phone: res.user.phone || '',
          alternativePhone: res.user.alternativePhone || '',
          occupation: res.user.occupation || '',
          dob: res.user.dob ? res.user.dob.slice(0, 10) : '',
          gender: res.user.gender || 'MALE',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (photoFile) {
        formData.append('file', photoFile);
      }

      const res = await residentApi.updateProfile(formData);
      if (res.success) {
        enqueueSnackbar('Account preferences updated successfully!', { variant: 'success' });
        fetchProfile();
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update preferences', { variant: 'error' });
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await authApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      if (res.success) {
        enqueueSnackbar('Password changed successfully!', { variant: 'success' });
        setPasswordForm({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to change password', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>Account & Preferences</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Manage contact details, emergency phone numbers, profile images, and security settings.</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#3657D6' }}>Personal Preferences</Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Alternative Phone" value={form.alternativePhone} onChange={(e) => setForm({ ...form, alternativePhone: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select value={form.gender} label="Gender" onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
                  Upload Avatar Photo
                  <input type="file" hidden accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
                </Button>
                {photoFile && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Photo: {photoFile.name}</Typography>}
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleUpdateProfile} sx={{ backgroundColor: '#3657D6' }}>
                Save Preferences
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#EF4444' }}>Security Credentials</Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField fullWidth type="password" label="Current Password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="password" label="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="error" onClick={handleChangePassword}>
                Change Password
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
