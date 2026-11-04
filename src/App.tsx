import React, { useState, useEffect, useCallback } from 'react';
import {
  Tab,
  Bookmark,
  BookmarkFolder,
  HistoryItem,
  SavedLogin,
  EasyListRule,
  BrowserExtension,
  SyncDevice,
  SyncSettings,
  PerformanceSettings,
  PerformanceStats,
  ClosedTabRecord,
  ScamPopupEvent,
  HomepageShortcut,
  HomepageSettings
} from './types/browser';
import { BrowserChrome } from './components/browser/BrowserChrome';
import { BrowserSidebar, SidebarPanelType } from './components/browser/BrowserSidebar';
import { SavePasswordModal } from './components/browser/SavePasswordModal';
import { ScamPopupAlert } from './components/browser/ScamPopupAlert';
import { NewTabPage } from './components/pages/NewTabPage';
import { PasswordsPage } from './components/pages/PasswordsPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { ShieldsPage } from './components/pages/ShieldsPage';
import { ExtensionsPage } from './components/pages/ExtensionsPage';
import { PerformancePage } from './components/pages/PerformancePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { SimulatedWebPage } from './components/sandbox/SimulatedWebPage';
import { ReaderView } from './components/browser/ReaderView';
import { easyListEngine, DEFAULT_EASYLIST_RULES } from './services/easyListEngine';
import { SyncEngine } from './services/syncEngine';
import { ImportExportService, ImportOptions } from './services/importExportService';
import {
  BrowserStorage,
  INITIAL_BOOKMARKS,
  INITIAL_BOOKMARK_FOLDERS,
  INITIAL_EXTENSIONS,
  INITIAL_HISTORY,
  INITIAL_PERFORMANCE_SETTINGS,
  INITIAL_PERFORMANCE_STATS,
  INITIAL_SAVED_LOGINS,
  INITIAL_SYNC_DEVICES,
  INITIAL_SYNC_SETTINGS,
  INITIAL_HOMEPAGE_SHORTCUTS,
  INITIAL_HOMEPAGE_SETTINGS
} from './services/storage';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return BrowserStorage.get('dark_mode', false);
  });

  // Private Window state
  const [isPrivateWindow, setIsPrivateWindow] = useState(false);

  // Tabs state
  const [tabs, setTabs] = useState<Tab[]>(() => {
    return [
      {
        id: 'tab-1',
        url: 'https://sandbox.amazer.test/ads-scams',
        title: 'Ad & Scam Defense Benchmark',
        favicon: '🛡️',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        historyStack: ['https://sandbox.amazer.test/ads-scams'],
        historyIndex: 0,
        isPrivate: false,
        isPinned: false,
        isMuted: false,
        isSleeping: false,
        memoryUsageMb: 34,
        cpuUsagePct: 1.2,
        adsBlockedCount: 6,
        popupsBlockedCount: 2,
        trackersBlockedCount: 14,
        createdAt: Date.now() - 60000,
        lastActiveAt: Date.now()
      },
      {
        id: 'tab-2',
        url: 'amazer://newtab',
        title: 'New Tab',
        favicon: '⚡',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        historyStack: ['amazer://newtab'],
        historyIndex: 0,
        isPrivate: false,
        isPinned: false,
        isMuted: false,
        isSleeping: false,
        memoryUsageMb: 18,
        cpuUsagePct: 0.2,
        adsBlockedCount: 0,
        popupsBlockedCount: 0,
        trackersBlockedCount: 0,
        createdAt: Date.now(),
        lastActiveAt: Date.now()
      }
    ];
  });
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Closed tabs stack for Ctrl+Shift+T restore
  const [closedTabs, setClosedTabs] = useState<ClosedTabRecord[]>([]);

  // Session restore banner
  const [sessionRestoreAvailable, setSessionRestoreAvailable] = useState<boolean>(true);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    BrowserStorage.get('bookmarks', INITIAL_BOOKMARKS)
  );
  const [bookmarkFolders] = useState<BookmarkFolder[]>(INITIAL_BOOKMARK_FOLDERS);
  const [showBookmarksBar, setShowBookmarksBar] = useState(true);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    BrowserStorage.get('history', INITIAL_HISTORY)
  );

  // Saved Logins (Multi-login per domain)
  const [logins, setLogins] = useState<SavedLogin[]>(() =>
    BrowserStorage.get('saved_logins', INITIAL_SAVED_LOGINS)
  );

  // EasyList Rules state
  const [rules, setRules] = useState<EasyListRule[]>(() => easyListEngine.getRules());

  // Scam popup events
  const [scamEvents, setScamEvents] = useState<ScamPopupEvent[]>([]);

  // Extensions
  const [extensions, setExtensions] = useState<BrowserExtension[]>(() =>
    BrowserStorage.get('extensions', INITIAL_EXTENSIONS)
  );

  // Sync state
  const [syncSettings, setSyncSettings] = useState<SyncSettings>(() =>
    BrowserStorage.get('sync_settings', INITIAL_SYNC_SETTINGS)
  );
  const [syncDevices, setSyncDevices] = useState<SyncDevice[]>(() =>
    BrowserStorage.get('sync_devices', INITIAL_SYNC_DEVICES)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Performance settings & telemetry
  const [perfSettings, setPerfSettings] = useState<PerformanceSettings>(() =>
    BrowserStorage.get('perf_settings', INITIAL_PERFORMANCE_SETTINGS)
  );
  const [perfStats, setPerfStats] = useState<PerformanceStats>(() =>
    BrowserStorage.get('perf_stats', INITIAL_PERFORMANCE_STATS)
  );

  // Homepage Shortcuts & Settings
  const [homepageShortcuts, setHomepageShortcuts] = useState<HomepageShortcut[]>(() =>
    BrowserStorage.get('homepage_shortcuts', INITIAL_HOMEPAGE_SHORTCUTS)
  );
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(() =>
    BrowserStorage.get('homepage_settings', INITIAL_HOMEPAGE_SETTINGS)
  );

  // Collapsible Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() =>
    BrowserStorage.get('sidebar_expanded', false)
  );
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanelType>(() =>
    BrowserStorage.get('sidebar_panel', 'tabs')
  );

  // Save Password Prompt Modal
  const [savePasswordPrompt, setSavePasswordPrompt] = useState<{
    isOpen: boolean;
    domain: string;
    username: string;
    password: string;
  }>({
    isOpen: false,
    domain: '',
    username: '',
    password: ''
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode || isPrivateWindow) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    BrowserStorage.set('dark_mode', isDarkMode);
  }, [isDarkMode, isPrivateWindow]);

  // Persist state
  useEffect(() => {
    BrowserStorage.set('bookmarks', bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    BrowserStorage.set('saved_logins', logins);
  }, [logins]);

  useEffect(() => {
    BrowserStorage.set('history', history);
  }, [history]);

  useEffect(() => {
    BrowserStorage.set('sync_settings', syncSettings);
  }, [syncSettings]);

  useEffect(() => {
    BrowserStorage.set('perf_settings', perfSettings);
  }, [perfSettings]);

  useEffect(() => {
    BrowserStorage.set('perf_stats', perfStats);
  }, [perfStats]);

  useEffect(() => {
    BrowserStorage.set('homepage_shortcuts', homepageShortcuts);
  }, [homepageShortcuts]);

  useEffect(() => {
    BrowserStorage.set('homepage_settings', homepageSettings);
  }, [homepageSettings]);

  useEffect(() => {
    BrowserStorage.set('sidebar_expanded', isSidebarExpanded);
  }, [isSidebarExpanded]);

  useEffect(() => {
    BrowserStorage.set('sidebar_panel', sidebarPanel);
  }, [sidebarPanel]);

  // Active tab helper
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Record history on navigation
  const recordHistory = useCallback(
    (url: string, title: string) => {
      if (isPrivateWindow || activeTab?.isPrivate) return;
      if (url.startsWith('amazer://newtab')) return;

      setHistory(prev => {
        const existingIdx = prev.findIndex(h => h.url === url);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            visitedAt: Date.now(),
            visitCount: updated[existingIdx].visitCount + 1
          };
          return updated;
        }

        const newItem: HistoryItem = {
          id: 'hist-' + Date.now(),
          url,
          title,
          visitedAt: Date.now(),
          visitCount: 1,
          isPrivate: false,
          syncedDeviceId: syncSettings.syncHistory ? 'dev-desktop' : undefined
        };
        return [newItem, ...prev.slice(0, 199)];
      });
    },
    [isPrivateWindow, activeTab?.isPrivate, syncSettings.syncHistory]
  );

  // Navigate a tab
  const handleNavigateTab = (tabId: string, url: string) => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id !== tabId) return t;

        // Determine title
        let title = 'Web Page';
        let favicon = '🌐';
        if (url.startsWith('amazer://newtab')) {
          title = 'New Tab';
          favicon = '⚡';
        } else if (url.startsWith('amazer://passwords')) {
          title = 'Passwords Vault';
          favicon = '🔑';
        } else if (url.startsWith('amazer://shields')) {
          title = 'EasyList Shields';
          favicon = '📋';
        } else if (url.startsWith('amazer://history')) {
          title = 'History';
          favicon = '⏱️';
        } else if (url.startsWith('amazer://extensions')) {
          title = 'Extensions';
          favicon = '🧩';
        } else if (url.startsWith('amazer://performance')) {
          title = 'Performance & RAM';
          favicon = '🚀';
        } else if (url.startsWith('amazer://settings')) {
          title = 'Settings';
          favicon = '⚙️';
        } else if (url.includes('sandbox.amazer.test')) {
          title = 'Ad & Scam Defense Benchmark';
          favicon = '🛡️';
        } else if (url.includes('technews.amazer.test')) {
          title = 'TechNews Daily';
          favicon = '⚡';
        } else if (url.includes('search.amazer.test')) {
          title = 'Amazer Fast Search';
          favicon = '🔍';
        } else {
          try {
            const host = new URL(url).hostname;
            title = host;
          } catch {
            title = url;
          }
        }

        const newStack = t.historyStack.slice(0, t.historyIndex + 1);
        newStack.push(url);

        return {
          ...t,
          url,
          title,
          favicon,
          isLoading: false,
          isSleeping: false,
          lastActiveAt: Date.now(),
          historyStack: newStack,
          historyIndex: newStack.length - 1,
          canGoBack: newStack.length > 1,
          canGoForward: false
        };
      })
    );

    recordHistory(url, url);
  };

  // Tab management
  const handleNewTab = (url: string = 'amazer://newtab') => {
    const newTabId = 'tab-' + Date.now();
    const newTab: Tab = {
      id: newTabId,
      url,
      title: url === 'amazer://newtab' ? 'New Tab' : 'Web Page',
      favicon: '⚡',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      historyStack: [url],
      historyIndex: 0,
      isPrivate: isPrivateWindow,
      isPinned: false,
      isMuted: false,
      isSleeping: false,
      memoryUsageMb: 24,
      cpuUsagePct: 0.4,
      adsBlockedCount: 0,
      popupsBlockedCount: 0,
      trackersBlockedCount: 0,
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleNewPrivateTab = () => {
    setIsPrivateWindow(true);
    handleNewTab('amazer://newtab');
  };

  const handleCloseTab = (id: string) => {
    const tabToClose = tabs.find(t => t.id === id);
    if (tabToClose) {
      setClosedTabs(prev => [
        {
          id: tabToClose.id,
          url: tabToClose.url,
          title: tabToClose.title,
          favicon: tabToClose.favicon,
          closedAt: Date.now(),
          isPrivate: tabToClose.isPrivate
        },
        ...prev.slice(0, 20)
      ]);
    }

    if (tabs.length === 1) {
      // Re-create newtab if closing last tab
      handleNewTab('amazer://newtab');
      setTabs(prev => prev.filter(t => t.id !== id));
      return;
    }

    const nextTabs = tabs.filter(t => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  // Restore closed tab (Ctrl+Shift+T)
  const handleRestoreClosedTab = () => {
    if (closedTabs.length === 0) return;
    const [lastClosed, ...rest] = closedTabs;
    setClosedTabs(rest);
    handleNewTab(lastClosed.url);
  };

  // Full Session Restore
  const handleRestoreSession = () => {
    const demoSessionUrls = [
      'https://sandbox.amazer.test/ads-scams',
      'https://technews.amazer.test',
      'amazer://passwords',
      'amazer://shields'
    ];

    const restoredTabs: Tab[] = demoSessionUrls.map((url, i) => ({
      id: `tab-restored-${Date.now()}-${i}`,
      url,
      title:
        url.includes('sandbox')
          ? 'Ad & Scam Defense Benchmark'
          : url.includes('technews')
          ? 'TechNews Daily'
          : url.includes('passwords')
          ? 'Passwords Vault'
          : 'EasyList Shields',
      favicon: url.includes('passwords') ? '🔑' : '🛡️',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      historyStack: [url],
      historyIndex: 0,
      isPrivate: false,
      isPinned: false,
      isMuted: false,
      isSleeping: i > 1, // Sleep background tabs for memory saver
      memoryUsageMb: i > 1 ? 4 : 32,
      cpuUsagePct: 0.5,
      adsBlockedCount: 5,
      popupsBlockedCount: 1,
      trackersBlockedCount: 8,
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    }));

    setTabs(restoredTabs);
    setActiveTabId(restoredTabs[0].id);
    setSessionRestoreAvailable(false);
  };

  // Navigation controls
  const handleGoBack = () => {
    if (!activeTab || !activeTab.canGoBack) return;
    const newIdx = activeTab.historyIndex - 1;
    const targetUrl = activeTab.historyStack[newIdx];
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTab.id
          ? {
              ...t,
              url: targetUrl,
              historyIndex: newIdx,
              canGoBack: newIdx > 0,
              canGoForward: true
            }
          : t
      )
    );
  };

  const handleGoForward = () => {
    if (!activeTab || !activeTab.canGoForward) return;
    const newIdx = activeTab.historyIndex + 1;
    const targetUrl = activeTab.historyStack[newIdx];
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTab.id
          ? {
              ...t,
              url: targetUrl,
              historyIndex: newIdx,
              canGoBack: true,
              canGoForward: newIdx < t.historyStack.length - 1
            }
          : t
      )
    );
  };

  const handleReload = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t => (t.id === activeTab.id ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs(prev =>
        prev.map(t => (t.id === activeTab.id ? { ...t, isLoading: false } : t))
      );
    }, 250);
  };

  const handleGoHome = () => {
    if (activeTab) {
      handleNavigateTab(activeTab.id, 'amazer://newtab');
    }
  };

  // Reader Mode Toggle
  const handleToggleReaderMode = () => {
    if (!activeTab) return;
    setTabs(prev =>
      prev.map(t =>
        t.id === activeTabId
          ? { ...t, isReadingMode: !t.isReadingMode }
          : t
      )
    );
  };

  // Sidebar Toggle
  const handleToggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  // Tab Pin & Mute
  const handleTogglePinTab = (id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleToggleMuteTab = (id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  // Memory Saver: Discard inactive tabs
  const handleDiscardInactiveTabs = () => {
    setTabs(prev =>
      prev.map(t => (t.id !== activeTabId ? { ...t, isSleeping: true } : t))
    );
    setPerfStats(prev => ({
      ...prev,
      totalRamSavedMb: prev.totalRamSavedMb + 140
    }));
  };

  const handleWakeTab = (id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isSleeping: false } : t))
    );
  };

  // Bookmarks
  const handleToggleBookmarkCurrent = () => {
    if (!activeTab) return;
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      const newBm: Bookmark = {
        id: 'bm-' + Date.now(),
        title: activeTab.title,
        url: activeTab.url,
        favicon: activeTab.favicon,
        createdAt: Date.now()
      };
      setBookmarks(prev => [...prev, newBm]);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  // Password Management
  const handleAddLogin = (newLoginData: Omit<SavedLogin, 'id' | 'createdAt' | 'lastUsedAt'>) => {
    const newLogin: SavedLogin = {
      ...newLoginData,
      id: 'login-' + Date.now(),
      createdAt: Date.now(),
      lastUsedAt: Date.now()
    };
    setLogins(prev => [newLogin, ...prev]);
  };

  const handleDeleteLogin = (id: string) => {
    setLogins(prev => prev.filter(l => l.id !== id));
  };

  const handleUpdateLogin = (id: string, updates: Partial<SavedLogin>) => {
    setLogins(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  // Scam pop-up interception trigger
  const handleTriggerPopup = (targetUrl: string, sourceUrl: string) => {
    const evalRes = easyListEngine.evaluatePopup(targetUrl, sourceUrl);
    if (!evalRes.allowed && evalRes.event) {
      setScamEvents(prev => [evalRes.event!, ...prev]);
      setPerfStats(prev => ({
        ...prev,
        totalPopupsBlocked: prev.totalPopupsBlocked + 1
      }));
      setTabs(prev =>
        prev.map(t =>
          t.id === activeTabId
            ? { ...t, popupsBlockedCount: (t.popupsBlockedCount || 0) + 1 }
            : t
        )
      );
    }
  };

  // EasyList Rule operations
  const handleToggleRule = (id: string) => {
    const updated = easyListEngine.toggleRule(id);
    setRules([...updated]);
  };

  const handleAddRule = (syntax: string, category: EasyListRule['category']) => {
    easyListEngine.addCustomRule(syntax, category);
    setRules([...easyListEngine.getRules()]);
  };

  const handleDeleteRule = (id: string) => {
    const updated = easyListEngine.deleteRule(id);
    setRules([...updated]);
  };

  const handleResetRules = () => {
    const updated = easyListEngine.resetToDefaults();
    setRules([...updated]);
  };

  // Extensions operations
  const handleToggleExtension = (id: string) => {
    setExtensions(prev =>
      prev.map(e => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const handleRemoveExtension = (id: string) => {
    setExtensions(prev => prev.filter(e => e.id !== id));
  };

  const handleInstallExtension = (ext: BrowserExtension) => {
    setExtensions(prev => [...prev, ext]);
  };

  // Sync operations
  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const syncRes = SyncEngine.simulateDeviceSync(syncDevices, syncSettings);
      setSyncDevices(syncRes.updatedDevices);
      setSyncSettings(syncRes.updatedSettings);
      setIsSyncing(false);
    }, 1200);
  };

  // Browser Import operations
  const handleImportFromBrowser = (options: ImportOptions) => {
    const result = ImportExportService.runBrowserImport(options);
    if (result.newBookmarks.length > 0) {
      setBookmarks(prev => [...prev, ...result.newBookmarks]);
    }
    if (result.newPasswords.length > 0) {
      setLogins(prev => [...prev, ...result.newPasswords]);
    }
    if (result.newHistory.length > 0) {
      setHistory(prev => [...result.newHistory, ...prev]);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 't' && !e.shiftKey) {
        e.preventDefault();
        handleNewTab();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleCloseTab(activeTabId);
      } else if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleRestoreClosedTab();
      } else if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewPrivateTab();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleNavigateTab(activeTabId, 'amazer://history');
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowBookmarksBar(prev => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReload();
      } else if ((e.altKey && e.key.toLowerCase() === 'r') || (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault();
        handleToggleReaderMode();
      } else if ((isCmdOrCtrl && e.key === '[') || (e.altKey && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, closedTabs]);

  // Render current tab content
  const renderTabContent = () => {
    if (!activeTab) return null;

    const url = activeTab.url;

    // Reading mode view for web pages
    if (activeTab.isReadingMode && !url.startsWith('amazer://')) {
      return (
        <ReaderView
          url={url}
          onExitReader={handleToggleReaderMode}
        />
      );
    }

    if (url.startsWith('amazer://newtab')) {
      return (
        <NewTabPage
          onNavigate={(target) => handleNavigateTab(activeTab.id, target)}
          stats={perfStats}
          recentlyClosed={closedTabs}
          onRestoreClosedTab={handleRestoreClosedTab}
          shortcuts={homepageShortcuts}
          onUpdateShortcuts={setHomepageShortcuts}
          homepageSettings={homepageSettings}
          onUpdateHomepageSettings={(updates) =>
            setHomepageSettings(prev => ({ ...prev, ...updates }))
          }
          bookmarks={bookmarks}
          history={history}
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
        />
      );
    }

    if (url.startsWith('amazer://passwords')) {
      return (
        <PasswordsPage
          logins={logins}
          onAddLogin={handleAddLogin}
          onDeleteLogin={handleDeleteLogin}
          onUpdateLogin={handleUpdateLogin}
        />
      );
    }

    if (url.startsWith('amazer://history')) {
      return (
        <HistoryPage
          history={history}
          onNavigate={(target) => handleNavigateTab(activeTab.id, target)}
          onDeleteItem={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
          onClearHistory={(range) => {
            if (range === 'all') setHistory([]);
            else if (range === 'hour') {
              setHistory(prev => prev.filter(h => Date.now() - h.visitedAt > 3600000));
            } else if (range === 'day') {
              setHistory(prev => prev.filter(h => Date.now() - h.visitedAt > 86400000));
            } else if (range === 'week') {
              setHistory(prev => prev.filter(h => Date.now() - h.visitedAt > 86400000 * 7));
            }
          }}
          syncHistoryEnabled={syncSettings.syncHistory}
          onToggleSyncHistory={() =>
            setSyncSettings(prev => ({ ...prev, syncHistory: !prev.syncHistory }))
          }
          syncDevices={syncDevices}
        />
      );
    }

    if (url.startsWith('amazer://shields')) {
      return (
        <ShieldsPage
          rules={rules}
          onToggleRule={handleToggleRule}
          onAddRule={handleAddRule}
          onDeleteRule={handleDeleteRule}
          onResetRules={handleResetRules}
          scamEvents={scamEvents}
          onClearScamEvents={() => setScamEvents([])}
        />
      );
    }

    if (url.startsWith('amazer://extensions')) {
      return (
        <ExtensionsPage
          extensions={extensions}
          onToggleExtension={handleToggleExtension}
          onRemoveExtension={handleRemoveExtension}
          onInstallExtension={handleInstallExtension}
        />
      );
    }

    if (url.startsWith('amazer://performance')) {
      return (
        <PerformancePage
          tabs={tabs}
          settings={perfSettings}
          stats={perfStats}
          onUpdateSettings={(updates) => setPerfSettings(prev => ({ ...prev, ...updates }))}
          onDiscardInactiveTabs={handleDiscardInactiveTabs}
          onWakeTab={handleWakeTab}
        />
      );
    }

    if (url.startsWith('amazer://settings')) {
      const tabParam = new URLSearchParams(url.split('?')[1] || '').get('tab') || 'sync';
      return (
        <SettingsPage
          syncSettings={syncSettings}
          onUpdateSyncSettings={(updates) =>
            setSyncSettings(prev => ({ ...prev, ...updates }))
          }
          syncDevices={syncDevices}
          onSyncNow={handleSyncNow}
          isSyncing={isSyncing}
          onImportFromBrowser={handleImportFromBrowser}
          bookmarks={bookmarks}
          passwords={logins}
          history={history}
          defaultTab={tabParam}
        />
      );
    }

    // Otherwise render simulated web page
    return (
      <SimulatedWebPage
        url={url}
        tab={activeTab}
        onTriggerPopup={handleTriggerPopup}
        onPromptSavePassword={(domain, username, password) => {
          setSavePasswordPrompt({
            isOpen: true,
            domain,
            username,
            password
          });
        }}
        savedLogins={logins}
        onIncrementBlockCount={(type) => {
          if (type === 'ad') {
            setPerfStats(p => ({ ...p, totalAdsBlocked: p.totalAdsBlocked + 1 }));
            setTabs(prev =>
              prev.map(t =>
                t.id === activeTab.id ? { ...t, adsBlockedCount: (t.adsBlockedCount || 0) + 1 } : t
              )
            );
          } else if (type === 'popup') {
            setPerfStats(p => ({ ...p, totalPopupsBlocked: p.totalPopupsBlocked + 1 }));
            setTabs(prev =>
              prev.map(t =>
                t.id === activeTab.id
                  ? { ...t, popupsBlockedCount: (t.popupsBlockedCount || 0) + 1 }
                  : t
              )
            );
          }
        }}
        onToggleReaderMode={handleToggleReaderMode}
      />
    );
  };

  const domainMatchingLoginsCount = logins.filter(
    l => l.domain === savePasswordPrompt.domain
  ).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Session Restore Banner */}
      {sessionRestoreAvailable && (
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">Amazer Session Guard:</span>
            <span>Restore previous browsing session (4 tabs with EasyList shields)?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreSession}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium text-[11px] transition-colors"
            >
              Restore Session
            </button>
            <button
              onClick={() => setSessionRestoreAvailable(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-200 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Browser Chrome Header (Tabs, Omnibox, Bookmarks Bar) */}
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onNewPrivateTab={handleNewPrivateTab}
        onTogglePinTab={handleTogglePinTab}
        onToggleMuteTab={handleToggleMuteTab}
        onNavigateTab={handleNavigateTab}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onGoHome={handleGoHome}
        lastClosedTab={closedTabs[0]}
        onRestoreClosedTab={handleRestoreClosedTab}
        onRestoreSession={handleRestoreSession}
        bookmarks={bookmarks}
        bookmarkFolders={bookmarkFolders}
        onToggleBookmarkCurrent={handleToggleBookmarkCurrent}
        onDeleteBookmark={handleDeleteBookmark}
        showBookmarksBar={showBookmarksBar}
        onToggleBookmarksBar={() => setShowBookmarksBar(!showBookmarksBar)}
        extensions={extensions}
        onToggleExtension={handleToggleExtension}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
        isPrivateWindow={isPrivateWindow}
        totalRamSavedMb={perfStats.totalRamSavedMb}
        onToggleReaderMode={handleToggleReaderMode}
        onToggleSidebar={handleToggleSidebar}
        isSidebarExpanded={isSidebarExpanded}
      />

      {/* Main Workspace: Collapsible Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <BrowserSidebar
          isExpanded={isSidebarExpanded}
          onToggleExpanded={handleToggleSidebar}
          activePanel={sidebarPanel}
          onSelectPanel={setSidebarPanel}
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
          onTogglePinTab={handleTogglePinTab}
          onToggleMuteTab={handleToggleMuteTab}
          onDiscardInactiveTabs={handleDiscardInactiveTabs}
          bookmarks={bookmarks}
          onNavigate={(target) => handleNavigateTab(activeTabId, target)}
          onDeleteBookmark={handleDeleteBookmark}
          onAddCurrentBookmark={handleToggleBookmarkCurrent}
          history={history}
          onDeleteHistoryItem={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
          isReadingMode={activeTab?.isReadingMode}
          onToggleReaderMode={handleToggleReaderMode}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 bg-white dark:bg-slate-900 relative overflow-y-auto flex flex-col">
          {renderTabContent()}

          {/* Scam Pop-up Alert Toasts */}
          <ScamPopupAlert
            events={scamEvents}
            onDismiss={(id) => setScamEvents(prev => prev.filter(e => e.id !== id))}
            onOpenShields={() => {
              if (activeTab) {
                handleNavigateTab(activeTab.id, 'amazer://shields');
              }
            }}
          />
        </main>
      </div>

      {/* Save Password Prompt Modal */}
      <SavePasswordModal
        isOpen={savePasswordPrompt.isOpen}
        onClose={() => setSavePasswordPrompt(prev => ({ ...prev, isOpen: false }))}
        onSave={handleAddLogin}
        initialDomain={savePasswordPrompt.domain}
        initialUsername={savePasswordPrompt.username}
        initialPassword={savePasswordPrompt.password}
        existingLoginsCount={domainMatchingLoginsCount}
      />
    </div>
  );
}
