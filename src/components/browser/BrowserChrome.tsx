import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Shield,
  Star,
  Plus,
  X,
  Volume2,
  VolumeX,
  MoreVertical,
  Zap,
  RefreshCw,
  EyeOff,
  Sliders,
  RotateCcw,
  Pin,
  Puzzle,
  Globe,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Tab, OmniboxSuggestion, ClosedTabRecord, BrowserExtension, Bookmark, BookmarkFolder } from '../../types/browser';
import { OmniboxSuggestions } from './OmniboxSuggestions';
import { BookmarksBar } from './BookmarksBar';
import { ShieldPopup } from './ShieldPopup';
import { BrowserMenu } from './BrowserMenu';
import { ExtensionPopups } from './ExtensionPopups';

interface BrowserChromeProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string) => void;
  onNewPrivateTab: () => void;
  onTogglePinTab: (id: string) => void;
  onToggleMuteTab: (id: string) => void;
  onNavigateTab: (tabId: string, url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  lastClosedTab?: ClosedTabRecord;
  onRestoreClosedTab: () => void;
  onRestoreSession: () => void;
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  onToggleBookmarkCurrent: () => void;
  onDeleteBookmark: (id: string) => void;
  showBookmarksBar: boolean;
  onToggleBookmarksBar: () => void;
  extensions: BrowserExtension[];
  onToggleExtension: (id: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  isPrivateWindow: boolean;
  totalRamSavedMb: number;
  onToggleReaderMode?: () => void;
  onToggleSidebar?: () => void;
  isSidebarExpanded?: boolean;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onNewPrivateTab,
  onTogglePinTab,
  onToggleMuteTab,
  onNavigateTab,
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  lastClosedTab,
  onRestoreClosedTab,
  onRestoreSession,
  bookmarks,
  bookmarkFolders,
  onToggleBookmarkCurrent,
  onDeleteBookmark,
  showBookmarksBar,
  onToggleBookmarksBar,
  extensions,
  onToggleExtension,
  isDarkMode,
  onToggleTheme,
  onSyncNow,
  isSyncing,
  isPrivateWindow,
  totalRamSavedMb,
  onToggleReaderMode,
  onToggleSidebar,
  isSidebarExpanded
}) => {
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [omniboxInput, setOmniboxInput] = useState(activeTab?.url || 'amazer://newtab');
  const [isOmniboxFocused, setIsOmniboxFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<OmniboxSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeExtPopupId, setActiveExtPopupId] = useState<string | null>(null);

  const omniboxRef = useRef<HTMLInputElement>(null);

  // Sync omnibox text with active tab's URL when active tab changes or finishes loading
  useEffect(() => {
    if (activeTab && !isOmniboxFocused) {
      setOmniboxInput(activeTab.url);
    }
  }, [activeTab?.url, activeTabId, isOmniboxFocused]);

  // Compute omnibox suggestions based on typed input
  const handleOmniboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOmniboxInput(val);
    setSelectedSuggestionIndex(-1);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const query = val.toLowerCase().trim();
    const results: OmniboxSuggestion[] = [];

    // Internal shortcut suggestions
    const internals = [
      { id: 'int-passwords', title: 'Amazer Passwords — View & Manage Logins', url: 'amazer://passwords' },
      { id: 'int-shields', title: 'Amazer Shields — EasyList Ad & Scam Blocker', url: 'amazer://shields' },
      { id: 'int-history', title: 'Amazer History & Device Sync', url: 'amazer://history' },
      { id: 'int-extensions', title: 'Amazer Extensions Store & Manager', url: 'amazer://extensions' },
      { id: 'int-perf', title: 'Amazer Performance & Memory Saver', url: 'amazer://performance' },
      { id: 'int-settings', title: 'Amazer Browser Settings', url: 'amazer://settings' },
      { id: 'int-newtab', title: 'New Tab Dashboard', url: 'amazer://newtab' }
    ];

    internals.forEach(item => {
      if (item.title.toLowerCase().includes(query) || item.url.includes(query)) {
        results.push({
          id: item.id,
          title: item.title,
          url: item.url,
          type: 'internal'
        });
      }
    });

    // Bookmarks matches
    bookmarks.forEach(bm => {
      if (bm.title.toLowerCase().includes(query) || bm.url.toLowerCase().includes(query)) {
        results.push({
          id: `bm-${bm.id}`,
          title: bm.title,
          url: bm.url,
          type: 'bookmark',
          favicon: bm.favicon
        });
      }
    });

    // If it looks like a URL
    if (val.includes('.') && !val.includes(' ')) {
      const fullUrl = val.startsWith('http://') || val.startsWith('https://') || val.startsWith('amazer://')
        ? val
        : `https://${val}`;
      results.unshift({
        id: 'direct-url',
        title: `Go to ${fullUrl}`,
        url: fullUrl,
        type: 'url'
      });
    }

    // Default search query option
    results.push({
      id: 'search-query',
      title: `Search Amazer for "${val}"`,
      url: `https://search.amazer.test?q=${encodeURIComponent(val)}`,
      type: 'search'
    });

    setSuggestions(results.slice(0, 7));
  };

  const handleOmniboxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
      } else {
        handleSubmitOmnibox(omniboxInput);
      }
    } else if (e.key === 'Escape') {
      setIsOmniboxFocused(false);
      setSuggestions([]);
      if (activeTab) setOmniboxInput(activeTab.url);
    }
  };

  const handleSubmitOmnibox = (input: string) => {
    let target = input.trim();
    if (!target) return;

    if (target.startsWith('amazer://') || target.startsWith('http://') || target.startsWith('https://')) {
      // standard url
    } else if (target.includes('.') && !target.includes(' ')) {
      target = `https://${target}`;
    } else {
      target = `https://search.amazer.test?q=${encodeURIComponent(target)}`;
    }

    onNavigateTab(activeTab.id, target);
    setIsOmniboxFocused(false);
    setSuggestions([]);
  };

  const handleSelectSuggestion = (suggestion: OmniboxSuggestion) => {
    onNavigateTab(activeTab.id, suggestion.url);
    setOmniboxInput(suggestion.url);
    setIsOmniboxFocused(false);
    setSuggestions([]);
  };

  const isCurrentBookmarked = bookmarks.some(b => b.url === activeTab?.url);

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0 select-none transition-colors duration-150">
      {/* Tab Strip Row */}
      <div className="flex items-center h-10 px-2 gap-1.5 pt-1.5 overflow-x-auto no-scrollbar">
        {/* Minimalist window dots */}
        <div className="flex items-center gap-1.5 px-2 mr-1 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80 hover:bg-rose-500 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 hover:bg-amber-500 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 hover:bg-emerald-500 transition-colors" />
        </div>

        {/* Private Window Badge */}
        {isPrivateWindow && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[11px] font-medium shrink-0">
            <EyeOff className="w-3 h-3 text-purple-400" />
            <span>Private Session</span>
          </div>
        )}

        {/* Tabs List */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => onSelectTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTab(tab.id);
                  }
                }}
                className={`group relative flex items-center justify-between gap-1.5 h-8 px-2.5 rounded-t-lg text-xs cursor-pointer transition-all duration-100 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border-t border-x border-slate-200/90 dark:border-slate-800 font-medium z-10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                } ${tab.isPinned ? 'w-9 justify-center px-0' : 'min-w-[130px] max-w-[210px] flex-1'}`}
              >
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  {tab.isSleeping ? (
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono" title="Tab sleeping to save RAM">
                      💤
                    </span>
                  ) : (
                    <span className="text-xs shrink-0 leading-none">
                      {tab.favicon || (tab.url.startsWith('amazer://') ? '⚡' : '🌐')}
                    </span>
                  )}

                  {!tab.isPinned && (
                    <span className="truncate text-[11px]">
                      {tab.isLoading ? 'Loading...' : tab.title}
                    </span>
                  )}
                </div>

                {/* Tab Controls */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tab.isMuted ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMuteTab(tab.id);
                      }}
                      title="Unmute tab"
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <VolumeX className="w-3 h-3 text-rose-500" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMuteTab(tab.id);
                      }}
                      title="Mute tab"
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePinTab(tab.id);
                    }}
                    title={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Pin className={`w-3 h-3 ${tab.isPinned ? 'rotate-45 text-amber-500' : ''}`} />
                  </button>

                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      title="Close tab (Ctrl+W)"
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Actions: Plus & Restore */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onNewTab()}
            title="New Tab (Ctrl+T)"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {lastClosedTab && (
            <button
              onClick={onRestoreClosedTab}
              title={`Restore closed tab: ${lastClosedTab.title} (Ctrl+Shift+T)`}
              className="p-1 rounded-md text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation & Omnibox Row */}
      <div className="flex items-center h-11 px-3 gap-2 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        {/* Nav Buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title={isSidebarExpanded ? "Collapse Sidebar (Ctrl+[)" : "Expand Sidebar (Ctrl+[)"}
              className={`p-1.5 rounded-lg transition-colors mr-0.5 ${
                isSidebarExpanded
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isSidebarExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onGoBack}
            disabled={!activeTab?.canGoBack}
            title="Back (Alt+Left)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onGoForward}
            disabled={!activeTab?.canGoForward}
            title="Forward (Alt+Right)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReload}
            title="Reload (Ctrl+R)"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCw className={`w-4 h-4 ${activeTab?.isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onGoHome}
            title="Home"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox / Address Bar Container */}
        <div className="relative flex-1 max-w-3xl mx-auto">
          <div
            className={`flex items-center h-8 px-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border transition-all text-xs ${
              isOmniboxFocused
                ? 'border-emerald-500 bg-white dark:bg-slate-850 shadow-sm ring-1 ring-emerald-500/20'
                : 'border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {/* Security / Protocol Indicator */}
            <div className="flex items-center gap-1.5 pr-2 shrink-0">
              {activeTab?.url.startsWith('amazer://') ? (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                  amazer://
                </span>
              ) : (
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>

            {/* Omnibox Text Input */}
            <input
              ref={omniboxRef}
              type="text"
              value={omniboxInput}
              onChange={handleOmniboxChange}
              onKeyDown={handleOmniboxKeyDown}
              onFocus={() => {
                setIsOmniboxFocused(true);
                omniboxRef.current?.select();
              }}
              onBlur={() => {
                // Slight delay to allow clicking suggestions
                setTimeout(() => setIsOmniboxFocused(false), 200);
              }}
              placeholder="Search with Amazer Fast or enter address..."
              className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none min-w-0 text-xs font-mono"
            />

            {/* Shield Badge & Bookmark Star */}
            <div className="flex items-center gap-1 pl-1 shrink-0">
              {/* EasyList Shield Indicator */}
              <button
                onClick={() => setIsShieldOpen(!isShieldOpen)}
                title="Amazer Shield: EasyList ad & scam popup protector"
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors text-[10px] font-semibold"
              >
                <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono">
                  {(activeTab?.adsBlockedCount || 0) + (activeTab?.popupsBlockedCount || 0)}
                </span>
              </button>

              {/* Reader Mode Button */}
              {!activeTab?.url.startsWith('amazer://newtab') && !activeTab?.url.startsWith('amazer://settings') && (
                <button
                  onClick={onToggleReaderMode}
                  title={activeTab?.isReadingMode ? "Exit Reading Mode (Alt+R)" : "Reading Mode — Strip ads & sidebars (Alt+R)"}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors text-[10px] font-semibold ${
                    activeTab?.isReadingMode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span className="hidden md:inline">{activeTab?.isReadingMode ? 'Reading' : 'Reader'}</span>
                </button>
              )}

              {/* Bookmark Star */}
              <button
                onClick={onToggleBookmarkCurrent}
                title={isCurrentBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
                className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isCurrentBookmarked ? 'fill-amber-500 text-amber-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Omnibox Suggestions Dropdown */}
          {isOmniboxFocused && (
            <OmniboxSuggestions
              suggestions={suggestions}
              selectedIndex={selectedSuggestionIndex}
              onSelect={handleSelectSuggestion}
              inputQuery={omniboxInput}
            />
          )}

          {/* Shield Popup Popover */}
          <ShieldPopup
            tab={activeTab}
            isOpen={isShieldOpen}
            onClose={() => setIsShieldOpen(false)}
            onOpenShieldsPage={() => onNavigateTab(activeTab.id, 'amazer://shields')}
            onReloadTab={onReload}
          />
        </div>

        {/* Toolbar Extension Icons & Utilities */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Memory Saver Live Pill */}
          <div
            title={`Amazer Memory Saver: ${totalRamSavedMb} MB RAM freed, inactive tabs suspended`}
            className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-800/40 text-[11px] font-mono cursor-pointer"
            onClick={() => onNavigateTab(activeTab.id, 'amazer://performance')}
          >
            <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>-{totalRamSavedMb} MB</span>
          </div>

          {/* Extensions Quick Launch */}
          {extensions.filter(e => e.enabled).slice(0, 3).map((ext) => (
            <button
              key={ext.id}
              onClick={() => setActiveExtPopupId(activeExtPopupId === ext.id ? null : ext.id)}
              title={ext.name}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            >
              {ext.id === 'ext-easylist-turbo' ? (
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
              ) : ext.id === 'ext-dark-reader' ? (
                <span className="text-xs">🌓</span>
              ) : (
                <Puzzle className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </button>
          ))}

          {/* Sync Button */}
          <button
            onClick={onSyncNow}
            title="Sync History, Bookmarks, and Passwords with Amazer Cloud"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          {/* 3-Dot Browser Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Customize and control Amazer"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <BrowserMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onNewTab={() => onNewTab()}
              onNewPrivateTab={onNewPrivateTab}
              onRestoreClosedTab={onRestoreClosedTab}
              lastClosedTab={lastClosedTab}
              onRestoreSession={onRestoreSession}
              onNavigateInternal={(page) => onNavigateTab(activeTab.id, page)}
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
              showBookmarksBar={showBookmarksBar}
              onToggleBookmarksBar={onToggleBookmarksBar}
              onToggleReaderMode={onToggleReaderMode}
              isReadingMode={activeTab?.isReadingMode}
            />
          </div>
        </div>

        {/* Extension Popup Popover */}
        <ExtensionPopups
          activeExtId={activeExtPopupId}
          onClose={() => setActiveExtPopupId(null)}
          extensions={extensions}
          onToggleExtension={onToggleExtension}
          onOpenExtensionsPage={() => onNavigateTab(activeTab.id, 'amazer://extensions')}
        />
      </div>

      {/* Bookmarks Bar */}
      {showBookmarksBar && (
        <BookmarksBar
          bookmarks={bookmarks}
          folders={bookmarkFolders}
          onNavigate={(url) => onNavigateTab(activeTab.id, url)}
          onAddCurrentPage={onToggleBookmarkCurrent}
          onDeleteBookmark={onDeleteBookmark}
          currentUrl={activeTab?.url || ''}
        />
      )}
    </div>
  );
};
