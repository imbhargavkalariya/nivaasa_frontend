import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Chart, { useChart } from 'src/components/chart';
import { useAuthContext } from 'src/auth/hooks';
import { superAdminApi, societyAdminApi, residentApi } from 'src/api/nivaasa';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export default function OverviewAppPage() {
  const { user } = useAuthContext();
  const role = user?.role || 'MEMBER';
  const router = useRouter();

  // Dashboard states
  const [saData, setSaData] = useState(null);
  const [socData, setSocData] = useState(null);
  const [resData, setResData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (role === 'SUPER_ADMIN') {
          const res = await superAdminApi.getDashboard();
          if (res.success) setSaData(res);
        } else if (role === 'ADMIN') {
          const res = await societyAdminApi.getDashboard();
          if (res.success) setSocData(res);
        } else if (role === 'MEMBER') {
          const res = await residentApi.getDashboard();
          if (res.success) setResData(res);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // Super Admin Chart Options
  const saRevenueChartOptions = useChart({
    chart: {
      toolbar: { show: false },
    },
    colors: ['#3657D6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value}`,
      },
    },
  });

  const saTierChartOptions = useChart({
    colors: ['#3657D6', '#16A085', '#F4B740'],
    labels: ['Total Onboarded', 'Active Subscriptions', 'Pending / Suspended'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
  });

  // Society Admin Chart Options
  const socCollectionChartOptions = useChart({
    chart: {
      toolbar: { show: false },
    },
    colors: ['#E5EAF2', '#16A085'],
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value}`,
      },
    },
  });

  const socComplaintsChartOptions = useChart({
    colors: ['#FF5630', '#FFAB00', '#22C55E'],
    labels: ['Pending Triage', 'Assigned / In Progress', 'Resolved (Ready to Close)'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | Nivaasa</title>
      </Helmet>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: '700', mb: 0.5, color: '#1F2937' }}>
          Welcome back, {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Role: <Chip label={role.replace('_', ' ')} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
        </Typography>

        {/* -------------------- SUPER ADMIN VIEW -------------------- */}
        {role === 'SUPER_ADMIN' && saData && (
          <Grid container spacing={3}>
            {/* SA KPI Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Total Societies</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{saData.metrics.totalSocieties}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Active Tiers</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{saData.metrics.activeSocieties}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Registered Members</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{saData.metrics.totalResidents}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Open Tickets</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main', mt: 1 }}>{saData.metrics.openTickets}</Typography>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button variant="contained" fullWidth onClick={() => router.push(paths.dashboard.superAdmin.societies)} sx={{ backgroundColor: '#3657D6' }}>
                    Register New Society
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.superAdmin.support)}>
                    View Support Tickets
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.superAdmin.subscriptions)}>
                    Configure Subscription Plans
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Recent Registrations */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Latest Societies Onboarded</Typography>
                <List>
                  {saData.latestSocieties.map((soc) => (
                    <ListItem key={soc._id} sx={{ px: 0, py: 1.2, borderBottom: '1px solid #F1F5F9', '&:last-child': { border: 'none' } }}>
                      <ListItemText
                        primary={soc.name}
                        secondary={`${soc.city}, ${soc.state} | Code: ${soc.societyCode}`}
                      />
                      <Chip label={soc.subscriptionPlan} size="small" color="info" />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Platform Subscription Revenue Growth</Typography>
                <Box sx={{ p: 1, pb: 0 }}>
                  <Chart
                    dir="ltr"
                    type="area"
                    series={[
                      { name: 'Recurring Billing (INR)', data: [12000, 18000, 24000, 31000, 42000, 56000] }
                    ]}
                    options={saRevenueChartOptions}
                    width="100%"
                    height={320}
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Societies Active Status</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Chart
                    dir="ltr"
                    type="donut"
                    series={[
                      saData.metrics.totalSocieties || 1,
                      saData.metrics.activeSocieties || 0,
                      (saData.metrics.totalSocieties - saData.metrics.activeSocieties) || 0
                    ]}
                    options={saTierChartOptions}
                    width="100%"
                    height={280}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* -------------------- SOCIETY ADMIN VIEW -------------------- */}
        {role === 'ADMIN' && socData && (
          <Grid container spacing={3}>
            {/* KPI Cards */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Building Occupancy</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {socData.kpis.occupiedFlats}
                  <Typography component="span" variant="subtitle2" color="text.secondary"> / {socData.kpis.flatsCount} Flats</Typography>
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Total Incomes (Paid Maintenance)</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main', mt: 1 }}>₹{socData.kpis.totalIncome}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Unresolved Complaints</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main', mt: 1 }}>{socData.kpis.openComplaints}</Typography>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>General Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button variant="contained" fullWidth onClick={() => router.push(paths.dashboard.societyAdmin.residents)} sx={{ backgroundColor: '#3657D6' }}>
                    Onboard Residents
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.societyAdmin.maintenance)}>
                    Generate Monthly Bills
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.societyAdmin.communication)}>
                    Post Announcement
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Recent Notice board */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Current Notices</Typography>
                {socData.recentNotices?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No announcements currently published.</Typography>
                ) : (
                  <List>
                    {socData.recentNotices.map((n) => (
                      <ListItem key={n._id} sx={{ px: 0, py: 1, borderBottom: '1px solid #F1F5F9', '&:last-child': { border: 'none' } }}>
                        <ListItemText primary={n.title} secondary={`${n.description.slice(0, 80)}...`} />
                        <Chip label={n.priority} size="small" color={n.priority === 'CRITICAL' ? 'error' : 'default'} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Card>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Maintenance Assessments vs Collections Ledger</Typography>
                <Box sx={{ p: 1, pb: 0 }}>
                  <Chart
                    dir="ltr"
                    type="bar"
                    series={[
                      { name: 'Billed Amount', data: [75000, 80000, 85000, 85000, 90000, 95000] },
                      { name: 'Collected Amount', data: [68000, 72000, 81000, 79000, 88000, socData.kpis.totalIncome || 92000] }
                    ]}
                    options={socCollectionChartOptions}
                    width="100%"
                    height={320}
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Service Complaints Triage</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <Chart
                    dir="ltr"
                    type="donut"
                    series={[
                      socData.kpis.openComplaints || 0,
                      4,
                      2
                    ]}
                    options={socComplaintsChartOptions}
                    width="100%"
                    height={280}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* -------------------- RESIDENT VIEW -------------------- */}
        {role === 'MEMBER' && resData && (
          <Grid container spacing={3}>
            {/* Resident KPIs */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Outstanding Dues</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: resData.financials.totalOutstanding > 0 ? 'error.main' : 'success.main', mt: 1 }}>
                  ₹{resData.financials.totalOutstanding}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Active Support Tickets</Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>{resData.activeComplaintsCount}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
                <Typography variant="caption" color="text.secondary">Flat Mapped</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1.5 }}>
                  {resData.flat?.towerId?.name} - Unit {resData.flat?.flatNumber}
                </Typography>
              </Card>
            </Grid>

            {/* Shortcuts */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Resident Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button variant="contained" fullWidth onClick={() => router.push(paths.dashboard.resident.maintenance)} sx={{ backgroundColor: '#3657D6' }}>
                    Pay Dues & Get Receipt
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.resident.complaints)}>
                    File Maintenance Complaint
                  </Button>
                  <Button variant="outlined" fullWidth onClick={() => router.push(paths.dashboard.resident.community)}>
                    Open Community Forum
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* Notices feed */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px', height: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Notices</Typography>
                {resData.recentNotices?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No notices currently published.</Typography>
                ) : (
                  <List>
                    {resData.recentNotices.map((n) => (
                      <ListItem key={n._id} sx={{ px: 0, py: 1.2, borderBottom: '1px solid #F1F5F9', '&:last-child': { border: 'none' } }}>
                        <ListItemText primary={n.title} secondary={`${n.description.slice(0, 100)}...`} />
                        <Chip label={n.priority} size="small" color={n.priority === 'CRITICAL' ? 'error' : 'default'} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
