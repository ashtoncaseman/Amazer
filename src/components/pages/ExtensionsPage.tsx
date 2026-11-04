import React, { useState } from 'react';
import {
  Puzzle,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  CheckCircle2,
  Sliders,
  Shield,
  Download,
  Search
} from 'lucide-react';
import { BrowserExtension } from '../../types/browser';

interface ExtensionsPageProps {
  extensions: BrowserExtension[];
  onToggleExtension: (id: string) => void;
  onRemoveExtension: (id: string) => void;
  onInstallExtension: (ext: BrowserExtension) => void;
}

const STORE_EXTENSIONS: BrowserExtension[] = [
  {
    id: 'store-bitwarden',
    name: 'Bitwarden Vault Integration',
    version: '2026.3.0',
    description: 'Sync and autofill credentials directly from your self-hosted or cloud Bitwarden vault.',
    author: 'Bitwarden Inc.',
    icon: 'Shield',
    enabled: true,
    permissions: ['activeTab', 'storage'],
    hasPopup: true,
    category: 'privacy'
  },
  {
    id: 'store-sponsorblock',
    name: 'SponsorBlock Fast Skip',
    version: '5.6.1',
    description: 'Automatically skip sponsored segments, intros, outros, and subscribe reminders in video streams.',
    author: 'Ajay Ramachandran',
    icon: 'Zap',
    enabled: true,
    permissions: ['webNavigation'],
    hasPopup: true,
    category: 'adblock'
  },
  {
    id: 'store-cookie-cleaner',
    name: 'Cookie Auto-Delete & Sanitizer',
    version: '3.8.0',
    description: 'Automatically deletes unused tracking cookies as soon as you close a browser tab.',
    author: 'CleanWeb Foundation',
    icon: 'Trash2',
    enabled: true,
    permissions: ['cookies', 'tabs'],
    hasPopup: false,
    category: 'privacy'
  },
  {
    id: 'store-vimium',
    name: 'Amazer Vim Navigator',
    version: '1.67',
    description: 'The hacker\'s browser. Navigate pages, follow links, and switch tabs entirely with keyboard shortcuts.',
    author: 'Phil Crosby',
    icon: 'Code',
    enabled: true,
    permissions: ['contentScripts'],
    hasPopup: false,
    category: 'utility'
  }
];

export const ExtensionsPage: React.FC<ExtensionsPageProps> = ({
  extensions,
  onToggleExtension,
  onRemoveExtension,
  onInstallExtension
}) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'store'>('installed');
  const [devMode, setDevMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const installedIds = new Set(extensions.map(e => e.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Extensions
              </h1>
              <div className="text-xs text-slate-500">
                Sandboxed, high-performance web extensions with zero background CPU drain
              </div>
            </div>
          </div>
        </div>

        {/* Developer Mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Developer Mode
            </span>
            <button
              onClick={() => setDevMode(!devMode)}
              className={`w-8 h-4 rounded-full transition-colors relative ${
                devMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                  devMode ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Developer Bar if enabled */}
      {devMode && (
        <div className="my-4 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between text-xs">
          <span className="text-indigo-900 dark:text-indigo-300 font-medium">
            Developer mode active: You can load unpacked manifests or inspect content scripts.
          </span>
          <button
            onClick={() => alert('Unpacked extension loader: manifest.json verified with Manifest V3')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
          >
            Load Unpacked Extension
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 my-5 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'installed'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Installed ({extensions.length})
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'store'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Amazer Extension Store
        </button>
      </div>

      {/* Installed Extensions Grid */}
      {activeTab === 'installed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensions.map((ext) => (
            <div
              key={ext.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {ext.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        v{ext.version} · By {ext.author}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleExtension(ext.id)}
                    className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                      ext.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                        ext.enabled ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {ext.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {ext.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400">
                  {ext.enabled ? 'Active in toolbar' : 'Disabled'}
                </span>
                <button
                  onClick={() => onRemoveExtension(ext.id)}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extension Store Catalog */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Curated, lightweight extensions thoroughly vetted for privacy, zero memory leaks, and speed.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STORE_EXTENSIONS.map((storeExt) => {
              const isInstalled = installedIds.has(storeExt.id);
              return (
                <div
                  key={storeExt.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          <Puzzle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {storeExt.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            v{storeExt.version} · By {storeExt.author}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {storeExt.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      Verified Safe
                    </span>

                    {isInstalled ? (
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Installed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onInstallExtension(storeExt)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Install</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
