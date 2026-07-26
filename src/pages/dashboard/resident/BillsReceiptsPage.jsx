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
  Typography,
  TableContainer,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { residentApi } from 'src/api/nivaasa';

export default function BillsReceiptsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await residentApi.getBills();
      if (res.success) {
        setBills(res.bills);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch bills ledger', { variant: 'error' });
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

  const handleOpenReceipt = async (bill) => {
    try {
      const res = await residentApi.getBill(bill._id);
      if (res.success) {
        setSelectedBill(res.bill);
        setOpenReceipt(true);
      }
    } catch (err) {
      enqueueSnackbar('Failed to load transaction details', { variant: 'error' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>My Bills & Receipts</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>View outstanding maintenance invoices, audit previous transactions, and print detailed tax receipts.</Typography>

      {/* Table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Invoice No.</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Billing Period</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Billing Cycle</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Bill Amount</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Outstanding</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: '600' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">No invoice history found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((b) => (
                  <TableRow key={b._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{b.invoiceNumber}</TableCell>
                    <TableCell>
                      {new Date(b.billingPeriodStart).toLocaleDateString()} - {new Date(b.billingPeriodEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{new Date(b.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{b.billingCycle}</TableCell>
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
                      <Button size="small" onClick={() => handleOpenReceipt(b)} startIcon={<Iconify icon="solar:file-text-bold" />}>
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Invoice Receipt Dialog */}
      <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Invoice Receipt</span>
          <IconButton onClick={handlePrint} color="primary">
            <Iconify icon="solar:printer-bold" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }} className="printable-receipt">
          {selectedBill && (
            <Box>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1, color: '#3657D6' }}>NIVAASA LIVING</Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>Surat, Gujarat, India</Typography>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">INVOICED TO:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{selectedBill.residentId?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Unit: {selectedBill.flatId?.flatNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBill.residentId?.email}</Typography>
                </Grid>
                <Grid item xs={6} align="right">
                  <Typography variant="caption" color="text.secondary">INVOICE DETAILS:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>#{selectedBill.invoiceNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">Date: {new Date(selectedBill.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Due Date: {new Date(selectedBill.dueDate).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC' }}>
                    <th style={{ textAlign: 'left', padding: '8px', fontSize: '14px' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '8px', fontSize: '14px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', fontSize: '14px' }}>Maintenance Assessment Fee ({selectedBill.billingCycle})</td>
                    <td style={{ textAlign: 'right', padding: '8px', fontSize: '14px' }}>₹{selectedBill.maintenanceAmount}</td>
                  </tr>
                  {selectedBill.additionalCharges > 0 && (
                    <tr>
                      <td style={{ padding: '8px', fontSize: '14px' }}>Additional Utilities / Parking slot surcharge</td>
                      <td style={{ textAlign: 'right', padding: '8px', fontSize: '14px' }}>₹{selectedBill.additionalCharges}</td>
                    </tr>
                  )}
                  {selectedBill.lateFee > 0 && (
                    <tr>
                      <td style={{ padding: '8px', fontSize: '14px' }}>Overdue Late Charges Penalty</td>
                      <td style={{ textAlign: 'right', padding: '8px', fontSize: '14px', color: 'red' }}>₹{selectedBill.lateFee}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">PAYMENT METHOD:</Typography>
                  <Typography variant="subtitle2">{selectedBill.paymentMethod || 'UNPAID'}</Typography>
                  {selectedBill.transactionReference && (
                    <Typography variant="caption" color="text.secondary">Ref: {selectedBill.transactionReference}</Typography>
                  )}
                </Grid>
                <Grid item xs={6} align="right">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Dues: ₹{selectedBill.totalAmount}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: selectedBill.outstandingAmount === 0 ? 'success.main' : 'error.main' }}>
                    Balance: ₹{selectedBill.outstandingAmount}
                  </Typography>
                </Grid>
              </Grid>

              {selectedBill.paymentStatus === 'PAID' && (
                <Box sx={{ border: '2px solid #22C55E', borderRadius: '8px', p: 1.5, mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#22C55E', fontWeight: 'bold' }}>
                  TRANSACTION PAID & SETTLED
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenReceipt(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
