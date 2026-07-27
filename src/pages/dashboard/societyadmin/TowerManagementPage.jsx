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
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';
import LoadingButton from '@mui/lab/LoadingButton';

export default function TowerManagementPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [towers, setTowers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openFloors, setOpenFloors] = useState(false);
  const [selectedTower, setSelectedTower] = useState(null);
  const [floors, setFloors] = useState([]);
  const [propertyType, setPropertyType] = useState('APARTMENT');
  
  const [form, setForm] = useState({
    name: '',
    towerCode: '',
    floorsCount: 5,
    description: '',
    displayOrder: 0,
  });

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const isVilla = propertyType === 'VILLA_ROW_HOUSE';
  const labelTower = isVilla ? 'Block / Sector / Row' : 'Tower / Wing';
  const labelTowerName = isVilla ? 'Block Name' : 'Tower Name';
  const labelCode = isVilla ? 'Block Code' : 'Tower Code';
  const labelHeader = isVilla ? 'Blocks & Sectors Configuration' : 'Tower & Wing Management';
  const labelSubtitle = isVilla
    ? 'Configure the phases, sectors, villa blocks or rows of bungalows in the community.'
    : 'Define towers, blocks or wings. Creating a tower automatically sets up floor entries.';

  const fetchProfile = async () => {
    try {
      const res = await societyAdminApi.getProfile();
      if (res.success && res.society?.propertyType) {
        setPropertyType(res.society.propertyType);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTowers = async () => {
    try {
      const res = await societyAdminApi.getTowers();
      if (res.success) {
        setTowers(res.towers);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch structures', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      floorsCount: isVilla ? 1 : 5,
    }));
  }, [isVilla]);

  const handleCreate = async () => {
    setLoadingCreate(true);
    try {
      const res = await societyAdminApi.createTower(form);
      if (res.success) {
        enqueueSnackbar(`${labelTower} configured successfully`, { variant: 'success' });
        setOpenCreate(false);
        setForm({
          name: '',
          towerCode: '',
          floorsCount: isVilla ? 1 : 5,
          description: '',
          displayOrder: 0,
        });
        fetchTowers();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error creating structure', { variant: 'error' });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleViewFloors = async (tower) => {
    setSelectedTower(tower);
    try {
      const res = await societyAdminApi.getFloors(tower._id);
      if (res.success) {
        setFloors(res.floors);
        setOpenFloors(true);
      }
    } catch (err) {
      enqueueSnackbar('Failed to fetch floors', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const confirmMessage = isVilla
      ? 'Deleting a block will permanently delete all plots/bungalows inside it. Proceed?'
      : 'Deleting a tower will permanently delete all floors and flats inside it. Proceed?';
    if (!window.confirm(confirmMessage)) return;
    setLoadingDelete(true);
    try {
      const res = await societyAdminApi.deleteTower(id);
      if (res.success) {
        enqueueSnackbar('Structure deleted successfully', { variant: 'success' });
        fetchTowers();
      }
    } catch (err) {
      enqueueSnackbar('Error deleting structure', { variant: 'error' });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>{labelHeader}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{labelSubtitle}</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          Add {isVilla ? 'Block / Row' : 'Tower / Wing'}
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>{labelTowerName}</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>{labelCode}</TableCell>
                {!isVilla && <TableCell sx={{ fontWeight: '600' }}>Floors Count</TableCell>}
                <TableCell sx={{ fontWeight: '600' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Display Order</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {towers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isVilla ? 5 : 6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No configurations registered. Click &quot;Add {isVilla ? 'Block' : 'Tower'}&quot; to begin.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                towers.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t.name}</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#3657D6' }}>{t.towerCode}</TableCell>
                    {!isVilla && <TableCell>{t.floorsCount} floors</TableCell>}
                    <TableCell>{t.description || 'N/A'}</TableCell>
                    <TableCell>{t.displayOrder}</TableCell>
                    <TableCell align="right">
                      {!isVilla && (
                        <Button size="small" onClick={() => handleViewFloors(t)} sx={{ mr: 1 }}>
                          View Floors
                        </Button>
                      )}
                      <IconButton onClick={() => handleDelete(t._id)} color="error" disabled={loadingDelete}>
                        {loadingDelete ? <CircularProgress size={20} /> : <Iconify icon="solar:trash-bin-trash-bold" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Create {isVilla ? 'Block / Row' : 'Tower / Wing'}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={`${labelTowerName} (e.g. ${isVilla ? 'Row A' : 'Tower A'})`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={`${labelCode} (e.g. ${isVilla ? 'R-A' : 'T-A'})`} value={form.towerCode} onChange={(e) => setForm({ ...form, towerCode: e.target.value })} required />
            </Grid>
            {!isVilla && (
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Floors Count" value={form.floorsCount} onChange={(e) => setForm({ ...form, floorsCount: Number(e.target.value) })} required />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Display Order" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
         <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <LoadingButton onClick={handleCreate} loading={loadingCreate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
            Creating...
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Floors View Dialog */}
      <Dialog open={openFloors} onClose={() => setOpenFloors(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>
          Floor Directory - {selectedTower?.name}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Floor Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {floors.map((f) => (
                  <TableRow key={f._id}>
                    <TableCell>{f.floorNumber}</TableCell>
                    <TableCell>{f.floorName}</TableCell>
                    <TableCell>{f.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenFloors(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
