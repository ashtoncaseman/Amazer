import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  Type,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Printer,
  Minus,
  Plus,
  AlignLeft,
  AlignCenter,
  Maximize2,
  Minimize2,
  Clock,
  User,
  Sliders,
  Check
} from 'lucide-react';
import { ReaderSettings } from '../../types/browser';
import { INITIAL_READER_SETTINGS, BrowserStorage } from '../../services/storage';

export interface ArticleData {
  title: string;
  author: string;
  publication: string;
  publishDate: string;
  readingTimeMinutes: number;
  wordCount: number;
  leadParagraph: string;
  sections: {
    heading?: string;
    paragraphs: string[];
    quote?: string;
    codeSnippet?: string;
  }[];
}

interface ReaderViewProps {
  url: string;
  article?: ArticleData;
  onExitReader: () => void;
  savedSettings?: ReaderSettings;
  onUpdateSettings?: (settings: Partial<ReaderSettings>) => void;
}

// Fallback parsed article generator if a generic URL is loaded
export function getArticleForUrl(url: string): ArticleData {
  if (url.includes('technews.amazer.test')) {
    return {
      title: 'Why Amazer Browser Consumes 60% Less RAM Than Traditional Web Browsers',
      author: 'Dr. Ashton Caseman',
      publication: 'TechNews Systems Journal',
      publishDate: 'November 4, 2026',
      readingTimeMinutes: 4,
      wordCount: 820,
      leadParagraph:
        'Modern browsers often consume gigabytes of system memory simply keeping dozens of inactive tabs alive while running resource-heavy ad tracking engines in the background. Amazer fundamentally changes this architectural assumption by executing zero-latency stream filtering at socket initialization.',
      sections: [
        {
          heading: 'The Problem: Tab Memory Leaks & Background Bloat',
          paragraphs: [
            'Traditional Chromium and WebKit forks maintain active DOM subtrees, V8 execution contexts, and persistent event loops for every background tab. As web applications increasingly integrate heavy client-side JavaScript bundles and unoptimized tracking pixels, system memory degrades rapidly.',
            'Furthermore, third-party analytics platforms inject multiple persistent setInterval timers that poll DOM mutations, preventing the CPU from entering low-power idle states.'
          ],
          quote:
            'A browser shouldn\'t feel like an operating system workload just to read a document. The ideal browser engine is invisible, swift, and strictly respectful of hardware.'
        },
        {
          heading: 'Zero-Latency Stream Filtering via Native EasyList',
          paragraphs: [
            'Rather than allowing advertising payloads and third-party trackers to download and then attempting to hide them with CSS mutations, Amazer evaluates request URLs against its internal EasyList rule tree before the HTTP socket is initialized.',
            'This pre-emptive interception eliminates up to 60% of unnecessary network bytes, prevents script execution overhead, and spares system memory from compiling unneeded bundle files.'
          ],
          codeSnippet: `// Amazer In-Process Filter Evaluation
const isBlocked = easyListEngine.evaluateRequest(request.url);
if (isBlocked) {
  request.abort('ERR_BLOCKED_BY_AMAZER_EASYLIST');
  incrementTabEfficiencyMetrics();
}`
        },
        {
          heading: 'Intelligent Tab Sleeping and Instant Wake Cycles',
          paragraphs: [
            'When a tab remains inactive beyond a user-configured threshold, Amazer serializes the session state and frees the associated V8 heap context.',
            'When the user switches back, the page reconstitutes in less than 3 milliseconds without re-fetching network resources. The result is a browser that remains cool, silent, and blisteringly fast across all workloads.'
          ]
        }
      ]
    };
  }

  if (url.includes('sandbox.amazer.test')) {
    return {
      title: 'Ad & Scam Defense Architecture: Inside Amazer\'s Zero-Trust Heuristic Engine',
      author: 'Amazer Security Research Team',
      publication: 'Amazer Engineering Benchmark',
      publishDate: 'November 4, 2026',
      readingTimeMinutes: 3,
      wordCount: 610,
      leadParagraph:
        'Malvertising and scam pop-ups frequently exploit edge cases in window.open semantics and deceptive clickjacking overlays. Here is how Amazer intercepts hostile redirect vectors before user interaction can be compromised.',
      sections: [
        {
          heading: 'Deceptive Redirects and Phishing Vectors',
          paragraphs: [
            'Rogue ad networks frequently bypass standard browser pop-up blockers by binding click events to transparent 1x1 pixel overlays. When the user taps anywhere on the screen, the browser inadvertently triggers a secondary tab navigation to a high-risk scam domain.',
            'Amazer inspects every window creation attempt against its real-time heuristic filter, halting malicious scareware alerts, fake virus warnings, and wallet drainer scripts.'
          ]
        },
        {
          heading: 'Safe Isolated Reading',
          paragraphs: [
            'In Reading Mode, Amazer completely isolates the semantic text elements of the article, discarding all inline script tags, external tracking beacons, and injected iframe wrappers.',
            'You enjoy a pristine editorial layout with complete privacy and zero distractions.'
          ]
        }
      ]
    };
  }

  // Generic extracted document
  let domain = 'web page';
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return {
    title: `Extracted Article: Reading Mode for ${domain}`,
    author: 'Amazer Content Extractor',
    publication: domain,
    publishDate: 'Today',
    readingTimeMinutes: 3,
    wordCount: 520,
    leadParagraph: `This web page content has been cleaned and formatted for distraction-free reading. All banner ads, popups, sidebar widgets, and third-party trackers from ${domain} have been stripped away.`,
    sections: [
      {
        heading: 'Distraction-Free Web Typography',
        paragraphs: [
          'Reading Mode extracts the primary text content from web documents and applies carefully calibrated typography principles: optimal line measure, balanced line height, and high-contrast color themes.',
          'You can customize the font family (Serif, Sans, Mono), text size, measure width, and color palette using the floating controls in the top bar.'
        ]
      },
      {
        heading: 'Zero Memory Overhead',
        paragraphs: [
          'By eliminating extraneous DOM nodes, animations, and recurring timer scripts, Reading Mode reduces tab CPU utilization to virtually zero, prolonging battery life and keeping your device responsive.'
        ]
      }
    ]
  };
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  url,
  article,
  onExitReader,
  savedSettings,
  onUpdateSettings
}) => {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    return savedSettings || BrowserStorage.get('reader_settings', INITIAL_READER_SETTINGS);
  });

  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const activeArticle = article || getArticleForUrl(url);

  // Sync settings helper
  const updateSettings = (updates: Partial<ReaderSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    BrowserStorage.set('reader_settings', next);
    if (onUpdateSettings) {
      onUpdateSettings(updates);
    }
  };

  // Keyboard shortcut: Escape to exit reader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitReader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitReader]);

  // Audio speech simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Style mappings based on reader settings
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'sepia':
        return 'bg-[#f7f3e8] text-[#2c2b29] selection:bg-[#e4dcbf]';
      case 'slate':
        return 'bg-[#1e293b] text-[#e2e8f0] selection:bg-[#334155]';
      case 'midnight':
        return 'bg-[#000000] text-[#d1d5db] selection:bg-[#262626]';
      case 'light':
      default:
        return 'bg-[#ffffff] text-[#111827] selection:bg-[#e5e7eb]';
    }
  };

  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case 'serif':
        return { fontFamily: "Georgia, 'Source Serif 4', Lora, Cambria, serif" };
      case 'mono':
        return { fontFamily: "var(--font-mono), monospace" };
      case 'sans':
      default:
        return { fontFamily: "var(--font-sans), sans-serif" };
    }
  };

  const getMeasureClass = () => {
    switch (settings.columnWidth) {
      case 'narrow':
        return 'max-w-xl'; // ~55ch
      case 'wide':
        return 'max-w-3xl'; // ~80ch
      case 'medium':
      default:
        return 'max-w-2xl'; // ~68ch (optimal measure)
    }
  };

  const getLineHeightClass = () => {
    switch (settings.lineHeight) {
      case 'tight':
        return 'leading-[1.55]';
      case 'relaxed':
        return 'leading-[2.0]';
      case 'normal':
      default:
        return 'leading-[1.78]';
    }
  };

  return (
    <div
      className={`min-h-full w-full flex flex-col items-center select-text relative transition-colors duration-200 overflow-y-auto ${getThemeClasses()}`}
      style={getFontFamilyStyle()}
    >
      {/* FLOATING TOP BAR FOR READER ACTIONS */}
      <header
        className="sticky top-0 z-40 w-full flex items-center justify-between px-6 py-3 border-b backdrop-blur-md transition-colors border-black/5 dark:border-white/10"
        style={{
          backgroundColor:
            settings.theme === 'sepia'
              ? 'rgba(247, 243, 232, 0.92)'
              : settings.theme === 'slate'
              ? 'rgba(30, 41, 59, 0.92)'
              : settings.theme === 'midnight'
              ? 'rgba(0, 0, 0, 0.92)'
              : 'rgba(255, 255, 255, 0.92)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium opacity-80 font-sans">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Amazer Reading Mode</span>
            <span className="opacity-40">·</span>
            <span className="truncate max-w-[200px] text-xs opacity-70">
              {activeArticle.publication}
            </span>
          </div>
        </div>

        {/* Reader Controls Toolbar */}
        <div className="flex items-center gap-2 font-sans select-none">
          {/* Read Aloud Simulation */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            title={isPlayingAudio ? 'Pause Read Aloud' : 'Read Article Aloud'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Reading ({audioProgress}%)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          {/* Typography Controls Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsControlsOpen(!isControlsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Adjust Reader Typography & Theme"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Aa</span>
            </button>

            {/* Typography Popover Menu */}
            {isControlsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsControlsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl shadow-2xl z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs space-y-4">
                  {/* Theme Palette Choice */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                      COLOR THEME
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'light', name: 'Light', bg: 'bg-[#ffffff] border-slate-300 text-black' },
                        { id: 'sepia', name: 'Sepia', bg: 'bg-[#f7f3e8] border-[#e2d8bd] text-[#2c2b29]' },
                        { id: 'slate', name: 'Slate', bg: 'bg-[#1e293b] border-slate-700 text-white' },
                        { id: 'midnight', name: 'Black', bg: 'bg-[#000000] border-neutral-800 text-white' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => updateSettings({ theme: t.id as any })}
                          className={`h-9 rounded-xl border flex items-center justify-center font-medium text-xs transition-all ${t.bg} ${
                            settings.theme === t.id
                              ? 'ring-2 ring-emerald-500 shadow-sm scale-105'
                              : 'hover:opacity-90'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family Choice */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                      FONT FAMILY
                    </label>
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      {[
                        { id: 'serif', name: 'Serif', font: 'Georgia, serif' },
                        { id: 'sans', name: 'Sans', font: 'sans-serif' },
                        { id: 'mono', name: 'Mono', font: 'monospace' }
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateSettings({ fontFamily: f.id as any })}
                          style={{ fontFamily: f.font }}
                          className={`flex-1 py-1.5 rounded-lg text-xs transition-colors ${
                            settings.fontFamily === f.id
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size Buttons */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                      <span>FONT SIZE</span>
                      <span className="font-mono">{settings.fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })
                        }
                        disabled={settings.fontSize <= 14}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Minus className="w-3 h-3" />
                        <span>A-</span>
                      </button>
                      <button
                        onClick={() =>
                          updateSettings({ fontSize: Math.min(24, settings.fontSize + 1) })
                        }
                        disabled={settings.fontSize >= 24}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <span>A+</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Column Width & Line Spacing */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                      PAGE WIDTH
                    </label>
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      {(['narrow', 'medium', 'wide'] as const).map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => updateSettings({ columnWidth: w })}
                          className={`flex-1 py-1 rounded-lg text-xs capitalize transition-colors ${
                            settings.columnWidth === w
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Exit Reader Mode */}
          <button
            onClick={onExitReader}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            title="Exit Reading Mode (Escape)"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Reader</span>
          </button>
        </div>
      </header>

      {/* ARTICLE CONTENT CONTAINER */}
      <main
        className={`w-full ${getMeasureClass()} px-6 py-12 transition-all mx-auto`}
        style={{ fontSize: `${settings.fontSize}px` }}
      >
        {/* Article Metadata Header */}
        <header className="mb-10 pb-8 border-b border-current/10 font-sans">
          <div className="flex items-center gap-2 text-xs opacity-60 mb-3">
            <span>{activeArticle.publication}</span>
            <span>·</span>
            <span>{activeArticle.publishDate}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activeArticle.readingTimeMinutes} min read</span>
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight"
            style={getFontFamilyStyle()}
          >
            {activeArticle.title}
          </h1>

          <div className="flex items-center gap-2 text-xs opacity-75">
            <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
              {activeArticle.author.charAt(0)}
            </span>
            <span className="font-medium">By {activeArticle.author}</span>
            <span className="opacity-40">·</span>
            <span className="opacity-60">{activeArticle.wordCount} words</span>
          </div>
        </header>

        {/* Lead Paragraph */}
        <p
          className={`font-medium mb-8 opacity-95 text-lg ${getLineHeightClass()}`}
        >
          {activeArticle.leadParagraph}
        </p>

        {/* Article Body Sections */}
        <div className={`space-y-8 ${getLineHeightClass()}`}>
          {activeArticle.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2
                  className="text-xl sm:text-2xl font-bold pt-4 tracking-tight opacity-90 font-sans"
                >
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="opacity-90">
                  {para}
                </p>
              ))}

              {section.quote && (
                <blockquote className="my-6 pl-4 border-l-2 border-emerald-600 italic opacity-85 text-base">
                  "{section.quote}"
                </blockquote>
              )}

              {section.codeSnippet && (
                <pre
                  className="p-4 my-6 rounded-xl font-mono text-xs overflow-x-auto border border-current/10"
                  style={{
                    backgroundColor:
                      settings.theme === 'midnight'
                        ? '#121212'
                        : settings.theme === 'slate'
                        ? '#0f172a'
                        : settings.theme === 'sepia'
                        ? '#eee7d5'
                        : '#f1f5f9'
                  }}
                >
                  <code>{section.codeSnippet}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-current/10 flex items-center justify-between text-xs opacity-60 font-sans">
          <div>Distraction-free Reading Engine · Amazer Browser</div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:underline"
          >
            Back to Top ↑
          </button>
        </footer>
      </main>
    </div>
  );
};
