/**
 * Risk level definitions, colors, and metadata
 */

import type { RiskLevel, HazardType } from '@/types/hazard';

export interface RiskLevelConfig {
  level: RiskLevel;
  label: string;
  description: string;
  color: {
    dark: string;
    light: string;
    bg: string;
    border: string;
    text: string;
  };
  threshold: { min: number; max: number };
  icon: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  low: {
    level: 'low',
    label: 'Low',
    description: 'Minimal threat. Routine monitoring sufficient.',
    color: {
      dark: '#22c55e',
      light: '#16a34a',
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: '#16a34a',
    },
    threshold: { min: 0, max: 25 },
    icon: 'check-circle',
    urgency: 'low',
    recommendedActions: [
      'Continue routine monitoring',
      'No immediate action required',
      'Stay informed via official channels',
    ],
  },
  moderate: {
    level: 'moderate',
    label: 'Moderate',
    description: 'Elevated threat. Increased vigilance advised.',
    color: {
      dark: '#f59e0b',
      light: '#d97706',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.4)',
      text: '#d97706',
    },
    threshold: { min: 25, max: 50 },
    icon: 'alert-triangle',
    urgency: 'medium',
    recommendedActions: [
      'Monitor weather updates closely',
      'Review emergency plans',
      'Prepare for potential warnings',
      'Avoid unnecessary travel in risk areas',
    ],
  },
  high: {
    level: 'high',
    label: 'High',
    description: 'Significant threat. Protective actions recommended.',
    color: {
      dark: '#ef4444',
      light: '#dc2626',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.4)',
      text: '#dc2626',
    },
    threshold: { min: 50, max: 75 },
    icon: 'alert-octagon',
    urgency: 'high',
    recommendedActions: [
      'Activate emergency protocols',
      'Issue public advisories',
      'Prepare evacuation routes',
      'Mobilize response teams',
      'Cancel outdoor activities',
    ],
  },
  extreme: {
    level: 'extreme',
    label: 'Extreme',
    description: 'Severe threat. Immediate action required.',
    color: {
      dark: '#7c2d12',
      light: '#991b1b',
      bg: 'rgba(124, 45, 18, 0.15)',
      border: 'rgba(124, 45, 18, 0.5)',
      text: '#991b1b',
    },
    threshold: { min: 75, max: 100 },
    icon: 'skull',
    urgency: 'critical',
    recommendedActions: [
      'IMMEDIATE EVACUATION of risk zones',
      'Activate highest emergency level',
      'Deploy all available resources',
      'Issue mandatory evacuation orders',
      'Establish emergency shelters',
      'Coordinate with disaster management authorities',
    ],
  },
};

export const HAZARD_CONFIGS: Record<HazardType, {
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  unit: string;
  typicalLeadTime: string;
  meteorologicalFactors: string[];
}> = {
  cloudburst: {
    label: 'Cloudburst',
    shortLabel: 'CB',
    icon: 'cloud-rain',
    description: 'Intense localized rainfall exceeding 100mm/hour',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    unit: 'mm/hr',
    typicalLeadTime: '1-3 hours',
    meteorologicalFactors: [
      'High moisture content (IWV > 50mm)',
      'Strong low-level convergence',
      'High CAPE (>2000 J/kg)',
      'Low CIN (<50 J/kg)',
      'Orographic lifting',
    ],
  },
  thunderstorm: {
    label: 'Severe Thunderstorm',
    shortLabel: 'TS',
    icon: 'cloud-lightning',
    description: 'Thunderstorms with hail, damaging winds, or tornadoes',
    primaryColor: '#8b5cf6',
    secondaryColor: '#5b21b6',
    unit: 'probability',
    typicalLeadTime: '2-6 hours',
    meteorologicalFactors: [
      'High CAPE (>1500 J/kg)',
      'Strong vertical wind shear (>20 m/s)',
      'Low-level moisture convergence',
      'Mid-level dry air intrusion',
      'Trigger mechanism (front, dryline, terrain)',
    ],
  },
  flash_flood: {
    label: 'Flash Flood',
    shortLabel: 'FF',
    icon: 'waves',
    description: 'Rapid flooding within 6 hours of heavy rainfall',
    primaryColor: '#06b6d4',
    secondaryColor: '#0e7490',
    unit: 'probability',
    typicalLeadTime: '2-6 hours',
    meteorologicalFactors: [
      'Heavy rainfall rates (>50mm/hr)',
      'High antecedent soil moisture',
      'Steep terrain / poor drainage',
      'Urban impervious surfaces',
      'Dam/levee breach potential',
    ],
  },
};

export function getRiskConfig(level: RiskLevel): RiskLevelConfig {
  return RISK_LEVELS[level];
}

export function getHazardConfig(type: HazardType) {
  return HAZARD_CONFIGS[type];
}

export function getRiskColor(level: RiskLevel, variant: 'dark' | 'light' | 'bg' | 'border' | 'text' = 'dark'): string {
  return RISK_LEVELS[level].color[variant];
}

export function getRiskClasses(level: RiskLevel): {
  bg: string;
  border: string;
  text: string;
  ring: string;
} {
  const config = RISK_LEVELS[level];
  return {
    bg: `bg-[${config.color.bg}]`,
    border: `border-[${config.color.border}]`,
    text: `text-[${config.color.text}]`,
    ring: `focus-visible:ring-[${config.color.dark}]`,
  };
}

export const RISK_SCALE = [
  { level: 'low' as RiskLevel, label: 'Low', range: '0-25%', color: '#22c55e' },
  { level: 'moderate' as RiskLevel, label: 'Moderate', range: '25-50%', color: '#f59e0b' },
  { level: 'high' as RiskLevel, label: 'High', range: '50-75%', color: '#ef4444' },
  { level: 'extreme' as RiskLevel, label: 'Extreme', range: '75-100%', color: '#7c2d12' },
] as const;