import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  Button,
  Dialog,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  TableContainer,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { superAdminApi } from 'src/api/nivaasa';

export default function SocietiesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [societies, setSocieties] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [plan, setPlan] = useState('');
  
  // Dialog controls
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [societyAdmins, setSocietyAdmins] = useState([]);
  const [createdAdminCredentials, setCreatedAdminCredentials] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  
  // Form fields
  const [form, setForm] = useState({
    name: '',
    societyCode: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    registrationNumber: '',
    establishmentYear: new Date().getFullYear(),
    subscriptionPlan: 'Trial',
    subscriptionExpiry: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    propertyType: 'APARTMENT',
    adminPassword: '',
  });

  const fetchSocieties = async () => {
    try {
      const data = await superAdminApi.listSocieties({ search, status, plan });
      if (data.success) {
        setSocieties(data.societies);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch societies', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchSocieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, plan]);

  const handleCreate = async () => {
    try {
      const res = await superAdminApi.createSociety(form);
      if (res.success) {
        setCreatedAdminCredentials({
          societyName: res.society?.name || form.name,
          societyCode: res.society?.societyCode || '',
          email: res.admin?.email || form.adminEmail,
          password: res.admin?.tempPassword || '',
        });
        enqueueSnackbar('Society registered successfully!', { variant: 'success' });
        setOpenCreate(false);
        fetchSocieties();
        // Reset form
        setForm({
          name: '',
          societyCode: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          contactPerson: '',
          phone: '',
          email: '',
          registrationNumber: '',
          establishmentYear: new Date().getFullYear(),
          subscriptionPlan: 'Trial',
          subscriptionExpiry: '',
          adminName: '',
          adminEmail: '',
          adminPhone: '',
          propertyType: 'APARTMENT',
          adminPassword: '',
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error creating society', { variant: 'error' });
    }
  };

  const handleOpenDetail = async (soc) => {
    try {
      const res = await superAdminApi.getSociety(soc._id);
      if (res.success) {
        setSelectedSociety(res.society);
        setSocietyAdmins(res.admins);
        setOpenDetail(true);
      }
    } catch (error) {
      enqueueSnackbar('Error loading details', { variant: 'error' });
    }
  };

  const handleToggleStatus = async (soc) => {
    const nextStatus = soc.activationStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await superAdminApi.updateSociety(soc._id, { activationStatus: nextStatus });
      if (res.success) {
        enqueueSnackbar(`Society is now ${nextStatus.toLowerCase()}`, { variant: 'success' });
        fetchSocieties();
      }
    } catch (error) {
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await superAdminApi.deleteSociety(id);
      if (res.success) {
        enqueueSnackbar('Society deleted permanently', { variant: 'success' });
        fetchSocieties();
      }
    } catch (error) {
      enqueueSnackbar('Error deleting society', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600', color: '#1F2937' }}>Society Management</Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>Onboard, review, suspend and delete customer society complexes.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ backgroundColor: '#3657D6', '&:hover': { backgroundColor: '#2748C9' }, borderRadius: '12px', px: 3, py: 1.2 }}
          onClick={() => setOpenCreate(true)}
        >
          Add Society
        </Button>
      </Box>

      {/* Filters card */}
      <Card sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #E5EAF2' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search by name, code, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Subscription Tier</InputLabel>
              <Select value={plan} label="Subscription Tier" onChange={(e) => setPlan(e.target.value)}>
                <MenuItem value="">All Tiers</MenuItem>
                <MenuItem value="Trial">Trial</MenuItem>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Society Name</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Contact Person</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {societies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>No societies found matching filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                societies.map((soc) => (
                  <TableRow key={soc._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{soc.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{soc.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={soc.societyCode} size="small" sx={{ fontWeight: 'bold', backgroundColor: '#EFF6FF', color: '#1E40AF' }} />
                    </TableCell>
                    <TableCell>{soc.city}, {soc.state}</TableCell>
                    <TableCell>{soc.contactPerson} ({soc.phone})</TableCell>
                    <TableCell>
                      <Chip label={soc.subscriptionPlan} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={soc.activationStatus}
                        size="small"
                        color={soc.activationStatus === 'ACTIVE' ? 'success' : 'error'}
                        sx={{ fontWeight: '600' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDetail(soc)} color="info">
                        <Iconify icon="solar:eye-bold" />
                      </IconButton>
                      <IconButton onClick={() => handleToggleStatus(soc)} color={soc.activationStatus === 'ACTIVE' ? 'warning' : 'success'}>
                        <Iconify icon={soc.activationStatus === 'ACTIVE' ? 'solar:lock-bold' : 'solar:lock-keyhole-unlocked-bold'} />
                      </IconButton>
                      <IconButton onClick={() => { setDeleteConfirmId(soc._id); setDeleteConfirmName(soc.name); }} color="error">
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Creation Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2', pb: 2 }}>Onboard New Society Complex</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#3657D6' }}>Society Details</Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Society Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Unique Society Code" value={form.societyCode} onChange={(e) => setForm({ ...form, societyCode: e.target.value })} placeholder="Blank to auto-generate (e.g. SUR101)" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Establishment Year" value={form.establishmentYear} onChange={(e) => setForm({ ...form, establishmentYear: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription Tier</InputLabel>
                <Select value={form.subscriptionPlan} label="Subscription Tier" onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value })}>
                  <MenuItem value="Trial">Trial</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Layout / Property Type</InputLabel>
                <Select value={form.propertyType} label="Layout / Property Type" onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                  <MenuItem value="APARTMENT">Apartment Complex (Multi-story)</MenuItem>
                  <MenuItem value="VILLA_ROW_HOUSE">Villa / Row House / Tenement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Subscription Expiry" InputLabelProps={{ shrink: true }} value={form.subscriptionExpiry} onChange={(e) => setForm({ ...form, subscriptionExpiry: e.target.value })} required />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 4, color: '#16A085' }}>Assign Primary Administrator</Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Admin Full Name" value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="email" label="Admin Email ID" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Admin Phone Number" value={form.adminPhone} onChange={(e) => setForm({ ...form, adminPhone: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admin Password"
                placeholder="Leave blank for 'SuperPassword'"
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined" sx={{ borderRadius: '8px' }}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ backgroundColor: '#3657D6', '&:hover': { backgroundColor: '#2748C9' }, borderRadius: '8px' }}>Create & Invite</Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Society Snapshot</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedSociety && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Society Details</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>{selectedSociety.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Code:</strong> {selectedSociety.societyCode}</Typography>
                <Typography variant="body2"><strong>Address:</strong> {selectedSociety.address}, {selectedSociety.city}, {selectedSociety.state} - {selectedSociety.postalCode}</Typography>
                <Typography variant="body2"><strong>Registration Number:</strong> {selectedSociety.registrationNumber}</Typography>
                <Typography variant="body2"><strong>Establishment Year:</strong> {selectedSociety.establishmentYear}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" color="text.secondary">Billing & Subscription</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={`Tier: ${selectedSociety.subscriptionPlan}`} color="primary" sx={{ mr: 1 }} />
                  <Chip label={`Status: ${selectedSociety.activationStatus}`} color={selectedSociety.activationStatus === 'ACTIVE' ? 'success' : 'error'} />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}><strong>Expiry Date:</strong> {new Date(selectedSociety.subscriptionExpiry).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Towers count:</strong> {selectedSociety.totalTowers}</Typography>
                <Typography variant="body2"><strong>Total flats:</strong> {selectedSociety.totalFlats}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="overline" color="text.secondary">Assigned Admins ({societyAdmins.length})</Typography>
                {societyAdmins.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No admins assigned.</Typography>
                ) : (
                  societyAdmins.map((adm) => (
                    <Box key={adm._id} sx={{ p: 2, bg: '#F8FAFC', border: '1px solid #E5EAF2', borderRadius: '12px', mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{adm.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{adm.email} | {adm.phone}</Typography>
                      <Typography variant="caption" color="text.disabled">Account status: {adm.status}</Typography>
                    </Box>
                  ))
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Credentials Dialog */}
      <Dialog
        open={!!createdAdminCredentials}
        onClose={() => setCreatedAdminCredentials(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, color: '#16A085' }}>
          Onboarding Completed!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Society <strong>{createdAdminCredentials?.societyName}</strong> has been registered with code <strong>{createdAdminCredentials?.societyCode}</strong>.
            An invitation email has been dispatched. Here are the admin&apos;s direct setup credentials:
          </Typography>
          <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Login Email ID:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1F2937' }}>
              {createdAdminCredentials?.email}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">Temporary Password:</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', color: '#3657D6' }}>
              {createdAdminCredentials?.password}
            </Typography>
          </Box>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: '500' }}>
            * Please copy these credentials or share them with the Society Admin to log in and begin the setup wizard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setCreatedAdminCredentials(null)}
            sx={{ backgroundColor: '#16A085', '&:hover': { backgroundColor: '#128C73' } }}
          >
            I Have Saved These Credentials
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', fontSize: '2rem' }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete society <strong>{deleteConfirmName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. It will permanently purge this society complex and delete all associated towers, floor levels, flat configurations, residents, billing records, and audit logs.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmId(null)} variant="outlined" fullWidth sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(deleteConfirmId);
              setDeleteConfirmId(null);
            }}
            variant="contained"
            color="error"
            fullWidth
            sx={{ borderRadius: '12px', backgroundColor: '#EF4444', '&:hover': { backgroundColor: '#DC2626' } }}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
