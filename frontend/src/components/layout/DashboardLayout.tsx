'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { TopNavBar } from './TopNavBar';
import { useUIStore } from '@/stores/uiStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  const { rightPanelOpen, rightPanelWidth, setRightPanelWidth } = useUIStore();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Main content area */}
      <div className={cn(
        'flex flex-1 flex-col overflow-hidden transition-all duration-200',
        rightPanelOpen ? `lg:pr-${Math.round(rightPanelWidth / 4)}` : ''
      )}>
        {/* Top Navigation Bar */}
        <TopNavBar />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-hidden">
          {header}
          <div className="h-full w-full overflow-hidden">{children}</div>
        </main>
      </div>

      {/* Right Panel Resizer */}
      {rightPanelOpen && (
        <div
          className="fixed right-0 top-14 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-primary/20 transition-colors z-30 lg:hidden"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = rightPanelWidth;

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const delta = startX - moveEvent.clientX;
              setRightPanelWidth(Math.max(300, Math.min(600, startWidth + delta)));
            };

            const handleMouseUp = () => {
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
          }}
        />
      )}
    </div>
  );
}