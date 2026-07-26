import {
  Box,
  Card,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';
import { societyAdminApi } from 'src/api/nivaasa';

export default function ReportsPage() {
  const { enqueueSnackbar } = useSnackbar();

  const triggerCSVDownload = (filename, headers, rows) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `${headers.join(',')}\n`;
    
    rows.forEach((row) => {
      csvContent += `${row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportResidents = async () => {
    try {
      const res = await societyAdminApi.getResidents();
      if (res.success && res.residents.length > 0) {
        const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Ownership Type', 'Occupation'];
        const rows = res.residents.map((r) => [
          r.name,
          r.email,
          r.phone,
          r.role,
          r.status,
          r.ownershipType || 'MEMBER',
          r.occupation || '',
        ]);
        triggerCSVDownload('residents_directory_report', headers, rows);
        enqueueSnackbar('Residents report exported successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('No residents data to export', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  const handleExportInvoices = async () => {
    try {
      const res = await societyAdminApi.getBills();
      if (res.success && res.bills.length > 0) {
        const headers = ['Invoice Number', 'Flat Number', 'Resident Name', 'Bill Cycle', 'Total Amount', 'Outstanding Amount', 'Status'];
        const rows = res.bills.map((b) => [
          b.invoiceNumber,
          b.flatId?.flatNumber || 'N/A',
          b.residentId?.name || 'N/A',
          b.billingCycle,
          b.totalAmount,
          b.outstandingAmount,
          b.paymentStatus,
        ]);
        triggerCSVDownload('maintenance_billing_ledger_report', headers, rows);
        enqueueSnackbar('Billing report exported successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('No maintenance invoices found to export', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  const handleExportExpenses = async () => {
    try {
      const res = await societyAdminApi.getExpenses();
      if (res.success && res.expenses.length > 0) {
        const headers = ['Category', 'Vendor / Payee', 'Payment Date', 'Payment Method', 'Invoice Number', 'Amount (INR)'];
        const rows = res.expenses.map((e) => [
          e.category,
          e.payeeName,
          new Date(e.paymentDate).toLocaleDateString(),
          e.paymentMethod,
          e.invoiceNumber || 'N/A',
          e.amount,
        ]);
        triggerCSVDownload('society_expenses_report', headers, rows);
        enqueueSnackbar('Expenses report exported!', { variant: 'success' });
      } else {
        enqueueSnackbar('No expenses logged to export', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar('Export failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>Reporting & Exports Center</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Compile community statistics, print billing audit papers, and download CSV log sheets.</Typography>

      <Grid container spacing={3.5}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 1.5, alignSelf: 'flex-start', backgroundColor: '#EFF6FF', borderRadius: '12px', color: '#3657D6' }}>
              <Iconify icon="solar:users-group-rounded-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Residents Registry</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>Export contact emails, occupancy states, and flat numbers of all members.</Typography>
            </div>
            <Button variant="outlined" startIcon={<Iconify icon="solar:download-bold" />} onClick={handleExportResidents}>
              Export CSV Directory
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 1.5, alignSelf: 'flex-start', backgroundColor: '#ECFDF5', borderRadius: '12px', color: '#16A085' }}>
              <Iconify icon="solar:bill-list-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Maintenance Ledger</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>Export maintenance collection states, total billing amounts, and pending arrears.</Typography>
            </div>
            <Button variant="outlined" startIcon={<Iconify icon="solar:download-bold" />} onClick={handleExportInvoices}>
              Export Billing Sheet
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 1.5, alignSelf: 'flex-start', backgroundColor: '#FFFBEB', borderRadius: '12px', color: '#F4B740' }}>
              <Iconify icon="solar:case-round-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Expenses Log</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>Export operational costs sheet, payroll records, and contractor details.</Typography>
            </div>
            <Button variant="outlined" startIcon={<Iconify icon="solar:download-bold" />} onClick={handleExportExpenses}>
              Export Expenses Sheet
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
