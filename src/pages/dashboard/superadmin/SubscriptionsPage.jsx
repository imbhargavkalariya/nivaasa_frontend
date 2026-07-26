import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { superAdminApi } from 'src/api/nivaasa';

export default function SubscriptionsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  
  const [form, setForm] = useState({
    name: 'Basic',
    price: 0,
    durationDays: 30,
    maxFlats: 100,
    maxResidents: 500,
    storageLimitGB: 5,
    enabledModules: ['dashboard', 'residents', 'hierarchy'],
    description: '',
    isActive: true,
  });

  const fetchPlans = async () => {
    try {
      const res = await superAdminApi.getPlans();
      if (res.success) {
        setPlans(res.plans);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch subscription plans', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      const res = await superAdminApi.createPlan(form);
      if (res.success) {
        enqueueSnackbar('Plan created successfully', { variant: 'success' });
        setOpenCreate(false);
        fetchPlans();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error creating plan', { variant: 'error' });
    }
  };

  const handleEditOpen = (plan) => {
    setSelectedPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      durationDays: plan.durationDays,
      maxFlats: plan.maxFlats,
      maxResidents: plan.maxResidents,
      storageLimitGB: plan.storageLimitGB || 5,
      enabledModules: plan.enabledModules || [],
      description: plan.description || '',
      isActive: plan.isActive !== false,
    });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await superAdminApi.updatePlan(selectedPlan._id, form);
      if (res.success) {
        enqueueSnackbar('Plan updated successfully', { variant: 'success' });
        setOpenEdit(false);
        fetchPlans();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating plan', { variant: 'error' });
    }
  };

  const toggleModule = (moduleName) => {
    const modules = [...form.enabledModules];
    const idx = modules.indexOf(moduleName);
    if (idx > -1) {
      modules.splice(idx, 1);
    } else {
      modules.push(moduleName);
    }
    setForm({ ...form, enabledModules: modules });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Subscription & Pricing Tiers</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Define flat/resident limit, storage size, and active features per subscription plan.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            setForm({
              name: 'Basic',
              price: 0,
              durationDays: 30,
              maxFlats: 100,
              maxResidents: 500,
              storageLimitGB: 5,
              enabledModules: ['dashboard', 'residents', 'hierarchy'],
              description: '',
              isActive: true,
            });
            setOpenCreate(true);
          }}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Add Custom Plan
        </Button>
      </Box>

      {/* Cards list */}
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan._id}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #E5EAF2', position: 'relative', overflow: 'visible', height: '100%' }}>
              <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: '700', color: '#1F2937' }}>{plan.name}</Typography>
                  <Chip label={plan.isActive ? 'Active' : 'Inactive'} size="small" color={plan.isActive ? 'success' : 'default'} />
                </Box>

                <Typography variant="h3" sx={{ fontWeight: '800', color: '#3657D6', mb: 1 }}>
                  ₹{plan.price}
                  <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: '500' }}> / {plan.durationDays} Days</Typography>
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', minHeight: '40px', mb: 3 }}>{plan.description || 'No description provided.'}</Typography>

                <Box sx={{ borderTop: '1px solid #E5EAF2', pt: 2, mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Iconify icon="solar:home-bold-duotone" sx={{ color: '#16A085' }} />
                    <Typography variant="body2">Max Flats: <strong>{plan.maxFlats}</strong></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Iconify icon="solar:users-group-rounded-bold-duotone" sx={{ color: '#3657D6' }} />
                    <Typography variant="body2">Max Residents: <strong>{plan.maxResidents}</strong></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Iconify icon="solar:server-bold-duotone" sx={{ color: '#F4B740' }} />
                    <Typography variant="body2">Storage Caps: <strong>{plan.storageLimitGB} GB</strong></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Iconify icon="solar:widget-bold-duotone" sx={{ color: 'info.main' }} />
                    <Typography variant="body2">Modules count: <strong>{plan.enabledModules?.length || 0} enabled</strong></Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleEditOpen(plan)}
                  sx={{ borderRadius: '10px', py: 1 }}
                >
                  Configure Tier
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit / Create Dialog */}
      <Dialog open={openEdit || openCreate} onClose={() => { setOpenEdit(false); setOpenCreate(false); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>
          {openCreate ? 'Create Pricing Tier' : `Configure ${form.name} Plan`}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={openEdit}>
                <InputLabel>Tier Name</InputLabel>
                <Select
                  value={form.name}
                  label="Tier Name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                >
                  <MenuItem value="Trial">Trial</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Pricing (INR)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Duration (Days)" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Max Flats" value={form.maxFlats} onChange={(e) => setForm({ ...form, maxFlats: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Max Residents" value={form.maxResidents} onChange={(e) => setForm({ ...form, maxResidents: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Cloud Storage (GB)" value={form.storageLimitGB} onChange={(e) => setForm({ ...form, storageLimitGB: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Tier Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Enabled Modules</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['dashboard', 'residents', 'hierarchy', 'maintenance', 'financials', 'notices', 'complaints', 'community', 'staff'].map((mod) => (
                  <Chip
                    key={mod}
                    label={mod.toUpperCase()}
                    clickable
                    color={form.enabledModules.includes(mod) ? 'primary' : 'default'}
                    onClick={() => toggleModule(mod)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />}
                label="Plan is Active (Available for onboarding)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => { setOpenEdit(false); setOpenCreate(false); }} variant="outlined">Cancel</Button>
          <Button onClick={openCreate ? handleCreate : handleUpdate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Save Settings</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
