/**
 * Mock data for the meteorological early warning dashboard
 * This simulates backend API responses for development
 */

import type {
  HazardSummary,
  HazardForecast,
  ActiveAlert,
  ForecastTimePoint,
  MapViewport,
  LayerConfig,
  DashboardState,
} from '@/types/hazard';
import type { HazardType, RiskLevel, TrendDirection } from '@/types/hazard';
import { getRiskLevel } from '@/types/hazard';
import { MAJOR_REGIONS } from '@/data/regions';

// Current timestamp for relative times
const NOW = new Date();
const ISO_NOW = NOW.toISOString();

export const MOCK_HAZARD_SUMMARIES: HazardSummary[] = [
  {
    type: 'cloudburst',
    label: 'Cloudburst Risk',
    icon: 'cloud-rain',
    currentRisk: 'high',
    probability: 68,
    affectedRegions: 12,
    leadTime: '2-4 hours',
    trend: 'up',
    trendValue: 15,
    lastUpdated: new Date(NOW.getTime() - 5 * 60000).toISOString(),
  },
  {
    type: 'thunderstorm',
    label: 'Severe Thunderstorm Risk',
    icon: 'cloud-lightning',
    currentRisk: 'moderate',
    probability: 42,
    affectedRegions: 8,
    leadTime: '3-6 hours',
    trend: 'stable',
    trendValue: 2,
    lastUpdated: new Date(NOW.getTime() - 5 * 60000).toISOString(),
  },
  {
    type: 'flash_flood',
    label: 'Flash Flood Risk',
    icon: 'waves',
    currentRisk: 'high',
    probability: 71,
    affectedRegions: 15,
    leadTime: '2-5 hours',
    trend: 'up',
    trendValue: 8,
    lastUpdated: new Date(NOW.getTime() - 5 * 60000).toISOString(),
  },
];

export const MOCK_ACTIVE_ALERTS: ActiveAlert[] = [
  {
    id: 'ALERT-2024-001',
    hazardType: 'flash_flood',
    location: 'Jaipur Region',
    coordinates: [75.7873, 26.9124],
    region: 'Jaipur, Rajasthan',
    riskLevel: 'high',
    probability: 82,
    expectedTime: new Date(NOW.getTime() + 3 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 30 * 60000).toISOString(),
    status: 'active',
    description: 'Intense rainfall expected over Jaipur district with accumulation exceeding 150mm in 3 hours. Urban flooding likely in low-lying areas.',
    metadata: {
      leadTime: '2-4 hours',
      affectedPopulation: 850000,
      affectedArea: 180,
      confidence: 87,
    },
  },
  {
    id: 'ALERT-2024-002',
    hazardType: 'cloudburst',
    location: 'Mumbai Metropolitan',
    coordinates: [72.8777, 19.0760],
    region: 'Mumbai, Maharashtra',
    riskLevel: 'extreme',
    probability: 91,
    expectedTime: new Date(NOW.getTime() + 1.5 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 15 * 60000).toISOString(),
    status: 'active',
    description: 'Cloudburst conditions developing over Mumbai with rainfall rates potentially exceeding 200mm/hour. Immediate precautionary measures advised.',
    metadata: {
      leadTime: '1-3 hours',
      affectedPopulation: 12400000,
      affectedArea: 320,
      confidence: 93,
    },
  },
  {
    id: 'ALERT-2024-003',
    hazardType: 'thunderstorm',
    location: 'Delhi NCR',
    coordinates: [77.2090, 28.6139],
    region: 'Delhi NCR',
    riskLevel: 'high',
    probability: 76,
    expectedTime: new Date(NOW.getTime() + 4 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 45 * 60000).toISOString(),
    status: 'active',
    description: 'Severe thunderstorm with hail (2-3cm) and wind gusts up to 100km/h expected. Risk of structural damage and power outages.',
    metadata: {
      leadTime: '3-6 hours',
      affectedPopulation: 22000000,
      affectedArea: 1484,
      confidence: 81,
    },
  },
  {
    id: 'ALERT-2024-004',
    hazardType: 'flash_flood',
    location: 'Chennai Coastal',
    coordinates: [80.2707, 13.0827],
    region: 'Chennai, Tamil Nadu',
    riskLevel: 'moderate',
    probability: 55,
    expectedTime: new Date(NOW.getTime() + 5 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 60 * 60000).toISOString(),
    status: 'active',
    description: 'Heavy rainfall expected over Chennai with potential for urban flooding. Drainage systems may be overwhelmed in 4-6 hours.',
    metadata: {
      leadTime: '4-6 hours',
      affectedPopulation: 4800000,
      affectedArea: 240,
      confidence: 72,
    },
  },
  {
    id: 'ALERT-2024-005',
    hazardType: 'cloudburst',
    location: 'Dehradun Valley',
    coordinates: [78.0322, 30.3165],
    region: 'Dehradun, Uttarakhand',
    riskLevel: 'high',
    probability: 69,
    expectedTime: new Date(NOW.getTime() + 2.5 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 20 * 60000).toISOString(),
    status: 'acknowledged',
    description: 'Orographic enhancement producing extreme rainfall rates in Doon Valley. Landslide risk elevated on hill slopes.',
    metadata: {
      leadTime: '2-3 hours',
      affectedPopulation: 280000,
      affectedArea: 85,
      confidence: 79,
    },
  },
  {
    id: 'ALERT-2024-006',
    hazardType: 'thunderstorm',
    location: 'Bengaluru Urban',
    coordinates: [77.5946, 12.9716],
    region: 'Bengaluru, Karnataka',
    riskLevel: 'moderate',
    probability: 48,
    expectedTime: new Date(NOW.getTime() + 5.5 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 90 * 60000).toISOString(),
    status: 'active',
    description: 'Scattered severe thunderstorms developing. Localized damaging winds and brief heavy rainfall possible.',
    metadata: {
      leadTime: '4-6 hours',
      affectedPopulation: 6200000,
      affectedArea: 380,
      confidence: 68,
    },
  },
  {
    id: 'ALERT-2024-007',
    hazardType: 'flash_flood',
    location: 'Guwahati Region',
    coordinates: [91.7362, 26.1445],
    region: 'Guwahati, Assam',
    riskLevel: 'high',
    probability: 74,
    expectedTime: new Date(NOW.getTime() + 3.5 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 40 * 60000).toISOString(),
    status: 'active',
    description: 'Brahmaputra tributaries rising rapidly. Flash flooding expected in low-lying areas of Guwahati metropolitan region.',
    metadata: {
      leadTime: '2-4 hours',
      affectedPopulation: 480000,
      affectedArea: 120,
      confidence: 83,
    },
  },
  {
    id: 'ALERT-2024-008',
    hazardType: 'cloudburst',
    location: 'Shimla Hills',
    coordinates: [77.1734, 31.1048],
    region: 'Shimla, Himachal Pradesh',
    riskLevel: 'moderate',
    probability: 38,
    expectedTime: new Date(NOW.getTime() + 6 * 3600000).toISOString(),
    issuedAt: new Date(NOW.getTime() - 120 * 60000).toISOString(),
    status: 'active',
    description: 'Cloudburst potential in upper Shimla hills. Tourist areas advised to exercise caution.',
    metadata: {
      leadTime: '4-6 hours',
      affectedPopulation: 85000,
      affectedArea: 45,
      confidence: 62,
    },
  },
];

function generateForecastData(
  hazardType: HazardType,
  baseProbability: number,
  regions: number
): HazardForecast[] {
  const forecasts: HazardForecast[] = [];
  const offsets = [0, 1, 2, 3, 4, 5, 6];

  offsets.forEach((offset, idx) => {
    const time = new Date(NOW.getTime() + offset * 3600000);
    // Add some variation to make it realistic
    const variation = (Math.random() - 0.5) * 20;
    const probability = Math.max(0, Math.min(100, baseProbability + variation + (offset * 3)));
    const riskLevel = getRiskLevel(probability);

    // Generate a simple grid of polygons for the affected area
    const features: GeoJSON.Feature<GeoJSON.Polygon>[] = [];
    for (let i = 0; i < Math.min(regions, 5); i++) {
      const region = MAJOR_REGIONS[i];
      const [lng, lat] = region.coordinates;
      const cellSize = 0.5;
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng - cellSize, lat - cellSize],
            [lng + cellSize, lat - cellSize],
            [lng + cellSize, lat + cellSize],
            [lng - cellSize, lat + cellSize],
            [lng - cellSize, lat - cellSize],
          ]],
        },
        properties: {
          hazardType,
          probability: Math.max(0, Math.min(100, probability + (Math.random() - 0.5) * 15)),
          riskLevel,
          region: region.name,
          validTime: time.toISOString(),
          leadTime: `${Math.max(1, offset)}h`,
        },
      });
    }

    forecasts.push({
      time: offset === 0 ? 'Now' : `+${offset}h`,
      hazardType,
      probability: Math.round(probability),
      riskLevel,
      affectedArea: {
        type: 'FeatureCollection',
        features,
      },
      metadata: {
        cape: 1500 + Math.random() * 1000,
        cin: 20 + Math.random() * 50,
        moisture: 40 + Math.random() * 20,
        windShear: 10 + Math.random() * 15,
        rainfall: Math.random() * 100,
      },
    });
  });

  return forecasts;
}

export const MOCK_FORECASTS: Record<HazardType, HazardForecast[]> = {
  cloudburst: generateForecastData('cloudburst', 68, 12),
  thunderstorm: generateForecastData('thunderstorm', 42, 8),
  flash_flood: generateForecastData('flash_flood', 71, 15),
};

export const MOCK_FORECAST_TIME_POINTS: ForecastTimePoint[] = [
  { offset: 0, label: 'Now', timestamp: NOW.toISOString(), isSelected: true },
  { offset: 1, label: '+1h', timestamp: new Date(NOW.getTime() + 1 * 3600000).toISOString(), isSelected: false },
  { offset: 2, label: '+2h', timestamp: new Date(NOW.getTime() + 2 * 3600000).toISOString(), isSelected: false },
  { offset: 3, label: '+3h', timestamp: new Date(NOW.getTime() + 3 * 3600000).toISOString(), isSelected: false },
  { offset: 4, label: '+4h', timestamp: new Date(NOW.getTime() + 4 * 3600000).toISOString(), isSelected: false },
  { offset: 5, label: '+5h', timestamp: new Date(NOW.getTime() + 5 * 3600000).toISOString(), isSelected: false },
  { offset: 6, label: '+6h', timestamp: new Date(NOW.getTime() + 6 * 3600000).toISOString(), isSelected: false },
];

export const MOCK_MAP_VIEWPORT: MapViewport = {
  center: [78.9629, 20.5937],
  zoom: 4.5,
  bearing: 0,
  pitch: 0,
};

export const MOCK_LAYER_CONFIGS: LayerConfig[] = [
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

export const MOCK_DASHBOARD_STATE: DashboardState = {
  selectedForecastOffset: 0,
  activeAlertId: 'ALERT-2024-001',
  mapViewport: MOCK_MAP_VIEWPORT,
  layerVisibility: MOCK_LAYER_CONFIGS.reduce((acc, layer) => {
    acc[layer.id] = layer.visible;
    return acc;
  }, {} as Record<string, boolean>),
  theme: 'dark',
};

export const MOCK_SYSTEM_STATUS = {
  status: 'operational' as const,
  lastDataUpdate: new Date(NOW.getTime() - 2 * 60000).toISOString(),
  apiStatus: 'connected' as const,
  wsStatus: 'connected' as const,
  activeAlerts: MOCK_ACTIVE_ALERTS.filter(a => a.status === 'active').length,
  dataLatency: 1240,
};

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'warning' as const,
    title: 'New Extreme Alert',
    message: 'Cloudburst warning issued for Mumbai Metropolitan',
    timestamp: new Date(NOW.getTime() - 10 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    type: 'info' as const,
    title: 'Model Update',
    message: 'IMDAA reanalysis data assimilated successfully',
    timestamp: new Date(NOW.getTime() - 30 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'success' as const,
    title: 'Alert Acknowledged',
    message: 'Dehradun Valley cloudburst alert acknowledged by district admin',
    timestamp: new Date(NOW.getTime() - 2 * 3600000).toISOString(),
    read: true,
  },
];

export const MOCK_USER = {
  id: 'user-001',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.kumar@imd.gov.in',
  role: 'admin' as const,
  avatar: null,
  preferences: {
    theme: 'dark' as const,
    notifications: true,
    autoRefresh: true,
    refreshInterval: 300,
  },
};

// Helper to get forecast for specific time offset
export function getForecastForTime(
  hazardType: HazardType,
  offset: number
): HazardForecast | undefined {
  return MOCK_FORECASTS[hazardType]?.find(f => {
    const forecastOffset = f.time === 'Now' ? 0 : parseInt(f.time.replace('+', '').replace('h', ''));
    return forecastOffset === offset;
  });
}

// Helper to get all hazards at a specific time
export function getAllHazardsAtTime(offset: number): HazardForecast[] {
  return Object.values(MOCK_FORECASTS).map(forecasts =>
    forecasts.find(f => {
      const forecastOffset = f.time === 'Now' ? 0 : parseInt(f.time.replace('+', '').replace('h', ''));
      return forecastOffset === offset;
    })
  ).filter(Boolean) as HazardForecast[];
}

// Generate heatmap points for a hazard type
export function generateHeatmapPoints(
  hazardType: HazardType,
  count: number = 200
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const features: GeoJSON.Feature<GeoJSON.Point>[] = [];
  const bounds = [68.1, 6.7, 97.4, 37.1]; // India bounds

  for (let i = 0; i < count; i++) {
    const lng = bounds[0] + Math.random() * (bounds[2] - bounds[0]);
    const lat = bounds[1] + Math.random() * (bounds[3] - bounds[1]);

    // Higher probability near certain regions
    let intensity = Math.random();
    MAJOR_REGIONS.forEach(region => {
      const [rLng, rLat] = region.coordinates;
      const dist = Math.sqrt(Math.pow(lng - rLng, 2) + Math.pow(lat - rLat, 2));
      if (dist < 2) intensity = Math.max(intensity, 0.7 + Math.random() * 0.3);
    });

    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {
        hazardType,
        intensity,
        value: intensity * 100,
        timestamp: ISO_NOW,
      },
    });
  }

  return { type: 'FeatureCollection', features };
}

// Generate region markers with hazard risk
export function generateRegionMarkers(): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const features = MAJOR_REGIONS.map(region => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: region.coordinates,
    },
    properties: {
      name: region.name,
      type: region.type,
      hazardRisk: {
        cloudburst: Math.random() * 80 + 10,
        thunderstorm: Math.random() * 70 + 10,
        flash_flood: Math.random() * 75 + 15,
      },
      population: region.population,
      elevation: region.elevation,
    },
  }));

  return { type: 'FeatureCollection', features };
}