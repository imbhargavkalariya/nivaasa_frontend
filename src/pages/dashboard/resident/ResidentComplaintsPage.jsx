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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { residentApi } from 'src/api/nivaasa';

export default function ResidentComplaintsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [complaints, setComplaints] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Forms
  const [form, setForm] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'MEDIUM',
    description: '',
    preferredContactMethod: 'PHONE',
  });
  const [filesList, setFilesList] = useState([]);
  const [commentText, setCommentText] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await residentApi.getComplaints();
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to load complaints', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status) => {
    if (status === 'RESOLVED' || status === 'CLOSED') return 'success';
    if (status === 'PENDING') return 'error';
    return 'warning';
  };

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      
      if (filesList.length > 0) {
        Array.from(filesList).forEach((file) => {
          formData.append('files', file);
        });
      }

      const res = await residentApi.createComplaint(formData);
      if (res.success) {
        enqueueSnackbar('Complaint filed successfully with ticket reference!', { variant: 'success' });
        setOpenCreate(false);
        setFilesList([]);
        setForm({
          title: '',
          category: 'Plumbing',
          priority: 'MEDIUM',
          description: '',
          preferredContactMethod: 'PHONE',
        });
        fetchComplaints();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error filing ticket', { variant: 'error' });
    }
  };

  const handleOpenDetail = (comp) => {
    setSelectedComplaint(comp);
    setCommentText('');
    setOpenDetail(true);
  };

  const handlePostComment = async () => {
    try {
      const res = await residentApi.addComplaintComment(selectedComplaint._id, commentText);
      if (res.success) {
        enqueueSnackbar('Comment added', { variant: 'success' });
        setCommentText('');
        setSelectedComplaint(res.complaint);
        fetchComplaints();
      }
    } catch (error) {
      enqueueSnackbar('Error posting comment', { variant: 'error' });
    }
  };

  const handleReopen = async (id) => {
    try {
      const res = await residentApi.reopenComplaint(id);
      if (res.success) {
        enqueueSnackbar('Complaint ticket reopened', { variant: 'success' });
        setOpenDetail(false);
        fetchComplaints();
      }
    } catch (err) {
      enqueueSnackbar('Reopen failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>My Service Tickets</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Submit and track maintenance requests, electrical faults, and compound security suggestions.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
        >
          File Support Ticket
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Ticket No.</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Date Filed</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">You haven&apos;t filed any service requests yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{c.complaintNumber}</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>{c.title}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.priority}
                        size="small"
                        color={c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.status}
                        size="small"
                        color={getStatusColor(c.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleOpenDetail(c)}>
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* File Ticket Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>File Service Ticket</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Ticket Subject" placeholder="e.g. Water leak in bathroom toilet" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Detailed Description" placeholder="Explain the problem in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <MenuItem value="Plumbing">Plumbing</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Cleaning">Sweeping / Cleaning</MenuItem>
                  <MenuItem value="Noise">Noise / Disturbance</MenuItem>
                  <MenuItem value="Other">Other Issues</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={form.priority} label="Priority" onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Contact Method</InputLabel>
                <Select value={form.preferredContactMethod} label="Contact Method" onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })}>
                  <MenuItem value="PHONE">Phone Call</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="IN_PERSON">In Person</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
                Upload photos of damage
                <input type="file" hidden multiple onChange={(e) => setFilesList(e.target.files)} />
              </Button>
              {filesList.length > 0 && (
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  {filesList.length} files selected.
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>File Ticket</Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Details & Feed Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>
          Ticket Track - #{selectedComplaint?.complaintNumber}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedComplaint && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{selectedComplaint.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Category: {selectedComplaint.category} | Priority: {selectedComplaint.priority} | Filed on: {new Date(selectedComplaint.createdAt).toLocaleDateString()}
              </Typography>

              <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2', minHeight: '80px', mb: 3 }}>
                <Typography variant="body2">{selectedComplaint.description}</Typography>
              </Box>

              {selectedComplaint.assignedStaffId && (
                <Card sx={{ p: 2, bg: '#F0FDF4', border: '1px solid #DCFCE7', mb: 3, borderRadius: '12px' }}>
                  <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold' }}>Assigned Service Provider:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: '600', mt: 0.5 }}>{selectedComplaint.assignedStaffId.name} ({selectedComplaint.assignedStaffId.role})</Typography>
                  <Typography variant="caption" color="text.secondary">Contact: {selectedComplaint.assignedStaffId.phone}</Typography>
                </Card>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>Ticket comments</Typography>
              <List sx={{ maxH: '150px', overflowY: 'auto', mb: 2 }}>
                {selectedComplaint.comments?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No responses recorded.</Typography>
                ) : (
                  selectedComplaint.comments.map((c, idx) => (
                    <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={c.message}
                        secondary={`${c.senderId === selectedComplaint.residentId ? 'You' : 'Management'} - ${new Date(c.timestamp).toLocaleString()}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))
                )}
              </List>

              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <TextField fullWidth size="small" placeholder="Ask for status update..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <Button variant="contained" onClick={handlePostComment}>Reply</Button>
              </Box>

              {selectedComplaint.status === 'RESOLVED' && (
                <Button variant="contained" color="warning" fullWidth onClick={() => handleReopen(selectedComplaint._id)}>
                  Issue Unresolved - Reopen Ticket
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
