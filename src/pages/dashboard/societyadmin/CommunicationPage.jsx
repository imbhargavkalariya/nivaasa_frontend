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
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function CommunicationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState('notices');
  
  const [notices, setNotices] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  const [openNotice, setOpenNotice] = useState(false);
  const [openDoc, setOpenDoc] = useState(false);
  const [docFile, setDocFile] = useState(null);

  // Forms
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    targetAudience: 'ALL',
  });

  const [docForm, setDocForm] = useState({
    name: '',
    category: 'Rules & Regulations',
    description: '',
    downloadPermissions: 'ALL',
  });

  const fetchNotices = async () => {
    try {
      const res = await societyAdminApi.getNotices();
      if (res.success) {
        setNotices(res.notices);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await societyAdminApi.getDocuments();
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchDocs();
  }, []);

  const handleCreateNotice = async () => {
    try {
      const res = await societyAdminApi.createNotice(noticeForm);
      if (res.success) {
        enqueueSnackbar('Announcement posted to notice board & notifications pushed to residents!', { variant: 'success' });
        setOpenNotice(false);
        setNoticeForm({
          title: '',
          description: '',
          category: 'GENERAL',
          priority: 'MEDIUM',
          targetAudience: 'ALL',
        });
        fetchNotices();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error posting notice', { variant: 'error' });
    }
  };

  const handleUploadDoc = async () => {
    try {
      const formData = new FormData();
      Object.keys(docForm).forEach((key) => {
        formData.append(key, docForm[key]);
      });
      if (docFile) {
        formData.append('file', docFile);
      }

      const res = await societyAdminApi.uploadDocument(formData);
      if (res.success) {
        enqueueSnackbar('Document uploaded to library successfully', { variant: 'success' });
        setOpenDoc(false);
        setDocFile(null);
        setDocForm({
          name: '',
          category: 'Rules & Regulations',
          description: '',
          downloadPermissions: 'ALL',
        });
        fetchDocs();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error uploading document', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Society Notice Board & Files</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Broadcast official announcements and publish rules sheets, meeting minutes, and financial reviews.</Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:megaphone-bold" />}
            onClick={() => setOpenNotice(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
          >
            Post Notice
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:file-bold" />}
            onClick={() => setOpenDoc(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#16A085' }}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 3 }}>
        <Tab value="notices" label="Active Announcements" />
        <Tab value="docs" label="Documents Library" />
      </Tabs>

      {currentTab === 'notices' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Notice Title</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Target Audience</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Date Posted</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Author</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No announcements published.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  notices.map((n) => (
                    <TableRow key={n._id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{n.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{n.description.slice(0, 80)}...</Typography>
                      </TableCell>
                      <TableCell>{n.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={n.priority}
                          size="small"
                          color={n.priority === 'CRITICAL' || n.priority === 'HIGH' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={n.targetAudience} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{new Date(n.publishDate).toLocaleDateString()}</TableCell>
                      <TableCell>{n.authorId?.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {currentTab === 'docs' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Document Name</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Folder Category</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>File Size</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Date Uploaded</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Permissions</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Uploaded By</TableCell>
                  <TableCell align="right" sx={{ fontWeight: '600' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No documents in vault.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((d) => (
                    <TableRow key={d._id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{d.name}</TableCell>
                      <TableCell>{d.category}</TableCell>
                      <TableCell>{(d.sizeBytes / 1024).toFixed(1)} KB</TableCell>
                      <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={d.downloadPermissions} size="small" color={d.downloadPermissions === 'ADMIN_ONLY' ? 'warning' : 'primary'} />
                      </TableCell>
                      <TableCell>{d.uploadedBy?.name}</TableCell>
                      <TableCell align="right">
                        <Button size="small" href={d.fileUrl} target="_blank" startIcon={<Iconify icon="solar:download-bold" />}>
                          Get File
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Post Notice Dialog */}
      <Dialog open={openNotice} onClose={() => setOpenNotice(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Publish Announcement</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Announcement Title" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Notice Description" value={noticeForm.description} onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={noticeForm.category} label="Category" onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}>
                  <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                  <MenuItem value="EVENT">Event</MenuItem>
                  <MenuItem value="EMERGENCY">Emergency</MenuItem>
                  <MenuItem value="MEETING">Meeting</MenuItem>
                  <MenuItem value="GENERAL">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={noticeForm.priority} label="Priority" onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Audience</InputLabel>
                <Select value={noticeForm.targetAudience} label="Audience" onChange={(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value })}>
                  <MenuItem value="ALL">All Residents</MenuItem>
                  <MenuItem value="OWNERS">Owners Only</MenuItem>
                  <MenuItem value="TENANTS">Tenants Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenNotice(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreateNotice} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Publish Notice</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={openDoc} onClose={() => setOpenDoc(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Upload Document to Vault</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Document Name" value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Folder / Category</InputLabel>
                <Select value={docForm.category} label="Folder / Category" onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}>
                  <MenuItem value="Rules & Regulations">Bye-laws & Rules</MenuItem>
                  <MenuItem value="Audit Report">Audit Reports</MenuItem>
                  <MenuItem value="Meeting Minutes">AGM Minutes</MenuItem>
                  <MenuItem value="General Document">General Pamphlets</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Permissions</InputLabel>
                <Select value={docForm.downloadPermissions} label="Permissions" onChange={(e) => setDocForm({ ...docForm, downloadPermissions: e.target.value })}>
                  <MenuItem value="ALL">Public (All Residents)</MenuItem>
                  <MenuItem value="ADMIN_ONLY">Confidential (Admins Only)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="File Description" value={docForm.description} onChange={(e) => setDocForm({ ...docForm, description: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
                Select File (PDF, Docs, JPG)
                <input type="file" hidden onChange={(e) => setDocFile(e.target.files[0])} />
              </Button>
              {docFile && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>File selected: {docFile.name}</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenDoc(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUploadDoc} variant="contained" sx={{ backgroundColor: '#16A085' }}>Upload File</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
