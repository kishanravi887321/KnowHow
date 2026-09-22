/**
 * Map state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapViewport, LayerConfig } from '@/types/hazard';
import { LAYER_CONFIGS } from '@/types/hazard';

interface MapState {
  // Viewport state
  viewport: MapViewport;
  setViewport: (viewport: Partial<MapViewport>) => void;

  // Layer visibility
  layerVisibility: Record<string, boolean>;
  layerOpacity: Record<string, number>;
  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;

  // Selected location
  selectedLocation: { coordinates: [number, number]; name: string } | null;
  setSelectedLocation: (location: { coordinates: [number, number]; name: string } | null) => void;

  // Map instance reference
  mapInstance: maplibregl.Map | null;
  setMapInstance: (map: maplibregl.Map | null) => void;

  // Layer configs
  layerConfigs: LayerConfig[];
  updateLayerConfig: (layerId: string, config: Partial<LayerConfig>) => void;

  // Reset to defaults
  resetViewport: () => void;
  resetLayers: () => void;
}

const DEFAULT_VIEWPORT: MapViewport = {
  center: [78.9629, 20.5937],
  zoom: 4.5,
  bearing: 0,
  pitch: 0,
};

const DEFAULT_LAYER_VISIBILITY = LAYER_CONFIGS.reduce((acc, layer) => {
  acc[layer.id] = layer.visible;
  return acc;
}, {} as Record<string, boolean>);

const DEFAULT_LAYER_OPACITY = LAYER_CONFIGS.reduce((acc, layer) => {
  acc[layer.id] = layer.opacity;
  return acc;
}, {} as Record<string, number>);

// Import maplibregl dynamically to avoid SSR issues
let maplibregl: typeof import('maplibre-gl') | null = null;
if (typeof window !== 'undefined') {
  import('maplibre-gl').then(m => { maplibregl = m; });
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      viewport: DEFAULT_VIEWPORT,
      setViewport: (viewport) =>
        set((state) => ({ viewport: { ...state.viewport, ...viewport } })),

      layerVisibility: DEFAULT_LAYER_VISIBILITY,
      layerOpacity: DEFAULT_LAYER_OPACITY,
      toggleLayer: (layerId) =>
        set((state) => ({
          layerVisibility: { ...state.layerVisibility, [layerId]: !state.layerVisibility[layerId] },
        })),
      setLayerOpacity: (layerId, opacity) =>
        set((state) => ({
          layerOpacity: { ...state.layerOpacity, [layerId]: Math.max(0, Math.min(1, opacity)) },
        })),
      setLayerVisibility: (layerId, visible) =>
        set((state) => ({
          layerVisibility: { ...state.layerVisibility, [layerId]: visible },
        })),

      selectedLocation: null,
      setSelectedLocation: (location) => set({ selectedLocation: location }),

      mapInstance: null,
      setMapInstance: (map) => set({ mapInstance: map }),

      layerConfigs: LAYER_CONFIGS,
      updateLayerConfig: (layerId, config) =>
        set((state) => ({
          layerConfigs: state.layerConfigs.map((layer) =>
            layer.id === layerId ? { ...layer, ...config } : layer
          ),
        })),

      resetViewport: () => set({ viewport: DEFAULT_VIEWPORT }),
      resetLayers: () =>
        set({
          layerVisibility: DEFAULT_LAYER_VISIBILITY,
          layerOpacity: DEFAULT_LAYER_OPACITY,
        }),
    }),
    {
      name: 'map-store',
      partialize: (state) => ({
        viewport: state.viewport,
        layerVisibility: state.layerVisibility,
        layerOpacity: state.layerOpacity,
      }),
    }
  )
);

// Selector hooks for performance
export const useMapViewport = () => useMapStore((state) => state.viewport);
export const useLayerVisibility = () => useMapStore((state) => state.layerVisibility);
export const useLayerOpacity = () => useMapStore((state) => state.layerOpacity);
export const useMapInstance = () => useMapStore((state) => state.mapInstance);
export const useSelectedLocation = () => useMapStore((state) => state.selectedLocation);