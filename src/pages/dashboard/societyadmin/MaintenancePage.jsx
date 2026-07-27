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
  Tabs,
  Tab,
  Stack,
  IconButton,
  Divider,
  LinearProgress,
  CircularProgress,
  Autocomplete,
  OutlinedInput,
  Tooltip,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function MaintenancePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [bills, setBills] = useState([]);
  const [towers, setTowers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [currentTab, setCurrentTab] = useState('overview');
  const [drillDownBatchId, setDrillDownBatchId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [towerFilter, setTowerFilter] = useState('');

  // Loading States
  const [loadingList, setLoadingList] = useState(false);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Modal States
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openEditBill, setOpenEditBill] = useState(false);
  const [openRecordPayment, setOpenRecordPayment] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // Selected entities for edits / updates
  const [selectedBill, setSelectedBill] = useState(null);
  const [billToDeleteId, setBillToDeleteId] = useState(null);

  // Batch edit / delete states
  const [openEditBatch, setOpenEditBatch] = useState(false);
  const [openDeleteBatchConfirm, setOpenDeleteBatchConfirm] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [batchForm, setBatchForm] = useState({
    amount: 1500,
    dueDate: '',
    lateFee: 150,
    description: '',
  });

  // Duplicate prompt overlay
  const [duplicateData, setDuplicateData] = useState({
    show: false,
    duplicateFlats: [],
  });

  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    totalFlats: 0,
    billsGenerated: 0,
    paidBills: 0,
    pendingBills: 0,
    overdueBills: 0,
    totalCollection: 0,
    outstandingAmount: 0,
    collectionPercentage: 0,
  });

  // Generate Invoices Form
  const [genForm, setGenForm] = useState({
    billingMonth: new Date().getMonth() + 1,
    billingYear: new Date().getFullYear(),
    amount: 1500,
    dueDate: '',
    lateFee: 150,
    description: 'Monthly Maintenance Assessment Fee',
    targetScope: 'ALL', // ALL, OCCUPIED, VACANT, TOWER, FLOOR, FLAT
    targetIds: [],
  });

  // Individual Bill edit Form
  const [editForm, setEditForm] = useState({
    maintenanceAmount: 0,
    dueDate: '',
    lateFee: 0,
    description: '',
    paymentStatus: 'UNPAID',
  });

  // Offline payment form
  const [payForm, setPayForm] = useState({
    paymentMethod: 'CASH',
    transactionReference: '',
    amountPaid: 0,
    remarks: '',
  });

  const fetchDashboardMetrics = async () => {
    try {
      const res = await societyAdminApi.getDashboardOverview();
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    }
  };

  const fetchBills = async () => {
    setLoadingList(true);
    try {
      const params = {
        status: statusFilter || undefined,
        billingMonth: monthFilter || undefined,
        billingYear: yearFilter || undefined,
        towerId: towerFilter || undefined,
        search: searchQuery || undefined,
      };
      const res = await societyAdminApi.getBills(params);
      if (res.success) {
        setBills(res.bills);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to fetch bills ledger', { variant: 'error' });
    } finally {
      setLoadingList(false);
    }
  };

  const fetchFiltersInfo = async () => {
    try {
      const resTowers = await societyAdminApi.getTowers();
      if (resTowers.success) setTowers(resTowers.towers);

      const resFlats = await societyAdminApi.getFlats({});
      if (resFlats.success) setFlats(resFlats.flats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, monthFilter, yearFilter, towerFilter]);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchFiltersInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchBills();
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === '') {
      setTimeout(() => {
        fetchBills();
      }, 50);
    }
  };

  const handleGenerateInvoices = async (regenerateFlag = false) => {
    setLoadingGen(true);
    try {
      const payload = {
        ...genForm,
        regenerate: regenerateFlag,
      };
      const res = await societyAdminApi.generateBills(payload);
      if (res.success) {
        enqueueSnackbar(res.message || 'Invoices generated successfully!', { variant: 'success' });
        setOpenGenerate(false);
        setDuplicateData({ show: false, duplicateFlats: [] });
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      if (error.response?.data?.hasDuplicates) {
        setDuplicateData({
          show: true,
          duplicateFlats: error.response.data.duplicateFlats || [],
        });
      } else {
        enqueueSnackbar(error.response?.data?.message || error.message || 'Error generating invoices', { variant: 'error' });
      }
    } finally {
      setLoadingGen(false);
    }
  };

  const handleEditBillClick = (bill) => {
    setSelectedBill(bill);
    setEditForm({
      maintenanceAmount: bill.totalAmount,
      dueDate: bill.dueDate ? bill.dueDate.substring(0, 10) : '',
      lateFee: bill.lateFee || 0,
      description: bill.description || '',
      paymentStatus: bill.paymentStatus || 'UNPAID',
    });
    setOpenEditBill(true);
  };

  const handleUpdateBill = async () => {
    setLoadingUpdate(true);
    try {
      const res = await societyAdminApi.updateMaintenanceBill(selectedBill._id, editForm);
      if (res.success) {
        enqueueSnackbar('Invoice details updated successfully', { variant: 'success' });
        setOpenEditBill(false);
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update invoice', { variant: 'error' });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteBillClick = (id) => {
    setBillToDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteBill = async () => {
    setLoadingDelete(true);
    try {
      const res = await societyAdminApi.deleteMaintenanceBill(billToDeleteId);
      if (res.success) {
        enqueueSnackbar('Invoice deleted successfully', { variant: 'success' });
        setOpenDeleteConfirm(false);
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to delete invoice', { variant: 'error' });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenRecordPayment = (bill) => {
    setSelectedBill(bill);
    setPayForm({
      paymentMethod: 'CASH',
      transactionReference: '',
      amountPaid: bill.outstandingAmount,
      remarks: '',
    });
    setOpenRecordPayment(true);
  };

  const handleRecordPayment = async () => {
    setLoadingAction(true);
    try {
      const res = await societyAdminApi.recordPayment(selectedBill._id, payForm);
      if (res.success) {
        enqueueSnackbar('Offline payment recorded successfully!', { variant: 'success' });
        setOpenRecordPayment(false);
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error logging payment', { variant: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleStatus = async (bill, currentStatus) => {
    setLoadingAction(true);
    try {
      const nextStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
      const res = await societyAdminApi.updateBillStatus(bill._id, nextStatus);
      if (res.success) {
        enqueueSnackbar(`Bill marked as ${nextStatus === 'PAID' ? 'Paid' : 'Pending'} successfully`, { variant: 'success' });
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Error updating status', { variant: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenReceipt = (bill) => {
    setSelectedBill(bill);
    setOpenReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Group bills by batch for batch tab
  const getBatches = () => {
    const batchMap = {};
    bills.forEach((b) => {
      if (b.batchId) {
        if (!batchMap[b.batchId]) {
          batchMap[b.batchId] = {
            batchId: b.batchId,
            month: b.billingMonth,
            year: b.billingYear,
            amount: b.totalAmount,
            dueDate: b.dueDate,
            lateFee: b.lateFee,
            description: b.description || 'Monthly assessment fee',
            count: 0,
            totalBilled: 0,
            paidCount: 0,
            pendingCount: 0,
            dateGenerated: b.createdAt,
          };
        }
        batchMap[b.batchId].count += 1;
        batchMap[b.batchId].totalBilled += b.totalAmount;
        if (b.paymentStatus === 'PAID') {
          batchMap[b.batchId].paidCount += 1;
        } else {
          batchMap[b.batchId].pendingCount += 1;
        }
      }
    });
    return Object.values(batchMap);
  };

  const handleEditBatchClick = (batch) => {
    setSelectedBatchId(batch.batchId);
    setBatchForm({
      amount: batch.amount,
      dueDate: batch.dueDate ? batch.dueDate.substring(0, 10) : '',
      lateFee: batch.lateFee || 0,
      description: batch.description || '',
    });
    setOpenEditBatch(true);
  };

  const handleUpdateBatch = async () => {
    setLoadingUpdate(true);
    try {
      const res = await societyAdminApi.updateMaintenanceBatch(selectedBatchId, batchForm);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: 'success' });
        setOpenEditBatch(false);
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update batch', { variant: 'error' });
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteBatchClick = (batchId) => {
    setSelectedBatchId(batchId);
    setOpenDeleteBatchConfirm(true);
  };

  const handleDeleteBatch = async () => {
    setLoadingDelete(true);
    try {
      const res = await societyAdminApi.deleteMaintenanceBatch(selectedBatchId);
      if (res.success) {
        enqueueSnackbar(res.message, { variant: 'success' });
        setOpenDeleteBatchConfirm(false);
        fetchBills();
        fetchDashboardMetrics();
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to delete batch', { variant: 'error' });
    } finally {
      setLoadingDelete(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Invoice Number', 'Tower', 'Flat Number', 'Resident Name', 'Period', 'Due Date', 'Amount', 'Outstanding', 'Status', 'Payment Date'];
    const rows = bills.map((b) => [
      b.invoiceNumber,
      b.flatId?.towerId?.name || '',
      b.flatId?.flatNumber || '',
      b.residentSnapshot?.name || 'Vacant',
      `${b.billingMonth}/${b.billingYear}`,
      new Date(b.dueDate).toLocaleDateString(),
      b.totalAmount,
      b.outstandingAmount,
      b.paymentStatus,
      b.paymentDate ? new Date(b.paymentDate).toLocaleDateString() : '',
    ]);

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(','), ...rows.map((e) => e.join(','))].join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nivaasa_Maintenance_Invoices_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    if (status === 'PAID') return 'success';
    if (status === 'UNPAID') return 'warning';
    return 'error';
  };

  const renderTableBody = () => {
    if (loadingList) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>Loading billing records...</Typography>
          </TableCell>
        </TableRow>
      );
    }

    // Filter bills to only show those inside the selected batch
    let batchBills = drillDownBatchId
      ? bills.filter((b) => b.batchId === drillDownBatchId)
      : bills;

    // Sort flat wise (Tower name first, then numerical Flat Number order for floor 1-14)
    batchBills = [...batchBills].sort((a, b) => {
      const towerA = a.flatId?.towerId?.name || '';
      const towerB = b.flatId?.towerId?.name || '';
      if (towerA !== towerB) {
        return towerA.localeCompare(towerB);
      }
      
      const flatNumA = Number(a.flatId?.flatNumber) || 0;
      const flatNumB = Number(b.flatId?.flatNumber) || 0;
      
      if (flatNumA !== flatNumB) {
        return flatNumA - flatNumB;
      }
      
      const flatStrA = String(a.flatId?.flatNumber || '');
      const flatStrB = String(b.flatId?.flatNumber || '');
      return flatStrA.localeCompare(flatStrB, undefined, { numeric: true, sensitivity: 'base' });
    });

    if (batchBills.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
            <Typography variant="body1" color="text.secondary">No invoices found matching current criteria.</Typography>
          </TableCell>
        </TableRow>
      );
    }
    return batchBills.map((b) => (
      <TableRow key={b._id} hover>
        <TableCell sx={{ fontWeight: 'bold' }}>{b.invoiceNumber}</TableCell>
        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Unit {b.flatId?.flatNumber}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{b.flatId?.towerId?.name || 'Block'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>{b.residentSnapshot?.name || 'Vacant'}</Typography>
          {b.residentSnapshot?.phone && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{b.residentSnapshot.phone}</Typography>
          )}
        </TableCell>
        <TableCell>{b.billingMonth}/{b.billingYear}</TableCell>
        <TableCell>{new Date(b.dueDate).toLocaleDateString()}</TableCell>
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
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title="View Receipt">
              <IconButton onClick={() => handleOpenReceipt(b)} color="info">
                <Iconify icon="solar:file-text-bold" />
              </IconButton>
            </Tooltip>
            {b.outstandingAmount > 0 ? (
              <Tooltip title="Record Payment">
                <IconButton onClick={() => handleOpenRecordPayment(b)} color="success">
                  <Iconify icon="solar:cash-out-bold" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Mark Unpaid">
                <IconButton onClick={() => handleToggleStatus(b, 'PAID')} color="warning">
                  <Iconify icon="solar:refresh-bold" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit Bill">
              <IconButton onClick={() => handleEditBillClick(b)} color="primary">
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Invoice">
              <IconButton onClick={() => handleDeleteBillClick(b._id)} color="error">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Panel */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: '700', color: '#1D2A52' }}>Maintenance Billing Hub</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Issue invoices to vacant or occupied properties, manage calculations, and audit collections.
          </Typography>
        </div>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={exportToCSV}
            startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
            sx={{ borderRadius: '12px', borderColor: '#E5EAF2', color: '#1F2937' }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenGenerate(true)}
            startIcon={<Iconify icon="solar:bill-list-bold" />}
            sx={{ borderRadius: '12px', backgroundColor: '#3657D6', '&:hover': { backgroundColor: '#2544B3' } }}
          >
            Generate Invoices
          </Button>
        </Stack>
      </Box>

      {/* Tabs Menu */}
      <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ mb: 4 }}>
        <Tab value="overview" label="Billing Analytics" icon={<Iconify icon="solar:chart-square-bold" />} iconPosition="start" />
        <Tab value="list" label="Invoices Ledger" icon={<Iconify icon="solar:document-text-bold" />} iconPosition="start" />
      </Tabs>

      {/* 1. OVERVIEW ANALYTICS TAB */}
      {currentTab === 'overview' && (
        <Box>
          {/* Current Month Statistics Section */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1D2A52' }}>
            This Month&apos;s billing Overview ({
              metrics.currentMonth 
                ? new Date(0, metrics.currentMonth - 1).toLocaleString('en', { month: 'long' }) 
                : 'Current Month'
            } {metrics.currentYear || ''})
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', background: 'linear-gradient(135deg, #3657D6 0%, #2544B3 100%)', color: '#FFFFFF' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>TOTAL BILLED THIS MONTH</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>₹{metrics.thisMonthBilled || 0}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:document-bold" /> Current month invoices
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>TOTAL COLLECTED THIS MONTH</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#16A085' }}>₹{metrics.thisMonthCollected || 0}</Typography>
                <Typography variant="caption" sx={{ color: '#16A085', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:check-circle-bold" /> Settled this month
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>TOTAL PENDING THIS MONTH</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#EF4444' }}>₹{metrics.thisMonthPending || 0}</Typography>
                <Typography variant="caption" sx={{ color: '#EF4444', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:danger-triangle-bold" /> Dues this month
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', py: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1 }}>
                  <div>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>COLLECTION RATE</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5, color: '#3657D6' }}>{metrics.thisMonthCollectionPercentage || 0}%</Typography>
                  </div>
                  <CircularProgress variant="determinate" value={metrics.thisMonthCollectionPercentage || 0} size={50} thickness={5} sx={{ color: '#3657D6' }} />
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Historical / All-Time Statistics Section */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, mt: 4, color: '#1D2A52' }}>
            All-Time Billing & Recovery Summary
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>TOTAL FLAT UNITS</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#1D2A52' }}>{metrics.totalFlats}</Typography>
                <Typography variant="caption" sx={{ color: '#16A085', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:home-bold" /> Mapped & active
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>TOTAL BILLED ALL-TIME</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#1D2A52' }}>{metrics.billsGenerated}</Typography>
                <Typography variant="caption" sx={{ color: '#F4B740', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:document-bold" /> Total invoices generated
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>TOTAL CASH COLLECTED</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#16A085' }}>₹{metrics.totalCollection}</Typography>
                <Typography variant="caption" sx={{ color: '#16A085', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:check-circle-bold" /> Settled all-time
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: '600' }}>ALL-TIME OUTSTANDING</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1, color: '#EF4444' }}>₹{metrics.outstandingAmount}</Typography>
                <Typography variant="caption" sx={{ color: '#EF4444', display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                  <Iconify icon="solar:danger-triangle-bold" /> Cumulative unpaid dues
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Invoice Settlement Statistics</Typography>
                <Stack spacing={2.5}>
                  <div>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Paid Invoices</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{metrics.paidBills} / {metrics.billsGenerated}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={metrics.billsGenerated ? (metrics.paidBills / metrics.billsGenerated) * 100 : 0} sx={{ height: 8, borderRadius: '4px', backgroundColor: '#F1F5F9', '& .MuiLinearProgress-bar': { backgroundColor: '#16A085' } }} />
                  </div>
                  <div>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Pending Invoices</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{metrics.pendingBills} / {metrics.billsGenerated}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={metrics.billsGenerated ? (metrics.pendingBills / metrics.billsGenerated) * 100 : 0} sx={{ height: 8, borderRadius: '4px', backgroundColor: '#F1F5F9', '& .MuiLinearProgress-bar': { backgroundColor: '#F4B740' } }} />
                  </div>
                  <div>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Overdue Invoices</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{metrics.overdueBills} / {metrics.billsGenerated}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={metrics.billsGenerated ? (metrics.overdueBills / metrics.billsGenerated) * 100 : 0} sx={{ height: 8, borderRadius: '4px', backgroundColor: '#F1F5F9', '& .MuiLinearProgress-bar': { backgroundColor: '#EF4444' } }} />
                  </div>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #E5EAF2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '220px' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress size={120} thickness={6} variant="determinate" value={metrics.collectionPercentage} sx={{ color: '#3657D6' }} />
                  <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1D2A52' }}>{metrics.collectionPercentage}%</Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Collection efficiency score</Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 2. INVOICES LEDGER TAB */}
      {currentTab === 'list' && (
        <Box>
          {!drillDownBatchId ? (
            /* Batches List View */
            <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: '600' }}>Batch Name</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Billing Period</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Properties Billed</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Paid Flats</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Pending Flats</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Total Batch Value</TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>Date Generated</TableCell>
                      <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getBatches().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <Typography variant="body1" color="text.secondary">No billing batches generated yet.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getBatches().map((batch) => {
                        const monthName = new Date(0, batch.month - 1).toLocaleString('en', { month: 'long' });
                        return (
                          <TableRow key={batch.batchId} hover>
                            <TableCell sx={{ fontWeight: 'bold', color: '#3657D6' }}>
                              {monthName} {batch.year} Batch
                            </TableCell>
                            <TableCell>{batch.month}/{batch.year}</TableCell>
                            <TableCell>{batch.count} flats</TableCell>
                            <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>{batch.paidCount} Paid</TableCell>
                            <TableCell sx={{ color: 'warning.main', fontWeight: 'bold' }}>{batch.pendingCount} Pending</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>₹{batch.totalBilled}</TableCell>
                            <TableCell>{new Date(batch.dateGenerated).toLocaleDateString()}</TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" variant="contained" onClick={() => setDrillDownBatchId(batch.batchId)} sx={{ backgroundColor: '#3657D6' }}>
                                  View Flats
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => handleEditBatchClick(batch)}>
                                  Edit
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteBatchClick(batch.batchId)}>
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          ) : (
            /* Drill Down Flats View */
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Button
                  startIcon={<Iconify icon="solar:arrow-left-outline" />}
                  onClick={() => setDrillDownBatchId(null)}
                  variant="outlined"
                  sx={{ borderRadius: '12px' }}
                >
                  Back to Batches
                </Button>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1D2A52' }}>
                  Flats list for {
                    (() => {
                      const activeBatch = getBatches().find(b => b.batchId === drillDownBatchId);
                      if (activeBatch) {
                        return `${new Date(0, activeBatch.month - 1).toLocaleString('en', { month: 'long' })} ${activeBatch.year} Batch`;
                      }
                      return drillDownBatchId;
                    })()
                  }
                </Typography>
              </Stack>

              {/* Filters Row */}
              <Card sx={{ borderRadius: '16px', p: 2.5, mb: 3, border: '1px solid #E5EAF2' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search flat number, resident..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchSubmit}
                      InputProps={{
                        startAdornment: <Iconify icon="solar:magnifer-bold" sx={{ color: 'text.disabled', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Status</InputLabel>
                      <Select value={statusFilter} label="Payment Status" onChange={(e) => setStatusFilter(e.target.value)}>
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="PAID">Paid</MenuItem>
                        <MenuItem value="UNPAID">Pending</MenuItem>
                        <MenuItem value="OVERDUE">Overdue</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Tower</InputLabel>
                      <Select value={towerFilter} label="Tower" onChange={(e) => setTowerFilter(e.target.value)}>
                        <MenuItem value="">All Towers</MenuItem>
                        {towers.map((t) => (
                          <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('');
                        setTowerFilter('');
                        setTimeout(() => {
                          fetchBills();
                        }, 50);
                      }}
                      sx={{ height: '54px', borderRadius: '12px' }}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Card>

              {/* Flats Table */}
              <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2' }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: '600' }}>Invoice No.</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Tower & Flat</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Resident</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Bill Amount</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Outstanding</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '600' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderTableBody()}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}
        </Box>
      )}

      {/* GENERATE BILLS DIALOG */}
      <Dialog open={openGenerate} onClose={() => setOpenGenerate(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Generate Maintenance Invoices</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {duplicateData.show ? (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center', color: 'error.main' }}>
                <Iconify icon="solar:danger-triangle-bold" sx={{ fontSize: '2.5rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Duplicate Records Found</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Invoices for the following flats have already been generated for **{genForm.billingMonth}/{genForm.billingYear}**:
              </Typography>
              <Box sx={{ backgroundColor: '#F8FAFC', p: 2, borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', mb: 3, border: '1px solid #E5EAF2' }}>
                {duplicateData.duplicateFlats.join(', ')}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Do you want to overwrite all existing bills for this period and regenerate?
              </Typography>
              <DialogActions sx={{ p: 0 }}>
                <Button onClick={() => setDuplicateData({ show: false, duplicateFlats: [] })} variant="outlined">
                  Cancel
                </Button>
                <LoadingButton onClick={() => handleGenerateInvoices(true)} loading={loadingGen} variant="contained" color="error">
                  Yes, Overwrite & Regenerate
                </LoadingButton>
              </DialogActions>
            </Box>
          ) : (
            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Billing Month</InputLabel>
                  <Select value={genForm.billingMonth} label="Billing Month" onChange={(e) => setGenForm({ ...genForm, billingMonth: Number(e.target.value) })}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Billing Year</InputLabel>
                  <Select value={genForm.billingYear} label="Billing Year" onChange={(e) => setGenForm({ ...genForm, billingYear: Number(e.target.value) })}>
                    <MenuItem value={2026}>2026</MenuItem>
                    <MenuItem value={2027}>2027</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Billing Amount (₹)" value={genForm.amount} onChange={(e) => setGenForm({ ...genForm, amount: Number(e.target.value) })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Late Fee Penalty (₹)" value={genForm.lateFee} onChange={(e) => setGenForm({ ...genForm, lateFee: Number(e.target.value) })} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={genForm.dueDate} onChange={(e) => setGenForm({ ...genForm, dueDate: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Target Billing Scope</InputLabel>
                  <Select value={genForm.targetScope} label="Target Billing Scope" onChange={(e) => setGenForm({ ...genForm, targetScope: e.target.value, targetIds: [] })}>
                    <MenuItem value="ALL">All Flats (Vacant & Occupied)</MenuItem>
                    <MenuItem value="OCCUPIED">Occupied Flats Only</MenuItem>
                    <MenuItem value="VACANT">Vacant Flats Only</MenuItem>
                    <MenuItem value="TOWER">Selected Towers</MenuItem>
                    <MenuItem value="FLOOR">Selected Floors</MenuItem>
                    <MenuItem value="FLAT">Selected Flats</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Dynamic Scope Selection Inputs */}
              {genForm.targetScope === 'TOWER' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Towers</InputLabel>
                    <Select
                      multiple
                      value={genForm.targetIds}
                      onChange={(e) => setGenForm({ ...genForm, targetIds: e.target.value })}
                      input={<OutlinedInput label="Select Towers" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const tow = towers.find((t) => t._id === value);
                            return <Chip key={value} label={tow?.name || value} size="small" />;
                          })}
                        </Box>
                      )}
                    >
                      {towers.map((t) => (
                        <MenuItem key={t._id} value={t._id}>{t.name} ({t.towerCode})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {genForm.targetScope === 'FLAT' && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={flats}
                    getOptionLabel={(option) => `Unit ${option.flatNumber} (${option.towerId?.name || ''})`}
                    value={flats.filter((f) => genForm.targetIds.includes(f._id))}
                    onChange={(event, newValue) => {
                      setGenForm({ ...genForm, targetIds: newValue.map((val) => val._id) });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Select Flats" placeholder="Search flat numbers..." />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Invoice Description" placeholder="e.g. Facilities upkeep & safety assessments charges" value={genForm.description} onChange={(e) => setGenForm({ ...genForm, description: e.target.value })} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        {!duplicateData.show && (
          <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
            <Button onClick={() => setOpenGenerate(false)} variant="outlined">Cancel</Button>
            <LoadingButton onClick={() => handleGenerateInvoices(false)} loading={loadingGen} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
              Generate Invoices
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>

      {/* EDIT INDIVIDUAL BILL DIALOG */}
      <Dialog open={openEditBill} onClose={() => setOpenEditBill(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Update Invoice Details</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Maintenance Amount (₹)" value={editForm.maintenanceAmount} onChange={(e) => setEditForm({ ...editForm, maintenanceAmount: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Late Fee Penalty (₹)" value={editForm.lateFee} onChange={(e) => setEditForm({ ...editForm, lateFee: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={editForm.dueDate} onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select value={editForm.paymentStatus} label="Payment Status" onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}>
                  <MenuItem value="UNPAID">Pending</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Invoice Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenEditBill(false)} variant="outlined">Cancel</Button>
          <LoadingButton onClick={handleUpdateBill} loading={loadingUpdate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* DELETE BILL CONFIRMATION DIALOG */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', fontSize: '2rem' }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete this maintenance bill record?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone and will remove the invoice history from the resident ledger.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDeleteConfirm(false)} variant="outlined" fullWidth sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          <LoadingButton onClick={handleDeleteBill} loading={loadingDelete} variant="contained" color="error" fullWidth sx={{ borderRadius: '12px', backgroundColor: '#EF4444' }}>
            Permanently Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* RECORD OFFLINE PAYMENT DIALOG */}
      <Dialog open={openRecordPayment} onClose={() => setOpenRecordPayment(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
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
          <Button onClick={() => setOpenRecordPayment(false)} variant="outlined">Cancel</Button>
          <LoadingButton onClick={handleRecordPayment} loading={loadingAction} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
            Record Payment
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* PRINTABLE RECEIPT DIALOG */}
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
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>Tax Invoice & Settlement Receipt</Typography>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">INVOICED TO:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{selectedBill.residentSnapshot?.name || 'Vacant'}</Typography>
                  <Typography variant="body2" color="text.secondary">Unit: {selectedBill.flatId?.flatNumber}</Typography>
                  {selectedBill.residentSnapshot?.email && (
                    <Typography variant="body2" color="text.secondary">{selectedBill.residentSnapshot.email}</Typography>
                  )}
                </Grid>
                <Grid item xs={6} align="right">
                  <Typography variant="caption" color="text.secondary">INVOICE DETAILS:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>#{selectedBill.invoiceNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">Period: {selectedBill.billingMonth}/{selectedBill.billingYear}</Typography>
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
                    <td style={{ padding: '8px', fontSize: '14px' }}>{selectedBill.description || 'Monthly Maintenance Assessment Fee'}</td>
                    <td style={{ textAlign: 'right', padding: '8px', fontSize: '14px' }}>₹{selectedBill.totalAmount}</td>
                  </tr>
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
          <Button onClick={() => setOpenReceipt(false)} variant="contained" sx={{ backgroundColor: '#3657D6' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT BATCH DIALOG */}
      <Dialog open={openEditBatch} onClose={() => setOpenEditBatch(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #E5EAF2' }}>Update Billing Batch</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, mt: 1 }}>
            This will update the invoice details for all properties generated in batch **{selectedBatchId}**.
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Billed Amount per flat (₹)" value={batchForm.amount} onChange={(e) => setBatchForm({ ...batchForm, amount: Number(e.target.value) })} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Late Fee Penalty (₹)" value={batchForm.lateFee} onChange={(e) => setBatchForm({ ...batchForm, lateFee: Number(e.target.value) })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={batchForm.dueDate} onChange={(e) => setBatchForm({ ...batchForm, dueDate: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Invoice Description" value={batchForm.description} onChange={(e) => setBatchForm({ ...batchForm, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #E5EAF2', p: 2 }}>
          <Button onClick={() => setOpenEditBatch(false)} variant="outlined">Cancel</Button>
          <LoadingButton onClick={handleUpdateBatch} loading={loadingUpdate} variant="contained" sx={{ backgroundColor: '#3657D6' }}>
            Update Batch
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* DELETE BATCH CONFIRMATION DIALOG */}
      <Dialog open={openDeleteBatchConfirm} onClose={() => setOpenDeleteBatchConfirm(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', fontSize: '2rem' }} />
          Delete Billing Batch
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to permanently delete all invoices in batch <strong>{selectedBatchId}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action is irreversible and will delete all invoices and payment histories generated in this batch execution.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDeleteBatchConfirm(false)} variant="outlined" fullWidth sx={{ borderRadius: '12px' }}>
            Cancel
          </Button>
          <LoadingButton onClick={handleDeleteBatch} loading={loadingDelete} variant="contained" color="error" fullWidth sx={{ borderRadius: '12px', backgroundColor: '#EF4444' }}>
            Permanently Delete Batch
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
