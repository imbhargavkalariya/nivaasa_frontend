import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { residentApi } from 'src/api/nivaasa';

export default function MyTimelinePage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await residentApi.getTimeline();
        if (res.success) {
          setLogs(res.logs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: '700px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>My Activity Logs</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Review chronological activity alerts and change logs tracked on your resident account.</Typography>

      <Card sx={{ p: 3, border: '1px solid #E5EAF2', borderRadius: '16px' }}>
        {logs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No activity logs recorded.
          </Typography>
        ) : (
          <List>
            {logs.map((log) => (
              <ListItem key={log._id} sx={{ py: 1.5, px: 1, borderBottom: '1px solid #F1F5F9', '&:last-child': { border: 'none' } }}>
                <Box sx={{ p: 1, backgroundColor: '#EFF6FF', borderRadius: '8px', color: '#3657D6', mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="solar:history-bold-duotone" />
                </Box>
                <ListItemText
                  primary={log.description}
                  secondary={`${new Date(log.createdAt).toLocaleString()} | IP: ${log.ipAddress || '127.0.0.1'}`}
                  primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: '600' } }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
}
