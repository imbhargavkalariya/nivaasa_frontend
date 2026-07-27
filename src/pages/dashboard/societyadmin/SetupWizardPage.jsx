import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';
import { useRouter } from 'src/routes/hooks';

const STEPS = ['Banking Details', 'Billing Configurations', 'Emergency Contacts & Rules'];

export default function SetupWizardPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState({
    bankingInfo: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      branch: '',
    },
    maintenanceSettings: {
      frequency: 'MONTHLY',
      billingType: 'FIXED',
      ratePerSqFt: 0,
      fixedAmount: 2000,
      lateFee: 200,
      dueDateDays: 10,
    },
    emergencyContacts: [
      { name: 'Society Main Gate Security', role: 'Security', phone: '9999911111' },
      { name: 'Surat Ambulance Service', role: 'Medical', phone: '102' },
    ],
    rules: [
      'No loud music in common zones past 10 PM.',
      'All residents must submit vehicle details to security office.',
    ],
  });

  const [newRule, setNewRule] = useState('');
  const [newContact, setNewContact] = useState({ name: '', role: '', phone: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await societyAdminApi.getProfile();
        if (res.success && res.society) {
          const s = res.society;
          setForm({
            bankingInfo: {
              bankName: s.bankingInfo?.bankName || '',
              accountNumber: s.bankingInfo?.accountNumber || '',
              ifscCode: s.bankingInfo?.ifscCode || '',
              accountHolderName: s.bankingInfo?.accountHolderName || '',
              branch: s.bankingInfo?.branch || '',
            },
            maintenanceSettings: {
              frequency: s.maintenanceSettings?.frequency || 'MONTHLY',
              billingType: s.maintenanceSettings?.billingType || 'FIXED',
              ratePerSqFt: s.maintenanceSettings?.ratePerSqFt || 0,
              fixedAmount: s.maintenanceSettings?.fixedAmount || 2000,
              lateFee: s.maintenanceSettings?.lateFee || 200,
              dueDateDays: s.maintenanceSettings?.dueDateDays || 10,
            },
            emergencyContacts: s.emergencyContacts && s.emergencyContacts.length > 0
              ? s.emergencyContacts
              : [
                  { name: 'Society Main Gate Security', role: 'Security', phone: '9999911111' },
                  { name: 'Surat Ambulance Service', role: 'Medical', phone: '102' },
                ],
            rules: s.rules && s.rules.length > 0
              ? s.rules
              : [
                  'No loud music in common zones past 10 PM.',
                  'All residents must submit vehicle details to security office.',
                ],
          });
        }
      } catch (error) {
        console.error('Failed to load existing society configurations', error);
      }
    };
    loadProfile();
  }, []);

  const [loadingSave, setLoadingSave] = useState(false);

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      handleSave();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const res = await societyAdminApi.setupWizard(form);
      if (res.success) {
        enqueueSnackbar('Society wizard configuration saved successfully!', { variant: 'success' });
        router.push('/dashboard');
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Wizard setup failed', { variant: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setForm({ ...form, rules: [...form.rules, newRule.trim()] });
    setNewRule('');
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setForm({ ...form, emergencyContacts: [...form.emergencyContacts, newContact] });
    setNewContact({ name: '', role: '', phone: '' });
  };

  const removeRule = (index) => {
    const updated = form.rules.filter((_, idx) => idx !== index);
    setForm({ ...form, rules: updated });
  };

  const removeContact = (index) => {
    const updated = form.emergencyContacts.filter((_, idx) => idx !== index);
    setForm({ ...form, emergencyContacts: updated });
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: '600', mb: 1 }}>Society Initialization Wizard</Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>Complete these 3 setup blocks to initialize operations for your community.</Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ p: 4, borderRadius: '20px', border: '1px solid #E5EAF2', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
        {/* Step 1: Banking */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Step 1: Set Up Society Bank Account</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField fullWidth label="Account Holder Name" value={form.bankingInfo.accountHolderName} onChange={(e) => setForm({ ...form, bankingInfo: { ...form.bankingInfo, accountHolderName: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Bank Name" value={form.bankingInfo.bankName} onChange={(e) => setForm({ ...form, bankingInfo: { ...form.bankingInfo, bankName: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Branch Name" value={form.bankingInfo.branch} onChange={(e) => setForm({ ...form, bankingInfo: { ...form.bankingInfo, branch: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Account Number" value={form.bankingInfo.accountNumber} onChange={(e) => setForm({ ...form, bankingInfo: { ...form.bankingInfo, accountNumber: e.target.value } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="IFSC Code" value={form.bankingInfo.ifscCode} onChange={(e) => setForm({ ...form, bankingInfo: { ...form.bankingInfo, ifscCode: e.target.value } })} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Billing Config */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Step 2: Default Maintenance Invoicing Structure</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Billing Frequency</InputLabel>
                  <Select value={form.maintenanceSettings.frequency} label="Billing Frequency" onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, frequency: e.target.value } })}>
                    <MenuItem value="MONTHLY">Monthly</MenuItem>
                    <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                    <MenuItem value="YEARLY">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Calculation Model</InputLabel>
                  <Select value={form.maintenanceSettings.billingType} label="Calculation Model" onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, billingType: e.target.value } })}>
                    <MenuItem value="FIXED">Flat Fixed Amount</MenuItem>
                    <MenuItem value="AREA_BASED">Area Size-Based Calculation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {form.maintenanceSettings.billingType === 'FIXED' ? (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Fixed Maintenance Amount (₹)" value={form.maintenanceSettings.fixedAmount} onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, fixedAmount: Number(e.target.value) } })} />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Rate Per Sq Ft (₹)" value={form.maintenanceSettings.ratePerSqFt} onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, ratePerSqFt: Number(e.target.value) } })} />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Late Fee Charges (₹)" value={form.maintenanceSettings.lateFee} onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, lateFee: Number(e.target.value) } })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Payment Window (Days from billing date)" value={form.maintenanceSettings.dueDateDays} onChange={(e) => setForm({ ...form, maintenanceSettings: { ...form.maintenanceSettings, dueDateDays: Number(e.target.value) } })} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3: Rules & Emergency */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Step 3: Setup Emergency Contacts & Bye-laws</Typography>
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Add Emergency Contacts</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Role / Department" value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth size="small" label="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button variant="contained" color="success" fullWidth onClick={addContact} sx={{ p: 1 }}>
                  Add
                </Button>
              </Grid>
            </Grid>

            <List sx={{ mb: 3 }}>
              {form.emergencyContacts.map((c, idx) => (
                <ListItem
                  key={idx}
                  sx={{ backgroundColor: '#F8FAFC', borderRadius: '8px', mb: 1 }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeContact(idx)} color="error">
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${c.name} - ${c.phone}`} secondary={c.role} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Add Bylaws / Rules</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <TextField fullWidth size="small" label="Rule description..." value={newRule} onChange={(e) => setNewRule(e.target.value)} />
              <Button variant="contained" onClick={addRule}>Add</Button>
            </Box>

            <List>
              {form.rules.map((r, idx) => (
                <ListItem
                  key={idx}
                  sx={{ backgroundColor: '#F8FAFC', borderRadius: '8px', mb: 1 }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeRule(idx)} color="error">
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`${idx + 1}. ${r}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #E5EAF2' }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Back
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleNext}
            loading={loadingSave}
            sx={{ backgroundColor: '#3657D6' }}
          >
            {activeStep === STEPS.length - 1 ? 'Finish Setup' : 'Next Step'}
          </LoadingButton>
        </Box>
      </Card>
    </Box>
  );
}
