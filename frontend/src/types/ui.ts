/**
 * UI state type definitions
 */

export type Theme = 'light' | 'dark' | 'system';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
  preferences: {
    theme: Theme;
    notifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // seconds
  };
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance' | 'offline';
  lastDataUpdate: string;
  apiStatus: 'connected' | 'disconnected' | 'error';
  wsStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  activeAlerts: number;
  dataLatency: number; // milliseconds
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: unknown;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface ToastProps {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retry?: () => void;
}

export interface DataTableState<T> {
  data: T[];
  pagination: PaginationState;
  sort: SortState | null;
  filters: FilterState;
  selection: string[];
  loading: LoadingState;
  error: ErrorState;
}