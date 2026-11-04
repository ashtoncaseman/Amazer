import React, { useState } from 'react';
import { Star, Folder, Plus, X, Globe, ExternalLink } from 'lucide-react';
import { Bookmark, BookmarkFolder } from '../../types/browser';

interface BookmarksBarProps {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  onNavigate: (url: string) => void;
  onAddCurrentPage: () => void;
  onDeleteBookmark: (id: string) => void;
  currentUrl: string;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  bookmarks,
  folders,
  onNavigate,
  onAddCurrentPage,
  onDeleteBookmark,
  currentUrl
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const isCurrentBookmarked = bookmarks.some(b => b.url === currentUrl);

  return (
    <div className="flex items-center justify-between h-7 px-3 bg-slate-50/80 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 select-none overflow-x-auto no-scrollbar gap-2">
      <div className="flex items-center gap-1 min-w-0">
        {/* All Bookmarks list */}
        {bookmarks.slice(0, 10).map((bm) => {
          const isActive = currentUrl === bm.url;
          return (
            <div
              key={bm.id}
              className="group relative flex items-center shrink-0"
            >
              <button
                onClick={() => onNavigate(bm.url)}
                title={bm.url}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs leading-none shrink-0">
                  {bm.favicon || '⭐'}
                </span>
                <span className="truncate max-w-[130px]">{bm.title}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBookmark(bm.id);
                }}
                title="Remove bookmark"
                className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white rounded-full flex items-center justify-center transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onAddCurrentPage}
          title={isCurrentBookmarked ? 'Page is bookmarked' : 'Bookmark this page (Ctrl+D)'}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
            isCurrentBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Star className={`w-3 h-3 ${isCurrentBookmarked ? 'fill-amber-500' : ''}`} />
          <span className="hidden sm:inline text-[10px]">
            {isCurrentBookmarked ? 'Saved' : 'Add'}
          </span>
        </button>
      </div>
    </div>
  );
};
