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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function FinancialsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState('income');
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Forms
  const [incForm, setIncForm] = useState({
    category: 'Parking Fees',
    amount: 0,
    transactionDate: '',
    payerName: '',
    paymentMethod: 'CASH',
    transactionReference: '',
    remarks: '',
  });

  const [expForm, setExpForm] = useState({
    category: 'Electricity Bill',
    amount: 0,
    paymentDate: '',
    payeeName: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionReference: '',
    invoiceNumber: '',
    remarks: '',
  });

  const fetchIncome = async () => {
    try {
      const res = await societyAdminApi.getIncome();
      if (res.success) {
        setIncomes(res.incomes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpense = async () => {
    try {
      const res = await societyAdminApi.getExpenses();
      if (res.success) {
        setExpenses(res.expenses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncome();
    fetchExpense();
  }, []);

  const handleCreateIncome = async () => {
    try {
      const res = await societyAdminApi.createIncome(incForm);
      if (res.success) {
        enqueueSnackbar('Income recorded successfully', { variant: 'success' });
        setOpenIncome(false);
        setIncForm({
          category: 'Parking Fees',
          amount: 0,
          transactionDate: '',
          payerName: '',
          paymentMethod: 'CASH',
          transactionReference: '',
          remarks: '',
        });
        fetchIncome();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error saving income', { variant: 'error' });
    }
  };

  const handleCreateExpense = async () => {
    try {
      const formData = new FormData();
      Object.keys(expForm).forEach((key) => {
        formData.append(key, expForm[key]);
      });
      if (attachmentFile) {
        formData.append('file', attachmentFile);
      }

      const res = await societyAdminApi.createExpense(formData);
      if (res.success) {
        enqueueSnackbar('Expense recorded successfully', { variant: 'success' });
        setOpenExpense(false);
        setAttachmentFile(null);
        setExpForm({
          category: 'Electricity Bill',
          amount: 0,
          paymentDate: '',
          payeeName: '',
          paymentMethod: 'BANK_TRANSFER',
          transactionReference: '',
          invoiceNumber: '',
          remarks: '',
        });
        fetchExpense();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error saving expense', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '600' }}>Society Financial Ledger</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Track custom community collections, parking rents, service fees, electricity bills, and security salaries.</Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenIncome(true)}
            sx={{ borderRadius: '12px' }}
          >
            Log Income
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenExpense(true)}
            sx={{ borderRadius: '12px' }}
          >
            Log Expense
          </Button>
        </Box>
      </Box>

      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 3 }}>
        <Tab value="income" label="Income Ledger" />
        <Tab value="expense" label="Expense Ledger" />
      </Tabs>

      {currentTab === 'income' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Payer Details</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No income logs entered yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  incomes.map((inc) => (
                    <TableRow key={inc._id} hover>
                      <TableCell>{new Date(inc.transactionDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{inc.category}</TableCell>
                      <TableCell>{inc.payerName}</TableCell>
                      <TableCell>{inc.paymentMethod}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>₹{inc.amount}</TableCell>
                      <TableCell>{inc.remarks || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {currentTab === 'expense' && (
        <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '600' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Payee / Vendor</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Invoice No.</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Invoice File</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">No expense logs entered yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((exp) => (
                    <TableRow key={exp._id} hover>
                      <TableCell>{new Date(exp.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{exp.category}</TableCell>
                      <TableCell>{exp.payeeName}</TableCell>
                      <TableCell>{exp.invoiceNumber || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'error.main' }}>₹{exp.amount}</TableCell>
                      <TableCell>
                        {exp.attachment ? (
                          <Button href={exp.attachment} target="_blank" size="small" variant="text">
                            View Receipt
                          </Button>
                        ) : (
                          'No attachment'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Log Income Modal */}
      <Dialog open={openIncome} onClose={() => setOpenIncome(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Log Miscellaneous Income</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select value={incForm.category} label="Category" onChange={(e) => setIncForm({ ...incForm, category: e.target.value })}>
                  <MenuItem value="Parking Fees">Parking Fees</MenuItem>
                  <MenuItem value="Donations">Donations</MenuItem>
                  <MenuItem value="Penalties">Penalties / Fine</MenuItem>
                  <MenuItem value="Clubhouse Rent">Clubhouse Rent</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Amount Collected (₹)" value={incForm.amount} onChange={(e) => setIncForm({ ...incForm, amount: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Transaction Date" InputLabelProps={{ shrink: true }} value={incForm.transactionDate} onChange={(e) => setIncForm({ ...incForm, transactionDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Mode</InputLabel>
                <Select value={incForm.paymentMethod} label="Payment Mode" onChange={(e) => setIncForm({ ...incForm, paymentMethod: e.target.value })}>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="ONLINE">Online Gateway</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Payer Name" value={incForm.payerName} onChange={(e) => setIncForm({ ...incForm, payerName: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Transaction Reference No" value={incForm.transactionReference} onChange={(e) => setIncForm({ ...incForm, transactionReference: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Remarks" value={incForm.remarks} onChange={(e) => setIncForm({ ...incForm, remarks: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenIncome(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreateIncome} variant="contained" color="success">Record Collection</Button>
        </DialogActions>
      </Dialog>

      {/* Log Expense Modal */}
      <Dialog open={openExpense} onClose={() => setOpenExpense(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Log Society Expenditure</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Expense Category</InputLabel>
                <Select value={expForm.category} label="Expense Category" onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}>
                  <MenuItem value="Electricity Bill">Electricity Bill</MenuItem>
                  <MenuItem value="Water Charges">Water Charges</MenuItem>
                  <MenuItem value="Security Salaries">Security Salaries</MenuItem>
                  <MenuItem value="General Maintenance">General Repairs</MenuItem>
                  <MenuItem value="Festivals / Events">Festivals / Events</MenuItem>
                  <MenuItem value="Office Stationery">Office Stationery</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Amount Spent (₹)" value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Payment Date" InputLabelProps={{ shrink: true }} value={expForm.paymentDate} onChange={(e) => setExpForm({ ...expForm, paymentDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Mode</InputLabel>
                <Select value={expForm.paymentMethod} label="Payment Mode" onChange={(e) => setExpForm({ ...expForm, paymentMethod: e.target.value })}>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="ONLINE">Online Card</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Vendor / Payee Name" value={expForm.payeeName} onChange={(e) => setExpForm({ ...expForm, payeeName: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Bill / Invoice Number" value={expForm.invoiceNumber} onChange={(e) => setExpForm({ ...expForm, invoiceNumber: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Transaction Ref No" value={expForm.transactionReference} onChange={(e) => setExpForm({ ...expForm, transactionReference: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', borderRadius: '8px' }}>
                Upload Invoice Scan
                <input type="file" hidden accept="image/*,application/pdf" onChange={(e) => setAttachmentFile(e.target.files[0])} />
              </Button>
              {attachmentFile && <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>File: {attachmentFile.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Expense Description" value={expForm.remarks} onChange={(e) => setExpForm({ ...expForm, remarks: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenExpense(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreateExpense} variant="contained" color="error">Record Expense</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
