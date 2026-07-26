import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  CardContent,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { residentApi } from 'src/api/nivaasa';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await residentApi.getEmergencyContacts();
        if (res.success) {
          setContacts(res.emergencyContacts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContacts();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>Emergency Contact Directory</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Access phone numbers for society administration staff, security gates, and municipal utility providers.</Typography>

      <Grid container spacing={3.5}>
        {contacts.map((c, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ border: '1px solid #E5EAF2', borderRadius: '16px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: '#FEF2F2', borderRadius: '12px', color: '#EF4444' }}>
                  <Iconify icon="solar:phone-calling-bold-duotone" width={32} />
                </Box>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{c.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 'bold', mt: 0.5 }}>{c.phone}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.role}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
