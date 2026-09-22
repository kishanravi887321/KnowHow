/**
 * Formatting utilities for the dashboard
 */

export function formatProbability(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatTimeRemaining(targetTime: string): string {
  const target = new Date(targetTime);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return 'Imminent';

  const diffHours = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);

  if (diffHours > 0) {
    return diffMins > 0 ? `${diffHours}h ${diffMins}m` : `${diffHours}h`;
  }
  return `${diffMins}m`;
}

export function formatTimestamp(timestamp: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  });
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatLeadTime(hours: number): string {
  if (hours < 1) return '< 1 hour';
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
}

export function formatLeadTimeRange(minHours: number, maxHours: number): string {
  if (minHours === maxHours) return formatLeadTime(minHours);
  return `${minHours}–${maxHours} hours`;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-IN', options).format(value);
}

export function formatCoordinates(lng: number, lat: number, precision = 4): string {
  return `${lat.toFixed(precision)}°N, ${lng.toFixed(precision)}°E`;
}

export function formatArea(sqKm: number): string {
  if (sqKm >= 1000000) {
    return `${(sqKm / 1000000).toFixed(1)}M km²`;
  }
  if (sqKm >= 1000) {
    return `${(sqKm / 1000).toFixed(1)}K km²`;
  }
  return `${Math.round(sqKm)} km²`;
}

export function formatPopulation(count: number): string {
  if (count >= 10000000) {
    return `${(count / 10000000).toFixed(1)} Cr`;
  }
  if (count >= 100000) {
    return `${(count / 100000).toFixed(1)} L`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function getTrendIcon(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'stable': return '→';
  }
}

export function getTrendLabel(direction: 'up' | 'down' | 'stable', value: number): string {
  const sign = direction === 'up' ? '+' : direction === 'down' ? '' : '±';
  return `${sign}${value}%`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}