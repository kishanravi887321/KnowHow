'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { formatProbability, getTrendIcon, getTrendLabel } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, AlertOctagon, Skull } from 'lucide-react';
import type { HazardSummary, RiskLevel } from '@/types/hazard';
import { getRiskConfig } from '@/data/riskLevels';

interface HazardSummaryCardProps {
  data: HazardSummary;
  onClick?: () => void;
  isActive?: boolean;
}

const RISK_ICONS: Record<RiskLevel, React.ComponentType<{ className?: string }>> = {
  low: CheckCircle,
  moderate: AlertTriangle,
  high: AlertOctagon,
  extreme: Skull,
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function HazardSummaryCard({ data, onClick, isActive }: HazardSummaryCardProps) {
  const riskConfig = getRiskConfig(data.currentRisk);
  const RiskIcon = RISK_ICONS[data.currentRisk];
  const TrendIcon = TREND_ICONS[data.trend];

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-yellow-500',
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        'hover:shadow-md',
        isActive && 'ring-2 ring-primary',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Risk level indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: riskConfig.color.dark }}
      />

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header with icon and hazard type */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: riskConfig.color.bg }}
              >
                <RiskIcon className="h-4 w-4" style={{ color: riskConfig.color.dark }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm truncate">{data.label}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {data.affectedRegions} region{data.affectedRegions !== 1 ? 's' : ''} affected
                </p>
              </div>
            </div>

            {/* Main probability display */}
            <div className="flex items-baseline gap-2 mb-3">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: riskConfig.color.dark }}
              >
                {formatProbability(data.probability)}
              </span>
              <Badge
                variant={
                  data.currentRisk === 'low' ? 'riskLow' :
                  data.currentRisk === 'moderate' ? 'riskModerate' :
                  data.currentRisk === 'high' ? 'riskHigh' : 'riskExtreme'
                }
                className="text-xs px-2 py-0.5"
              >
                {riskConfig.label}
              </Badge>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: riskConfig.color.dark }} />
                <span>Lead time: {data.leadTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={cn('h-3 w-3', trendColors[data.trend])}
                />
                <span className={cn('font-medium', trendColors[data.trend])}>
                  {getTrendLabel(data.trend, data.trendValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - mini sparkline or status */}
          <div className="flex flex-col items-end gap-1 hidden sm:block">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Last updated</p>
              <p className="text-xs font-mono">
                {new Date(data.lastUpdated).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Click hint */}
        {onClick && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Click for details</span>
            <span className="text-[10px] text-muted-foreground">→</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}