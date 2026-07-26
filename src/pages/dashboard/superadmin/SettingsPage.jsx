import { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useSnackbar } from 'notistack';

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [form, setForm] = useState({
    appName: 'Nivaasa Platform',
    supportEmail: 'bhargav@anguler.com',
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    backupSchedule: 'Weekly',
    maintenanceMode: false,
    lockoutPolicy: true,
    maxFailedAttempts: 5,
    sessionTimeout: 60, // minutes
  });

  const handleSave = () => {
    enqueueSnackbar('System settings saved successfully', { variant: 'success' });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>SaaS Settings & Configuration</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Configure default app preferences, session timeouts, timezones, and backup routines.</Typography>

      <Card sx={{ p: 4, borderRadius: '16px', border: '1px solid #E5EAF2', mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#3657D6' }}>General Brand Preferences</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Application Name" value={form.appName} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="System Support Email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Timezone Settings" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Default Currency Symbol" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#16A085' }}>Security & Policies</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Max Login Failures before account lock" value={form.maxFailedAttempts} onChange={(e) => setForm({ ...form, maxFailedAttempts: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Session Token Expiry Timer (Minutes)" value={form.sessionTimeout} onChange={(e) => setForm({ ...form, sessionTimeout: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={form.lockoutPolicy} onChange={(e) => setForm({ ...form, lockoutPolicy: e.target.checked })} />}
              label="Enable brute-force account locking policy"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />}
              label="Activate Global Platform Maintenance Mode"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#3657D6', px: 4, py: 1.2, borderRadius: '10px' }}>
            Save Platform Settings
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
