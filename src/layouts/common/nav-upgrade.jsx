import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

const getRoleLabel = (role) => {
  if (!role) return '';
  switch (role.toUpperCase()) {
    case 'SUPERADMIN':
      return 'Super Admin';
    case 'SOCIETYADMIN':
      return 'Society Admin';
    case 'MEMBER':
      return 'Resident';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
};

const getRoleColor = (role) => {
  if (!role) return 'info';
  const r = role.toUpperCase();
  if (r === 'SUPERADMIN') return 'error';
  if (r === 'SOCIETYADMIN') return 'primary';
  return 'info';
};

export default function NavUpgrade() {
  const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 4,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box>
          <Avatar src={user?.photoURL} alt={user?.name} sx={{ width: 48, height: 48, mx: 'auto' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, width: 1 }} alignItems="center">
          <Typography variant="subtitle2" noWrap sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Label
              color={getRoleColor(user?.role)}
              variant="soft"
            >
              {getRoleLabel(user?.role)}
            </Label>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
