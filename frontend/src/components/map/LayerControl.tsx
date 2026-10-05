'use client';

import * as React from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, AlertTriangle, CloudRain, CloudLightning, Waves, Droplets, Wind, Mountain, Satellite, MapPin, Layers } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useMapStore } from '@/stores/mapStore';
import { LAYER_CONFIGS } from '@/types/hazard';
import { getRiskColor } from '@/data/riskLevels';

const LAYER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'cloudburst-risk': CloudRain,
  'thunderstorm-risk': CloudLightning,
  'flash-flood-risk': Waves,
  'rainfall': Droplets,
  'cape': Wind,
  'moisture': Droplets,
  'wind': Wind,
  'terrain': Mountain,
  'satellite': Satellite,
};

const LAYER_CATEGORIES = [
  { key: 'hazard', label: 'Hazard Risk', icon: AlertTriangle },
  { key: 'meteorological', label: 'Meteorological', icon: CloudRain },
  { key: 'base', label: 'Base Layers', icon: Layers },
] as const;

export function LayerControl() {
  const { layerVisibility, layerOpacity, toggleLayer, setLayerOpacity, setLayerVisibility, layerConfigs } = useMapStore();
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(['hazard', 'meteorological', 'base']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isCategoryExpanded = (category: string) => expandedCategories.includes(category);

  return (
    <div className="fixed left-4 top-20 z-30 lg:relative lg:top-0 lg:left-auto lg:z-auto">
      <div className="lg:hidden mb-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => toggleCategory('hazard')}
        >
          <Layers className="mr-2 h-4 w-4" />
          Map Layers
          {isCategoryExpanded('hazard') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className={cn(
        'bg-card border shadow-lg rounded-lg p-2 transition-all duration-200',
        'w-64 lg:w-72',
        'hidden lg:block'
      )}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Map Layers</h3>
        </div>

        <ScrollArea className="max-h-[500px]">
          <div className="space-y-3">
            {LAYER_CATEGORIES.map(({ key: categoryKey, label, icon: CategoryIcon }) => (
              <div key={categoryKey} className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn('w-full justify-between text-left px-1 py-1', !isCategoryExpanded(categoryKey) && 'text-muted-foreground')}
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium capitalize">{label}</span>
                  </div>
                  {isCategoryExpanded(categoryKey) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </Button>

                {isCategoryExpanded(categoryKey) && (
                  <div className="space-y-1 pl-6 border-l border-border/50">
                    {layerConfigs
                      .filter(l => l.category === categoryKey)
                      .map((layer) => (
                        <LayerControlItem
                          key={layer.id}
                          layer={layer}
                          visible={layerVisibility[layer.id]}
                          opacity={layerOpacity[layer.id]}
                          onToggle={toggleLayer}
                          onOpacityChange={setLayerOpacity}
                          onVisibilityChange={setLayerVisibility}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

interface LayerControlItemProps {
  layer: (typeof LAYER_CONFIGS)[0];
  visible: boolean;
  opacity: number;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onVisibilityChange: (id: string, visible: boolean) => void;
}

function LayerControlItem({ layer, visible, opacity, onToggle, onOpacityChange, onVisibilityChange }: LayerControlItemProps) {
  const Icon = LAYER_ICONS[layer.id] || MapPin;
  const [showOpacity, setShowOpacity] = React.useState(false);
  const isHazard = layer.category === 'hazard';

  return (
    <div className="group relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <label
              className={cn(
                'flex items-center gap-2 px-1 py-1.5 rounded cursor-pointer transition-colors',
                'hover:bg-accent/50',
                visible ? '' : 'opacity-60'
              )}
              onClick={(e) => {
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLLabelElement) return;
                onVisibilityChange(layer.id, !visible);
              }}
            >
              <Checkbox
                checked={visible}
                onCheckedChange={(checked) => onVisibilityChange(layer.id, checked as boolean)}
                className="h-4 w-4"
              />
              <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', isHazard && 'text-primary')} />
              <span className="text-xs font-medium truncate flex-1">{layer.label}</span>
              {isHazard && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getRiskColor('extreme') }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getRiskColor('high') }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getRiskColor('moderate') }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getRiskColor('low') }}
                  />
                </div>
              )}
            </label>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p className="text-xs">{layer.metadata?.description || `${layer.category} layer`}</p>
            {layer.metadata?.source && <p className="text-[10px] text-muted-foreground">Source: {layer.metadata.source}</p>}
            {layer.metadata?.resolution && <p className="text-[10px] text-muted-foreground">Resolution: {layer.metadata.resolution}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {visible && showOpacity && (
        <div className="mt-1 ml-6 flex items-center gap-2 px-1 pb-1">
          <span className="text-[10px] text-muted-foreground w-10">Opacity</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
            className="flex-1 h-1.5 appearance-none bg-muted rounded-full accent-primary"
          />
          <span className="text-[10px] text-muted-foreground w-10 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseEnter={() => setShowOpacity(true)}
        onMouseLeave={() => setShowOpacity(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowOpacity(!showOpacity);
          }}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}