import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { superAdminApi } from 'src/api/nivaasa';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSocieties: 0,
    totalSocieties: 0,
  });

  const [recentSocieties, setRecentSocieties] = useState([]);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await superAdminApi.getDashboard();
        if (res.success) {
          setMetrics(res.metrics);
          setRecentSocieties(res.latestSocieties);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadOverview();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>Revenue & Subscription Analytics</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Track platform sales volume, user additions, and customer society growth logs.</Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, backgroundColor: '#EFF6FF', borderRadius: '12px', color: '#3657D6' }}>
              <Iconify icon="solar:bank-note-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="body2" color="text.secondary">Total Platform Sales</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹{metrics.totalRevenue}</Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, backgroundColor: '#ECFDF5', borderRadius: '12px', color: '#16A085' }}>
              <Iconify icon="solar:chart-square-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="body2" color="text.secondary">Monthly Recurring</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹{metrics.monthlyRevenue?.toFixed(0)}</Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, backgroundColor: '#FDF2F8', borderRadius: '12px', color: 'pink' }}>
              <Iconify icon="solar:home-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="body2" color="text.secondary">Onboarded Societies</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{metrics.totalSocieties}</Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, backgroundColor: '#FFFBEB', borderRadius: '12px', color: '#F4B740' }}>
              <Iconify icon="solar:users-group-rounded-bold-duotone" width={32} />
            </Box>
            <div>
              <Typography variant="body2" color="text.secondary">Active Communities</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{metrics.activeSocieties}</Typography>
            </div>
          </Card>
        </Grid>
      </Grid>

      {/* Growth log table */}
      <Card sx={{ borderRadius: '16px', border: '1px solid #E5EAF2', p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Society Registration Analytics</Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Society</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Subscription Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSocieties.map((s) => (
                <TableRow key={s._id} hover>
                  <TableCell sx={{ fontWeight: '600' }}>{s.name}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell>
                    <Chip label={s.subscriptionPlan} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>{new Date(s.subscriptionExpiry).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={s.activationStatus} size="small" color={s.activationStatus === 'ACTIVE' ? 'success' : 'default'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
