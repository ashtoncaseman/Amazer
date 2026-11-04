import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  KeyRound,
  Shield,
  Laptop,
  Smartphone,
  Monitor,
  Check,
  CheckCircle2,
  Trash2,
  Copy,
  ExternalLink,
  Sliders,
  QrCode
} from 'lucide-react';
import { SyncDevice, SyncSettings, Bookmark, SavedLogin, HistoryItem } from '../../types/browser';
import { ImportExportService, ImportOptions } from '../../services/importExportService';
import { SyncEngine } from '../../services/syncEngine';

interface SettingsPageProps {
  syncSettings: SyncSettings;
  onUpdateSyncSettings: (updates: Partial<SyncSettings>) => void;
  syncDevices: SyncDevice[];
  onSyncNow: () => void;
  isSyncing: boolean;
  onImportFromBrowser: (options: ImportOptions) => void;
  bookmarks: Bookmark[];
  passwords: SavedLogin[];
  history: HistoryItem[];
  defaultTab?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  syncSettings,
  onUpdateSyncSettings,
  syncDevices,
  onSyncNow,
  isSyncing,
  onImportFromBrowser,
  bookmarks,
  passwords,
  history,
  defaultTab = 'sync'
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'import' | 'privacy' | 'general'>(
    defaultTab === 'import' ? 'import' : 'sync'
  );

  // Import options
  const [selectedBrowser, setSelectedBrowser] = useState<ImportOptions['browser']>('chrome');
  const [importBookmarks, setImportBookmarks] = useState(true);
  const [importPasswords, setImportPasswords] = useState(true);
  const [importHistory, setImportHistory] = useState(true);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Sync copy state
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPairQr, setShowPairQr] = useState(false);

  const handleRunImport = () => {
    onImportFromBrowser({
      browser: selectedBrowser,
      importBookmarks,
      importPasswords,
      importHistory,
      importExtensions: false
    });

    const browserNames = {
      chrome: 'Google Chrome',
      firefox: 'Mozilla Firefox',
      safari: 'Apple Safari',
      edge: 'Microsoft Edge',
      brave: 'Brave Browser'
    };

    setImportSuccessMsg(`Successfully imported bookmarks, saved logins, and browsing history from ${browserNames[selectedBrowser]}!`);
    setTimeout(() => setImportSuccessMsg(null), 4000);
  };

  const copySyncKey = () => {
    navigator.clipboard.writeText(syncSettings.syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr = ImportExportService.exportAllData(bookmarks, passwords, history);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amazer-browser-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Amazer Browser Settings
          </h1>
          <div className="text-xs text-slate-500">
            Manage end-to-end encrypted sync, browser importer, and privacy defaults
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 my-5 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('sync')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'sync'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Amazer Encrypted Sync
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'import'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Import & Export
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'privacy'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Privacy & Security
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'general'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          General & Startup
        </button>
      </div>

      {/* Sync Section */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Amazer Cloud Sync (End-to-End Encrypted)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Securely synchronizes history, bookmarks, and logins across your devices without sharing plaintext with any server.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onSyncNow}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>

            {/* Sync Key */}
            <div className="py-4">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Your Amazer Sync Chain Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100">
                  {syncSettings.syncKey}
                </div>
                <button
                  onClick={copySyncKey}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
                <button
                  onClick={() => setShowPairQr(!showPairQr)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>
              </div>

              {showPairQr && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="w-32 h-32 bg-white p-2 mx-auto rounded-lg shadow-sm flex items-center justify-center font-mono text-xs text-slate-900 border">
                    [AMAZER_QR_SYNC]
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Scan with Amazer Mobile on iOS or Android to pair instantly.
                  </div>
                </div>
              )}
            </div>

            {/* Sync Toggles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Items to Synchronize
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.syncHistory}
                    onChange={(e) => onUpdateSyncSettings({ syncHistory: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Browsing History</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.syncBookmarks}
                    onChange={(e) => onUpdateSyncSettings({ syncBookmarks: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Bookmarks Bar</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.syncPasswords}
                    onChange={(e) => onUpdateSyncSettings({ syncPasswords: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Saved Passwords</span>
                </label>
              </div>
            </div>
          </div>

          {/* Connected Sync Devices */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Connected Devices ({syncDevices.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Devices linked to this encrypted Amazer sync vault.
            </p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {syncDevices.map((dev) => (
                <div key={dev.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {dev.type === 'mobile' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : dev.type === 'laptop' ? (
                        <Laptop className="w-4 h-4" />
                      ) : (
                        <Monitor className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{dev.name}</span>
                        {dev.isCurrent && (
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Last synced {new Date(dev.lastSync).toLocaleTimeString()} · IP {dev.ip}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import & Export Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Import from Other Web Browsers
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Seamlessly transfer your bookmarks, multiple saved logins, and browsing history into Amazer with 1 click.
            </p>

            {importSuccessMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {/* Browser choice */}
            <div className="space-y-3 mb-5">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Select Source Browser
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'chrome', name: 'Chrome', icon: '🌐' },
                  { id: 'firefox', name: 'Firefox', icon: '🦊' },
                  { id: 'safari', name: 'Safari', icon: '🧭' },
                  { id: 'edge', name: 'Edge', icon: '🌊' },
                  { id: 'brave', name: 'Brave', icon: '🦁' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrowser(b.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedBrowser === b.id
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <div className="text-xs">{b.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes for what to import */}
            <div className="space-y-2 mb-5">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Select Data to Import
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importBookmarks}
                    onChange={(e) => setImportBookmarks(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Bookmarks and Favorites Bar</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importPasswords}
                    onChange={(e) => setImportPasswords(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Saved Passwords & Multiple Logins per site</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importHistory}
                    onChange={(e) => setImportHistory(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Browsing History</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleRunImport}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Import Selected Data</span>
            </button>
          </div>

          {/* Backup / Export */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Export Amazer Data Backup
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download a JSON backup of all bookmarks, credentials, and history records.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Privacy & Shields Policies
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  EasyList Strict Filter Mode
                </div>
                <div className="text-[11px] text-slate-500">
                  Blocks video pre-rolls, banners, sponsored cards, and interstitial scripts.
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Scam Pop-Up & Phishing Trap Killer
                </div>
                <div className="text-[11px] text-slate-500">
                  Intercepts unauthorized popup windows, scareware alerts, and crypto drainers.
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Fingerprint Randomization
                </div>
                <div className="text-[11px] text-slate-500">
                  Spoofs canvas and audio hashes to prevent cross-site identity tracking.
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            General & Startup
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                On Startup
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="startup" defaultChecked className="text-emerald-600" />
                  <span>Restore previous session (reopen all tabs from last time)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="startup" className="text-emerald-600" />
                  <span>Open the New Tab page</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Default Search Provider
              </label>
              <select className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs">
                <option>Amazer Fast Search (Private & Zero-Tracking)</option>
                <option>DuckDuckGo</option>
                <option>Google</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
