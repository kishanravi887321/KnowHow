'use client';

import * as React from 'react';
import { Bell, User, Settings, LogOut, Moon, Sun, Monitor, HelpCircle, Wifi, WifiOff, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatTimeAgo } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useUIStore } from '@/stores/uiStore';
import type { SystemStatus } from '@/types/ui';

interface TopNavBarProps {
  onNotificationClick?: (id: string) => void;
}

export function TopNavBar({ onNotificationClick }: TopNavBarProps) {
  const {
    theme,
    resolvedTheme,
    setTheme,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    user,
    systemStatus,
  } = useUIStore();

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'maintenance': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'maintenance': return 'text-blue-500';
      case 'offline': return 'text-red-500';
    }
  };

  const getConnectionIcon = (status: SystemStatus['wsStatus']) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'disconnected':
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* System Name & Status */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-tight">SIH Weather Command Center</h1>
              <p className="text-xs text-muted-foreground">AI-Driven Hyper-Local Extreme Weather Early Warning</p>
            </div>
          </div>

          {/* Live Status Indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border',
                  getStatusColor(systemStatus.status)
                )}>
                  <span className={cn(
                    'relative flex h-1.5 w-1.5 rounded-full animate-pulse',
                    systemStatus.status === 'operational' && 'bg-green-500',
                    systemStatus.status === 'degraded' && 'bg-yellow-500',
                    systemStatus.status === 'maintenance' && 'bg-blue-500',
                    systemStatus.status === 'offline' && 'bg-red-500'
                  )}>
                    {systemStatus.status === 'operational' && (
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring" />
                    )}
                  </span>
                  <span className="capitalize">{systemStatus.status}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <div className="space-y-1">
                  <p className="font-medium">System Status</p>
                  <p className="text-sm text-muted-foreground">
                    Last data update: {formatTimeAgo(systemStatus.lastDataUpdate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    API: {systemStatus.apiStatus} • WS: {systemStatus.wsStatus}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active alerts: {systemStatus.activeAlerts} • Latency: {systemStatus.dataLatency}ms
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-border" />

        {/* Last Update Time */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            Updated {formatTimeAgo(systemStatus.lastDataUpdate)}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-border" />

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 max-h-96">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                        Mark all read
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={cn(
                            'flex flex-col items-start gap-1 p-3',
                            !notif.read && 'bg-accent/50'
                          )}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            onNotificationClick?.(notif.id);
                          }}
                          inset
                        >
                          <div className="flex w-full items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={cn('font-medium text-sm', !notif.read && 'font-semibold')}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(notif.timestamp)}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifications {unreadCount > 0 && `(${unreadCount})`}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px bg-border" />

        {/* Connection Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                {getConnectionIcon(systemStatus.wsStatus)}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              WebSocket: {systemStatus.wsStatus}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-9 items-center gap-2 rounded-md px-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
                <AvatarFallback className="text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              System Default
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Documentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}