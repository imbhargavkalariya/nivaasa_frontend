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
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function FlatManagementPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [flats, setFlats] = useState([]);
  const [towers, setTowers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedTowerFilter, setSelectedTowerFilter] = useState('');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingFlatId, setEditingFlatId] = useState(null);
  const [editFloors, setEditFloors] = useState([]);
  const [editForm, setEditForm] = useState({
    towerId: '',
    floorId: '',
    flatNumber: '',
    areaSqFt: 1000,
    ownershipType: '',
    occupancyStatus: 'VACANT',
    parkingSlot: '',
    notes: '',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmNumber, setDeleteConfirmNumber] = useState('');

  const [form, setForm] = useState({
    towerId: '',
    floorId: '',
    flatNumber: '',
    areaSqFt: 1000,
    ownershipType: '',
    occupancyStatus: 'VACANT',
    parkingSlot: '',
    notes: '',
  });

  const [bulkForm, setBulkForm] = useState({
    towerId: '',
    flatsPerFloor: 4,
    areaSqFt: 1000,
    numberingStyle: 'FLOOR_PREFIX',
  });

  const isVilla = propertyType === 'VILLA_ROW_HOUSE';
  const labelTower = isVilla ? 'Block / Sector / Row' : 'Tower / Wing';
  const labelFlat = isVilla ? 'Villa / Plot Number' : 'Flat Number';
  const labelFloor = isVilla ? 'Floor (N/A / Ground)' : 'Floor Level';
  const labelDirectory = isVilla ? 'Property Listings Directory' : 'Flat Listing Directory';
  const labelSubtitle = isVilla
    ? 'Onboard individual villas, bungalows or tenements, track sizes, sectors, and occupancy logs.'
    : 'Onboard individual society properties, track floor levels, sizes, and occupancy logs.';

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

  const fetchFlats = async () => {
    try {
      const res = await societyAdminApi.getFlats({ towerId: selectedTowerFilter });
      if (res.success) {
        setFlats(res.flats);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch flats', { variant: 'error' });
    }
  };

  const fetchTowers = async () => {
    try {
      const res = await societyAdminApi.getTowers();
      if (res.success) {
        setTowers(res.towers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTowers();
  }, []);

  useEffect(() => {
    fetchFlats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTowerFilter]);

  useEffect(() => {
    if (isVilla) {
      setBulkForm((prev) => ({ ...prev, numberingStyle: 'SIMPLE_SEQUENCE' }));
    } else {
      setBulkForm((prev) => ({ ...prev, numberingStyle: 'FLOOR_PREFIX' }));
    }
  }, [isVilla]);

  const getOccupancyColor = (status) => {
    if (status === 'OCCUPIED') return 'success';
    if (status === 'VACANT') return 'warning';
    return 'default';
  };

  const handleTowerChangeInForm = async (towerId) => {
    setForm({ ...form, towerId, floorId: '' });
    try {
      const res = await societyAdminApi.getFloors(towerId);
      if (res.success) {
        setFloors(res.floors);
        if (res.floors.length > 0 && isVilla) {
          setForm((prev) => ({ ...prev, towerId, floorId: res.floors[0]._id }));
        }
      }
    } catch (err) {
      enqueueSnackbar('Failed to fetch floors for selected tower', { variant: 'error' });
    }
  };

  const handleEditClick = async (flat) => {
    setEditingFlatId(flat._id);
    setEditForm({
      towerId: flat.towerId?._id || '',
      floorId: flat.floorId?._id || '',
      flatNumber: flat.flatNumber || '',
      areaSqFt: flat.areaSqFt || 1000,
      ownershipType: flat.ownershipType || '',
      occupancyStatus: flat.occupancyStatus || 'VACANT',
      parkingSlot: flat.parkingSlot || '',
      notes: flat.notes || '',
    });
    try {
      const res = await societyAdminApi.getFloors(flat.towerId?._id);
      if (res.success) {
        setEditFloors(res.floors);
      }
    } catch (err) {
      console.error(err);
    }
    setOpenEdit(true);
  };

  const handleTowerChangeInEditForm = async (towerId) => {
    setEditForm({ ...editForm, towerId, floorId: '' });
    try {
      const res = await societyAdminApi.getFloors(towerId);
      if (res.success) {
        setEditFloors(res.floors);
      }
    } catch (err) {
      enqueueSnackbar('Failed to fetch floors for selected tower', { variant: 'error' });
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await societyAdminApi.updateFlat(editingFlatId, editForm);
      if (res.success) {
        enqueueSnackbar('Property details updated successfully', { variant: 'success' });
        setOpenEdit(false);
        fetchFlats();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating property', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await societyAdminApi.deleteFlat(id);
      if (res.success) {
        enqueueSnackbar('Property deleted successfully', { variant: 'success' });
        fetchFlats();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error deleting property', { variant: 'error' });
    }
  };

  const handleCreate = async () => {
    try {
      const res = await societyAdminApi.createFlat(form);
      if (res.success) {
        enqueueSnackbar('Property registered successfully', { variant: 'success' });
        setOpenCreate(false);
        setForm({
          towerId: '',
          floorId: '',
          flatNumber: '',
          areaSqFt: 1000,
          ownershipType: '',
          occupancyStatus: 'VACANT',
          parkingSlot: '',
          notes: '',
        });
        fetchFlats();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error creating property', { variant: 'error' });
    }
  };

  const handleBulkGenerate = async () => {
    try {
      const res = await societyAdminApi.bulkGenerateFlats(bulkForm);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: 'success' });
        setOpenBulk(false);
        setBulkForm({
          towerId: '',
          flatsPerFloor: 4,
          areaSqFt: 1000,
          numberingStyle: isVilla ? 'SIMPLE_SEQUENCE' : 'FLOOR_PREFIX',
        });
        fetchFlats();
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Error generating properties', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>{labelDirectory}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{labelSubtitle}</Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mingcute:settings-7-line" />}
            onClick={() => setOpenBulk(true)}
            sx={{ borderRadius: '12px', borderColor: '#3657D6', color: '#3657D6' }}
          >
            Bulk Generate
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenCreate(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
          >
            Add Property
          </Button>
        </Box>
      </Box>

      {/* Filter Card */}
      <Card sx={{ p: 2.5, mb: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by {labelTower}</InputLabel>
              <Select
                value={selectedTowerFilter}
                label={`Filter by ${labelTower}`}
                onChange={(e) => setSelectedTowerFilter(e.target.value)}
              >
                <MenuItem value="">All {labelTower}s</MenuItem>
                {towers.map((t) => (
                  <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>{labelFlat}</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>{labelTower}</TableCell>
                {!isVilla && <TableCell sx={{ fontWeight: '600' }}>{labelFloor}</TableCell>}
                <TableCell sx={{ fontWeight: '600' }}>Super Area (SqFt)</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Ownership</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Parking Allocated</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isVilla ? 7 : 8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No units registered. Click &quot;Add Property&quot; to get started.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                flats.map((f) => (
                  <TableRow key={f._id} hover>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1F2937' }}>{f.flatNumber}</TableCell>
                    <TableCell>{f.towerId?.name}</TableCell>
                    {!isVilla && <TableCell>{f.floorId?.floorName}</TableCell>}
                    <TableCell>{f.areaSqFt} SqFt</TableCell>
                    <TableCell>
                      {f.ownershipType ? (
                        <Chip label={f.ownershipType} size="small" variant="outlined" />
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={f.occupancyStatus}
                        size="small"
                        color={getOccupancyColor(f.occupancyStatus)}
                      />
                    </TableCell>
                    <TableCell>{f.parkingSlot || 'None'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditClick(f)} color="primary">
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton onClick={() => { setDeleteConfirmId(f._id); setDeleteConfirmNumber(f.flatNumber); }} color="error">
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

      {/* Onboard Flat Modal */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Register {isVilla ? 'Villa / Bungalow' : 'Flat / Apartment'}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{labelTower}</InputLabel>
                <Select value={form.towerId} label={labelTower} onChange={(e) => handleTowerChangeInForm(e.target.value)}>
                  {towers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>{t.name} ({t.towerCode})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {!isVilla && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={!form.towerId}>
                  <InputLabel>Floor Level</InputLabel>
                  <Select value={form.floorId} label="Floor Level" onChange={(e) => setForm({ ...form, floorId: e.target.value })}>
                    {floors.map((fl) => (
                      <MenuItem key={fl._id} value={fl._id}>{fl.floorName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={`${labelFlat} (e.g. ${isVilla ? 'A-1' : 'A-101'})`} value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Area Size (SqFt)" value={form.areaSqFt} onChange={(e) => setForm({ ...form, areaSqFt: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Parking Slot ID" value={form.parkingSlot} onChange={(e) => setForm({ ...form, parkingSlot: e.target.value })} placeholder="e.g. P-A12" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Occupancy Status</InputLabel>
                <Select value={form.occupancyStatus} label="Occupancy Status" onChange={(e) => setForm({ ...form, occupancyStatus: e.target.value })}>
                  <MenuItem value="VACANT">Vacant</MenuItem>
                  <MenuItem value="OCCUPIED">Occupied (Pre-filled)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Internal Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Register Unit</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Generate Modal */}
      <Dialog open={openBulk} onClose={() => setOpenBulk(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>
          Bulk Generate Properties
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 1 }}>
            Automatically generate multiple units across all configured levels of the selected block/row.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{labelTower}</InputLabel>
                <Select value={bulkForm.towerId} label={labelTower} onChange={(e) => setBulkForm({ ...bulkForm, towerId: e.target.value })}>
                  {towers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>{t.name} ({t.towerCode})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={isVilla ? "Units / Plots per Block" : "Properties per Floor"}
                value={bulkForm.flatsPerFloor}
                onChange={(e) => setBulkForm({ ...bulkForm, flatsPerFloor: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Average Size (SqFt)"
                value={bulkForm.areaSqFt}
                onChange={(e) => setBulkForm({ ...bulkForm, areaSqFt: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Numbering Style</InputLabel>
                <Select value={bulkForm.numberingStyle} label="Numbering Style" onChange={(e) => setBulkForm({ ...bulkForm, numberingStyle: e.target.value })}>
                  {!isVilla && <MenuItem value="FLOOR_PREFIX">Floor Prefix (e.g. A-101, A-102)</MenuItem>}
                  <MenuItem value="SIMPLE_SEQUENCE">Sequential (e.g. A-1, A-2, A-3)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenBulk(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleBulkGenerate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
            Generate Units
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Flat Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Update {isVilla ? 'Villa / Bungalow' : 'Flat / Apartment'}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{labelTower}</InputLabel>
                <Select value={editForm.towerId} label={labelTower} onChange={(e) => handleTowerChangeInEditForm(e.target.value)}>
                  {towers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>{t.name} ({t.towerCode})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {!isVilla && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={!editForm.towerId}>
                  <InputLabel>Floor Level</InputLabel>
                  <Select value={editForm.floorId} label="Floor Level" onChange={(e) => setEditForm({ ...editForm, floorId: e.target.value })}>
                    {editFloors.map((fl) => (
                      <MenuItem key={fl._id} value={fl._id}>{fl.floorName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={labelFlat}
                value={editForm.flatNumber}
                onChange={(e) => setEditForm({ ...editForm, flatNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Super Builtup Area (SqFt)"
                value={editForm.areaSqFt}
                onChange={(e) => setEditForm({ ...editForm, areaSqFt: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ownership Type</InputLabel>
                <Select value={editForm.ownershipType} label="Ownership Type" onChange={(e) => setEditForm({ ...editForm, ownershipType: e.target.value })}>
                  <MenuItem value="">Unassigned</MenuItem>
                  <MenuItem value="OWNER">Owner</MenuItem>
                  <MenuItem value="TENANT">Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Occupancy Status</InputLabel>
                <Select value={editForm.occupancyStatus} label="Occupancy Status" onChange={(e) => setEditForm({ ...editForm, occupancyStatus: e.target.value })}>
                  <MenuItem value="VACANT">Vacant</MenuItem>
                  <MenuItem value="OCCUPIED">Occupied</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parking Slot Allocation"
                value={editForm.parkingSlot}
                onChange={(e) => setEditForm({ ...editForm, parkingSlot: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenEdit(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Update Property</Button>
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
            Are you sure you want to permanently delete property <strong>{deleteConfirmNumber}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. Make sure there are no active residents or registered users assigned to this property unit.
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
