'use client';

import * as React from 'react';
import { HazardSummaryCard } from './HazardSummaryCard';
import { MOCK_HAZARD_SUMMARIES } from '@/data/mockData';
import { useForecastStore } from '@/stores/forecastStore';
import type { HazardType } from '@/types/hazard';

interface HazardSummaryCardsProps {
  onHazardSelect?: (hazardType: HazardType) => void;
  activeHazard?: HazardType | null;
}

export function HazardSummaryCards({ onHazardSelect, activeHazard }: HazardSummaryCardsProps) {
  const { selectedOffset } = useForecastStore();

  // Get forecast data for current time to update probabilities
  const getCurrentProbability = (hazardType: HazardType) => {
    if (selectedOffset === 0) {
      return MOCK_HAZARD_SUMMARIES.find(s => s.type === hazardType)?.probability || 0;
    }
    // In a real app, this would come from forecast store
    return MOCK_HAZARD_SUMMARIES.find(s => s.type === hazardType)?.probability || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
      {MOCK_HAZARD_SUMMARIES.map((summary) => {
        const currentProb = getCurrentProbability(summary.type);
        const isActive = activeHazard === summary.type;

        return (
          <HazardSummaryCard
            key={summary.type}
            data={{
              ...summary,
              probability: currentProb,
            }}
            isActive={isActive}
            onClick={() => onHazardSelect?.(summary.type)}
          />
        );
      })}
    </div>
  );
}