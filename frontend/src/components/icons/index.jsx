/**
 * A small, dependency-free icon set. Each icon is a simple stroked SVG
 * sized via the `size` prop and colored via currentColor, so it picks
 * up text color from its parent automatically.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Icon({ size = 20, children, className = '', ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base} {...rest}>
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

export const CartIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="21" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="19" cy="21" r="1.3" fill="currentColor" stroke="none" />
    <path d="M2.5 3h2l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
  </Icon>
);

export const HeartIcon = ({ filled = false, ...props }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5s-7.5-4.6-10-9.4C0.3 7.7 1.8 4 5.4 3.3c2.2-0.4 4.2 0.7 5.6 2.6 1.4-1.9 3.4-3 5.6-2.6 3.6 0.7 5.1 4.4 3.4 7.8-2.5 4.8-10 9.4-10 9.4z" />
  </Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
    <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

export const ChevronLeftIcon = (props) => (
  <Icon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
);

export const ChevronRightIcon = (props) => (
  <Icon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

export const StarIcon = ({ filled = false, ...props }) => (
  <Icon {...props} fill={filled ? 'currentColor' : 'none'}>
    <polygon points="12 2.5 15.1 9 22.2 9.8 17 14.7 18.4 21.8 12 18.3 5.6 21.8 7 14.7 1.8 9.8 8.9 9 12 2.5" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <polyline points="20 6.5 9 17.5 4 12.5" />
  </Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <polyline points="3.5 6 5.5 6 20.5 6" />
    <path d="M9 6V4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4.5V6m2 0v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10z" />
    <line x1="10" y1="11" x2="10" y2="16" />
    <line x1="14" y1="11" x2="14" y2="16" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const MinusIcon = (props) => (
  <Icon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const DownloadIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3v12" />
    <polyline points="7 11 12 16 17 11" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Icon>
);

export const WhatsAppIcon = (props) => (
  <Icon {...props} strokeWidth={1.4}>
    <path d="M3.5 20.5L4.8 16A8.5 8.5 0 1 1 8 19.2L3.5 20.5z" fill="currentColor" fillOpacity="0.08" />
    <path d="M8.5 8.7c0.2-0.5 0.5-0.5 0.7-0.5h0.5c0.2 0 0.4 0 0.6 0.4 0.2 0.4 0.6 1.4 0.7 1.5 0.1 0.1 0.1 0.3 0 0.5-0.1 0.2-0.2 0.3-0.3 0.5-0.1 0.1-0.3 0.3-0.1 0.6 0.2 0.3 0.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5 0.3 0.1 0.5 0.1 0.6-0.1 0.2-0.2 0.6-0.7 0.8-0.9 0.2-0.2 0.4-0.2 0.6-0.1 0.2 0.1 1.5 0.7 1.8 0.8 0.3 0.1 0.4 0.2 0.5 0.3 0.1 0.2 0.1 0.9-0.2 1.7-0.3 0.8-1.6 1.5-2.2 1.6-0.6 0.1-1.1 0.2-3.5-0.7-3-1.2-4.8-4.2-4.9-4.4-0.1-0.2-1-1.4-1-2.6 0-1.2 0.6-1.8 0.8-2.1z" />
  </Icon>
);

export const InstagramIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const FacebookIcon = (props) => (
  <Icon {...props}>
    <path d="M15.5 8.5h-2a1 1 0 0 0-1 1V12h3l-0.4 3h-2.6v7h-3v-7H7.5v-3h2V9a4 4 0 0 1 4-4h2v3.5z" />
  </Icon>
);

export const TikTokIcon = (props) => (
  <Icon {...props}>
    <path d="M14 3v10.5a3 3 0 1 1-2.4-2.94" />
    <path d="M14 3c0.3 2.4 1.9 4.2 4.5 4.5" />
  </Icon>
);

export const MailIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <polyline points="3.5 6 12 13 20.5 6" />
  </Icon>
);

export const PhoneIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h3l1.5 4.5L7.5 10a13 13 0 0 0 6.5 6.5l1.5-2L20 16v3a1.5 1.5 0 0 1-1.6 1.5C12 20 4 12 4 5.6A1.5 1.5 0 0 1 5 4z" />
  </Icon>
);

export const LocationIcon = (props) => (
  <Icon {...props}>
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.3" />
  </Icon>
);

export const FilterIcon = (props) => (
  <Icon {...props}>
    <line x1="5" y1="6" x2="19" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6l7-3z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);

export const SparkleIcon = (props) => (
  <Icon {...props} fill="currentColor" stroke="none">
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
  </Icon>
);

export const ZapIcon = (props) => (
  <Icon {...props}>
    <polygon points="13 2 4 14 11 14 10 22 19 10 12 10 13 2" />
  </Icon>
);

export const LockIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
  </Icon>
);

export const RefreshIcon = (props) => (
  <Icon {...props}>
    <polyline points="4 4 4 9 9 9" />
    <path d="M4.5 14.5A8 8 0 1 0 6 7.5L4 9" />
  </Icon>
);

export const ArrowUpIcon = (props) => (
  <Icon {...props}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="6 11 12 5 18 11" />
  </Icon>
);

export const ImageIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.7" />
    <path d="M5 17l4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16l1.5-1.5a1.5 1.5 0 0 1 2.1 0L21 17" />
  </Icon>
);

export const EditIcon = (props) => (
  <Icon {...props}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Icon>
);

export const LogoutIcon = (props) => (
  <Icon {...props}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

export const PackageIcon = (props) => (
  <Icon {...props}>
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <line x1="12" y1="13" x2="12" y2="21" />
  </Icon>
);

export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Icon>
);

export const TrendingIcon = (props) => (
  <Icon {...props}>
    <polyline points="3 17 9.5 10.5 13.5 14.5 21 7" />
    <polyline points="15 7 21 7 21 13" />
  </Icon>
);
