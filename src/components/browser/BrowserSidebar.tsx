import React, { useState } from 'react';
import {
  Layers,
  Bookmark,
  History,
  Shield,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  X,
  Search,
  Volume2,
  VolumeX,
  Pin,
  ExternalLink,
  Trash2,
  Zap,
  Moon,
  Clock,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Tab, Bookmark as BookmarkType, HistoryItem } from '../../types/browser';

export type SidebarPanelType = 'tabs' | 'bookmarks' | 'history';

interface BrowserSidebarProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  activePanel: SidebarPanelType;
  onSelectPanel: (panel: SidebarPanelType) => void;
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string) => void;
  onTogglePinTab: (id: string) => void;
  onToggleMuteTab: (id: string) => void;
  onDiscardInactiveTabs: () => void;
  bookmarks: BookmarkType[];
  onNavigate: (url: string) => void;
  onDeleteBookmark: (id: string) => void;
  onAddCurrentBookmark: () => void;
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  isReadingMode?: boolean;
  onToggleReaderMode?: () => void;
}

export const BrowserSidebar: React.FC<BrowserSidebarProps> = ({
  isExpanded,
  onToggleExpanded,
  activePanel,
  onSelectPanel,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onTogglePinTab,
  onToggleMuteTab,
  onDiscardInactiveTabs,
  bookmarks,
  onNavigate,
  onDeleteBookmark,
  onAddCurrentBookmark,
  history,
  onDeleteHistoryItem,
  isReadingMode,
  onToggleReaderMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Tab search filter
  const filteredTabs = tabs.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Bookmark search filter
  const filteredBookmarks = bookmarks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // History search filter
  const filteredHistory = history.filter(h =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.url.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 30);

  const sleepingTabsCount = tabs.filter(t => t.isSleeping).length;

  return (
    <aside className="flex h-full select-none shrink-0 z-20 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-150">
      {/* 1. SLIM ICON RAIL (Always visible: 44px wide) */}
      <div className="w-11 flex flex-col items-center justify-between py-2 border-r border-slate-100 dark:border-slate-900 bg-slate-50/70 dark:bg-slate-950/80 shrink-0">
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* Collapse / Expand Toggle */}
          <button
            onClick={onToggleExpanded}
            title={isExpanded ? 'Collapse Sidebar (Ctrl+[)' : 'Expand Sidebar (Ctrl+[)'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <div className="w-6 h-[1px] bg-slate-200 dark:border-slate-800 my-1" />

          {/* Active Tabs Manager Panel Button */}
          <button
            onClick={() => {
              onSelectPanel('tabs');
              if (!isExpanded) onToggleExpanded();
            }}
            title={`Tabs (${tabs.length} open · ${sleepingTabsCount} sleeping)`}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isExpanded && activePanel === 'tabs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            {tabs.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[9px] font-mono font-bold flex items-center justify-center">
                {tabs.length}
              </span>
            )}
          </button>

          {/* Bookmarks Panel Button */}
          <button
            onClick={() => {
              onSelectPanel('bookmarks');
              if (!isExpanded) onToggleExpanded();
            }}
            title={`Bookmarks (${bookmarks.length} saved)`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isExpanded && activePanel === 'bookmarks'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* History Panel Button */}
          <button
            onClick={() => {
              onSelectPanel('history');
              if (!isExpanded) onToggleExpanded();
            }}
            title="Browsing History"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isExpanded && activePanel === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Rail Utilities: Reading Mode & Shields */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {onToggleReaderMode && (
            <button
              onClick={onToggleReaderMode}
              title={isReadingMode ? 'Exit Reading Mode (Alt+R)' : 'Reading Mode (Alt+R)'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isReadingMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onNavigate('amazer://shields')}
            title="Amazer EasyList Shields"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. EXPANDED CONTENT DRAWER (270px wide when isExpanded) */}
      {isExpanded && (
        <div className="w-68 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden animate-in slide-in-from-left-2 duration-150">
          {/* Panel Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 capitalize">
                {activePanel === 'tabs' ? 'Active Tabs' : activePanel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activePanel === 'tabs'
                  ? `(${tabs.length})`
                  : activePanel === 'bookmarks'
                  ? `(${bookmarks.length})`
                  : `(${history.length})`}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {activePanel === 'tabs' && (
                <>
                  <button
                    onClick={onDiscardInactiveTabs}
                    title="Sleep inactive tabs to free RAM"
                    className="p-1 rounded text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNewTab()}
                    title="New Tab (Ctrl+T)"
                    className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {activePanel === 'bookmarks' && (
                <button
                  onClick={onAddCurrentBookmark}
                  title="Bookmark current page"
                  className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={onToggleExpanded}
                title="Collapse Panel"
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Filter Search Input */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-850 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${activePanel}...`}
                className="w-full pl-7 pr-6 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900/60 p-1">
            {/* 1. TABS PANEL */}
            {activePanel === 'tabs' && (
              <div className="space-y-0.5">
                {filteredTabs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching tabs found
                  </div>
                ) : (
                  filteredTabs.map(tab => {
                    const isActive = tab.id === activeTabId;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm shrink-0 leading-none">
                            {tab.isSleeping ? '💤' : tab.favicon || '🌐'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs">
                              {tab.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate">
                              {tab.isSleeping ? 'Sleeping (3 MB)' : `${tab.memoryUsageMb || 32} MB`}
                            </div>
                          </div>
                        </div>

                        {/* Actions on hover */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onTogglePinTab(tab.id);
                            }}
                            title={tab.isPinned ? 'Unpin' : 'Pin'}
                            className="p-1 hover:text-amber-500 text-slate-400"
                          >
                            <Pin className={`w-3 h-3 ${tab.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onToggleMuteTab(tab.id);
                            }}
                            title={tab.isMuted ? 'Unmute' : 'Mute'}
                            className="p-1 hover:text-slate-900 dark:hover:text-slate-100 text-slate-400"
                          >
                            {tab.isMuted ? (
                              <VolumeX className="w-3 h-3 text-rose-500" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                          {tabs.length > 1 && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onCloseTab(tab.id);
                              }}
                              title="Close tab"
                              className="p-1 hover:text-rose-600 text-slate-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. BOOKMARKS PANEL */}
            {activePanel === 'bookmarks' && (
              <div className="space-y-0.5">
                {filteredBookmarks.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No bookmarks found
                  </div>
                ) : (
                  filteredBookmarks.map(bm => (
                    <div
                      key={bm.id}
                      onClick={() => onNavigate(bm.url)}
                      className="group flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm shrink-0 leading-none">
                          {bm.favicon || '⭐'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate text-xs text-slate-900 dark:text-slate-100">
                            {bm.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {bm.url}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteBookmark(bm.id);
                        }}
                        title="Remove bookmark"
                        className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. HISTORY PANEL */}
            {activePanel === 'history' && (
              <div className="space-y-0.5">
                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No browsing history found
                  </div>
                ) : (
                  filteredHistory.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate(item.url)}
                      className="group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm shrink-0 leading-none">
                          {item.favicon || '🌐'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-slate-900 dark:text-slate-100">
                            {item.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {new Date(item.visitedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} · {item.url}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteHistoryItem(item.id);
                        }}
                        title="Delete from history"
                        className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Panel Bottom Quick Link */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-850 shrink-0 text-center">
            {activePanel === 'tabs' ? (
              <button
                onClick={() => onNavigate('amazer://performance')}
                className="w-full py-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Memory Saver & V8 Engine Monitor</span>
              </button>
            ) : activePanel === 'bookmarks' ? (
              <button
                onClick={() => onNavigate('amazer://settings?tab=import')}
                className="w-full py-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                Import bookmarks from Chrome / Safari
              </button>
            ) : (
              <button
                onClick={() => onNavigate('amazer://history')}
                className="w-full py-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open Full History Page (Ctrl+H)
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
