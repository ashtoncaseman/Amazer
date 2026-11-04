import React from 'react';
import { ShieldCheck, Moon, Zap, ExternalLink, Sliders, CheckCircle2 } from 'lucide-react';
import { BrowserExtension } from '../../types/browser';

interface ExtensionPopupsProps {
  activeExtId: string | null;
  onClose: () => void;
  extensions: BrowserExtension[];
  onToggleExtension: (id: string) => void;
  onOpenExtensionsPage: () => void;
}

export const ExtensionPopups: React.FC<ExtensionPopupsProps> = ({
  activeExtId,
  onClose,
  extensions,
  onToggleExtension,
  onOpenExtensionsPage
}) => {
  if (!activeExtId) return null;

  const ext = extensions.find(e => e.id === activeExtId);
  if (!ext) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-12 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {ext.name}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v{ext.version}</span>
          </div>
          <button
            onClick={() => onToggleExtension(ext.id)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              ext.enabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {ext.enabled ? 'ENABLED' : 'PAUSED'}
          </button>
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          {ext.description}
        </div>

        {ext.id === 'ext-easylist-turbo' && (
          <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50 mb-3 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 dark:text-emerald-300">Active Rules</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">1,428</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 dark:text-emerald-300">Engine Latency</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">&lt; 0.4ms</span>
            </div>
          </div>
        )}

        {ext.id === 'ext-dark-reader' && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Contrast</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">100%</span>
            </div>
            <input
              type="range"
              defaultValue={100}
              min={70}
              max={130}
              className="w-full accent-emerald-500 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {ext.id === 'ext-clean-links' && (
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] mb-3">
            <span className="text-slate-500">Tracking tags stripped today:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 ml-1.5">34 params</span>
          </div>
        )}

        <button
          onClick={() => {
            onOpenExtensionsPage();
            onClose();
          }}
          className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors text-center text-[11px]"
        >
          Manage All Extensions
        </button>
      </div>
    </>
  );
};
