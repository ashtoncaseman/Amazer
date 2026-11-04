import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, X, ShieldAlert, User } from 'lucide-react';
import { SavedLogin } from '../../types/browser';

interface SavePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (login: Omit<SavedLogin, 'id' | 'createdAt' | 'lastUsedAt'>) => void;
  initialDomain: string;
  initialUsername: string;
  initialPassword: string;
  existingLoginsCount: number;
}

export const SavePasswordModal: React.FC<SavePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDomain,
  initialUsername,
  initialPassword,
  existingLoginsCount
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState<SavedLogin['category']>('personal');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!username.trim() || !password.trim()) return;
    onSave({
      site: initialDomain.replace(/\.[^/.]+$/, '').toUpperCase(),
      domain: initialDomain,
      username: username.trim(),
      password: password.trim(),
      category,
      note: 'Saved automatically by Amazer Password Manager'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-[2px]">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-xs text-slate-800 dark:text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Save password in Amazer?
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {initialDomain}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {existingLoginsCount > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
            You already have <strong className="font-semibold">{existingLoginsCount} saved account{existingLoginsCount > 1 ? 's' : ''}</strong> for {initialDomain}. Amazer supports multiple logins per site and will save this as an additional profile.
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Account Vault Category
            </label>
            <div className="flex gap-2">
              {(['personal', 'work', 'finance'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-1 px-2 rounded-md capitalize text-[11px] font-medium transition-colors border ${
                    category === cat
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Never for this site
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};
