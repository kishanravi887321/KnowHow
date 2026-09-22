/**
 * Forecast state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HazardForecast, ForecastTimePoint, HazardType } from '@/types/hazard';
import { MOCK_FORECASTS, MOCK_FORECAST_TIME_POINTS, getAllHazardsAtTime } from '@/data/mockData';

interface ForecastState {
  // Time selection
  timePoints: ForecastTimePoint[];
  selectedOffset: number;
  setSelectedOffset: (offset: number) => void;
  setTimePoints: (points: ForecastTimePoint[]) => void;

  // Forecast data
  forecasts: Record<HazardType, HazardForecast[]>;
  setForecasts: (forecasts: Record<HazardType, HazardForecast[]>) => void;
  updateForecast: (hazardType: HazardType, forecasts: HazardForecast[]) => void;

  // Computed
  getCurrentForecasts: () => HazardForecast[];
  getForecastForHazard: (hazardType: HazardType) => HazardForecast | undefined;
  getSelectedTimePoint: () => ForecastTimePoint | undefined;
}

export const useForecastStore = create<ForecastState>()(
  persist(
    (set, get) => ({
      timePoints: MOCK_FORECAST_TIME_POINTS,
      selectedOffset: 0,
      setSelectedOffset: (offset) =>
        set((state) => ({
          selectedOffset: offset,
          timePoints: state.timePoints.map((tp) => ({
            ...tp,
            isSelected: tp.offset === offset,
          })),
        })),
      setTimePoints: (points) => set({ timePoints: points }),

      forecasts: MOCK_FORECASTS,
      setForecasts: (forecasts) => set({ forecasts }),
      updateForecast: (hazardType, forecasts) =>
        set((state) => ({
          forecasts: { ...state.forecasts, [hazardType]: forecasts },
        })),

      getCurrentForecasts: () => {
        const { selectedOffset } = get();
        return getAllHazardsAtTime(selectedOffset);
      },

      getForecastForHazard: (hazardType) => {
        const { forecasts, selectedOffset } = get();
        return forecasts[hazardType]?.find((f) => {
          const forecastOffset = f.time === 'Now' ? 0 : parseInt(f.time.replace('+', '').replace('h', ''));
          return forecastOffset === selectedOffset;
        });
      },

      getSelectedTimePoint: () => {
        const { timePoints, selectedOffset } = get();
        return timePoints.find((tp) => tp.offset === selectedOffset);
      },
    }),
    {
      name: 'forecast-store',
      partialize: (state) => ({
        selectedOffset: state.selectedOffset,
      }),
    }
  )
);

// Selector hooks
export const useSelectedForecastOffset = () => useForecastStore((state) => state.selectedOffset);
export const useForecastTimePoints = () => useForecastStore((state) => state.timePoints);
export const useCurrentForecasts = () => useForecastStore((state) => state.getCurrentForecasts());
export const useSelectedTimePoint = () => useForecastStore((state) => state.getSelectedTimePoint());