/**
 * Alert state management using Zustand
 */

import { create } from 'zustand';
import type { ActiveAlert, AlertStatus } from '@/types/hazard';
import { MOCK_ACTIVE_ALERTS } from '@/data/mockData';

interface AlertState {
  alerts: ActiveAlert[];
  selectedAlertId: string | null;
  filter: {
    hazardTypes: string[];
    riskLevels: string[];
    statuses: AlertStatus[];
    searchQuery: string;
  };
  sort: {
    key: keyof ActiveAlert | 'expectedTime' | 'issuedAt' | 'probability';
    direction: 'asc' | 'desc';
  };

  // Actions
  setAlerts: (alerts: ActiveAlert[]) => void;
  addAlert: (alert: ActiveAlert) => void;
  updateAlert: (id: string, updates: Partial<ActiveAlert>) => void;
  removeAlert: (id: string) => void;
  selectAlert: (id: string | null) => void;
  acknowledgeAlert: (id: string) => void;

  // Filters
  setHazardTypeFilter: (types: string[]) => void;
  setRiskLevelFilter: (levels: string[]) => void;
  setStatusFilter: (statuses: AlertStatus[]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Sorting
  setSort: (key: AlertState['sort']['key'], direction?: 'asc' | 'desc') => void;

  // Computed
  getFilteredAlerts: () => ActiveAlert[];
  getSelectedAlert: () => ActiveAlert | null;
  getAlertCountByRisk: () => Record<string, number>;
  getAlertCountByHazard: () => Record<string, number>;
  getAlertCountByStatus: () => Record<string, number>;
}

const DEFAULT_FILTER = {
  hazardTypes: ['cloudburst', 'thunderstorm', 'flash_flood'],
  riskLevels: ['low', 'moderate', 'high', 'extreme'],
  statuses: ['active', 'acknowledged'] as AlertStatus[],
  searchQuery: '',
};

const DEFAULT_SORT = {
  key: 'expectedTime' as const,
  direction: 'asc' as const,
};

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: MOCK_ACTIVE_ALERTS,
  selectedAlertId: MOCK_ACTIVE_ALERTS[0]?.id || null,
  filter: DEFAULT_FILTER,
  sort: DEFAULT_SORT,

  setAlerts: (alerts) => set({ alerts }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      selectedAlertId: state.selectedAlertId || alert.id,
    })),

  updateAlert: (id, updates) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, ...updates } : alert
      ),
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
      selectedAlertId: state.selectedAlertId === id ? null : state.selectedAlertId,
    })),

  selectAlert: (id) => set({ selectedAlertId: id }),

  acknowledgeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, status: 'acknowledged' as AlertStatus } : alert
      ),
    })),

  setHazardTypeFilter: (types) =>
    set((state) => ({ filter: { ...state.filter, hazardTypes: types } })),

  setRiskLevelFilter: (levels) =>
    set((state) => ({ filter: { ...state.filter, riskLevels: levels } })),

  setStatusFilter: (statuses) =>
    set((state) => ({ filter: { ...state.filter, statuses } })),

  setSearchQuery: (query) =>
    set((state) => ({ filter: { ...state.filter, searchQuery: query } })),

  clearFilters: () => set({ filter: DEFAULT_FILTER }),

  setSort: (key, direction) =>
    set((state) => ({
      sort: {
        key,
        direction: direction || (state.sort.key === key && state.sort.direction === 'asc' ? 'desc' : 'asc'),
      },
    })),

  getFilteredAlerts: () => {
    const { alerts, filter, sort } = get();
    let filtered = alerts.filter((alert) => {
      if (!filter.hazardTypes.includes(alert.hazardType)) return false;
      if (!filter.riskLevels.includes(alert.riskLevel)) return false;
      if (!filter.statuses.includes(alert.status)) return false;
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        if (
          !alert.location.toLowerCase().includes(query) &&
          !alert.region.toLowerCase().includes(query) &&
          !alert.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: unknown = a[sort.key];
      let bVal: unknown = b[sort.key];

      if (sort.key === 'expectedTime' || sort.key === 'issuedAt') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  },

  getSelectedAlert: () => {
    const { alerts, selectedAlertId } = get();
    return alerts.find((a) => a.id === selectedAlertId) || null;
  },

  getAlertCountByRisk: () => {
    const { alerts } = get();
    return alerts.reduce((acc, alert) => {
      acc[alert.riskLevel] = (acc[alert.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getAlertCountByHazard: () => {
    const { alerts } = get();
    return alerts.reduce((acc, alert) => {
      acc[alert.hazardType] = (acc[alert.hazardType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getAlertCountByStatus: () => {
    const { alerts } = get();
    return alerts.reduce((acc, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
}));

// Selector hooks
export const useAlerts = () => useAlertStore((state) => state.alerts);
export const useFilteredAlerts = () => useAlertStore((state) => state.getFilteredAlerts());
export const useSelectedAlert = () => useAlertStore((state) => state.getSelectedAlert());
export const useSelectedAlertId = () => useAlertStore((state) => state.selectedAlertId);
export const useAlertFilters = () => useAlertStore((state) => state.filter);
export const useAlertSort = () => useAlertStore((state) => state.sort);
export const useAlertCounts = () => useAlertStore((state) => ({
  byRisk: state.getAlertCountByRisk(),
  byHazard: state.getAlertCountByHazard(),
  byStatus: state.getAlertCountByStatus(),
}));