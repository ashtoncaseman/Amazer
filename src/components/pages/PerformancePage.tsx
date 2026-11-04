import React from 'react';
import {
  Zap,
  Cpu,
  HardDrive,
  Moon,
  ShieldCheck,
  Check,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';
import { PerformanceSettings, PerformanceStats, Tab } from '../../types/browser';

interface PerformancePageProps {
  tabs: Tab[];
  settings: PerformanceSettings;
  stats: PerformanceStats;
  onUpdateSettings: (updates: Partial<PerformanceSettings>) => void;
  onDiscardInactiveTabs: () => void;
  onWakeTab: (id: string) => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  tabs,
  settings,
  stats,
  onUpdateSettings,
  onDiscardInactiveTabs,
  onWakeTab
}) => {
  const sleepingTabsCount = tabs.filter(t => t.isSleeping).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Performance & Memory Saver
              </h1>
              <div className="text-xs text-slate-500">
                Ultra-low RAM footprint · Tab discarding · Instant sub-millisecond execution
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDiscardInactiveTabs}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Put Inactive Tabs to Sleep</span>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <HardDrive className="w-4 h-4 text-cyan-500" />
            <span>RAM Saved</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.totalRamSavedMb} MB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Saved by sleeping tabs & blocked ad bloat
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>CPU Time Saved</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.totalCpuTimeSavedSeconds}s
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Less battery drain on background tabs
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Speed Multiplier</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.speedMultiplier}x
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Faster DOM paint vs standard browsers
          </div>
        </div>
      </div>

      {/* Tabs Memory Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs mb-8">
        <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Current Tabs Memory Footprint ({tabs.length} tabs open · {sleepingTabsCount} sleeping)
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            V8 Heap Monitored
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">
                  {tab.favicon || '🌐'}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                    {tab.title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {tab.url}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {tab.isSleeping ? '3.2 MB' : `${tab.memoryUsageMb || 38} MB`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {tab.isSleeping ? 'Sleeping' : 'Active'}
                  </div>
                </div>

                {tab.isSleeping ? (
                  <button
                    onClick={() => onWakeTab(tab.id)}
                    className="px-2 py-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 text-[11px] font-medium"
                  >
                    Wake Tab
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    Running
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Config */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Memory & Energy Configuration
        </h3>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Automatic Memory Saver
              </div>
              <div className="text-[11px] text-slate-500">
                Suspends background tabs when system memory reaches threshold to keep active tabs blisteringly fast.
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ memorySaver: !settings.memorySaver })}
              className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                settings.memorySaver ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.memorySaver ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Tab Sleep Timeout
              </div>
              <div className="text-[11px] text-slate-500">
                Duration of tab inactivity before automatically sleeping.
              </div>
            </div>
            <select
              value={settings.discardInactiveTabsMinutes}
              onChange={(e) =>
                onUpdateSettings({ discardInactiveTabsMinutes: parseInt(e.target.value) })
              }
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Sub-Millisecond Asset Pre-rendering
              </div>
              <div className="text-[11px] text-slate-500">
                Pre-parses HTML on hover for immediate instant page loads.
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ prefetchResources: !settings.prefetchResources })}
              className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                settings.prefetchResources ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                  settings.prefetchResources ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
