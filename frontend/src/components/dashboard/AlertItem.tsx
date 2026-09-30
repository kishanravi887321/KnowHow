'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { formatTimeRemaining, formatTimestamp } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, AlertTriangle, CheckCircle, AlertOctagon, Skull, ChevronRight, ExternalLink } from 'lucide-react';
import type { ActiveAlert, RiskLevel } from '@/types/hazard';
import { getRiskConfig } from '@/data/riskLevels';
import { getHazardConfig } from '@/data/riskLevels';

interface AlertItemProps {
  alert: ActiveAlert;
  isSelected: boolean;
  onClick: () => void;
  onFocusMap: () => void;
  onAcknowledge?: () => void;
}

const STATUS_ICONS = {
  active: AlertTriangle,
  acknowledged: CheckCircle,
  expired: Clock,
  cancelled: AlertOctagon,
};

const STATUS_LABELS = {
  active: 'Active',
  acknowledged: 'Acknowledged',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export function AlertItem({ alert, isSelected, onClick, onFocusMap, onAcknowledge }: AlertItemProps) {
  const riskConfig = getRiskConfig(alert.riskLevel);
  const hazardConfig = getHazardConfig(alert.hazardType);
  const StatusIcon = STATUS_ICONS[alert.status];

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        'hover:shadow-md',
        isSelected && 'ring-2 ring-primary bg-primary/5',
        'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Risk level indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: riskConfig.color.dark }}
      />

      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Left: Hazard type and risk badge */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: riskConfig.color.bg }}
            >
              <StatusIcon
                className="h-5 w-5"
                style={{ color: riskConfig.color.dark }}
              />
            </div>
            <Badge
              variant={
                alert.riskLevel === 'low' ? 'riskLow' :
                alert.riskLevel === 'moderate' ? 'riskModerate' :
                alert.riskLevel === 'high' ? 'riskHigh' : 'riskExtreme'
              }
              className="text-[10px] px-2 py-0.5 whitespace-nowrap"
            >
              {riskConfig.label}
            </Badge>
          </div>

          {/* Center: Alert details */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm truncate">{alert.location}</h4>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                    {hazardConfig.shortLabel}
                  </Badge>
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded',
                      alert.status === 'active' && 'bg-red-500/10 text-red-500',
                      alert.status === 'acknowledged' && 'bg-green-500/10 text-green-500',
                      alert.status === 'expired' && 'bg-gray-500/10 text-gray-500',
                      alert.status === 'cancelled' && 'bg-gray-500/10 text-gray-500'
                    )}
                  >
                    {STATUS_LABELS[alert.status]}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {alert.region}
                </p>
              </div>
            </div>

            {/* Probability and time */}
            <div className="flex items-center gap-4 text-xs mb-2">
              <div className="flex items-center gap-1">
                <span
                  className="font-mono font-bold"
                  style={{ color: riskConfig.color.dark }}
                >
                  {alert.probability}%
                </span>
                <span className="text-muted-foreground">probability</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeRemaining(alert.expectedTime)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>
                  {alert.coordinates[1].toFixed(3)}°N, {alert.coordinates[0].toFixed(3)}°E
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {alert.description}
            </p>

            {/* Metadata badges */}
            <div className="flex flex-wrap gap-1.5">
              {alert.metadata.leadTime && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  Lead: {alert.metadata.leadTime}
                </Badge>
              )}
              {alert.metadata.affectedPopulation && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  Pop: {(alert.metadata.affectedPopulation / 100000).toFixed(1)}L
                </Badge>
              )}
              {alert.metadata.affectedArea && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  Area: {alert.metadata.affectedArea} km²
                </Badge>
              )}
              {alert.metadata.confidence && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  Conf: {alert.metadata.confidence}%
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onFocusMap();
              }}
              title="Focus on map"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {alert.status === 'active' && onAcknowledge && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[10px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge();
                }}
              >
                Acknowledge
              </Button>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <Separator className="my-2" />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Issued: {formatTimestamp(alert.issuedAt, { hour: '2-digit', minute: '2-digit' })}</span>
          <span>ID: {alert.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}