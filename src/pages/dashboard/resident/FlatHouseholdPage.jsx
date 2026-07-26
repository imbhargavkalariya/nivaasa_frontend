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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { residentApi } from 'src/api/nivaasa';

export default function FlatHouseholdPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [flat, setFlat] = useState(null);
  const [family, setFamily] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [currentTab, setCurrentTab] = useState('flat');

  // Dialog states
  const [openFamily, setOpenFamily] = useState(false);
  const [openVehicle, setOpenVehicle] = useState(false);

  // Forms
  const [famForm, setFamForm] = useState({
    name: '',
    relationship: 'Spouse',
    age: '',
    phone: '',
    email: '',
  });

  const [vehForm, setVehForm] = useState({
    registrationNumber: '',
    vehicleType: 'CAR',
    brand: '',
    model: '',
    color: '',
  });

  const fetchFlatDetails = async () => {
    try {
      const res = await residentApi.getFlatDetails();
      if (res.success) {
        setFlat(res.flat);
        setFamily(res.familyMembers);
        setVehicles(res.vehicles);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load household details', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchFlatDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApprovalColor = (status) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'PENDING') return 'warning';
    return 'error';
  };

  const handleAddFamily = async () => {
    try {
      const res = await residentApi.addFamilyMember(famForm);
      if (res.success) {
        enqueueSnackbar('Family member added successfully', { variant: 'success' });
        setOpenFamily(false);
        setFamForm({ name: '', relationship: 'Spouse', age: '', phone: '', email: '' });
        fetchFlatDetails();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error adding family member', { variant: 'error' });
    }
  };

  const handleAddVehicle = async () => {
    try {
      const res = await residentApi.requestVehicle(vehForm);
      if (res.success) {
        enqueueSnackbar(res.message || 'Vehicle permit request registered', { variant: 'success' });
        setOpenVehicle(false);
        setVehForm({ registrationNumber: '', vehicleType: 'CAR', brand: '', model: '', color: '' });
        fetchFlatDetails();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error requesting vehicle permit', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>My Flat & Household</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track your apartment configurations, coordinate family profiles, and file vehicle parking stickers.</Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenFamily(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
          >
            Add Family Member
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenVehicle(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#16A085' }}
          >
            Add Vehicle Permit
          </Button>
        </Box>
      </Box>

      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 3 }}>
        <Tab value="flat" label="Apartment Specifications" />
        <Tab value="family" label="Family Directory" />
        <Tab value="vehicles" label="Permitted Vehicles" />
      </Tabs>

      {currentTab === 'flat' && flat && (
        <Card sx={{ p: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#3657D6' }}>Flat Configuration Snapshot</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Building block</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>{flat.towerId?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Floor</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>{flat.floorId?.floorName}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Flat / Unit Number</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>{flat.flatNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Super Built-up Area</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>{flat.areaSqFt} SqFt</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Ownership State</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}><Chip label={flat.ownershipType || 'MEMBER'} color="primary" variant="outlined" size="small" /></Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Allocated Parking Slot</Typography>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>{flat.parkingSlot || 'None'}</Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      {currentTab === 'family' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Relationship</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Email ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {family.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No other family members logged.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  family.map((f) => (
                    <TableRow key={f._id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{f.name}</TableCell>
                      <TableCell>{f.relationship}</TableCell>
                      <TableCell>{f.age} years</TableCell>
                      <TableCell>{f.phone || '-'}</TableCell>
                      <TableCell>{f.email || '-'}</TableCell>
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
                  <TableCell sx={{ fontWeight: '600' }}>Reg Plate Number</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Brand & Model</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Permit Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No vehicles permitted yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v) => (
                    <TableRow key={v._id} hover>
                      <TableCell sx={{ fontWeight: 'bold', color: '#3657D6' }}>{v.registrationNumber}</TableCell>
                      <TableCell>{v.vehicleType}</TableCell>
                      <TableCell>{v.brand} {v.model}</TableCell>
                      <TableCell>{v.color || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={v.approvalStatus}
                          size="small"
                          color={getApprovalColor(v.approvalStatus)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add Family Dialog */}
      <Dialog open={openFamily} onClose={() => setOpenFamily(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Add Family Member</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={famForm.name} onChange={(e) => setFamForm({ ...famForm, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Relationship</InputLabel>
                <Select value={famForm.relationship} label="Relationship" onChange={(e) => setFamForm({ ...famForm, relationship: e.target.value })}>
                  <MenuItem value="Spouse">Spouse</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Age" value={famForm.age} onChange={(e) => setFamForm({ ...famForm, age: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={famForm.phone} onChange={(e) => setFamForm({ ...famForm, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="email" label="Email Address" value={famForm.email} onChange={(e) => setFamForm({ ...famForm, email: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenFamily(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAddFamily} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Register Member</Button>
        </DialogActions>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <Dialog open={openVehicle} onClose={() => setOpenVehicle(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Request Parking permit sticker</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Reg Plate Number" placeholder="e.g. GJ05AB1234" value={vehForm.registrationNumber} onChange={(e) => setVehForm({ ...vehForm, registrationNumber: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select value={vehForm.vehicleType} label="Vehicle Type" onChange={(e) => setVehForm({ ...vehForm, vehicleType: e.target.value })}>
                  <MenuItem value="CAR">Car</MenuItem>
                  <MenuItem value="BIKE">Motorcycle</MenuItem>
                  <MenuItem value="SCOOTER">Scooter</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Brand" value={vehForm.brand} onChange={(e) => setVehForm({ ...vehForm, brand: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Model" value={vehForm.model} onChange={(e) => setVehForm({ ...vehForm, model: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Color" value={vehForm.color} onChange={(e) => setVehForm({ ...vehForm, color: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenVehicle(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleAddVehicle} variant="contained" sx={{ backgroundColor: '#3657D6' }}>File Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
