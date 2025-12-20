export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  LEADS: '/leads',
  LEAD_DETAIL: '/leads/:id',
  TASKS: '/tasks',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'crm_auth_token',
  USER_DATA: 'crm_user_data',
  THEME: 'crm_theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
} as const;
