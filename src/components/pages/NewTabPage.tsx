import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  Zap,
  RotateCcw,
  Plus,
  X,
  Edit2,
  MoveLeft,
  MoveRight,
  GripVertical,
  Sliders,
  Check,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Bookmark as BookmarkIcon,
  Clock,
  LayoutList,
  Pin,
  VolumeX,
  Moon,
  ExternalLink,
  Laptop,
  Smartphone,
  Monitor,
  CornerDownLeft,
  Layers,
  Filter
} from 'lucide-react';
import {
  PerformanceStats,
  ClosedTabRecord,
  HomepageShortcut,
  HomepageSettings,
  HomepageBackground,
  Tab,
  Bookmark,
  HistoryItem
} from '../../types/browser';
import {
  INITIAL_HOMEPAGE_SHORTCUTS,
  INITIAL_HOMEPAGE_SETTINGS,
  INITIAL_BOOKMARKS,
  INITIAL_HISTORY
} from '../../services/storage';

export type GlobalSearchFilter = 'all' | 'tabs' | 'bookmarks' | 'history';

export interface GlobalSearchResult {
  id: string;
  type: 'tab' | 'bookmark' | 'history';
  title: string;
  url: string;
  favicon?: string;
  tabId?: string;
  isActiveTab?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isSleeping?: boolean;
  memoryUsageMb?: number;
  visitedAt?: number;
  visitCount?: number;
  syncedDeviceId?: string;
  folderId?: string;
}

// Safely highlight matching query in text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + lowerQuery.length);
  const after = text.slice(index + lowerQuery.length);

  return (
    <>
      {before}
      <mark className="bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-medium rounded-sm px-0.5 not-italic">
        {match}
      </mark>
      {highlightMatch(after, query)}
    </>
  );
}

function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface NewTabPageProps {
  onNavigate: (url: string) => void;
  stats: PerformanceStats;
  recentlyClosed: ClosedTabRecord[];
  onRestoreClosedTab: () => void;
  shortcuts?: HomepageShortcut[];
  onUpdateShortcuts?: (shortcuts: HomepageShortcut[]) => void;
  homepageSettings?: HomepageSettings;
  onUpdateHomepageSettings?: (settings: Partial<HomepageSettings>) => void;
  bookmarks?: Bookmark[];
  history?: HistoryItem[];
  tabs?: Tab[];
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
}

const PRESET_ICONS = ['🛡️', '⚡', '🔑', '📋', '🚀', '⏱️', '🐙', '📚', '🔍', '💬', '🎬', '🛒', '📰', '🎧', '💻', '🌐'];

export const NewTabPage: React.FC<NewTabPageProps> = ({
  onNavigate,
  stats,
  recentlyClosed,
  onRestoreClosedTab,
  shortcuts = INITIAL_HOMEPAGE_SHORTCUTS,
  onUpdateShortcuts,
  homepageSettings = INITIAL_HOMEPAGE_SETTINGS,
  onUpdateHomepageSettings,
  bookmarks = INITIAL_BOOKMARKS,
  history = INITIAL_HISTORY,
  tabs = [],
  activeTabId,
  onSelectTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Shortcut Add / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<HomepageShortcut | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUrl, setModalUrl] = useState('');
  const [modalIcon, setModalIcon] = useState('🌐');
  const [modalDesc, setModalDesc] = useState('');

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Search Engine Selector dropdown state
  const [isSearchEngineMenuOpen, setIsSearchEngineMenuOpen] = useState(false);

  // Internal shortcuts list state if onUpdateShortcuts not provided
  const [internalShortcuts, setInternalShortcuts] = useState<HomepageShortcut[]>(shortcuts);
  const [internalSettings, setInternalSettings] = useState<HomepageSettings>(homepageSettings);

  const activeShortcuts = onUpdateShortcuts ? shortcuts : internalShortcuts;
  const activeSettings = onUpdateHomepageSettings ? homepageSettings : internalSettings;

  const updateShortcutsList = (newItems: HomepageShortcut[]) => {
    if (onUpdateShortcuts) {
      onUpdateShortcuts(newItems);
    } else {
      setInternalShortcuts(newItems);
    }
  };

  const updateSettings = (updates: Partial<HomepageSettings>) => {
    if (onUpdateHomepageSettings) {
      onUpdateHomepageSettings(updates);
    } else {
      setInternalSettings(prev => ({ ...prev, ...updates }));
    }
  };

  // Global Concurrent Search State
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GlobalSearchFilter>('all');
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setIsSearchDropdownOpen(true);
      setSelectedResultIndex(-1);
    } else {
      setIsSearchDropdownOpen(false);
      setSelectedResultIndex(-1);
    }
  };

  const queryTrimmed = searchQuery.trim();
  const queryLower = queryTrimmed.toLowerCase();

  // 1. Open Tabs Search
  const matchedTabs: GlobalSearchResult[] = useMemo(() => {
    if (!queryLower) return [];
    return (tabs || [])
      .filter(t => t.title.toLowerCase().includes(queryLower) || t.url.toLowerCase().includes(queryLower))
      .map(t => ({
        id: `tab-${t.id}`,
        type: 'tab' as const,
        title: t.title || 'Untitled Tab',
        url: t.url,
        favicon: t.favicon || '📑',
        tabId: t.id,
        isActiveTab: t.id === activeTabId,
        isPinned: t.isPinned,
        isMuted: t.isMuted,
        isSleeping: t.isSleeping,
        memoryUsageMb: t.memoryUsageMb
      }));
  }, [tabs, queryLower, activeTabId]);

  // 2. Bookmarks Search
  const matchedBookmarks: GlobalSearchResult[] = useMemo(() => {
    if (!queryLower) return [];
    return (bookmarks || INITIAL_BOOKMARKS)
      .filter(b => b.title.toLowerCase().includes(queryLower) || b.url.toLowerCase().includes(queryLower))
      .map(b => ({
        id: `bm-${b.id}`,
        type: 'bookmark' as const,
        title: b.title,
        url: b.url,
        favicon: b.favicon || '⭐',
        folderId: b.folderId
      }));
  }, [bookmarks, queryLower]);

  // 3. Browsing History Search (deduplicated by URL, latest first)
  const matchedHistory: GlobalSearchResult[] = useMemo(() => {
    if (!queryLower) return [];
    const dedupMap = new Map<string, HistoryItem>();
    const list = history || INITIAL_HISTORY;
    for (const h of list) {
      if (h.isPrivate) continue;
      if (h.title.toLowerCase().includes(queryLower) || h.url.toLowerCase().includes(queryLower)) {
        if (!dedupMap.has(h.url) || dedupMap.get(h.url)!.visitedAt < h.visitedAt) {
          dedupMap.set(h.url, h);
        }
      }
    }
    return Array.from(dedupMap.values())
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, 15)
      .map(h => ({
        id: `hist-${h.id}`,
        type: 'history' as const,
        title: h.title,
        url: h.url,
        favicon: h.favicon || '🕒',
        visitedAt: h.visitedAt,
        visitCount: h.visitCount,
        syncedDeviceId: h.syncedDeviceId
      }));
  }, [history, queryLower]);

  const totalMatches = matchedTabs.length + matchedBookmarks.length + matchedHistory.length;

  // Flattened displayed items based on active filter
  const displayedItems: GlobalSearchResult[] = useMemo(() => {
    if (activeFilter === 'tabs') return matchedTabs;
    if (activeFilter === 'bookmarks') return matchedBookmarks;
    if (activeFilter === 'history') return matchedHistory;
    return [...matchedTabs, ...matchedBookmarks, ...matchedHistory];
  }, [activeFilter, matchedTabs, matchedBookmarks, matchedHistory]);

  const handleSelectResult = (result: GlobalSearchResult) => {
    setIsSearchDropdownOpen(false);
    if (result.type === 'tab' && result.tabId && onSelectTab) {
      onSelectTab(result.tabId);
    } else {
      onNavigate(result.url);
    }
  };

  // Search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearchDropdownOpen(false);

    if (query.includes('.') && !query.includes(' ')) {
      const url = query.startsWith('http://') || query.startsWith('https://') || query.startsWith('amazer://')
        ? query
        : `https://${query}`;
      onNavigate(url);
    } else {
      let searchUrl = `https://search.amazer.test?q=${encodeURIComponent(query)}`;
      if (activeSettings.searchProvider === 'google') {
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      } else if (activeSettings.searchProvider === 'duckduckgo') {
        searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      }
      onNavigate(searchUrl);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchDropdownOpen || !searchQuery.trim()) {
      if (e.key === 'ArrowDown' && searchQuery.trim()) {
        setIsSearchDropdownOpen(true);
      }
      return;
    }

    const maxIndex = displayedItems.length; // maxIndex corresponds to the web search action

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(prev => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && selectedResultIndex < displayedItems.length) {
        handleSelectResult(displayedItems[selectedResultIndex]);
      } else {
        handleSearchSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setIsSearchDropdownOpen(false);
      setSelectedResultIndex(-1);
    }
  };

  // Add or Edit shortcut
  const handleOpenAddModal = () => {
    setEditingShortcut(null);
    setModalTitle('');
    setModalUrl('');
    setModalIcon('🌐');
    setModalDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sc: HomepageShortcut, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingShortcut(sc);
    setModalTitle(sc.title);
    setModalUrl(sc.url);
    setModalIcon(sc.icon);
    setModalDesc(sc.desc || '');
    setIsModalOpen(true);
  };

  const handleSaveModalShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    let url = modalUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('amazer://')) {
      url = `https://${url}`;
    }

    let title = modalTitle.trim();
    if (!title) {
      try {
        title = new URL(url).hostname.replace('www.', '');
      } catch {
        title = url;
      }
    }

    if (editingShortcut) {
      // Update existing
      const updated = activeShortcuts.map(s =>
        s.id === editingShortcut.id
          ? {
              ...s,
              title,
              url,
              icon: modalIcon || '🌐',
              desc: modalDesc.trim() || undefined
            }
          : s
      );
      updateShortcutsList(updated);
    } else {
      // Add new
      const newShortcut: HomepageShortcut = {
        id: 'sc-' + Date.now(),
        title,
        url,
        icon: modalIcon || '🌐',
        desc: modalDesc.trim() || undefined,
        order: activeShortcuts.length
      };
      updateShortcutsList([...activeShortcuts, newShortcut]);
    }

    setIsModalOpen(false);
  };

  const handleRemoveShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = activeShortcuts.filter(s => s.id !== id);
    updateShortcutsList(updated);
  };

  // Reordering helpers (1-click Left/Right shift)
  const handleMoveShortcut = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeShortcuts.length) return;

    const reordered = [...activeShortcuts];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    updateShortcutsList(reordered);
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const items = [...activeShortcuts];
    const fromIndex = items.findIndex(item => item.id === draggedId);
    const toIndex = items.findIndex(item => item.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const [draggedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, draggedItem);
      updateShortcutsList(items);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleResetShortcuts = () => {
    updateShortcutsList([...INITIAL_HOMEPAGE_SHORTCUTS]);
  };

  // Background style classes based on selection
  const getBackgroundClass = (bg: HomepageBackground) => {
    switch (bg) {
      case 'aurora':
        return 'bg-gradient-to-br from-emerald-500/5 via-slate-100 to-indigo-500/5 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900';
      case 'nordic':
        return 'bg-gradient-to-b from-slate-100 via-sky-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
      case 'midnight':
        return 'bg-[#0f172a] text-slate-100 dark:bg-black';
      case 'zen':
        return 'bg-[#f7f5ef] dark:bg-[#121110] text-stone-900 dark:text-stone-100';
      case 'dots':
        return 'bg-slate-50 dark:bg-slate-950 bg-pattern-dots';
      case 'grid':
        return 'bg-slate-50 dark:bg-slate-950 bg-pattern-grid';
      case 'clean':
      default:
        return 'bg-slate-50 dark:bg-slate-950';
    }
  };

  const searchEngineLabels = {
    amazer: { name: 'Amazer Fast', icon: '⚡' },
    google: { name: 'Google', icon: '🌐' },
    duckduckgo: { name: 'DuckDuckGo', icon: '🦆' }
  };

  return (
    <div
      className={`min-h-full flex flex-col items-center justify-between px-4 py-8 select-none overflow-y-auto transition-colors duration-200 relative ${getBackgroundClass(
        activeSettings.background
      )}`}
    >
      {/* Top right customize trigger */}
      <div className="w-full max-w-4xl flex items-center justify-end gap-2 mb-2">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            isEditMode
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="Toggle shortcut rearrangement and editing"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditMode ? 'Done Editing' : 'Arrange Shortcuts'}</span>
        </button>

        <button
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors shadow-xs"
          title="Customize homepage background and settings"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize Homepage</span>
        </button>
      </div>

      {/* Main Content Center Area */}
      <div className="w-full max-w-3xl flex flex-col items-center my-auto py-6">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              A
            </div>
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Amazer
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Loads everything fast · Blocks all ads & scam pop-ups
          </p>
        </div>

        {/* PROMINENT SEARCH BAR WITH CONCURRENT GLOBAL SEARCH */}
        <div className="w-full max-w-2xl mb-8 relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="flex items-center w-full h-13 pl-4 pr-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-emerald-500 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              {/* Search Engine Selector */}
              <div className="relative shrink-0 pr-2">
                <button
                  type="button"
                  onClick={() => setIsSearchEngineMenuOpen(!isSearchEngineMenuOpen)}
                  className="flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Switch Search Engine"
                >
                  <span className="text-base leading-none">
                    {searchEngineLabels[activeSettings.searchProvider].icon}
                  </span>
                  <span className="hidden sm:inline text-[11px] font-sans">
                    {searchEngineLabels[activeSettings.searchProvider].name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Search Engine Dropdown */}
                {isSearchEngineMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSearchEngineMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                      {(['amazer', 'google', 'duckduckgo'] as const).map(engine => (
                        <button
                          key={engine}
                          type="button"
                          onClick={() => {
                            updateSettings({ searchProvider: engine });
                            setIsSearchEngineMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                            activeSettings.searchProvider === engine
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{searchEngineLabels[engine].icon}</span>
                            <span>{searchEngineLabels[engine].name}</span>
                          </div>
                          {activeSettings.searchProvider === engine && (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchDropdownOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={`Search history, bookmarks, tabs, or web with ${searchEngineLabels[activeSettings.searchProvider].name}...`}
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none min-w-0 font-mono px-2"
                autoFocus
              />

              {/* Clear button if typed */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                    setSelectedResultIndex(-1);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Concurrent Global Search Dropdown */}
          {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left transition-all">
              {/* Search Meta & Filter Header */}
              <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mr-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Global Search</span>
                  </span>

                  {/* Filter Pills */}
                  <button
                    type="button"
                    onClick={() => { setActiveFilter('all'); setSelectedResultIndex(-1); }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      activeFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>All</span>
                    <span className="opacity-75 font-mono">{totalMatches}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveFilter('tabs'); setSelectedResultIndex(-1); }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      activeFilter === 'tabs'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutList className="w-3 h-3" />
                    <span>Tabs</span>
                    <span className="opacity-75 font-mono">{matchedTabs.length}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveFilter('bookmarks'); setSelectedResultIndex(-1); }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      activeFilter === 'bookmarks'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookmarkIcon className="w-3 h-3" />
                    <span>Bookmarks</span>
                    <span className="opacity-75 font-mono">{matchedBookmarks.length}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveFilter('history'); setSelectedResultIndex(-1); }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      activeFilter === 'history'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>History</span>
                    <span className="opacity-75 font-mono">{matchedHistory.length}</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Concurrent</span>
                </div>
              </div>

              {/* Results List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {displayedItems.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      No matching open tabs, bookmarks, or history
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">Enter ↵</kbd> to search with {searchEngineLabels[activeSettings.searchProvider].name}
                    </p>
                  </div>
                ) : (
                  displayedItems.map((item, index) => {
                    const isSelected = selectedResultIndex === index;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Type Icon / Favicon */}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-sm">
                            {item.type === 'tab' ? (
                              item.favicon && item.favicon !== '📑' ? <span>{item.favicon}</span> : <LayoutList className="w-3.5 h-3.5 text-emerald-500" />
                            ) : item.type === 'bookmark' ? (
                              item.favicon && item.favicon !== '⭐' ? <span>{item.favicon}</span> : <BookmarkIcon className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              item.favicon && item.favicon !== '🕒' ? <span>{item.favicon}</span> : <Clock className="w-3.5 h-3.5 text-blue-500" />
                            )}
                          </div>

                          {/* Title & URL */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium truncate">
                                {highlightMatch(item.title, searchQuery)}
                              </span>

                              {/* Type Badges */}
                              {item.type === 'tab' && (
                                <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                                  {item.isActiveTab ? 'Active Tab' : 'Open Tab'}
                                </span>
                              )}
                              {item.type === 'bookmark' && (
                                <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
                                  Bookmark
                                </span>
                              )}
                              {item.type === 'history' && (
                                <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-medium bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
                                  History
                                </span>
                              )}

                              {/* Secondary status indicators */}
                              {item.isPinned && (
                                <span title="Pinned Tab" className="text-slate-400">
                                  <Pin className="w-2.5 h-2.5" />
                                </span>
                              )}
                              {item.isMuted && (
                                <span title="Muted Tab" className="text-slate-400">
                                  <VolumeX className="w-2.5 h-2.5" />
                                </span>
                              )}
                              {item.isSleeping && (
                                <span title="Sleeping Tab" className="text-indigo-400">
                                  <Moon className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">
                              <span className="truncate">{highlightMatch(item.url, searchQuery)}</span>
                              {item.visitedAt && (
                                <span className="shrink-0 text-[10px] text-slate-400">· {formatRelativeTime(item.visitedAt)}</span>
                              )}
                              {item.syncedDeviceId && (
                                <span className="shrink-0 text-[10px] text-slate-400">· synced</span>
                              )}
                              {item.memoryUsageMb !== undefined && (
                                <span className="shrink-0 text-[10px] text-slate-400">· {item.memoryUsageMb}MB</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {item.type === 'tab' ? (
                            <button
                              type="button"
                              className="px-2 py-1 text-[10px] font-semibold rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                            >
                              <span>Switch</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </button>
                          ) : item.type === 'bookmark' ? (
                            <button
                              type="button"
                              className="px-2 py-1 text-[10px] font-semibold rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                            >
                              <span>Open</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="px-2 py-1 text-[10px] font-semibold rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                            >
                              <span>Visit</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Web Search Action Fallback Item */}
              <div
                onClick={(e) => handleSearchSubmit(e)}
                className={`px-4 py-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedResultIndex === displayedItems.length
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50/90 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs truncate">
                    Search with {searchEngineLabels[activeSettings.searchProvider].name} for{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">"{searchQuery}"</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Press Enter ↵</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Keyboard Shortcuts Hint Footer */}
              <div className="px-4 py-1.5 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
                <span>Concurrently searches open tabs, bookmarks, and history</span>
                <div className="flex items-center gap-3">
                  <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                  <span><kbd className="font-mono">↵</kbd> select</span>
                  <span><kbd className="font-mono">Esc</kbd> dismiss</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CUSTOMIZABLE SHORTCUT TILES GRID */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between pb-2 mb-2 px-1">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Favorite Shortcuts {isEditMode ? '— Drag or use arrows to rearrange' : ''}
            </span>

            {isEditMode && (
              <button
                onClick={handleResetShortcuts}
                className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {activeShortcuts.map((shortcut, index) => {
              const isDragging = draggedId === shortcut.id;
              const isOver = dragOverId === shortcut.id;

              return (
                <div
                  key={shortcut.id}
                  draggable={isEditMode}
                  onDragStart={() => handleDragStart(shortcut.id)}
                  onDragOver={e => handleDragOver(e, shortcut.id)}
                  onDrop={e => handleDrop(e, shortcut.id)}
                  onClick={() => {
                    if (!isEditMode) onNavigate(shortcut.url);
                  }}
                  className={`group relative p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border transition-all text-left cursor-pointer flex flex-col justify-between min-h-[82px] ${
                    isOver
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.02]'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  } ${isDragging ? 'opacity-40' : ''}`}
                >
                  {/* Tile Content */}
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 p-1 rounded-lg bg-slate-50 dark:bg-slate-800 leading-none">
                      {shortcut.icon || '🌐'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {shortcut.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                        {shortcut.desc || shortcut.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                      </div>
                    </div>
                  </div>

                  {/* Rearrange / Edit / Delete Controls (Always visible in edit mode, or on hover) */}
                  <div
                    className={`mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-400 transition-opacity ${
                      isEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {/* Move Left / Right Buttons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={e => handleMoveShortcut(index, 'left', e)}
                        disabled={index === 0}
                        title="Move Left"
                        className="p-1 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-20 transition-colors"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => handleMoveShortcut(index, 'right', e)}
                        disabled={index === activeShortcuts.length - 1}
                        title="Move Right"
                        className="p-1 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-20 transition-colors"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Edit & Remove Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => handleOpenEditModal(shortcut, e)}
                        title="Edit Shortcut"
                        className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={e => handleRemoveShortcut(shortcut.id, e)}
                        title="Remove Shortcut"
                        className="p-1 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ADD SHORTCUT BUTTON TILE */}
            <button
              onClick={handleOpenAddModal}
              className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex flex-col items-center justify-center min-h-[82px] gap-1 group"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium">Add Shortcut</span>
            </button>
          </div>
        </div>

        {/* Real-time Browser Efficiency Stats Card (Toggleable) */}
        {activeSettings.showEfficiencyStats && (
          <div className="w-full max-w-2xl p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-xs mb-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Amazer Engine Protection & Efficiency
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Live metrics</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                  {stats.totalAdsBlocked.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">Ads Blocked</div>
              </div>

              <div>
                <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                  {stats.totalPopupsBlocked.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">Scam Pop-ups Killed</div>
              </div>

              <div>
                <div className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {stats.totalRamSavedMb} MB
                </div>
                <div className="text-[11px] text-slate-500">RAM Saved</div>
              </div>

              <div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stats.speedMultiplier}x
                </div>
                <div className="text-[11px] text-slate-500">Page Load Speedup</div>
              </div>
            </div>

            {/* Recently closed restore strip */}
            {activeSettings.showRecentlyClosed && recentlyClosed.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate mr-2">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">Recently closed: {recentlyClosed[0].title}</span>
                </div>
                <button
                  onClick={onRestoreClosedTab}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  Reopen Tab
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer copyright */}
      <div className="w-full max-w-4xl text-center text-[11px] text-slate-400 py-2">
        Amazer Web Browser · Zero Tracking · High Performance DOM Architecture
      </div>

      {/* ADD / EDIT SHORTCUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {editingShortcut ? 'Edit Shortcut' : 'Add Shortcut Tile'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModalShortcut} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Website Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. YouTube, GitHub, Reddit"
                  value={modalTitle}
                  onChange={e => setModalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  URL Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://youtube.com or reddit.com"
                  value={modalUrl}
                  onChange={e => setModalUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Icon or Emoji
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={modalIcon}
                    onChange={e => setModalIcon(e.target.value)}
                    maxLength={4}
                    className="w-12 text-center text-lg py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[11px] text-slate-500">Pick from presets:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  {PRESET_ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setModalIcon(ic)}
                      className={`w-7 h-7 rounded text-base flex items-center justify-center transition-transform hover:scale-110 ${
                        modalIcon === ic
                          ? 'bg-emerald-100 dark:bg-emerald-950 ring-1 ring-emerald-500'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Subtitle / Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daily dev feed or Video streaming"
                  value={modalDesc}
                  onChange={e => setModalDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                >
                  {editingShortcut ? 'Update Shortcut' : 'Add Shortcut'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMIZE HOMEPAGE DRAWER / MODAL */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Customize Amazer Homepage
                </h3>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Background Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Minimalist Background Style
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Distraction-free, high-contrast themes tailored for pure focus.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'clean', name: 'Clean', desc: 'Minimal canvas' },
                  { id: 'aurora', name: 'Aurora', desc: 'Subtle ambient mesh' },
                  { id: 'nordic', name: 'Nordic', desc: 'Arctic soft mist' },
                  { id: 'midnight', name: 'Midnight', desc: 'Matte OLED dark' },
                  { id: 'zen', name: 'Zen', desc: 'Parchment stone' },
                  { id: 'dots', name: 'Dot Matrix', desc: 'Engineering dots' },
                  { id: 'grid', name: 'Hairline Grid', desc: 'Blueprint lines' }
                ].map(bg => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => updateSettings({ background: bg.id as HomepageBackground })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      activeSettings.background === bg.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-medium text-xs mb-0.5">{bg.name}</div>
                    <div className="text-[10px] text-slate-400">{bg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Toggles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Homepage Elements
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Efficiency & Shield Telemetry
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Displays real-time ads blocked and RAM saved stats
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeSettings.showEfficiencyStats}
                    onChange={e => updateSettings({ showEfficiencyStats: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Recently Closed Tab Strip
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Quick 1-click restore for the last closed session tab
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeSettings.showRecentlyClosed}
                    onChange={e => updateSettings({ showRecentlyClosed: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  updateSettings(INITIAL_HOMEPAGE_SETTINGS);
                  handleResetShortcuts();
                }}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              >
                Reset All to Defaults
              </button>

              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
