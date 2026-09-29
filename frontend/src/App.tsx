'use client';

import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { DashboardLayout } from '@/components/layout';
import {
  MapContainer,
  MapLayers,
  LayerControl,
  MapLegend,
  MapSearch,
} from '@/components/map';
import {
  HazardSummaryCards,
  AlertPanel,
  ForecastTimeline,
} from '@/components/dashboard';
import { useMapStore } from '@/stores/mapStore';
import { useForecastStore } from '@/stores/forecastStore';
import { useUIStore } from '@/stores/uiStore';
import { MOCK_HAZARD_SUMMARIES } from '@/data/mockData';
import type { HazardType } from '@/types/hazard';

function DashboardContent() {
  const mapInstance = useMapStore((state) => state.mapInstance);
  const { selectedOffset } = useForecastStore();
  const { resolvedTheme } = useUIStore();
  const [activeHazard, setActiveHazard] = React.useState<HazardType | null>(null);

  // Handle layer click to show alert details
  const handleLayerClick = React.useCallback(
    (e: React.MouseEvent, feature: any) => {
      const hazardType = feature.properties?.hazardType;
      if (hazardType) {
        setActiveHazard(hazardType);
      }
    },
    []
  );

  // Handle layer hover for tooltip
  const handleLayerHover = React.useCallback(
    (e: React.MouseEvent, feature: any | undefined) => {
      // Could show tooltip with probability info
    },
    []
  );

  const handleMapClick = React.useCallback((e: any) => {
    // Click on map background - could deselect alert
  }, []);

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      {/* Map Section - Left/Center */}
      <div className="flex-1 relative min-w-0">
        <MapContainer
          onMapLoad={(map) => {
            // Map loaded callback
          }}
          onMapClick={handleMapClick}
          onLayerClick={handleLayerClick}
          onLayerHover={handleLayerHover}
        />
        <MapLayers map={mapInstance} />

        {/* Map Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 top-20 z-30 pointer-events-auto lg:relative lg:top-0 lg:left-auto lg:z-auto">
            <LayerControl />
          </div>

          <div className="absolute right-4 top-20 z-30 pointer-events-auto lg:relative lg:top-0 lg:right-auto lg:z-auto">
            <MapLegend activeHazard={activeHazard} />
          </div>

          <div className="absolute left-4 top-20 z-30 pointer-events-auto lg:relative lg:top-0 lg:left-auto lg:z-auto lg:ml-4">
            <MapSearch map={mapInstance} />
          </div>
        </div>
      </div>

      {/* Right Panel - Alerts */}
      <div className="hidden lg:block w-96 flex-shrink-0 border-l bg-card">
        <AlertPanel />
      </div>

      {/* Mobile bottom sheet for alerts would go here */}
    </div>
  );
}

function DashboardHeader() {
  const { timePoints, selectedOffset } = useForecastStore();
  const currentTimePoint = timePoints[selectedOffset];

  return (
    <div className="border-b p-3 lg:p-4 bg-card/50 backdrop-blur">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {selectedOffset === 0 ? 'Current Conditions' : `Forecast: ${currentTimePoint?.label}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedOffset === 0
              ? 'Live AI-generated hazard probabilities'
              : `Predicted risk at ${new Date(currentTimePoint?.timestamp || '').toLocaleString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HazardSummaryCards
            onHazardSelect={setActiveHazard}
            activeHazard={activeHazard}
          />
        </div>
      </div>
    </div>
  );
}

// We need to move activeHazard state to a context or store for sharing
// For now, let's create a wrapper component

function DashboardWithState() {
  const [activeHazard, setActiveHazard] = React.useState<HazardType | null>(null);

  return (
    <DashboardLayout
      header={
        <div className="border-b p-3 lg:p-4 bg-card/50 backdrop-blur">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {useForecastStore.getState().selectedOffset === 0
                  ? 'Current Conditions'
                  : `Forecast: +${useForecastStore.getState().selectedOffset}h`}
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-generated hyper-local hazard probabilities
              </p>
            </div>
            <HazardSummaryCards
              onHazardSelect={setActiveHazard}
              activeHazard={activeHazard}
            />
          </div>
        </div>
      }
    >
      <div className="flex h-full w-full relative overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative min-w-0">
          <MapContainer />
          <MapLayers map={useMapStore.getState().mapInstance} />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-4 top-0 z-30 pointer-events-auto lg:relative lg:top-0 lg:left-auto lg:z-auto lg:mt-4">
              <LayerControl />
            </div>

            <div className="absolute right-4 top-0 z-30 pointer-events-auto lg:relative lg:top-0 lg:right-auto lg:z-auto lg:mt-4">
              <MapLegend activeHazard={activeHazard} />
            </div>

            <div className="absolute left-4 top-0 z-30 pointer-events-auto lg:relative lg:top-0 lg:left-auto lg:z-auto lg:mt-4 lg:ml-4">
              <MapSearch map={useMapStore.getState().mapInstance} />
            </div>
          </div>
        </div>

        {/* Right Panel - Alerts */}
        <div className="hidden lg:block w-96 flex-shrink-0 border-l bg-card">
          <AlertPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function App() {
  const { resolvedTheme } = useUIStore();

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <TooltipProvider>
      <div className={cn('min-h-screen w-full', resolvedTheme === 'dark' ? 'dark' : 'light')}>
        <DashboardWithState />
        <ForecastTimeline />
      </div>
    </TooltipProvider>
  );
}