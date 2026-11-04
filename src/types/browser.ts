export type BrowserPageType =
  | 'internal' // amazer://...
  | 'web';     // simulated web page or custom url

export type InternalPageId =
  | 'newtab'
  | 'passwords'
  | 'history'
  | 'extensions'
  | 'shields'
  | 'settings'
  | 'performance';

export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  historyStack: string[];
  historyIndex: number;
  isPrivate: boolean;
  isPinned: boolean;
  isMuted: boolean;
  isSleeping: boolean;
  memoryUsageMb: number;
  cpuUsagePct: number;
  adsBlockedCount: number;
  popupsBlockedCount: number;
  trackersBlockedCount: number;
  isReadingMode?: boolean;
  createdAt: number;
  lastActiveAt: number;
}

export interface ReaderSettings {
  theme: 'light' | 'sepia' | 'slate' | 'midnight';
  fontFamily: 'serif' | 'sans' | 'mono';
  fontSize: number; // 14 to 22
  columnWidth: 'narrow' | 'medium' | 'wide';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  createdAt: number;
}

export interface BookmarkFolder {
  id: string;
  title: string;
  parentId?: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitedAt: number;
  visitCount: number;
  favicon?: string;
  isPrivate: boolean;
  syncedDeviceId?: string;
}

export interface SavedLogin {
  id: string;
  site: string;      // e.g. "GitHub"
  domain: string;    // e.g. "github.com"
  username: string;  // e.g. "ashton_dev" or "work@corp.com"
  password: string;  // Plain or decrypted password
  createdAt: number;
  lastUsedAt: number;
  note?: string;
  category?: 'work' | 'personal' | 'finance' | 'social';
}

export interface EasyListRule {
  id: string;
  rawSyntax: string;
  pattern: string;
  type: 'network' | 'popup' | 'cosmetic' | 'whitelist';
  category: 'ads' | 'privacy' | 'annoyances' | 'scam';
  enabled: boolean;
  hitCount: number;
  description?: string;
}

export interface BrowserExtension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  enabled: boolean;
  permissions: string[];
  hasPopup: boolean;
  badgeText?: string;
  category: 'adblock' | 'privacy' | 'utility' | 'theme';
}

export interface SyncDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'mobile';
  lastSync: number;
  isCurrent: boolean;
  ip: string;
  status: 'synced' | 'syncing' | 'idle';
}

export interface SyncSettings {
  enabled: boolean;
  syncHistory: boolean;
  syncBookmarks: boolean;
  syncPasswords: boolean;
  syncExtensions: boolean;
  syncKey: string;
  lastGlobalSync: number;
}

export interface PerformanceSettings {
  memorySaver: boolean;
  discardInactiveTabsMinutes: number;
  aggressiveAdBlocking: boolean;
  blockScamPopups: boolean;
  blockFingerprinting: boolean;
  prefetchResources: boolean;
  hardwareAccel: boolean;
}

export interface PerformanceStats {
  totalAdsBlocked: number;
  totalPopupsBlocked: number;
  totalTrackersBlocked: number;
  totalRamSavedMb: number;
  totalCpuTimeSavedSeconds: number;
  speedMultiplier: number;
}

export interface MasterPasswordState {
  isSet: boolean;
  isUnlocked: boolean;
  salt?: string;
  hash?: string;
  autoLockMinutes: number;
  lastUnlockedAt?: number;
}

export interface ClosedTabRecord {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  closedAt: number;
  isPrivate: boolean;
}

export interface OmniboxSuggestion {
  id: string;
  title: string;
  url: string;
  type: 'search' | 'history' | 'bookmark' | 'internal' | 'url';
  favicon?: string;
  matchedText?: string;
}

export interface ScamPopupEvent {
  id: string;
  sourceUrl: string;
  attemptedUrl: string;
  reason: string;
  timestamp: number;
  severity: 'high' | 'critical' | 'medium';
}

export interface HomepageShortcut {
  id: string;
  title: string;
  url: string;
  icon: string;
  desc?: string;
  order: number;
}

export type HomepageBackground =
  | 'clean'       // Minimal default canvas
  | 'aurora'      // Subtle emerald & slate ambient gradient
  | 'nordic'      // Arctic mist soft tone
  | 'midnight'    // Deep OLED dark matte
  | 'zen'         // Warm stone parchment
  | 'dots'        // Fine-grain minimalist engineering dot matrix
  | 'grid';       // Subtle technical blueprint hairline grid

export interface HomepageSettings {
  background: HomepageBackground;
  searchProvider: 'amazer' | 'google' | 'duckduckgo';
  showEfficiencyStats: boolean;
  showRecentlyClosed: boolean;
  blurBackground: boolean;
}

