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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function MaintenancePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [bills, setBills] = useState([]);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Generate forms
  const [genForm, setGenForm] = useState({
    billingPeriodStart: '',
    billingPeriodEnd: '',
    dueDate: '',
  });

  // Record payment form
  const [payForm, setPayForm] = useState({
    paymentMethod: 'CASH',
    transactionReference: '',
    amountPaid: 0,
    remarks: '',
  });

  const fetchBills = async () => {
    try {
      const res = await societyAdminApi.getBills();
      if (res.success) {
        setBills(res.bills);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch bills list', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status) => {
    if (status === 'PAID') return 'success';
    if (status === 'UNPAID') return 'error';
    return 'warning';
  };

  const handleGenerate = async () => {
    try {
      const res = await societyAdminApi.generateBills(genForm);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: 'success' });
        setOpenGenerate(false);
        fetchBills();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error generating invoices', { variant: 'error' });
    }
  };

  const handleOpenRecord = (bill) => {
    setSelectedBill(bill);
    setPayForm({
      paymentMethod: 'CASH',
      transactionReference: '',
      amountPaid: bill.outstandingAmount,
      remarks: '',
    });
    setOpenRecord(true);
  };

  const handleRecordPayment = async () => {
    try {
      const res = await societyAdminApi.recordPayment(selectedBill._id, payForm);
      if (res.success) {
        enqueueSnackbar('Offline payment recorded successfully!', { variant: 'success' });
        setOpenRecord(false);
        fetchBills();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error logging payment', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Maintenance Invoicing & Ledger</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track society maintenance payments, issue monthly bills, and log offline collections.</Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:bill-list-bold" />}
            onClick={() => setOpenGenerate(true)}
            sx={{ borderRadius: '12px', backgroundColor: '#3657D6' }}
          >
            Generate Invoices
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Invoice No.</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Flat / Resident</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Billing Period</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Outstanding</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No invoices generated yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((b) => (
                  <TableRow key={b._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{b.invoiceNumber}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>Unit {b.flatId?.flatNumber}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.residentId?.name}</Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(b.billingPeriodStart).toLocaleDateString()} - {new Date(b.billingPeriodEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: b.paymentStatus === 'UNPAID' ? 'error.main' : 'inherit' }}>
                      {new Date(b.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>₹{b.totalAmount}</TableCell>
                    <TableCell sx={{ color: b.outstandingAmount > 0 ? 'error.main' : 'success.main' }}>
                      ₹{b.outstandingAmount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={b.paymentStatus}
                        size="small"
                        color={getStatusColor(b.paymentStatus)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {b.outstandingAmount > 0 && (
                        <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:cash-out-bold" />} onClick={() => handleOpenRecord(b)}>
                          Pay Offline
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generate Invoices Modal */}
      <Dialog open={openGenerate} onClose={() => setOpenGenerate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Generate Maintenance Invoices</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, mt: 1 }}>
            This will trigger invoice generation for all occupied apartments in the society. Reminders will be emailed automatically to resident list.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Billing Period Start" InputLabelProps={{ shrink: true }} value={genForm.billingPeriodStart} onChange={(e) => setGenForm({ ...genForm, billingPeriodStart: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Billing Period End" InputLabelProps={{ shrink: true }} value={genForm.billingPeriodEnd} onChange={(e) => setGenForm({ ...genForm, billingPeriodEnd: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={genForm.dueDate} onChange={(e) => setGenForm({ ...genForm, dueDate: e.target.value })} required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenGenerate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleGenerate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Start Billing</Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={openRecord} onClose={() => setOpenRecord(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Record Offline Collection</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select value={payForm.paymentMethod} label="Payment Method" onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Amount Paid" value={payForm.amountPaid} onChange={(e) => setPayForm({ ...payForm, amountPaid: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Transaction Ref / Cheque No" placeholder="e.g. TXN98765432 or CHQ-1234" value={payForm.transactionReference} onChange={(e) => setPayForm({ ...payForm, transactionReference: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Remarks" placeholder="Optional notes..." value={payForm.remarks} onChange={(e) => setPayForm({ ...payForm, remarks: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenRecord(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleRecordPayment} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Record payment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
