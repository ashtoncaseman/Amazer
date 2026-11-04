import {
  Bookmark,
  BookmarkFolder,
  BrowserExtension,
  HistoryItem,
  HomepageBackground,
  HomepageSettings,
  HomepageShortcut,
  PerformanceSettings,
  PerformanceStats,
  ReaderSettings,
  SavedLogin,
  SyncDevice,
  SyncSettings,
  Tab
} from '../types/browser';

export const INITIAL_SAVED_LOGINS: SavedLogin[] = [
  {
    id: 'login-gh-1',
    site: 'GitHub',
    domain: 'github.com',
    username: 'ashton-dev',
    password: 'ghp_UltraSecureToken2026!#',
    createdAt: Date.now() - 86400000 * 24,
    lastUsedAt: Date.now() - 3600000 * 2,
    note: 'Personal open-source account with 2FA passkey',
    category: 'personal'
  },
  {
    id: 'login-gh-2',
    site: 'GitHub Enterprise',
    domain: 'github.com',
    username: 'ashton.caseman@corp.io',
    password: 'CorpGHE_Secured9821$',
    createdAt: Date.now() - 86400000 * 45,
    lastUsedAt: Date.now() - 86400000 * 1,
    note: 'Work enterprise organization admin',
    category: 'work'
  },
  {
    id: 'login-goog-1',
    site: 'Google Account',
    domain: 'google.com',
    username: 'ashton.caseman@gmail.com',
    password: 'GGL_Protect2026!Alpha',
    createdAt: Date.now() - 86400000 * 90,
    lastUsedAt: Date.now() - 3600000 * 4,
    note: 'Primary personal Google account',
    category: 'personal'
  },
  {
    id: 'login-goog-2',
    site: 'Google Workspace',
    domain: 'google.com',
    username: 'ashton@amazer-labs.dev',
    password: 'AmazerCloudAdmin99@!',
    createdAt: Date.now() - 86400000 * 12,
    lastUsedAt: Date.now() - 86400000 * 2,
    note: 'Amazer development workspace',
    category: 'work'
  },
  {
    id: 'login-stripe-1',
    site: 'Stripe Dashboard',
    domain: 'stripe.com',
    username: 'billing@amazer-labs.dev',
    password: 'sk_live_StripeMasterKey92$',
    createdAt: Date.now() - 86400000 * 30,
    lastUsedAt: Date.now() - 86400000 * 3,
    note: 'Production revenue payments',
    category: 'finance'
  },
  {
    id: 'login-aws-1',
    site: 'AWS Console',
    domain: 'aws.amazon.com',
    username: 'cloud-ops-ashton',
    password: 'AWS_IAM_RootMFA_9872!',
    createdAt: Date.now() - 86400000 * 60,
    lastUsedAt: Date.now() - 86400000 * 5,
    note: 'US-West-2 cluster manager',
    category: 'work'
  }
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    title: 'Ad & Scam Sandbox',
    url: 'https://sandbox.amazer.test/ads-scams',
    favicon: '🛡️',
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'bm-2',
    title: 'TechNews Daily',
    url: 'https://technews.amazer.test',
    favicon: '⚡',
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'bm-3',
    title: 'EasyList Filter Rules',
    url: 'amazer://shields',
    favicon: '📋',
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'bm-4',
    title: 'Password Manager',
    url: 'amazer://passwords',
    favicon: '🔑',
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'bm-5',
    title: 'Fast Search Engine',
    url: 'https://search.amazer.test',
    favicon: '🔍',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'bm-6',
    title: 'Resource & RAM Optimizer',
    url: 'amazer://performance',
    favicon: '⚡',
    createdAt: Date.now() - 86400000 * 8
  }
];

export const INITIAL_BOOKMARK_FOLDERS: BookmarkFolder[] = [
  { id: 'f-dev', title: 'Developer Tools' },
  { id: 'f-security', title: 'Privacy & Security' }
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    url: 'https://sandbox.amazer.test/ads-scams',
    title: 'Ad & Scam Popup Defense Test Bench',
    visitedAt: Date.now() - 1000 * 60 * 15,
    visitCount: 14,
    favicon: '🛡️',
    isPrivate: false,
    syncedDeviceId: 'dev-laptop'
  },
  {
    id: 'hist-2',
    url: 'https://technews.amazer.test',
    title: 'TechNews — AI Studio and Browser Acceleration Breakthroughs',
    visitedAt: Date.now() - 1000 * 60 * 45,
    visitCount: 8,
    favicon: '⚡',
    isPrivate: false,
    syncedDeviceId: 'dev-desktop'
  },
  {
    id: 'hist-3',
    url: 'https://github.com/easylist/easylist',
    title: 'easylist/easylist: The definitive ad-blocking filter lists',
    visitedAt: Date.now() - 1000 * 60 * 120,
    visitCount: 22,
    favicon: '🐙',
    isPrivate: false,
    syncedDeviceId: 'dev-laptop'
  },
  {
    id: 'hist-4',
    url: 'https://search.amazer.test?q=minimalist+browser+low+cpu',
    title: 'Amazer Search — Minimalist browser with ultra-low CPU footprint',
    visitedAt: Date.now() - 1000 * 60 * 240,
    visitCount: 5,
    favicon: '🔍',
    isPrivate: false
  },
  {
    id: 'hist-5',
    url: 'amazer://passwords',
    title: 'Amazer Passwords Vault',
    visitedAt: Date.now() - 86400000,
    visitCount: 19,
    favicon: '🔑',
    isPrivate: false
  },
  {
    id: 'hist-6',
    url: 'https://speedtest.amazer.test',
    title: 'V8 Engine Latency & DOM Paint Benchmarks',
    visitedAt: Date.now() - 86400000 * 1.5,
    visitCount: 3,
    favicon: '⏱️',
    isPrivate: false,
    syncedDeviceId: 'dev-mobile'
  }
];

export const INITIAL_EXTENSIONS: BrowserExtension[] = [
  {
    id: 'ext-easylist-turbo',
    name: 'EasyList Turbo Engine',
    version: '4.8.2',
    description: 'In-process network stream filter running official EasyList & EasyPrivacy rules at zero latency.',
    author: 'Amazer Core Team',
    icon: 'ShieldCheck',
    enabled: true,
    permissions: ['webRequest', 'declarativeNetRequest', 'storage'],
    hasPopup: true,
    badgeText: 'ON',
    category: 'adblock'
  },
  {
    id: 'ext-dark-reader',
    name: 'Amazer Dark Slate Mode',
    version: '2.1.0',
    description: 'Generates gentle dark mode color schemes on the fly without breaking page contrast.',
    author: 'Amazer Labs',
    icon: 'Moon',
    enabled: true,
    permissions: ['activeTab', 'styling'],
    hasPopup: true,
    badgeText: 'DARK',
    category: 'theme'
  },
  {
    id: 'ext-clean-links',
    name: 'Clean Links & Anti-Redirect',
    version: '1.4.0',
    description: 'Strips tracking parameters (utm_*, fbclid, gclid, affiliate wrappers) before page load.',
    author: 'Privacy Guard',
    icon: 'Zap',
    enabled: true,
    permissions: ['webNavigation'],
    hasPopup: true,
    badgeText: '',
    category: 'privacy'
  },
  {
    id: 'ext-json-view',
    name: 'Amazer Fast JSON Formatter',
    version: '1.0.8',
    description: 'Collapsible high-speed syntax highlighter for API responses and JSON payloads.',
    author: 'Developer Utilities',
    icon: 'Code',
    enabled: true,
    permissions: ['contentScripts'],
    hasPopup: false,
    category: 'utility'
  }
];

export const INITIAL_SYNC_DEVICES: SyncDevice[] = [
  {
    id: 'dev-desktop',
    name: 'Amazer Workstation (Linux)',
    type: 'desktop',
    lastSync: Date.now() - 1000 * 60 * 3,
    isCurrent: true,
    ip: '192.168.1.104',
    status: 'synced'
  },
  {
    id: 'dev-laptop',
    name: 'Amazer MacBook Air M3',
    type: 'laptop',
    lastSync: Date.now() - 1000 * 60 * 42,
    isCurrent: false,
    ip: '192.168.1.189',
    status: 'synced'
  },
  {
    id: 'dev-mobile',
    name: 'Amazer Phone (Android)',
    type: 'mobile',
    lastSync: Date.now() - 1000 * 60 * 180,
    isCurrent: false,
    ip: '10.0.0.45',
    status: 'synced'
  }
];

export const INITIAL_SYNC_SETTINGS: SyncSettings = {
  enabled: true,
  syncHistory: true,
  syncBookmarks: true,
  syncPasswords: true,
  syncExtensions: true,
  syncKey: 'amz_sync_7f8a92b3_e910_4c51_88ba',
  lastGlobalSync: Date.now() - 1000 * 60 * 3
};

export const INITIAL_PERFORMANCE_SETTINGS: PerformanceSettings = {
  memorySaver: true,
  discardInactiveTabsMinutes: 10,
  aggressiveAdBlocking: true,
  blockScamPopups: true,
  blockFingerprinting: true,
  prefetchResources: true,
  hardwareAccel: true
};

export const INITIAL_PERFORMANCE_STATS: PerformanceStats = {
  totalAdsBlocked: 1428,
  totalPopupsBlocked: 89,
  totalTrackersBlocked: 3241,
  totalRamSavedMb: 846,
  totalCpuTimeSavedSeconds: 214,
  speedMultiplier: 2.8
};

export const INITIAL_HOMEPAGE_SHORTCUTS: HomepageShortcut[] = [
  {
    id: 'sc-1',
    title: 'Ad & Scam Sandbox',
    url: 'https://sandbox.amazer.test/ads-scams',
    icon: '🛡️',
    desc: 'Test EasyList & scam blocker',
    order: 0
  },
  {
    id: 'sc-2',
    title: 'TechNews Daily',
    url: 'https://technews.amazer.test',
    icon: '⚡',
    desc: 'High-speed clean media feed',
    order: 1
  },
  {
    id: 'sc-3',
    title: 'Password Vault',
    url: 'amazer://passwords',
    icon: '🔑',
    desc: 'View & manage saved logins',
    order: 2
  },
  {
    id: 'sc-4',
    title: 'EasyList Filter Engine',
    url: 'amazer://shields',
    icon: '📋',
    desc: 'Rule editor & tracker inspect',
    order: 3
  },
  {
    id: 'sc-5',
    title: 'RAM & CPU Saver',
    url: 'amazer://performance',
    icon: '🚀',
    desc: 'Memory optimizer telemetry',
    order: 4
  },
  {
    id: 'sc-6',
    title: 'Browsing History',
    url: 'amazer://history',
    icon: '⏱️',
    desc: 'Cross-device encrypted history',
    order: 5
  },
  {
    id: 'sc-7',
    title: 'GitHub',
    url: 'https://github.com',
    icon: '🐙',
    desc: 'Developer code repositories',
    order: 6
  },
  {
    id: 'sc-8',
    title: 'Wikipedia',
    url: 'https://wikipedia.org',
    icon: '📚',
    desc: 'Free encyclopedia',
    order: 7
  }
];

export const INITIAL_HOMEPAGE_SETTINGS: HomepageSettings = {
  background: 'clean',
  searchProvider: 'amazer',
  showEfficiencyStats: true,
  showRecentlyClosed: true,
  blurBackground: false
};

export const INITIAL_READER_SETTINGS: ReaderSettings = {
  theme: 'sepia',
  fontFamily: 'serif',
  fontSize: 18,
  columnWidth: 'medium',
  lineHeight: 'normal'
};

// Storage helper
export const BrowserStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`amazer_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`amazer_${key}`, JSON.stringify(value));
    } catch {
      // Storage full or restricted
    }
  }
};
