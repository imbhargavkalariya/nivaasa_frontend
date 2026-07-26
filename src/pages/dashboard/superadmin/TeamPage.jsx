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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { superAdminApi } from 'src/api/nivaasa';

export default function TeamPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [team, setTeam] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const fetchTeam = async () => {
    try {
      const res = await superAdminApi.getTeam();
      if (res.success) {
        setTeam(res.team);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch team members', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    try {
      const res = await superAdminApi.createTeam(form);
      if (res.success) {
        enqueueSnackbar('Team member added successfully', { variant: 'success' });
        setOpenCreate(false);
        setForm({ name: '', email: '', phone: '', password: '' });
        fetchTeam();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error adding team member', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Platform Staff Roster</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Onboard support executives, system administrators, and platform operations managers.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Add Staff
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Email ID</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Platform Role</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {team.map((t) => (
                <TableRow key={t._id} hover>
                  <TableCell sx={{ fontWeight: '600' }}>{t.name}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>{t.phone || 'N/A'}</TableCell>
                  <TableCell>SUPER_ADMIN (Support Executive)</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: t.status === 'ACTIVE' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                      {t.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Staff Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Add Platform Staff</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="email" label="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="password" label="Temporary Password" placeholder="Blank for default: NivaasaStaff@2026" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
