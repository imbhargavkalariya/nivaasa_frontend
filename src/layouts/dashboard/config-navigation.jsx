import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const role = user?.role || 'MEMBER';

  const data = useMemo(() => {
    // ------------------ SUPER ADMIN NAV ------------------
    if (role === 'SUPER_ADMIN') {
      return [
        {
          subheader: 'Overview',
          items: [
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
              icon: ICONS.dashboard,
            },
          ],
        },
        {
          subheader: 'SaaS Platform',
          items: [
            {
              title: 'Societies',
              path: paths.dashboard.superAdmin.societies,
              icon: ICONS.ecommerce,
            },
            {
              title: 'Subscriptions',
              path: paths.dashboard.superAdmin.subscriptions,
              icon: ICONS.invoice,
            },
            {
              title: 'Platform Team',
              path: paths.dashboard.superAdmin.team,
              icon: ICONS.user,
            },
            {
              title: 'Support Tickets',
              path: paths.dashboard.superAdmin.support,
              icon: ICONS.chat,
            },
            {
              title: 'Revenue Analytics',
              path: paths.dashboard.superAdmin.analytics,
              icon: ICONS.analytics,
            },
            {
              title: 'System Settings',
              path: paths.dashboard.superAdmin.settings,
              icon: ICONS.folder,
            },
          ],
        },
      ];
    }

    // ------------------ SOCIETY ADMIN NAV ------------------
    if (role === 'ADMIN') {
      return [
        {
          subheader: 'Overview',
          items: [
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
              icon: ICONS.dashboard,
            },
            {
              title: 'Setup Wizard',
              path: paths.dashboard.societyAdmin.wizard,
              icon: ICONS.tour,
            },
            {
              title: 'Profile Settings',
              path: paths.dashboard.societyAdmin.profile,
              icon: ICONS.user,
            },
          ],
        },
        {
          subheader: 'Operations',
          items: [
            {
              title: 'Towers Wing',
              path: paths.dashboard.societyAdmin.towers,
              icon: ICONS.label,
            },
            {
              title: 'Flat Listing',
              path: paths.dashboard.societyAdmin.flats,
              icon: ICONS.ecommerce,
            },
            {
              title: 'Resident Roster',
              path: paths.dashboard.societyAdmin.residents,
              icon: ICONS.user,
            },
            {
              title: 'Maintenance',
              path: paths.dashboard.societyAdmin.maintenance,
              icon: ICONS.invoice,
            },
            {
              title: 'Financials',
              path: paths.dashboard.societyAdmin.financials,
              icon: ICONS.banking,
            },
            {
              title: 'Society Staff',
              path: paths.dashboard.societyAdmin.staff,
              icon: ICONS.booking,
            },
            {
              title: 'Notice Board',
              path: paths.dashboard.societyAdmin.communication,
              icon: ICONS.blog,
            },
            {
              title: 'Complaints desk',
              path: paths.dashboard.societyAdmin.complaints,
              icon: ICONS.chat,
            },
            {
              title: 'Reports Center',
              path: paths.dashboard.societyAdmin.reports,
              icon: ICONS.analytics,
            },
          ],
        },
      ];
    }

    // ------------------ RESIDENT MEMBER NAV ------------------
    return [
      {
        subheader: 'My Home',
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: 'Flat Household',
            path: paths.dashboard.resident.flat,
            icon: ICONS.user,
          },
          {
            title: 'Bills Receipts',
            path: paths.dashboard.resident.maintenance,
            icon: ICONS.invoice,
          },
          {
            title: 'Complaints',
            path: paths.dashboard.resident.complaints,
            icon: ICONS.chat,
          },
          {
            title: 'Community Feed',
            path: paths.dashboard.resident.community,
            icon: ICONS.blog,
          },
          {
            title: 'Emergency Staff',
            path: paths.dashboard.resident.directory,
            icon: ICONS.booking,
          },
          {
            title: 'Account Settings',
            path: paths.dashboard.resident.settings,
            icon: ICONS.folder,
          },
          {
            title: 'My Timeline',
            path: paths.dashboard.resident.timeline,
            icon: ICONS.calendar,
          },
        ],
      },
    ];
  }, [role]);

  return data;
}
