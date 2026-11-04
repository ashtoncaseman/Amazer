import React from 'react';
import { Search, Globe, Bookmark, History, Shield, KeyRound, Puzzle, Zap, Sliders } from 'lucide-react';
import { OmniboxSuggestion } from '../../types/browser';

interface OmniboxSuggestionsProps {
  suggestions: OmniboxSuggestion[];
  selectedIndex: number;
  onSelect: (suggestion: OmniboxSuggestion) => void;
  inputQuery: string;
}

export const OmniboxSuggestions: React.FC<OmniboxSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  inputQuery
}) => {
  if (suggestions.length === 0) return null;

  const getIcon = (type: OmniboxSuggestion['type'], url: string) => {
    if (type === 'internal') {
      if (url.includes('passwords')) return <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      if (url.includes('shields')) return <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      if (url.includes('extensions')) return <Puzzle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      if (url.includes('performance')) return <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />;
      if (url.includes('history')) return <History className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      return <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
    if (type === 'bookmark') return <Bookmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    if (type === 'history') return <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    if (type === 'url') return <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    return <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  return (
    <div
      role="listbox"
      aria-label="Address suggestions"
      className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 py-1 divide-y divide-slate-100 dark:divide-slate-800/60"
    >
      <div className="px-3 py-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Amazer Quick Search & Suggestions</span>
        <span className="text-[10px]">Press Enter to navigate · ↑↓ to choose</span>
      </div>

      <div className="max-h-80 overflow-y-auto py-0.5">
        {suggestions.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={item.id}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(item);
                }
              }}
              className={`flex items-center justify-between gap-3 px-3 py-2 text-xs cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {getIcon(item.type, item.url)}
                <div className="truncate flex items-center gap-1.5 min-w-0">
                  <span className="font-medium truncate">{item.title}</span>
                  {item.type === 'search' && (
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate">
                      — Amazer Fast Web Search
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[200px] text-right shrink-0">
                {item.type === 'internal' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium text-[11px]">
                    Internal Page
                  </span>
                ) : item.type === 'bookmark' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-sans font-medium text-[11px]">
                    Bookmark
                  </span>
                ) : (
                  item.url
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
