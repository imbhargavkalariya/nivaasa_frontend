import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function ProfileSettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [logoFile, setLogoFile] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstNumber: '',
    registrationNumber: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await societyAdminApi.getProfile();
        if (res.success && res.society) {
          const s = res.society;
          setForm({
            name: s.name || '',
            address: s.address || '',
            city: s.city || '',
            state: s.state || '',
            postalCode: s.postalCode || '',
            contactPerson: s.contactPerson || '',
            phone: s.phone || '',
            email: s.email || '',
            gstNumber: s.gstNumber || '',
            registrationNumber: s.registrationNumber || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await societyAdminApi.updateProfile(formData);
      if (res.success) {
        enqueueSnackbar('Society profile updated successfully!', { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Error updating profile', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>Society Profile Settings</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Manage community registration papers, tax configurations, logo assets, and contact details.</Typography>

      <Card sx={{ p: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#3657D6' }}>Complex Information</Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Society Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Full Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#16A085' }}>Contacts & TAX</Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
              Upload Society Logo
              <input type="file" hidden accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            </Button>
            {logoFile && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Selected: {logoFile.name}</Typography>}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleUpdate} sx={{ backgroundColor: '#3657D6', px: 4, py: 1.2, borderRadius: '8px' }}>
            Update Profile
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
