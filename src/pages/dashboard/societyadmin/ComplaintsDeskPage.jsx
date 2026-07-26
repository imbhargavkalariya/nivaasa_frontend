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
import { societyAdminApi } from 'src/api/nivaasa';

export default function ComplaintsDeskPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [status, setStatus] = useState('PENDING');
  const [assignee, setAssignee] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await societyAdminApi.getComplaints();
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch complaints', { variant: 'error' });
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await societyAdminApi.getStaff();
      if (res.success) {
        setStaff(res.staff);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (statusVal) => {
    if (statusVal === 'RESOLVED' || statusVal === 'CLOSED') return 'success';
    if (statusVal === 'PENDING') return 'error';
    return 'warning';
  };

  const handleOpenDetail = (comp) => {
    setSelectedComplaint(comp);
    setStatus(comp.status);
    setAssignee(comp.assignedStaffId?._id || '');
    setRemarks('');
    setOpenDetail(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await societyAdminApi.updateComplaint(selectedComplaint._id, {
        status,
        remarks,
        assignedStaffId: assignee || undefined,
      });

      if (res.success) {
        enqueueSnackbar('Complaint state updated successfully', { variant: 'success' });
        setOpenDetail(false);
        fetchComplaints();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating complaint', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Resident Complaints Desk</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Triage resident issues, assign plumbers or security workers, and track resolution timelines.</Typography>
        </div>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Ticket No.</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Resident / Flat</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Assigned Helper</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No complaints registered in society database.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{c.complaintNumber}</TableCell>
                    <TableCell sx={{ fontWeight: '600' }}>{c.title}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{c.residentId?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Unit {c.flatId?.flatNumber}</Typography>
                    </TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.priority}
                        size="small"
                        color={c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={c.status}
                        size="small"
                        color={getStatusColor(c.status)}
                      />
                    </TableCell>
                    <TableCell>{c.assignedStaffId?.name || 'Unassigned'}</TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={() => handleOpenDetail(c)}>
                        Action
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Detail & Update Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2', pb: 2 }}>
          Resident Ticket - #{selectedComplaint?.complaintNumber}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedComplaint && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={7} sx={{ borderRight: '1px solid #E5EAF2', pr: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>{selectedComplaint.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Filed by {selectedComplaint.residentId?.name} (Unit {selectedComplaint.flatId?.flatNumber}) on {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Typography>

                <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2', minHeight: '100px', mb: 3 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedComplaint.description}</Typography>
                </Box>

                {selectedComplaint.attachments?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Attachments</Typography>
                    {selectedComplaint.attachments.map((url, idx) => (
                      <Button key={idx} href={url} target="_blank" variant="outlined" size="small" sx={{ mr: 1 }}>
                        Attachment {idx + 1}
                      </Button>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Progress Timeline</Typography>
                <List>
                  {selectedComplaint.timeline?.map((t, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={t.remarks}
                        secondary={`State: ${t.status} - ${new Date(t.timestamp).toLocaleString()}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Triage / Edit Side */}
              <Grid item xs={12} sm={5} sx={{ pl: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Triage Settings</Typography>

                <FormControl fullWidth sx={{ mb: 2.5 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="ASSIGNED">Assigned</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                    <MenuItem value="CLOSED">Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Assign Helper Staff</InputLabel>
                  <Select value={assignee} label="Assign Helper Staff" onChange={(e) => setAssignee(e.target.value)}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {staff.map((st) => (
                      <MenuItem key={st._id} value={st._id}>{st.name} ({st.role})</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Update remarks"
                  placeholder="Type any actions taken or instructions..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="outlined">Close</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Update Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
