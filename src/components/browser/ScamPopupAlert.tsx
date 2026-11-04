import React from 'react';
import { ShieldAlert, X, ExternalLink, ArrowRight } from 'lucide-react';
import { ScamPopupEvent } from '../../types/browser';

interface ScamPopupAlertProps {
  events: ScamPopupEvent[];
  onDismiss: (id: string) => void;
  onOpenShields: () => void;
}

export const ScamPopupAlert: React.FC<ScamPopupAlertProps> = ({
  events,
  onDismiss,
  onOpenShields
}) => {
  if (events.length === 0) return null;

  return (
    <div className="absolute top-12 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
      {events.slice(0, 3).map((event) => (
        <div
          key={event.id}
          className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/80 rounded-xl shadow-2xl p-3 text-xs animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Scam Pop-Up Blocked
                  </span>
                  <span className="text-[10px] bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono px-1 rounded">
                    Neutralized
                  </span>
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">
                  {event.reason}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[220px] mt-0.5">
                  Blocked target: {event.attemptedUrl}
                </div>
              </div>
            </div>

            <button
              onClick={() => onDismiss(event.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Amazer Zero-Trust Filter</span>
            <button
              onClick={onOpenShields}
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>View Rule</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
