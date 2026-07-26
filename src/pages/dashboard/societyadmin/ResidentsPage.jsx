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
  Tabs,
  Tab,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function ResidentsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [residents, setResidents] = useState([]);
  const [flats, setFlats] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [currentTab, setCurrentTab] = useState('list');
  const [vehicles, setVehicles] = useState([]);
  
  // Registration forms
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    dob: '',
    ownershipType: 'OWNER',
    flatId: '',
    occupation: '',
    emergencyContact: { name: '', relation: '', phone: '' },
    password: '',
  });

  const [openVehicle, setOpenVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    flatId: '',
    ownerId: '',
    registrationNumber: '',
    vehicleType: 'CAR',
    brand: '',
    model: '',
    color: '',
    parkingSlot: '',
  });

  // Edit / Delete states
  const [openEditResident, setOpenEditResident] = useState(false);
  const [editingResidentId, setEditingResidentId] = useState(null);
  const [editResidentForm, setEditResidentForm] = useState({
    name: '',
    phone: '',
    gender: 'MALE',
    dob: '',
    ownershipType: 'OWNER',
    flatId: '',
    occupation: '',
    emergencyContact: { name: '', relation: '', phone: '' },
    password: '',
  });

  const [deleteResidentConfirmId, setDeleteResidentConfirmId] = useState(null);
  const [deleteResidentConfirmName, setDeleteResidentConfirmName] = useState('');

  const [openEditVehicle, setOpenEditVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editVehicleForm, setEditVehicleForm] = useState({
    flatId: '',
    ownerId: '',
    registrationNumber: '',
    vehicleType: 'CAR',
    brand: '',
    model: '',
    color: '',
    parkingSlot: '',
  });

  const [deleteVehicleConfirmId, setDeleteVehicleConfirmId] = useState(null);
  const [deleteVehicleConfirmReg, setDeleteVehicleConfirmReg] = useState('');

  const fetchResidents = async () => {
    try {
      const res = await societyAdminApi.getResidents();
      if (res.success) {
        setResidents(res.residents);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch residents', { variant: 'error' });
    }
  };

  const fetchFlats = async () => {
    try {
      // Get vacant or all flats to map
      const res = await societyAdminApi.getFlats({});
      if (res.success) {
        setFlats(res.flats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await societyAdminApi.getVehicles();
      if (res.success) {
        setVehicles(res.vehicles);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchFlats();
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditResidentClick = (r) => {
    setEditingResidentId(r._id);
    setEditResidentForm({
      name: r.name || '',
      phone: r.phone || '',
      gender: r.gender || 'MALE',
      dob: r.dob ? r.dob.substring(0, 10) : '',
      ownershipType: r.ownershipType || 'OWNER',
      flatId: r.flatId?._id || '',
      occupation: r.occupation || '',
      emergencyContact: r.emergencyContact || { name: '', relation: '', phone: '' },
      password: '',
    });
    setOpenEditResident(true);
  };

  const handleUpdateResident = async () => {
    try {
      const res = await societyAdminApi.updateResident(editingResidentId, editResidentForm);
      if (res.success) {
        enqueueSnackbar('Resident details updated successfully', { variant: 'success' });
        setOpenEditResident(false);
        fetchResidents();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating resident', { variant: 'error' });
    }
  };

  const handleDeleteResident = async (id) => {
    try {
      const res = await societyAdminApi.deleteResident(id);
      if (res.success) {
        enqueueSnackbar('Resident deleted successfully', { variant: 'success' });
        fetchResidents();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error deleting resident', { variant: 'error' });
    }
  };

  const handleEditVehicleClick = (v) => {
    setEditingVehicleId(v._id);
    setEditVehicleForm({
      flatId: v.flatId?._id || '',
      ownerId: v.ownerId?._id || '',
      registrationNumber: v.registrationNumber || '',
      vehicleType: v.vehicleType || 'CAR',
      brand: v.brand || '',
      model: v.model || '',
      color: v.color || '',
      parkingSlot: v.parkingSlot || '',
    });
    setOpenEditVehicle(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const res = await societyAdminApi.updateVehicle(editingVehicleId, editVehicleForm);
      if (res.success) {
        enqueueSnackbar('Vehicle details updated successfully', { variant: 'success' });
        setOpenEditVehicle(false);
        fetchVehicles();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating vehicle', { variant: 'error' });
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      const res = await societyAdminApi.deleteVehicle(id);
      if (res.success) {
        enqueueSnackbar('Vehicle record deleted successfully', { variant: 'success' });
        fetchVehicles();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error deleting vehicle', { variant: 'error' });
    }
  };

  const handleOnboard = async () => {
    try {
      const res = await societyAdminApi.onboardResident(form);
      if (res.success) {
        enqueueSnackbar('Resident onboarded & invitation credentials sent via email!', { variant: 'success' });
        setOpenCreate(false);
        setForm({
          name: '',
          email: '',
          phone: '',
          gender: 'MALE',
          dob: '',
          ownershipType: 'OWNER',
          flatId: '',
          occupation: '',
          emergencyContact: { name: '', relation: '', phone: '' },
          password: '',
        });
        fetchResidents();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error onboarding resident', { variant: 'error' });
    }
  };

  const handleAddVehicleOpen = (resUser) => {
    setVehicleForm({
      flatId: resUser.flatId?._id || '',
      ownerId: resUser._id,
      registrationNumber: '',
      vehicleType: 'CAR',
      brand: '',
      model: '',
      color: '',
      parkingSlot: resUser.flatId?.parkingSlot || '',
    });
    setOpenVehicle(true);
  };

  const handleRegisterVehicle = async () => {
    try {
      const res = await societyAdminApi.registerVehicle(vehicleForm);
      if (res.success) {
        enqueueSnackbar('Vehicle logged successfully', { variant: 'success' });
        setOpenVehicle(false);
        fetchVehicles();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error registering vehicle', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Resident & Vehicle Roster</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Onboard owners and tenants, assign them to flat units, and keep records of household vehicles.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Onboard Resident
        </Button>
      </Box>

      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 3 }}>
        <Tab value="list" label="Resident Roster" />
        <Tab value="vehicles" label="Vehicle Registry" />
      </Tabs>

      {currentTab === 'list' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Resident Details</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Flat Mapped</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Ownership Type</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Emergency Contact</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Occupation</TableCell>
                  <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No residents onboarded yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{r.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{r.email} | {r.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {r.flatId ? `${r.flatId.towerId?.name || ''} - Unit ${r.flatId.flatNumber}` : 'Unmapped'}
                      </TableCell>
                      <TableCell>
                        <Chip label={r.ownershipType || 'MEMBER'} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell>
                        {r.emergencyContact?.name ? (
                          <>
                            <Typography variant="body2">{r.emergencyContact.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{r.emergencyContact.phone} ({r.emergencyContact.relation})</Typography>
                          </>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{r.occupation || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:garage-bold" />} onClick={() => handleAddVehicleOpen(r)}>
                            Add Vehicle
                          </Button>
                          <IconButton onClick={() => handleEditResidentClick(r)} color="primary">
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton onClick={() => { setDeleteResidentConfirmId(r._id); setDeleteResidentConfirmName(r.name); }} color="error">
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {currentTab === 'vehicles' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Reg Plate No.</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Vehicle Type</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Brand & Model</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Flat Mapped</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Owner Name</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Parking Allocated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No vehicles registered yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v) => (
                    <TableRow key={v._id} hover>
                      <TableCell sx={{ fontWeight: 'bold', color: '#3657D6' }}>{v.registrationNumber}</TableCell>
                      <TableCell>{v.vehicleType}</TableCell>
                      <TableCell>{v.brand} {v.model} ({v.color})</TableCell>
                      <TableCell>Unit {v.flatId?.flatNumber}</TableCell>
                      <TableCell>{v.ownerId?.name || 'N/A'}</TableCell>
                      <TableCell>{v.parkingSlot || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEditVehicleClick(v)} color="primary">
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton onClick={() => { setDeleteVehicleConfirmId(v._id); setDeleteVehicleConfirmReg(v.registrationNumber); }} color="error">
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
      )}

      {/* Onboard Resident Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Onboard Resident Profile</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="email" label="Unique Email ID" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Mapped Flat</InputLabel>
                <Select value={form.flatId} label="Mapped Flat" onChange={(e) => setForm({ ...form, flatId: e.target.value })}>
                  {flats.map((fl) => (
                    <MenuItem key={fl._id} value={fl._id}>Unit {fl.flatNumber} ({fl.towerId?.name || ''})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ownership Category</InputLabel>
                <Select value={form.ownershipType} label="Ownership Category" onChange={(e) => setForm({ ...form, ownershipType: e.target.value })}>
                  <MenuItem value="OWNER">Owner</MenuItem>
                  <MenuItem value="TENANT">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
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
              <TextField
                fullWidth
                label="Login Password"
                placeholder="Leave blank for 'Member123'"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>Emergency Contact Person</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Contact Name" value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Relation" value={form.emergencyContact.relation} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relation: e.target.value } })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Phone" value={form.emergencyContact.phone} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleOnboard} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Onboard resident</Button>
        </DialogActions>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <Dialog open={openVehicle} onClose={() => setOpenVehicle(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Add Vehicle Log</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Reg Plate Number" placeholder="e.g. GJ05AB1234" value={vehicleForm.registrationNumber} onChange={(e) => setForm({ ...form }) || setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select value={vehicleForm.vehicleType} label="Vehicle Type" onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}>
                  <MenuItem value="CAR">Car</MenuItem>
                  <MenuItem value="BIKE">Motorcycle</MenuItem>
                  <MenuItem value="SCOOTER">Scooter</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Brand" value={vehicleForm.brand} onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Model" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Color" value={vehicleForm.color} onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Parking Slot ID" value={vehicleForm.parkingSlot} onChange={(e) => setVehicleForm({ ...vehicleForm, parkingSlot: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenVehicle(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleRegisterVehicle} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Register Vehicle</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Resident Dialog */}
      <Dialog open={openEditResident} onClose={() => setOpenEditResident(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Update Resident Profile</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={editResidentForm.name} onChange={(e) => setEditResidentForm({ ...editResidentForm, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={editResidentForm.phone} onChange={(e) => setEditResidentForm({ ...editResidentForm, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} value={editResidentForm.dob} onChange={(e) => setEditResidentForm({ ...editResidentForm, dob: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Mapped Flat</InputLabel>
                <Select value={editResidentForm.flatId} label="Mapped Flat" onChange={(e) => setEditResidentForm({ ...editResidentForm, flatId: e.target.value })}>
                  {flats.map((fl) => (
                    <MenuItem key={fl._id} value={fl._id}>Unit {fl.flatNumber} ({fl.towerId?.name || ''})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ownership Category</InputLabel>
                <Select value={editResidentForm.ownershipType} label="Ownership Category" onChange={(e) => setEditResidentForm({ ...editResidentForm, ownershipType: e.target.value })}>
                  <MenuItem value="OWNER">Owner</MenuItem>
                  <MenuItem value="TENANT">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Occupation" value={editResidentForm.occupation} onChange={(e) => setEditResidentForm({ ...editResidentForm, occupation: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={editResidentForm.gender} label="Gender" onChange={(e) => setEditResidentForm({ ...editResidentForm, gender: e.target.value })}>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                placeholder="Leave blank to keep unchanged"
                value={editResidentForm.password}
                onChange={(e) => setEditResidentForm({ ...editResidentForm, password: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>Emergency Contact Person</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Contact Name" value={editResidentForm.emergencyContact.name} onChange={(e) => setEditResidentForm({ ...editResidentForm, emergencyContact: { ...editResidentForm.emergencyContact, name: e.target.value } })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Relation" value={editResidentForm.emergencyContact.relation} onChange={(e) => setEditResidentForm({ ...editResidentForm, emergencyContact: { ...editResidentForm.emergencyContact, relation: e.target.value } })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Phone" value={editResidentForm.emergencyContact.phone} onChange={(e) => setEditResidentForm({ ...editResidentForm, emergencyContact: { ...editResidentForm.emergencyContact, phone: e.target.value } })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenEditResident(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdateResident} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Update Resident</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Resident Confirmation Dialog */}
      <Dialog
        open={!!deleteResidentConfirmId}
        onClose={() => setDeleteResidentConfirmId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', fontSize: '2rem' }} />
          Delete Resident
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete resident <strong>{deleteResidentConfirmName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will delete their login credentials and mark their flat unit as VACANT.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteResidentConfirmId(null)} variant="outlined" fullWidth sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteResident(deleteResidentConfirmId);
              setDeleteResidentConfirmId(null);
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

      {/* Edit Vehicle Dialog */}
      <Dialog open={openEditVehicle} onClose={() => setOpenEditVehicle(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Update Vehicle Log</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Reg Plate Number" placeholder="e.g. GJ05AB1234" value={editVehicleForm.registrationNumber} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, registrationNumber: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select value={editVehicleForm.vehicleType} label="Vehicle Type" onChange={(e) => setEditVehicleForm({ ...editVehicleForm, vehicleType: e.target.value })}>
                  <MenuItem value="CAR">Car</MenuItem>
                  <MenuItem value="BIKE">Motorcycle</MenuItem>
                  <MenuItem value="SCOOTER">Scooter</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Brand" value={editVehicleForm.brand} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, brand: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Model" value={editVehicleForm.model} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, model: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Color" value={editVehicleForm.color} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, color: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Parking Slot ID" value={editVehicleForm.parkingSlot} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, parkingSlot: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenEditVehicle(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdateVehicle} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Update Vehicle</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Vehicle Confirmation Dialog */}
      <Dialog
        open={!!deleteVehicleConfirmId}
        onClose={() => setDeleteVehicleConfirmId(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', fontSize: '2rem' }} />
          Delete Vehicle
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete vehicle record <strong>{deleteVehicleConfirmReg}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone and will purge this vehicle from the parking roster.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteVehicleConfirmId(null)} variant="outlined" fullWidth sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteVehicle(deleteVehicleConfirmId);
              setDeleteVehicleConfirmId(null);
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
