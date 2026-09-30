'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { AlertItem } from './AlertItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Filter, X, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock, AlertOctagon } from 'lucide-react';
import { useAlertStore } from '@/stores/alertStore';
import type { AlertStatus, RiskLevel, HazardType } from '@/types/hazard';
import { getRiskConfig } from '@/data/riskLevels';

const RISK_LEVELS: RiskLevel[] = ['extreme', 'high', 'moderate', 'low'];
const HAZARD_TYPES: HazardType[] = ['cloudburst', 'thunderstorm', 'flash_flood'];
const STATUSES: AlertStatus[] = ['active', 'acknowledged', 'expired', 'cancelled'];

const HAZARD_LABELS: Record<HazardType, string> = {
  cloudburst: 'Cloudburst',
  thunderstorm: 'Thunderstorm',
  flash_flood: 'Flash Flood',
};

const STATUS_LABELS: Record<AlertStatus, string> = {
  active: 'Active',
  acknowledged: 'Acknowledged',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const STATUS_ICONS: Record<AlertStatus, React.ComponentType<{ className?: string }>> = {
  active: AlertTriangle,
  acknowledged: CheckCircle,
  expired: Clock,
  cancelled: AlertOctagon,
};

export function AlertPanel() {
  const {
    selectedAlertId,
    filter,
    sort,
    selectAlert,
    acknowledgeAlert,
    setHazardTypeFilter,
    setRiskLevelFilter,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    setSort,
    getFilteredAlerts,
  } = useAlertStore();

  const alerts = getFilteredAlerts();

  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQueryState] = React.useState('');

  React.useEffect(() => {
    setSearchQueryState(filter.searchQuery);
  }, [filter.searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQueryState(value);
    setSearchQuery(value);
  };

  const hasActiveFilters =
    filter.hazardTypes.length !== HAZARD_TYPES.length ||
    filter.riskLevels.length !== RISK_LEVELS.length ||
    filter.statuses.length !== STATUSES.length ||
    filter.searchQuery;

  return (
    <div className="fixed right-4 top-20 z-30 lg:relative lg:top-0 lg:right-auto lg:z-auto h-[calc(100vh-5.5rem)] flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-3 border-b bg-card/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">Active Alerts</h2>
          <Badge variant="secondary" className="text-[10px]">
            {alerts.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowFilters(!showFilters)}
            title={showFilters ? 'Hide filters' : 'Show filters'}
          >
            <Filter className={cn('h-4 w-4', hasActiveFilters && 'text-primary')} />
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={clearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-3 border-b space-y-3 bg-muted/30">
          {/* Search */}
          <div className="relative">
            <AlertTriangle className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search alerts..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Hazard Type Filter */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Hazard Type
            </label>
            <div className="flex flex-wrap gap-1">
              {HAZARD_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setHazardTypeFilter(
                      filter.hazardTypes.includes(type)
                        ? filter.hazardTypes.filter(t => t !== type)
                        : [...filter.hazardTypes, type]
                    )
                  }
                  className={cn(
                    'px-2 py-1 rounded text-[10px] font-medium transition-colors',
                    filter.hazardTypes.includes(type)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted-foreground/50'
                  )}
                >
                  {HAZARD_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Risk Level
            </label>
            <div className="flex flex-wrap gap-1">
              {RISK_LEVELS.map((level) => {
                const config = getRiskConfig(level);
                return (
                  <button
                    key={level}
                    onClick={() =>
                      setRiskLevelFilter(
                        filter.riskLevels.includes(level)
                          ? filter.riskLevels.filter(l => l !== level)
                          : [...filter.riskLevels, level]
                      )
                    }
                    className={cn(
                      'px-2 py-1 rounded text-[10px] font-medium transition-colors',
                      filter.riskLevels.includes(level)
                        ? `bg-[${config.color.dark}] text-white`
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/50'
                    )}
                    style={
                      filter.riskLevels.includes(level)
                        ? { backgroundColor: config.color.dark, color: 'white' }
                        : undefined
                    }
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Status
            </label>
            <div className="flex flex-wrap gap-1">
              {STATUSES.map((status) => {
                const Icon = STATUS_ICONS[status];
                return (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(
                        filter.statuses.includes(status)
                          ? filter.statuses.filter(s => s !== status)
                          : [...filter.statuses, status]
                      )
                    }
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
                      filter.statuses.includes(status)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted-foreground/50'
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Sort By
            </label>
            <div className="flex flex-wrap gap-1">
              {([
                { key: 'expectedTime', label: 'Expected Time' },
                { key: 'issuedAt', label: 'Issued Time' },
                { key: 'probability', label: 'Probability' },
                { key: 'riskLevel', label: 'Risk Level' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors',
                    sort.key === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted-foreground/50'
                  )}
                >
                  {label}
                  {sort.key === key && (
                    sort.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert List */}
      <ScrollArea className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-2">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 opacity-30 mb-3" />
              <p className="text-sm">No alerts match current filters</p>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="mt-2" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                isSelected={selectedAlertId === alert.id}
                onClick={() => selectAlert(alert.id)}
                onFocusMap={() => selectAlert(alert.id)}
                onAcknowledge={() => acknowledgeAlert(alert.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{alerts.length} of {useAlertStore.getState().alerts.length} alerts</span>
          <span>Auto-refresh: 30s</span>
        </div>
      </div>
    </div>
  );
}