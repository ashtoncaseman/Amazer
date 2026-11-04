import { Bookmark, HistoryItem, SavedLogin } from '../types/browser';

export interface ImportOptions {
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'brave';
  importBookmarks: boolean;
  importPasswords: boolean;
  importHistory: boolean;
  importExtensions: boolean;
}

export interface ImportResult {
  bookmarksCount: number;
  passwordsCount: number;
  historyCount: number;
  newBookmarks: Bookmark[];
  newPasswords: SavedLogin[];
  newHistory: HistoryItem[];
}

export const BROWSER_IMPORT_PROFILES: Record<
  ImportOptions['browser'],
  {
    name: string;
    icon: string;
    bookmarks: Partial<Bookmark>[];
    logins: Partial<SavedLogin>[];
    history: Partial<HistoryItem>[];
  }
> = {
  chrome: {
    name: 'Google Chrome',
    icon: '🌐',
    bookmarks: [
      { title: 'Google Cloud Console', url: 'https://console.cloud.google.com', favicon: '☁️' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '🟧' },
      { title: 'Hacker News', url: 'https://news.ycombinator.com', favicon: '🟠' },
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', favicon: '📖' },
      { title: 'Reddit Home', url: 'https://reddit.com', favicon: '🔴' }
    ],
    logins: [
      {
        site: 'Reddit',
        domain: 'reddit.com',
        username: 'ashton_reddit',
        password: 'RedditSecret2026!#',
        note: 'Imported from Google Chrome Password Manager'
      },
      {
        site: 'Stack Overflow',
        domain: 'stackoverflow.com',
        username: 'ashton.caseman@gmail.com',
        password: 'StackDevKey99$$',
        note: 'Imported from Google Chrome'
      },
      {
        site: 'Linear App',
        domain: 'linear.app',
        username: 'ashton@amazer-labs.dev',
        password: 'Lin_ProjectMgmt2026@',
        note: 'Imported from Google Chrome'
      }
    ],
    history: [
      {
        title: 'Hacker News — Show HN: Amazer Browser Launch',
        url: 'https://news.ycombinator.com/item?id=389128',
        visitedAt: Date.now() - 3600000 * 5,
        visitCount: 3
      },
      {
        title: 'TypeScript 5.8 Release Notes',
        url: 'https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/',
        visitedAt: Date.now() - 3600000 * 18,
        visitCount: 1
      }
    ]
  },
  firefox: {
    name: 'Mozilla Firefox',
    icon: '🦊',
    bookmarks: [
      { title: 'Mozilla Developer Network', url: 'https://developer.mozilla.org', favicon: '🦖' },
      { title: 'Rust Language Hub', url: 'https://rust-lang.org', favicon: '🦀' },
      { title: 'EFF Electronic Frontier Foundation', url: 'https://eff.org', favicon: '🛡️' }
    ],
    logins: [
      {
        site: 'ProtonMail',
        domain: 'proton.me',
        username: 'ashton.sec@proton.me',
        password: 'ProtonVaultPassphrase99!',
        note: 'Imported from Firefox Lockwise'
      },
      {
        site: 'GitHub Work',
        domain: 'github.com',
        username: 'ashton-firefox-dev',
        password: 'ghp_FirefoxToken8821$',
        note: 'Imported from Firefox Lockwise'
      }
    ],
    history: [
      {
        title: 'MDN Web Security & Content-Security-Policy',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
        visitedAt: Date.now() - 3600000 * 12,
        visitCount: 6
      }
    ]
  },
  safari: {
    name: 'Apple Safari',
    icon: '🧭',
    bookmarks: [
      { title: 'Apple Developer Documentation', url: 'https://developer.apple.com', favicon: '🍏' },
      { title: 'iCloud Web', url: 'https://icloud.com', favicon: '☁️' },
      { title: 'Swift.org', url: 'https://swift.org', favicon: '🦅' }
    ],
    logins: [
      {
        site: 'Apple ID',
        domain: 'apple.com',
        username: 'ashton.caseman@gmail.com',
        password: 'ApplePasskeyProtected99#',
        note: 'Imported from Apple iCloud Keychain'
      }
    ],
    history: [
      {
        title: 'Apple WebKit Blog — Standards and Performance',
        url: 'https://webkit.org/blog/',
        visitedAt: Date.now() - 3600000 * 20,
        visitCount: 2
      }
    ]
  },
  edge: {
    name: 'Microsoft Edge',
    icon: '🌊',
    bookmarks: [
      { title: 'Azure Portal', url: 'https://portal.azure.com', favicon: '🔷' },
      { title: 'Microsoft Learn', url: 'https://learn.microsoft.com', favicon: '📚' }
    ],
    logins: [
      {
        site: 'Microsoft 365',
        domain: 'microsoft.com',
        username: 'ashton@corporatecloud.net',
        password: 'MS365_CorpAuth9918$',
        note: 'Imported from Microsoft Edge'
      }
    ],
    history: [
      {
        title: 'Microsoft Learn — Modern Web Architecture',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/',
        visitedAt: Date.now() - 3600000 * 24,
        visitCount: 1
      }
    ]
  },
  brave: {
    name: 'Brave Browser',
    icon: '🦁',
    bookmarks: [
      { title: 'CoinGecko Crypto Tracker', url: 'https://coingecko.com', favicon: '🦎' },
      { title: 'Brave Search', url: 'https://search.brave.com', favicon: '🦁' }
    ],
    logins: [
      {
        site: 'Brave Rewards & Creator Portal',
        domain: 'creators.brave.com',
        username: 'creator_ashton',
        password: 'BraveTokenKey_87192!',
        note: 'Imported from Brave Browser'
      }
    ],
    history: [
      {
        title: 'Brave Privacy Research & Fingerprinting Defense',
        url: 'https://brave.com/privacy/',
        visitedAt: Date.now() - 3600000 * 8,
        visitCount: 4
      }
    ]
  }
};

export class ImportExportService {
  public static runBrowserImport(options: ImportOptions): ImportResult {
    const profile = BROWSER_IMPORT_PROFILES[options.browser];
    const newBookmarks: Bookmark[] = [];
    const newPasswords: SavedLogin[] = [];
    const newHistory: HistoryItem[] = [];

    if (options.importBookmarks && profile.bookmarks) {
      profile.bookmarks.forEach((bm, i) => {
        newBookmarks.push({
          id: `bm-imp-${options.browser}-${Date.now()}-${i}`,
          title: bm.title || 'Untitled Bookmark',
          url: bm.url || 'https://amazer.internal',
          favicon: bm.favicon || '⭐',
          createdAt: Date.now()
        });
      });
    }

    if (options.importPasswords && profile.logins) {
      profile.logins.forEach((lg, i) => {
        newPasswords.push({
          id: `login-imp-${options.browser}-${Date.now()}-${i}`,
          site: lg.site || 'Website',
          domain: lg.domain || 'example.com',
          username: lg.username || 'user',
          password: lg.password || 'password123',
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
          note: lg.note || `Imported from ${profile.name}`,
          category: 'personal'
        });
      });
    }

    if (options.importHistory && profile.history) {
      profile.history.forEach((h, i) => {
        newHistory.push({
          id: `hist-imp-${options.browser}-${Date.now()}-${i}`,
          title: h.title || 'Visited Web Page',
          url: h.url || 'https://example.com',
          visitedAt: h.visitedAt || Date.now(),
          visitCount: h.visitCount || 1,
          favicon: '🌐',
          isPrivate: false,
          syncedDeviceId: `imported-${options.browser}`
        });
      });
    }

    return {
      bookmarksCount: newBookmarks.length,
      passwordsCount: newPasswords.length,
      historyCount: newHistory.length,
      newBookmarks,
      newPasswords,
      newHistory
    };
  }

  public static exportAllData(
    bookmarks: Bookmark[],
    passwords: SavedLogin[],
    history: HistoryItem[]
  ): string {
    const data = {
      app: 'Amazer Web Browser',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      bookmarks,
      passwords,
      history
    };
    return JSON.stringify(data, null, 2);
  }
}
