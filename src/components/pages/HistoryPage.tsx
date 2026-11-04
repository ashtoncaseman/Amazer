import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Laptop,
  Smartphone,
  Monitor,
  RefreshCw,
  Shield,
  Check,
  Calendar,
  Clock
} from 'lucide-react';
import { HistoryItem, SyncDevice } from '../../types/browser';

interface HistoryPageProps {
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: (timeframe: 'hour' | 'day' | 'week' | 'all') => void;
  syncHistoryEnabled: boolean;
  onToggleSyncHistory: () => void;
  syncDevices: SyncDevice[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onNavigate,
  onDeleteItem,
  onClearHistory,
  syncHistoryEnabled,
  onToggleSyncHistory,
  syncDevices
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'yesterday' | 'synced'>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearRange, setClearRange] = useState<'hour' | 'day' | 'week' | 'all'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const now = Date.now();
    const oneDay = 86400000;
    if (filterDate === 'today') {
      return now - item.visitedAt < oneDay;
    }
    if (filterDate === 'yesterday') {
      return now - item.visitedAt >= oneDay && now - item.visitedAt < oneDay * 2;
    }
    if (filterDate === 'synced') {
      return !!item.syncedDeviceId;
    }
    return true;
  });

  const getDeviceIcon = (deviceId?: string) => {
    if (!deviceId) return null;
    if (deviceId.includes('mobile')) return <span title="Synced from mobile"><Smartphone className="w-3 h-3 text-slate-400" /></span>;
    if (deviceId.includes('laptop')) return <span title="Synced from laptop"><Laptop className="w-3 h-3 text-slate-400" /></span>;
    return <span title="Synced from desktop"><Monitor className="w-3 h-3 text-slate-400" /></span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Browsing History
              </h1>
              <div className="text-xs text-slate-500">
                Encrypted on device · Private windows leave zero traces
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History Sync Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              History Sync
            </span>
            <button
              onClick={onToggleSyncHistory}
              className={`w-8 h-4 rounded-full transition-colors relative ${
                syncHistoryEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                  syncHistoryEnabled ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => setIsClearModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Browsing Data</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="my-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by title or URL..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-[11px]">
          {(['all', 'today', 'yesterday', 'synced'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterDate(filter)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                filterDate === filter
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No history found
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {searchQuery ? 'Try another search query' : 'Your visited web pages will appear here'}
            </div>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const dateStr = new Date(item.visitedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-[11px] font-mono text-slate-400 w-12 shrink-0">
                    {dateStr}
                  </span>

                  <span className="text-sm shrink-0">
                    {item.favicon || '🌐'}
                  </span>

                  <div className="min-w-0 truncate">
                    <button
                      onClick={() => onNavigate(item.url)}
                      className="text-xs font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block text-left"
                    >
                      {item.title}
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 truncate block">
                      {item.url}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Synced device indicator */}
                  {item.syncedDeviceId && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {getDeviceIcon(item.syncedDeviceId)}
                      <span>Synced</span>
                    </div>
                  )}

                  {/* Visit count */}
                  {item.visitCount > 1 && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.visitCount} visits
                    </span>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="Remove from history"
                    className="p-1 rounded text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear Browsing Data Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-xs text-slate-800 dark:text-slate-200">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Clear Browsing Data
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Clears your browsing history, cached web files, and tracker identities.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Time Range
                </label>
                <select
                  value={clearRange}
                  onChange={(e) => setClearRange(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="hour">Last hour</option>
                  <option value="day">Last 24 hours</option>
                  <option value="week">Last 7 days</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Browsing & Download History</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cookies and other site data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cached images and V8 JIT compile artifacts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory(clearRange);
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
