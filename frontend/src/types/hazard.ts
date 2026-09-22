/**
 * Core type definitions for the meteorological early warning system
 */

export type HazardType = 'cloudburst' | 'thunderstorm' | 'flash_flood';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme';
export type AlertStatus = 'active' | 'acknowledged' | 'expired' | 'cancelled';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface RiskThresholds {
  low: { min: number; max: number };
  moderate: { min: number; max: number };
  high: { min: number; max: number };
  extreme: { min: number; max: number };
}

export const RISK_THRESHOLDS: RiskThresholds = {
  low: { min: 0, max: 25 },
  moderate: { min: 25, max: 50 },
  high: { min: 50, max: 75 },
  extreme: { min: 75, max: 100 },
};

export function getRiskLevel(probability: number): RiskLevel {
  if (probability >= RISK_THRESHOLDS.extreme.min) return 'extreme';
  if (probability >= RISK_THRESHOLDS.high.min) return 'high';
  if (probability >= RISK_THRESHOLDS.moderate.min) return 'moderate';
  return 'low';
}

export interface HazardSummary {
  type: HazardType;
  label: string;
  icon: string;
  currentRisk: RiskLevel;
  probability: number;
  affectedRegions: number;
  leadTime: string; // e.g., "2-4 hours"
  trend: TrendDirection;
  trendValue: number; // percentage change
  lastUpdated: string; // ISO timestamp
}

export interface HazardForecast {
  time: string; // ISO timestamp or offset like "+1h"
  hazardType: HazardType;
  probability: number;
  riskLevel: RiskLevel;
  affectedArea: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
  metadata: {
    cape?: number;
    cin?: number;
    moisture?: number;
    windShear?: number;
    rainfall?: number;
  };
}

export interface ActiveAlert {
  id: string;
  hazardType: HazardType;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  region: string;
  riskLevel: RiskLevel;
  probability: number;
  expectedTime: string; // ISO timestamp
  issuedAt: string; // ISO timestamp
  status: AlertStatus;
  description: string;
  metadata: {
    leadTime: string;
    affectedPopulation?: number;
    affectedArea?: number; // sq km
    confidence?: number;
  };
}

export interface ForecastTimePoint {
  offset: number; // hours from now (0-6)
  label: string; // "Now", "+1h", "+2h", etc.
  timestamp: string; // ISO timestamp
  isSelected: boolean;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface LayerConfig {
  id: string;
  label: string;
  category: 'hazard' | 'meteorological' | 'base';
  visible: boolean;
  opacity: number;
  metadata?: {
    source?: string;
    updateFrequency?: string;
    resolution?: string;
  };
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { id: 'cloudburst-risk', label: 'Cloudburst Risk', category: 'hazard', visible: true, opacity: 0.8 },
  { id: 'thunderstorm-risk', label: 'Thunderstorm Risk', category: 'hazard', visible: false, opacity: 0.8 },
  { id: 'flash-flood-risk', label: 'Flash Flood Risk', category: 'hazard', visible: false, opacity: 0.8 },
  { id: 'rainfall', label: 'Rainfall (QPE)', category: 'meteorological', visible: false, opacity: 0.7 },
  { id: 'cape', label: 'CAPE', category: 'meteorological', visible: false, opacity: 0.6 },
  { id: 'moisture', label: 'Moisture / IWV', category: 'meteorological', visible: false, opacity: 0.6 },
  { id: 'wind', label: 'Wind / Shear', category: 'meteorological', visible: false, opacity: 0.6 },
  { id: 'terrain', label: 'Terrain', category: 'base', visible: true, opacity: 0.5 },
  { id: 'satellite', label: 'Satellite', category: 'base', visible: false, opacity: 0.7 },
];

export interface DashboardState {
  selectedForecastOffset: number;
  activeAlertId: string | null;
  mapViewport: MapViewport;
  layerVisibility: Record<string, boolean>;
  theme: 'light' | 'dark';
}