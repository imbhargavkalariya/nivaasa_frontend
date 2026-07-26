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
import { superAdminApi } from 'src/api/nivaasa';

export default function SupportPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('Open');
  const [staffList, setStaffList] = useState([]);
  const [assignee, setAssignee] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await superAdminApi.getTickets({ status });
      if (res.success) {
        setTickets(res.tickets);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to fetch tickets', { variant: 'error' });
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await superAdminApi.getTeam();
      if (res.success) {
        setStaffList(res.team);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleOpenDetail = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status);
    setAssignee(ticket.assignedStaffId?._id || '');
    setOpenDetail(true);
  };

  const handleReply = async () => {
    try {
      const res = await superAdminApi.replyTicket(selectedTicket._id, {
        message: replyMessage,
        status: ticketStatus,
        assignTo: assignee || undefined,
      });

      if (res.success) {
        enqueueSnackbar('Ticket updated successfully', { variant: 'success' });
        setReplyMessage('');
        setOpenDetail(false);
        fetchTickets();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to reply ticket', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Platform Support Desk</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Resolve society complaints, triage technical requests, and manage ticket assignments.</Typography>
        </div>
      </Box>

      {/* Filter panel */}
      <Card sx={{ p: 2.5, mb: 4, borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={status} label="Filter by Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="">All Tickets</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Assigned">Assigned</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
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
                <TableCell sx={{ fontWeight: '600' }}>Ticket No.</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Society Name</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>No support requests in queue.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{t.ticketNumber}</TableCell>
                    <TableCell>{t.societyId?.name || 'Platform'}</TableCell>
                    <TableCell sx={{ fontWeight: '500' }}>{t.title}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.priority}
                        size="small"
                        color={t.priority === 'Critical' || t.priority === 'High' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.status}
                        size="small"
                        color={t.status === 'Resolved' || t.status === 'Closed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={() => handleOpenDetail(t)}>
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Ticket Reply Modal */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2', pb: 2 }}>
          Ticket Detail - #{selectedTicket?.ticketNumber}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedTicket && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={7} sx={{ borderRight: '1px solid #E5EAF2', pr: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>{selectedTicket.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Opened by {selectedTicket.adminId?.name || 'Admin'} ({selectedTicket.adminId?.email}) on {new Date(selectedTicket.createdAt).toLocaleString()}
                </Typography>

                <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5EAF2', minHeight: '120px', mb: 3 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</Typography>
                </Box>

                {selectedTicket.attachments?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Attachments</Typography>
                    {selectedTicket.attachments.map((url, idx) => (
                      <Button key={idx} href={url} target="_blank" variant="outlined" size="small" sx={{ mr: 1, borderRadius: '8px' }}>
                        View Attachment {idx + 1}
                      </Button>
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>Ticket Feed / Conversation</Typography>
                <List sx={{ maxH: '200px', overflowY: 'auto' }}>
                  {selectedTicket.comments?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No conversation history yet.</Typography>
                  ) : (
                    selectedTicket.comments.map((c, idx) => (
                      <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                        <ListItemText
                          primary={c.message}
                          secondary={`${c.senderId === selectedTicket.adminId?._id ? 'Society Admin' : 'Support Desk'} - ${new Date(c.timestamp).toLocaleString()}`}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: '500' } }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Grid>

              {/* Triage / Update Panel */}
              <Grid item xs={12} sm={5} sx={{ pl: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Update Ticket State</Typography>

                <FormControl fullWidth sx={{ mb: 2.5 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={ticketStatus} label="Status" onChange={(e) => setTicketStatus(e.target.value)}>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Assigned">Assigned</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Assign Staff</InputLabel>
                  <Select value={assignee} label="Assign Staff" onChange={(e) => setAssignee(e.target.value)}>
                    <MenuItem value="">Unassigned</MenuItem>
                    {staffList.map((st) => (
                      <MenuItem key={st._id} value={st._id}>{st.name} ({st.email})</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Response Comment"
                  placeholder="Type your response to the society admin..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenDetail(false)} variant="outlined">Close</Button>
          <Button onClick={handleReply} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Post Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
