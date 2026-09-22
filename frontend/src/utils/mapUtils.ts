/**
 * Map utility functions for MapLibre GL JS
 */

import maplibregl from 'maplibre-gl';
import type { MapViewport, RiskPolygonFeature, LayerConfig } from '@/types';

export function createMapContainer(
  container: HTMLElement,
  options: maplibregl.MapOptions
): maplibregl.Map {
  return new maplibregl.Map({
    container,
    style: options.style || 'https://demotiles.maplibre.org/style.json',
    center: options.center || [78.9629, 20.5937],
    zoom: options.zoom || 4.5,
    minZoom: options.minZoom || 3,
    maxZoom: options.maxZoom || 18,
    pitch: options.pitch || 0,
    bearing: options.bearing || 0,
    antialias: true,
    preserveDrawingBuffer: false,
    ...options,
  });
}

export function getViewport(map: maplibregl.Map): MapViewport {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
}

export function fitBounds(
  map: maplibregl.Map,
  bounds: maplibregl.LngLatBoundsLike,
  options?: maplibregl.FitBoundsOptions
): void {
  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 12,
    duration: 1000,
    ...options,
  });
}

export function flyToLocation(
  map: maplibregl.Map,
  coordinates: [number, number],
  zoom = 10,
  options?: Partial<maplibregl.AnimationOptions>
): void {
  map.flyTo({
    center: coordinates,
    zoom,
    duration: 1500,
    essential: true,
    ...options,
  });
}

export function createGeoJSONSource(
  id: string,
  data: GeoJSON.FeatureCollection | GeoJSON.Feature | null
): maplibregl.GeoJSONSourceSpecification {
  return {
    type: 'geojson',
    data: data || { type: 'FeatureCollection', features: [] },
    generateId: true,
    cluster: false,
    maxzoom: 14,
  };
}

export function createRasterSource(
  id: string,
  tiles: string[],
  options?: { minzoom?: number; maxzoom?: number; attribution?: string }
): maplibregl.RasterSourceSpecification {
  return {
    type: 'raster',
    tiles,
    minzoom: options?.minzoom ?? 0,
    maxzoom: options?.maxzoom ?? 18,
    attribution: options?.attribution,
    tileSize: 256,
  };
}

export function createHeatmapLayer(
  id: string,
  sourceId: string,
  options: {
    weightProperty?: string;
    intensity?: number;
    radius?: number;
    opacity?: number;
    colorStops?: [number, string][];
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.HeatmapLayerSpecification {
  return {
    id,
    type: 'heatmap',
    source: sourceId,
    minzoom: options.minzoom ?? 3,
    maxzoom: options.maxzoom ?? 14,
    paint: {
      'heatmap-weight': options.weightProperty
        ? ['get', options.weightProperty]
        : 1,
      'heatmap-intensity': options.intensity ?? 1,
      'heatmap-radius': options.radius ?? 30,
      'heatmap-opacity': options.opacity ?? 0.8,
      'heatmap-color': options.colorStops ?? [
        [0, 'rgba(34, 197, 94, 0)'],
        [0.25, 'rgba(34, 197, 94, 0.3)'],
        [0.5, 'rgba(34, 197, 94, 0.6)'],
        [0.75, 'rgba(245, 158, 11, 0.7)'],
        [1, 'rgba(239, 68, 68, 0.9)'],
      ],
    },
  };
}

export function createFillLayer(
  id: string,
  sourceId: string,
  options: {
    colorProperty?: string;
    opacity?: number;
    outlineColor?: string;
    outlineWidth?: number;
    filter?: maplibregl.Filter;
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.FillLayerSpecification {
  return {
    id,
    type: 'fill',
    source: sourceId,
    filter: options.filter,
    minzoom: options.minzoom ?? 3,
    maxzoom: options.maxzoom ?? 18,
    paint: {
      'fill-color': options.colorProperty
        ? ['get', options.colorProperty]
        : '#22c55e',
      'fill-opacity': options.opacity ?? 0.6,
      'fill-outline-color': options.outlineColor ?? 'transparent',
    },
    layout: {
      visibility: 'visible',
    },
  };
}

export function createLineLayer(
  id: string,
  sourceId: string,
  options: {
    color?: string;
    width?: number;
    dashArray?: number[];
    opacity?: number;
    filter?: maplibregl.Filter;
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.LineLayerSpecification {
  return {
    id,
    type: 'line',
    source: sourceId,
    filter: options.filter,
    minzoom: options.minzoom ?? 3,
    maxzoom: options.maxzoom ?? 18,
    paint: {
      'line-color': options.color ?? '#22c55e',
      'line-width': options.width ?? 2,
      'line-dasharray': options.dashArray,
      'line-opacity': options.opacity ?? 0.8,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
      visibility: 'visible',
    },
  };
}

export function createCircleLayer(
  id: string,
  sourceId: string,
  options: {
    radius?: number | maplibregl.Expression;
    color?: string | maplibregl.Expression;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    filter?: maplibregl.Filter;
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.CircleLayerSpecification {
  return {
    id,
    type: 'circle',
    source: sourceId,
    filter: options.filter,
    minzoom: options.minzoom ?? 3,
    maxzoom: options.maxzoom ?? 18,
    paint: {
      'circle-radius': options.radius ?? 6,
      'circle-color': options.color ?? '#22c55e',
      'circle-stroke-color': options.strokeColor ?? '#ffffff',
      'circle-stroke-width': options.strokeWidth ?? 2,
      'circle-opacity': options.opacity ?? 0.9,
    },
    layout: {
      visibility: 'visible',
    },
  };
}

export function createSymbolLayer(
  id: string,
  sourceId: string,
  options: {
    textField?: string | maplibregl.Expression;
    textSize?: number;
    textFont?: string[];
    textColor?: string;
    textHaloColor?: string;
    textHaloWidth?: number;
    iconImage?: string;
    iconSize?: number;
    filter?: maplibregl.Filter;
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.SymbolLayerSpecification {
  return {
    id,
    type: 'symbol',
    source: sourceId,
    filter: options.filter,
    minzoom: options.minzoom ?? 3,
    maxzoom: options.maxzoom ?? 18,
    layout: {
      'text-field': options.textField,
      'text-size': options.textSize ?? 12,
      'text-font': options.textFont ?? ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-anchor': 'top',
      'text-offset': [0, 1],
      'icon-image': options.iconImage,
      'icon-size': options.iconSize ?? 1,
      'icon-allow-overlap': true,
      'text-allow-overlap': true,
      visibility: 'visible',
    },
    paint: {
      'text-color': options.textColor ?? '#ffffff',
      'text-halo-color': options.textHaloColor ?? '#000000',
      'text-halo-width': options.textHaloWidth ?? 2,
    },
  };
}

export function createRasterLayer(
  id: string,
  sourceId: string,
  options: {
    opacity?: number;
    filter?: maplibregl.Filter;
    minzoom?: number;
    maxzoom?: number;
  } = {}
): maplibregl.RasterLayerSpecification {
  return {
    id,
    type: 'raster',
    source: sourceId,
    filter: options.filter,
    minzoom: options.minzoom ?? 0,
    maxzoom: options.maxzoom ?? 18,
    paint: {
      'raster-opacity': options.opacity ?? 0.7,
      'raster-fade-duration': 300,
    },
    layout: {
      visibility: 'visible',
    },
  };
}

export function generateRiskPolygonGrid(
  bounds: [number, number, number, number],
  cellSize: number,
  hazardType: 'cloudburst' | 'thunderstorm' | 'flash_flood',
  baseProbability: number
): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const features: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

  for (let lng = minLng; lng < maxLng; lng += cellSize) {
    for (let lat = minLat; lat < maxLat; lat += cellSize) {
      // Add some spatial variation
      const variation = (Math.random() - 0.5) * 30;
      const probability = Math.max(0, Math.min(100, baseProbability + variation));

      let riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
      if (probability >= 75) riskLevel = 'extreme';
      else if (probability >= 50) riskLevel = 'high';
      else if (probability >= 25) riskLevel = 'moderate';
      else riskLevel = 'low';

      const polygon: GeoJSON.Polygon = {
        type: 'Polygon',
        coordinates: [[
          [lng, lat],
          [lng + cellSize, lat],
          [lng + cellSize, lat + cellSize],
          [lng, lat + cellSize],
          [lng, lat],
        ]],
      };

      features.push({
        type: 'Feature',
        geometry: polygon,
        properties: {
          hazardType,
          probability,
          riskLevel,
          region: `Grid ${Math.floor((lng - minLng) / cellSize)},${Math.floor((lat - minLat) / cellSize)}`,
          validTime: new Date().toISOString(),
          leadTime: '2-4 hours',
        },
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

export function createRiskColorExpression(hazardType: string): maplibregl.Expression {
  return [
    'interpolate',
    ['linear'],
    ['get', 'probability'],
    0, 'rgba(34, 197, 94, 0)',
    25, 'rgba(34, 197, 94, 0.4)',
    50, 'rgba(245, 158, 11, 0.6)',
    75, 'rgba(239, 68, 68, 0.8)',
    100, 'rgba(124, 45, 18, 0.95)',
  ];
}

export function createRiskOutlineExpression(hazardType: string): maplibregl.Expression {
  return [
    'interpolate',
    ['linear'],
    ['get', 'probability'],
    0, 'rgba(34, 197, 94, 0)',
    25, 'rgba(34, 197, 94, 0.6)',
    50, 'rgba(245, 158, 11, 0.8)',
    75, 'rgba(239, 68, 68, 1)',
    100, 'rgba(124, 45, 18, 1)',
  ];
}

export const LAYER_ORDER = [
  'terrain',
  'satellite',
  'rainfall',
  'cape',
  'moisture',
  'wind',
  'cloudburst-risk',
  'thunderstorm-risk',
  'flash-flood-risk',
] as const;

export function getLayerZIndex(layerId: string): number {
  const index = LAYER_ORDER.indexOf(layerId as typeof LAYER_ORDER[number]);
  return index >= 0 ? index + 1 : 999;
}