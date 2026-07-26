import { useState } from 'react';
import { useScroll } from 'framer-motion';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import ScrollProgress from 'src/components/scroll-progress';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      title: 'Member Management',
      desc: 'Seamlessly onboard and track residents, owners, tenants, and family members in a centralized directory.',
      icon: 'solar:users-group-rounded-bold',
      color: '#3657D6',
    },
    {
      title: 'Tower & Wing Structure',
      desc: 'Map multiple wings, towers, floor levels, and unit lists matching your community layout layout.',
      icon: 'solar:home-2-bold',
      color: '#16A085',
    },
    {
      title: 'Auto Maintenance Billing',
      desc: 'Generate monthly maintenance assessments in bulk with configurable flat rates or area-based billing.',
      icon: 'solar:card-recive-bold',
      color: '#F4B740',
    },
    {
      title: 'Income & Expense Ledger',
      desc: 'Maintain transparent audit trails for society maintenance collections and vendor expense listings.',
      icon: 'solar:wad-of-money-bold',
      color: '#E0466E',
    },
    {
      title: 'Complaint Resolution Desk',
      desc: 'Enable residents to lodge maintenance tickets. Track assignments, categories, and resolution progress.',
      icon: 'solar:danger-triangle-bold',
      color: '#8E44AD',
    },
    {
      title: 'Digital Notice Board',
      desc: 'Publish announcements and critical notices to all residents instantly via email and dashboard alerts.',
      icon: 'solar:clipboard-list-bold',
      color: '#2980B9',
    },
    {
      title: 'Community Feed & Posts',
      desc: 'Foster neighborhood communication with secure discussions, updates, and community feed updates.',
      icon: 'solar:chat-round-dots-bold',
      color: '#27AE60',
    },
    {
      title: 'Reports & Analytics',
      desc: 'Generate collection ledgers, dues lists, and monthly financial statements at the click of a button.',
      icon: 'solar:graph-up-bold',
      color: '#E67E22',
    },
    {
      title: 'Secure Role Access',
      desc: 'Custom access controls tailored specifically for Platform Super Admins, Society Admins, and Residents.',
      icon: 'solar:shield-keyhole-bold',
      color: '#1D2A52',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Onboard Society',
      desc: 'Super Admin creates the society record and configures plan tiers on the master dashboard.',
    },
    {
      step: '02',
      title: 'Configure Layout',
      desc: 'Society Admin defines sectors, blocks, wings, and generates units in bulk with sequential numbering.',
    },
    {
      step: '03',
      title: 'Invite Residents',
      desc: 'Owners and tenants receive their login details automatically via secure SMTP invite emails.',
    },
    {
      step: '04',
      title: 'Manage Digitally',
      desc: 'Pay bills, lodge complaints, track assets, and post notices seamlessly from any web device.',
    },
  ];

  const benefits = [
    { title: 'Zero Setup Hassle', desc: 'Auto-generate 100+ flats instantly with bulk creation.' },
    { title: 'Cloud-Based Safety', desc: 'Secure database architecture keeping resident records private.' },
    { title: 'Responsive Design', desc: 'Looks stunning on laptop screens, tablets, and smartphones.' },
    { title: 'Financial Transparency', desc: 'Detailed ledgers showing all collections and expenses.' },
  ];

  const roles = [
    {
      role: 'Super Admin',
      icon: 'solar:shield-user-bold',
      desc: 'Master platform administrator responsible for onboarding new societies, configuring subscription rates, and managing support tickets globally.',
    },
    {
      role: 'Society Admin',
      icon: 'solar:user-bold',
      desc: 'Local committee administrator managing building configuration, generating bills, reviewing complaints, and managing resident credentials.',
    },
    {
      role: 'Resident Member',
      icon: 'solar:users-group-rounded-bold',
      desc: 'Homeowner or tenant viewing invoices, recording maintenance payments, lodging service tickets, and participating in community discussion feeds.',
    },
  ];

  const faqData = [
    {
      q: 'What is Nivaasa?',
      a: 'Nivaasa is a comprehensive, cloud-based Society and Community Management Platform that helps residential complexes, apartments, and gated societies manage daily operations, maintenance payments, and communication.',
    },
    {
      q: 'Does it support independent bungalows and tenements?',
      a: 'Yes! Nivaasa supports both apartment structures (towers $\\rightarrow$ floors $\\rightarrow$ flats) and independent layouts (villas, plots, row houses, tenements) with dynamic labeling and simple sequential numbering.',
    },
    {
      q: 'Can residents pay maintenance bills online?',
      a: 'Absolutely. Residents can track billing invoices, review payment receipts, and record offline payments directly from their private dashboards.',
    },
    {
      q: 'Is my society data secure?',
      a: 'Security is our core priority. Nivaasa utilizes JWT auth tokens, secure password encryption, and strict database isolation filters to ensure your society data remains safe and private.',
    },
  ];

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          pt: { xs: 16, md: 20 },
          pb: { xs: 10, md: 16 },
          background: 'linear-gradient(135deg, #1D2A52 0%, #0F172A 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Gradients */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            bgcolor: '#3657D6',
            filter: 'blur(150px)',
            borderRadius: '50%',
            opacity: 0.15,
            top: -100,
            right: -100,
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            bgcolor: '#16A085',
            filter: 'blur(120px)',
            borderRadius: '50%',
            opacity: 0.1,
            bottom: -50,
            left: -50,
            zIndex: 1,
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 10 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: '800',
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  lineHeight: 1.15,
                  mb: 2.5,
                  background: 'linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Modern Society & Community Management Made Simple
              </Typography>
              <Typography variant="body1" sx={{ color: '#94A3B8', fontSize: '1.1rem', mb: 4.5, lineHeight: 1.6 }}>
                Nivaasa helps residential societies digitally manage members, maintenance bills, tower structures, visitor tickets, and community conversations from one secure, premium platform.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  href="/auth/jwt/login"
                  variant="contained"
                  sx={{
                    bgcolor: '#3657D6',
                    '&:hover': { bgcolor: '#2748C9' },
                    borderRadius: '14px',
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </Grid>

            {/* Premium Simulated UI Preview Widget */}
            <Grid xs={12} md={6}>
              <Card
                sx={{
                  p: 2.5,
                  bgcolor: '#1E293B',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  color: 'white',
                }}
              >
                {/* Header Mock */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: '800', letterSpacing: 1 }}>NIVAASA SECURE PORTAL</Typography>
                </Stack>

                <Grid container spacing={2}>
                  {/* Sidebar Mock */}
                  <Grid xs={3.5}>
                    <Stack spacing={1}>
                      {/* Active Dashboard item */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, bgcolor: 'rgba(54,87,214,0.15)', borderRadius: '8px', borderLeft: '3px solid #3657D6' }}>
                        <Iconify icon="solar:widget-bold" sx={{ color: '#3657D6', fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Dashboard</Typography>
                      </Stack>
                      {/* Inactive Tower item */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, color: '#64748B' }}>
                        <Iconify icon="solar:home-2-bold" sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Towers</Typography>
                      </Stack>
                      {/* Inactive Residents item */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, color: '#64748B' }}>
                        <Iconify icon="solar:users-group-rounded-bold" sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Residents</Typography>
                      </Stack>
                      {/* Inactive Maintenance item */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, color: '#64748B' }}>
                        <Iconify icon="solar:card-recive-bold" sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Billing</Typography>
                      </Stack>
                      {/* Inactive Complaints item */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, color: '#64748B' }}>
                        <Iconify icon="solar:danger-triangle-bold" sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Complaints</Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Dashboard Content Mock */}
                  <Grid xs={8.5}>
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Collected</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: '800', color: '#10B981', mt: 0.2 }}>₹92,000</Typography>
                          <Typography variant="caption" sx={{ color: '#10B981', display: 'block', fontSize: '0.65rem', fontWeight: 'bold' }}>+12.4% this mo.</Typography>
                        </Box>
                      </Grid>
                      <Grid xs={6}>
                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>Overdue Dues</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: '800', color: '#EF4444', mt: 0.2 }}>₹14,500</Typography>
                          <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', fontSize: '0.65rem', fontWeight: 'bold' }}>8 flats pending</Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', height: 160 }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 'bold' }}>Collections History (INR)</Typography>
                          {/* Simulated bar chart columns */}
                          <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ height: 95, mt: 1, px: 1 }}>
                            <Stack alignItems="center" spacing={0.5} sx={{ height: 1 }}>
                              <Box sx={{ width: 16, height: '40%', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Feb</Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={0.5} sx={{ height: 1 }}>
                              <Box sx={{ width: 16, height: '55%', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Mar</Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={0.5} sx={{ height: 1 }}>
                              <Box sx={{ width: 16, height: '70%', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>Apr</Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={0.5} sx={{ height: 1 }}>
                              <Box sx={{ width: 16, height: '80%', bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />
                              <Typography sx={{ fontSize: '0.65rem', color: '#64748B' }}>May</Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={0.5} sx={{ height: 1 }}>
                              <Box sx={{ width: 16, height: '95%', bgcolor: '#3657D6', borderRadius: '4px' }} />
                              <Typography sx={{ fontSize: '0.65rem', color: 'white', fontWeight: 'bold' }}>Jun</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 12, bgcolor: '#F8FAFC' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#3657D6', fontWeight: 'bold', letterSpacing: 1.5 }}>CORE PLATFORM FEATURES</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, color: '#1D2A52' }}>Everything You Need in One Secure Portal</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Say goodbye to paper ledger books, spreadsheet billing errors, and manual notice printouts.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feat) => (
              <Grid xs={12} sm={6} md={4} key={feat.title}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    border: '1px solid #E5EAF2',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                      borderColor: '#3657D6',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: `${feat.color}15`,
                      color: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Iconify icon={feat.icon} width={24} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1D2A52' }}>{feat.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>{feat.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Solutions / How It Works Section */}
      <Box id="solutions" sx={{ py: 12, bgcolor: 'white' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#16A085', fontWeight: 'bold', letterSpacing: 1.5 }}>WORKFLOW</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, color: '#1D2A52' }}>How Nivaasa Works</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto' }}>
              We have designed the onboarding experience to be quick, intuitive, and error-free.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {workflowSteps.map((step) => (
              <Grid xs={12} sm={6} md={3} key={step.step}>
                <Box sx={{ position: 'relative', p: 1 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: '900',
                      color: 'rgba(54,87,214,0.06)',
                      position: 'absolute',
                      top: -15,
                      left: 0,
                      fontSize: '5rem',
                      zIndex: 1,
                    }}
                  >
                    {step.step}
                  </Typography>
                  <Box sx={{ position: 'relative', zIndex: 2, pt: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1D2A52' }}>{step.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>{step.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Who Can Use & Benefits Row */}
      <Box sx={{ py: 12, bgcolor: '#F8FAFC' }}>
        <Container>
          <Grid container spacing={8} alignItems="center">
            <Grid xs={12} md={6}>
              <Typography variant="overline" sx={{ color: '#3657D6', fontWeight: 'bold', letterSpacing: 1.5 }}>BENEFITS</Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 4, color: '#1D2A52' }}>Why Communities Choose Nivaasa</Typography>
              <Stack spacing={3.5}>
                {benefits.map((b) => (
                  <Stack direction="row" spacing={2.5} key={b.title}>
                    <Box sx={{ color: '#16A085', mt: 0.5 }}>
                      <Iconify icon="solar:check-circle-bold" width={24} />
                    </Box>
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5, color: '#1D2A52' }}>{b.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{b.desc}</Typography>
                    </div>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* Target Stakeholders */}
            <Grid xs={12} md={6}>
              <Box sx={{ bgcolor: 'white', p: 4, borderRadius: '24px', border: '1px solid #E5EAF2', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1D2A52' }}>Who Can Use Nivaasa?</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#3657D6' }}>Society Management Committees</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Secretaries, chairpersons, and treasurers aiming to simplify record accounting and billing.</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#3657D6' }}>Builders & Developers</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Maintain operational support handovers and tower bill tracking during initial construction phases.</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#3657D6' }}>Gated Suburbs & Row Houses</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Manage independent tenement addresses and billing templates from a single block-level system.</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Role-Based Visualizer Section */}
      <Box sx={{ py: 12, bgcolor: 'white' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#3657D6', fontWeight: 'bold', letterSpacing: 1.5 }}>ROLES & RESPONSIBILITIES</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, color: '#1D2A52' }}>Custom Roles Built For Collaboration</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Three visual user dashboards designed for different levels of society workflow access.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {roles.map((r) => (
              <Grid xs={12} md={4} key={r.role}>
                <Card sx={{ p: 4, borderRadius: '20px', border: '1px solid #E5EAF2', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: 'rgba(54,87,214,0.1)', color: '#3657D6', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <Iconify icon={r.icon} width={22} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1D2A52' }}>{r.role}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{r.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 12, bgcolor: '#F8FAFC' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#16A085', fontWeight: 'bold', letterSpacing: 1.5 }}>TESTIMONIALS</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, color: '#1D2A52' }}>Praise From Society Admins</Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: '20px', border: '1px solid #E5EAF2' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                  &quot;Nivaasa has completely changed how we run our society in Surat. Auto-generating 140 bills used to take our treasurer two days; now it takes exactly two minutes.&quot;
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#3657D6' }}>PK</Avatar>
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Pritesh Kalariya</Typography>
                    <Typography variant="caption" color="text.secondary">Secretary, Gokuldham Residency</Typography>
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: '20px', border: '1px solid #E5EAF2' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                  &quot;The transparency Nivaasa provides is excellent. Residents can instantly view their collection receipts and track support tickets on their phones, minimizing calls to the board.&quot;
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#16A085' }}>BP</Avatar>
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Bhargav Patel</Typography>
                    <Typography variant="caption" color="text.secondary">President, Vesu Heights Complex</Typography>
                  </div>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQs Section */}
      <Box id="pricing" sx={{ py: 12, bgcolor: 'white' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#3657D6', fontWeight: 'bold', letterSpacing: 1.5 }}>QUESTIONS & ANSWERS</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, mb: 2, color: '#1D2A52' }}>Frequently Asked Questions</Typography>
          </Box>

          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            {faqData.map((faq, index) => (
              <Accordion
                key={faq.q}
                expanded={activeFaq === index}
                onChange={() => setActiveFaq(activeFaq === index ? null : index)}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                  border: '1px solid #E5EAF2',
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="solar:alt-arrow-down-bold" />}
                  sx={{ py: 1, '& .MuiAccordionSummary-expandIconWrapper': { color: '#3657D6' } }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1D2A52' }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 3.5, px: 3, borderTop: '1px solid #F1F5F9' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        id="contact"
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #1D2A52 0%, #0F172A 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            bgcolor: '#16A085',
            filter: 'blur(150px)',
            borderRadius: '50%',
            opacity: 0.1,
            bottom: -200,
            right: -100,
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: '800', mb: 2, color: 'white' }}>Digitize Your Society Complex Today</Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto', mb: 5, fontSize: '1.05rem' }}>
            Empower your residents with clear logs, transparent financials, and modern digital communication desks.
          </Typography>
          <Stack direction="row" spacing={2.5} justifyContent="center">
            <Button
              component="a"
              href="mailto:info@nivaasa.com"
              variant="contained"
              sx={{
                bgcolor: '#16A085',
                '&:hover': { bgcolor: '#128C73' },
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
