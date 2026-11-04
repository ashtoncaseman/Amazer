import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  Zap,
  Check,
  Search,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Shield,
  BookOpen
} from 'lucide-react';
import { SavedLogin, Tab } from '../../types/browser';

interface SimulatedWebPageProps {
  url: string;
  tab: Tab;
  onTriggerPopup: (targetUrl: string, sourceUrl: string) => void;
  onPromptSavePassword: (domain: string, username: string, password: string) => void;
  savedLogins: SavedLogin[];
  onIncrementBlockCount: (type: 'ad' | 'popup' | 'tracker') => void;
  onToggleReaderMode?: () => void;
}

export const SimulatedWebPage: React.FC<SimulatedWebPageProps> = ({
  url,
  tab,
  onTriggerPopup,
  onPromptSavePassword,
  savedLogins,
  onIncrementBlockCount,
  onToggleReaderMode
}) => {
  // Sandbox state
  const [showBlockedAds, setShowBlockedAds] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedSavedAccount, setSelectedSavedAccount] = useState<SavedLogin | null>(null);
  const [loginSubmittedSuccess, setLoginSubmittedSuccess] = useState(false);

  // Search state
  const isSearchPage = url.startsWith('https://search.amazer.test');
  const searchQuery = new URLSearchParams(url.split('?')[1] || '').get('q') || 'Amazer browser';

  // Domain logins for autofill dropdown
  const domainLogins = savedLogins.filter(
    (l) => l.domain === 'github.com' || l.domain === 'sandbox.amazer.test' || l.domain === 'google.com'
  );

  const handleAutofill = (login: SavedLogin) => {
    setSelectedSavedAccount(login);
    setLoginUsername(login.username);
    setLoginPassword(login.password);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;

    setLoginSubmittedSuccess(true);
    // Prompt browser to save password
    onPromptSavePassword('sandbox.amazer.test', loginUsername, loginPassword);
  };

  // 1. AD & SCAM DEFENSE TEST BENCH
  if (url.includes('sandbox.amazer.test') || url.includes('/ads-scams')) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 text-slate-800 dark:text-slate-200 select-none">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Active Defense Sandbox</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  EasyList Ad & Scam Pop-up Test Bench
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Test Amazer's pop-up killer, simulated tracking beacons, and multi-login credential manager in real time.
                </p>
              </div>

              {/* Blocker Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs shrink-0">
                <span className="text-[11px] text-slate-500 px-1">Blocker View:</span>
                <button
                  onClick={() => setShowBlockedAds(false)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    !showBlockedAds
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Amazer Shield (Clean)
                </button>
                <button
                  onClick={() => setShowBlockedAds(true)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    showBlockedAds
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Unfiltered (Bloat)
                </button>
              </div>
            </div>
          </div>

          {/* Scam Pop-Up Attack Simulator */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Test 1: Scam Pop-up & Scareware Interception
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Click the triggers below to simulate malicious popups attempting to launch in the background. Amazer immediately halts the process and notifies you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  onIncrementBlockCount('popup');
                  onTriggerPopup(
                    'https://urgent-security-warning.xyz/win-prize/fake-lockup',
                    'https://sandbox.amazer.test/ads-scams'
                  );
                }}
                className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 dark:hover:bg-rose-950/40 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center justify-between">
                  <span>Tech-Support Virus Scam</span>
                  <span className="text-[10px] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Simulates full-screen browser locker alert
                </div>
              </button>

              <button
                onClick={() => {
                  onIncrementBlockCount('popup');
                  onTriggerPopup(
                    'https://claim-prize-rewards.net/survey-iphone-spin',
                    'https://sandbox.amazer.test/ads-scams'
                  );
                }}
                className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center justify-between">
                  <span>Lottery Spin Phishing</span>
                  <span className="text-[10px] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Simulates background pop-under survey redirect
                </div>
              </button>

              <button
                onClick={() => {
                  onIncrementBlockCount('popup');
                  onTriggerPopup(
                    'https://ad-shield-cleaner-install.info/rogue-cleaner.exe',
                    'https://sandbox.amazer.test/ads-scams'
                  );
                }}
                className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 dark:hover:bg-purple-950/40 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1 flex items-center justify-between">
                  <span>Rogue Cleaner Malware</span>
                  <span className="text-[10px] font-mono group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Simulates rogue executable automatic download
                </div>
              </button>
            </div>
          </div>

          {/* Multi-Account Login Autofill & Password Saving Test */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Test 2: Multiple Saved Logins per Site & Auto-Save Credentials
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Amazer allows multiple saved accounts per website (e.g. personal vs corporate). Select from your saved vault below or submit a new login to test saving!
            </p>

            {/* Quick account selector */}
            <div className="mb-4">
              <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-2">
                Available Vault Logins for this Domain:
              </div>
              <div className="flex flex-wrap gap-2">
                {domainLogins.map((lg) => (
                  <button
                    key={lg.id}
                    onClick={() => handleAutofill(lg)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      selectedSavedAccount?.id === lg.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>{lg.username}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      ({lg.category || 'personal'})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="max-w-md space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Sign In & Test Save Prompt
                </button>

                {loginSubmittedSuccess && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Credentials submitted to browser!</span>
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Test 3: EasyList Ad Filter In Action */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Test 3: EasyList Cosmetic & Banner Filter
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                Rule: ||pagead2.googlesyndication.com^
              </span>
            </div>

            {showBlockedAds ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/30 text-center">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    [UNBLOCKED ADVERTISEMENT BANNER]
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Heavy JavaScript tracking payload (340 KB) · Consumes 18% CPU on render
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 text-center text-[10px] text-rose-500 font-mono"
                    >
                      Taboola Sponsored Ad #{n}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-center">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>All Advertisements Blocked by Amazer EasyList Engine</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  DOM tree cleaned in 0.2ms. Zero unnecessary network bytes downloaded.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. TECHNEWS DAILY SIMULATION
  if (url.includes('technews.amazer.test')) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-6 select-none">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                TechNews Daily
              </div>
              <div className="text-xs text-slate-500">
                Latest updates from browser architectures and systems engineering
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onToggleReaderMode && (
                <button
                  onClick={onToggleReaderMode}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  title="Strip ads & sidebars with Reading Mode"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Reading Mode</span>
                </button>
              )}
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                ⚡ 4 Ads Stripped by Amazer
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <article className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    Browser Innovations
                  </span>
                  {onToggleReaderMode && (
                    <button
                      onClick={onToggleReaderMode}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Read Clean Article</span>
                    </button>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 mb-2">
                  Why Amazer Browser Consumes 60% Less RAM Than Traditional Browsers
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  By executing EasyList network blocking before socket initialization and aggressively sleeping idle tab execution contexts, Amazer achieves near-instant page paints without heating up CPU cores or exhausting system memory.
                </p>
                <div className="text-[11px] text-slate-400">
                  Published 2 hours ago · 4 min read
                </div>
              </article>

              <article className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Security Deep Dive
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 mb-2">
                  How Zero-Trust Pop-up Trapping Neutralizes Malicious Tech-Support Scareware
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Rogue advertising networks frequently exploit deceptive click-jacking triggers. Amazer examines navigation intentions with its real-time heuristic filter, halting malicious redirects before an unrequested window can capture user focus.
                </p>
                <div className="text-[11px] text-slate-400">
                  Published today · 6 min read
                </div>
              </article>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Trending Topics
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="hover:text-blue-500 cursor-pointer"># WebAssembly V8 JIT</div>
                  <div className="hover:text-blue-500 cursor-pointer"># EasyList Syntax 2026</div>
                  <div className="hover:text-blue-500 cursor-pointer"># PBKDF2 Password Vaults</div>
                  <div className="hover:text-blue-500 cursor-pointer"># Cross-Device Sync</div>
                </div>
              </div>

              {/* Clean Ad Slot Filter Indicator */}
              <div className="p-3.5 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-center">
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Ad Slot Hidden
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  EasyList Rule: ##.ad-placement-top
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. AMAZER FAST SEARCH ENGINE
  if (isSearchPage) {
    return (
      <div className="min-h-full bg-white dark:bg-slate-950 p-6 select-none">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Amazer Fast Search
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Results for: "{searchQuery}"
            </span>
          </div>

          <div className="space-y-5">
            {[
              {
                title: 'Amazer: The Ultra-Fast Minimalist Browser with Native EasyList',
                url: 'https://amazer-labs.dev/browser-overview',
                snippet: 'Discover the Amazer web browser architecture. Featuring zero-latency stream filtering, master-password-protected credentials vault, and tab sleeping.'
              },
              {
                title: 'EasyList — Filter lists for adblockers',
                url: 'https://github.com/easylist/easylist',
                snippet: 'EasyList is the primary filter list that removes most advertisements from English-language web pages, including banners, pop-ups, and video prerolls.'
              },
              {
                title: 'High-Performance Web Applications and Low RAM Usage',
                url: 'https://developer.mozilla.org/en-US/docs/Web/Performance',
                snippet: 'Techniques for measuring, optimizing, and reducing DOM memory footprint and CPU thread consumption on desktop and mobile browsers.'
              }
            ].map((res, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                  {res.url}
                </div>
                <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {res.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for custom or arbitrary URLs
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center select-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Amazer Safe Web Viewport
        </h2>
        <p className="text-xs font-mono text-slate-500 mb-4 truncate">
          {url}
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1 mb-5">
          <div className="flex items-center justify-between">
            <span>EasyList Stream Filter:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Scam Pop-up Killer:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Armed</span>
          </div>
          <div className="flex items-center justify-between">
            <span>RAM Conservation Mode:</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">Enabled</span>
          </div>
        </div>
        <button
          onClick={() => onPromptSavePassword(new URL(url).hostname || 'example.com', 'user@example.com', 'SecurePass2026!')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
        >
          Test Password Save on this Site
        </button>
      </div>
    </div>
  );
};
