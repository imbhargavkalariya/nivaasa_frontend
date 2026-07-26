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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function StaffPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [staff, setStaff] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: 'Security Guard',
    salary: 12000,
    joiningDate: '',
    emergencyContact: '',
    address: '',
    notes: '',
  });

  const fetchStaff = async () => {
    try {
      const res = await societyAdminApi.getStaff();
      if (res.success) {
        setStaff(res.staff);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch staff directory', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (photoFile) {
        formData.append('file', photoFile); // files goes under 'file' in upload service
      }

      const res = await societyAdminApi.createStaff(formData);
      if (res.success) {
        enqueueSnackbar('Staff member registered successfully', { variant: 'success' });
        setOpenCreate(false);
        setPhotoFile(null);
        setForm({
          name: '',
          phone: '',
          role: 'Security Guard',
          salary: 12000,
          joiningDate: '',
          emergencyContact: '',
          address: '',
          notes: '',
        });
        fetchStaff();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error registering staff member', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Society Staff Directory</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Maintain details of compound security guards, plumbers, gardeners, and technical help desk workers.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Add Staff Member
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Designation / Role</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Salary (Monthly)</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Joining Date</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Emergency Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No staff members registered.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((s) => (
                  <TableRow key={s._id} hover>
                    <TableCell>
                      {s.photo ? (
                        <Box component="img" src={s.photo} sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3657D6', fontWeight: 'bold' }}>
                          {s.name.slice(0, 1).toUpperCase()}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>{s.name}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>₹{s.salary}</TableCell>
                    <TableCell>{new Date(s.joiningDate).toLocaleDateString()}</TableCell>
                    <TableCell>{s.emergencyContact || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Staff Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Add Staff Member</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Designation / Role</InputLabel>
                <Select value={form.role} label="Designation / Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="Security Guard">Security Guard</MenuItem>
                  <MenuItem value="Electrician">Electrician</MenuItem>
                  <MenuItem value="Plumber">Plumber</MenuItem>
                  <MenuItem value="Gardener">Gardener</MenuItem>
                  <MenuItem value="Technician">Technician</MenuItem>
                  <MenuItem value="Cleaner">Sweeper / Cleaner</MenuItem>
                  <MenuItem value="Supervisor">Office Supervisor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Salary (₹)" value={form.salary} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Joining Date" InputLabelProps={{ shrink: true }} value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Emergency Phone Number" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
                Upload Profile Picture
                <input type="file" hidden accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
              </Button>
              {photoFile && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>Photo: {photoFile.name}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Home Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Register Staff</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
