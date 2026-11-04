import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Zap, Sliders, ExternalLink, RefreshCw } from 'lucide-react';
import { Tab } from '../../types/browser';

interface ShieldPopupProps {
  tab: Tab;
  isOpen: boolean;
  onClose: () => void;
  onOpenShieldsPage: () => void;
  onReloadTab: () => void;
}

export const ShieldPopup: React.FC<ShieldPopupProps> = ({
  tab,
  isOpen,
  onClose,
  onOpenShieldsPage,
  onReloadTab
}) => {
  if (!isOpen) return null;

  const totalBlockedOnTab =
    (tab.adsBlockedCount || 0) +
    (tab.popupsBlockedCount || 0) +
    (tab.trackersBlockedCount || 0);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-4 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3.5 z-50 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">
                Amazer Shields
              </div>
              <div className="text-[10px] text-slate-500">
                EasyList & Scam Pop-up Killer
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
            ACTIVE
          </span>
        </div>

        {/* Protection Metrics */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-600 dark:text-slate-400">Ads Blocked</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              {tab.adsBlockedCount || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-600 dark:text-slate-400">Scam Pop-ups Intercepted</span>
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
              {tab.popupsBlockedCount || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-600 dark:text-slate-400">Cross-Site Trackers</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              {tab.trackersBlockedCount || 0}
            </span>
          </div>
        </div>

        {/* Status notice */}
        <div className="text-[11px] text-slate-500 mb-3 leading-relaxed">
          Running in high-speed hardware mode. Zero telemetry or fingerprint leaks.
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onReloadTab();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Page</span>
          </button>

          <button
            onClick={() => {
              onOpenShieldsPage();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
          >
            <Sliders className="w-3 h-3" />
            <span>Filter Rules</span>
          </button>
        </div>
      </div>
    </>
  );
};
