import React from 'react';
import {
  Plus,
  EyeOff,
  RotateCcw,
  KeyRound,
  History,
  Bookmark,
  Puzzle,
  Zap,
  Shield,
  Download,
  Settings,
  Sun,
  Moon,
  Trash2,
  Copy,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ClosedTabRecord } from '../../types/browser';

interface BrowserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onNewPrivateTab: () => void;
  onRestoreClosedTab: () => void;
  lastClosedTab?: ClosedTabRecord;
  onRestoreSession: () => void;
  onNavigateInternal: (page: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  showBookmarksBar: boolean;
  onToggleBookmarksBar: () => void;
  onToggleReaderMode?: () => void;
  isReadingMode?: boolean;
}

export const BrowserMenu: React.FC<BrowserMenuProps> = ({
  isOpen,
  onClose,
  onNewTab,
  onNewPrivateTab,
  onRestoreClosedTab,
  lastClosedTab,
  onRestoreSession,
  onNavigateInternal,
  isDarkMode,
  onToggleTheme,
  showBookmarksBar,
  onToggleBookmarksBar,
  onToggleReaderMode,
  isReadingMode
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-2 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs divide-y divide-slate-100 dark:divide-slate-800/70 select-none">
        {/* Core Tab Actions */}
        <div className="py-1">
          <button
            onClick={() => {
              onNewTab();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Tab</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+T</span>
          </button>

          <button
            onClick={() => {
              onNewPrivateTab();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-3.5 h-3.5 text-purple-500" />
              <span>New Private Window</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+Shift+N</span>
          </button>

          {lastClosedTab && (
            <button
              onClick={() => {
                onRestoreClosedTab();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <RotateCcw className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Restore Tab: {lastClosedTab.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">Ctrl+Shift+T</span>
            </button>
          )}

          <button
            onClick={() => {
              onRestoreSession();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Restore Last Session</span>
            </div>
          </button>
        </div>

        {/* Browser Tools */}
        <div className="py-1">
          <button
            onClick={() => {
              onNavigateInternal('amazer://passwords');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Password Manager</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Protected
            </span>
          </button>

          <button
            onClick={() => {
              onNavigateInternal('amazer://history');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-3.5 h-3.5 text-blue-500" />
              <span>History & Sync</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+H</span>
          </button>

          <button
            onClick={() => {
              onNavigateInternal('amazer://shields');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>EasyList & Scam Popups</span>
            </div>
          </button>

          <button
            onClick={() => {
              onNavigateInternal('amazer://extensions');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Puzzle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Extensions</span>
            </div>
          </button>

          <button
            onClick={() => {
              if (onToggleReaderMode) onToggleReaderMode();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isReadingMode ? 'Exit Reading Mode' : 'Reading Mode'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Alt+R</span>
          </button>

          <button
            onClick={() => {
              onNavigateInternal('amazer://performance');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Performance & RAM Saver</span>
            </div>
          </button>
        </div>

        {/* View & Import */}
        <div className="py-1">
          <button
            onClick={() => {
              onToggleBookmarksBar();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Show Bookmarks Bar</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {showBookmarksBar ? 'Shown' : 'Hidden'}
            </span>
          </button>

          <button
            onClick={() => {
              onNavigateInternal('amazer://settings?tab=import');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Import from Other Browsers</span>
            </div>
          </button>

          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
              )}
              <span>Theme</span>
            </div>
            <span className="text-[10px] text-slate-400 capitalize">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>

        {/* Settings */}
        <div className="py-1">
          <button
            onClick={() => {
              onNavigateInternal('amazer://settings');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
