'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, Clock, FastForward, Rewind } from 'lucide-react';
import { useForecastStore } from '@/stores/forecastStore';
import type { ForecastTimePoint } from '@/types/hazard';

interface ForecastTimelineProps {
  className?: string;
}

export function ForecastTimeline({ className }: ForecastTimelineProps) {
  const {
    timePoints,
    selectedOffset,
    setSelectedOffset,
  } = useForecastStore();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playSpeed, setPlaySpeed] = React.useState(1); // 1x, 2x

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const nextOffset = selectedOffset + 1;
      if (nextOffset <= 6) {
        setSelectedOffset(nextOffset);
      } else {
        setIsPlaying(false);
      }
    }, 2000 / playSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, selectedOffset, setSelectedOffset]);

  const handleSelectTime = (offset: number) => {
    setSelectedOffset(offset);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (selectedOffset >= 6) {
      setSelectedOffset(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStep = (direction: 'prev' | 'next') => {
    const newOffset = direction === 'prev'
      ? Math.max(0, selectedOffset - 1)
      : Math.min(6, selectedOffset + 1);
    setSelectedOffset(newOffset);
    setIsPlaying(false);
  };

  const handleSpeedChange = () => {
    setPlaySpeed(prev => (prev === 1 ? 2 : 1));
  };

  const handleJumpTo = (offset: 0 | 6) => {
    setSelectedOffset(offset);
    setIsPlaying(false);
  };

  return (
    <div className={cn('bg-card border rounded-lg p-3 lg:p-4', className)}>
      {/* Timeline Label */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Forecast Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {playSpeed}x
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleSpeedChange}
            title={`Playback speed: ${playSpeed}x`}
          >
            <FastForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Time Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-3 lg:mx-0 lg:pb-0 px-3 lg:px-0">
        {timePoints.map((point) => (
          <Button
            key={point.offset}
            variant={point.isSelected ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'whitespace-nowrap transition-all duration-200',
              'min-w-[60px] lg:min-w-[70px]',
              point.isSelected && 'shadow-md'
            )}
            onClick={() => handleSelectTime(point.offset)}
            disabled={point.isSelected}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-medium text-xs">{point.label}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(point.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </Button>
        ))}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleJumpTo(0)}
            title="Jump to now"
            disabled={selectedOffset === 0}
          >
            <Rewind className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleStep('prev')}
            title="Previous hour"
            disabled={selectedOffset === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleStep('next')}
            title="Next hour"
            disabled={selectedOffset === 6}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleJumpTo(6)}
            title="Jump to +6h"
            disabled={selectedOffset === 6}
          >
            <FastForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Current time info */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {selectedOffset === 0 ? 'Current' : `+${selectedOffset}h`}
            {' '}
            ({new Date(timePoints[selectedOffset].timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })})
          </span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-linear"
          style={{ width: `${((selectedOffset) / 6) * 100}%` }}
        />
      </div>
    </div>
  );
}