/**
 * Map-related type definitions
 */

import maplibregl from 'maplibre-gl';

export interface MapSource {
  id: string;
  type: 'geojson' | 'raster' | 'vector';
  data?: GeoJSON.FeatureCollection | string;
  tiles?: string[];
  minzoom?: number;
  maxzoom?: number;
  attribution?: string;
}

export interface MapLayer {
  id: string;
  type: 'fill' | 'line' | 'circle' | 'heatmap' | 'raster' | 'symbol';
  source: string;
  'source-layer'?: string;
  filter?: maplibregl.Filter;
  paint?: maplibregl.AnyPaint;
  layout?: maplibregl.AnyLayout;
  minzoom?: number;
  maxzoom?: number;
}

export interface MapFeature {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: Record<string, unknown>;
  id?: string | number;
}

export interface RiskPolygonFeature extends MapFeature {
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  properties: {
    hazardType: 'cloudburst' | 'thunderstorm' | 'flash_flood';
    probability: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
    region: string;
    validTime: string;
    leadTime: string;
    metadata?: Record<string, unknown>;
  };
}

export interface HeatmapPointFeature extends MapFeature {
  geometry: GeoJSON.Point;
  properties: {
    hazardType: 'cloudburst' | 'thunderstorm' | 'flash_flood';
    intensity: number; // 0-1
    value: number; // actual meteorological value
    timestamp: string;
  };
}

export interface RegionMarkerFeature extends MapFeature {
  geometry: GeoJSON.Point;
  properties: {
    name: string;
    type: 'city' | 'district' | 'station' | 'observatory';
    hazardRisk: {
      cloudburst: number;
      thunderstorm: number;
      flash_flood: number;
    };
    population?: number;
    elevation?: number;
  };
}

export const INDIA_BOUNDS: [number, number, number, number] = [68.1, 6.7, 97.4, 37.1];
export const INDIA_CENTER: [number, number] = [78.9629, 20.5937];
export const DEFAULT_ZOOM = 4.5;

export const MAP_STYLES = {
  dark: 'https://demotiles.maplibre.org/style.json',
  light: 'https://demotiles.maplibre.org/style.json',
  satellite: 'https://api.maptiler.com/maps/satellite/style.json?key=YOUR_KEY',
} as const;

export interface MapEventHandlers {
  onLoad?: (map: maplibregl.Map) => void;
  onClick?: (e: maplibregl.MapMouseEvent) => void;
  onMoveEnd?: (e: maplibregl.MapEvent) => void;
  onZoomEnd?: (e: maplibregl.MapEvent) => void;
  onLayerClick?: (e: maplibregl.MapMouseEvent, feature: maplibregl.MapboxGeoJSONFeature) => void;
  onLayerHover?: (e: maplibregl.MapMouseEvent, feature: maplibregl.MapboxGeoJSONFeature | undefined) => void;
}

export const RISK_COLORS = {
  low: ['#22c55e', '#16a34a'],
  moderate: ['#f59e0b', '#d97706'],
  high: ['#ef4444', '#dc2626'],
  extreme: ['#7c2d12', '#991b1b'],
} as const;

export const RISK_COLOR_STOPS = {
  low: [
    [0, 'rgba(34, 197, 94, 0)'],
    [0.25, 'rgba(34, 197, 94, 0.3)'],
    [0.5, 'rgba(34, 197, 94, 0.6)'],
    [1, 'rgba(34, 197, 94, 0.9)'],
  ],
  moderate: [
    [0, 'rgba(245, 158, 11, 0)'],
    [0.25, 'rgba(245, 158, 11, 0.3)'],
    [0.5, 'rgba(245, 158, 11, 0.6)'],
    [1, 'rgba(245, 158, 11, 0.9)'],
  ],
  high: [
    [0, 'rgba(239, 68, 68, 0)'],
    [0.25, 'rgba(239, 68, 68, 0.3)'],
    [0.5, 'rgba(239, 68, 68, 0.6)'],
    [1, 'rgba(239, 68, 68, 0.9)'],
  ],
  extreme: [
    [0, 'rgba(124, 45, 18, 0)'],
    [0.25, 'rgba(124, 45, 18, 0.3)'],
    [0.5, 'rgba(124, 45, 18, 0.6)'],
    [1, 'rgba(124, 45, 18, 0.9)'],
  ],
} as const;

export function getRiskColorStops(riskLevel: 'low' | 'moderate' | 'high' | 'extreme') {
  return RISK_COLOR_STOPS[riskLevel];
}

export function getRiskFillColor(probability: number): string {
  if (probability >= 75) return '#7c2d12';
  if (probability >= 50) return '#ef4444';
  if (probability >= 25) return '#f59e0b';
  return '#22c55e';
}

export function getRiskFillOpacity(probability: number): number {
  return Math.max(0.3, Math.min(0.9, probability / 100));
}