import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Search,
  Check,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { SavedLogin, MasterPasswordState } from '../../types/browser';
import { masterPasswordService } from '../../services/masterPasswordService';

interface PasswordsPageProps {
  logins: SavedLogin[];
  onAddLogin: (login: Omit<SavedLogin, 'id' | 'createdAt' | 'lastUsedAt'>) => void;
  onDeleteLogin: (id: string) => void;
  onUpdateLogin: (id: string, updates: Partial<SavedLogin>) => void;
}

export const PasswordsPage: React.FC<PasswordsPageProps> = ({
  logins,
  onAddLogin,
  onDeleteLogin,
  onUpdateLogin
}) => {
  const [masterState, setMasterState] = useState<MasterPasswordState>(() =>
    masterPasswordService.getState()
  );
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangeMasterOpen, setIsChangeMasterOpen] = useState(false);

  // New login form state
  const [newSite, setNewSite] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState<SavedLogin['category']>('personal');
  const [newNote, setNewNote] = useState('');

  // Change master password state
  const [oldMasterPass, setOldMasterPass] = useState('');
  const [newMasterPass, setNewMasterPass] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    const success = await masterPasswordService.unlock(unlockInput);
    if (success) {
      setMasterState(masterPasswordService.getState());
      setUnlockInput('');
    } else {
      setUnlockError('Incorrect master password. Default for this sandbox is "amazer2026" or "amazer".');
    }
  };

  const handleLock = () => {
    masterPasswordService.lock();
    setMasterState(masterPasswordService.getState());
    setRevealedIds({});
  };

  const handleChangeMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    if (newMasterPass.length < 4) {
      setChangeError('New master password must be at least 4 characters.');
      return;
    }
    const success = await masterPasswordService.changeMasterPassword(oldMasterPass, newMasterPass);
    if (success) {
      setChangeSuccess(true);
      setTimeout(() => {
        setIsChangeMasterOpen(false);
        setChangeSuccess(false);
        setOldMasterPass('');
        setNewMasterPass('');
      }, 1200);
    } else {
      setChangeError('Current master password was incorrect.');
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain || !newUsername || !newPassword) return;

    onAddLogin({
      site: newSite.trim() || newDomain.trim(),
      domain: newDomain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      username: newUsername.trim(),
      password: newPassword.trim(),
      category: newCategory,
      note: newNote.trim()
    });

    // Reset
    setNewSite('');
    setNewDomain('');
    setNewUsername('');
    setNewPassword('');
    setNewNote('');
    setIsAddModalOpen(false);
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 18; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewPassword(res);
  };

  // Filter logins
  const filteredLogins = logins.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.site.toLowerCase().includes(query) ||
      item.domain.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query)
    );
  });

  // Group logins by domain to demonstrate multiple logins per site
  const loginsByDomain: Record<string, SavedLogin[]> = {};
  filteredLogins.forEach((lg) => {
    if (!loginsByDomain[lg.domain]) loginsByDomain[lg.domain] = [];
    loginsByDomain[lg.domain].push(lg);
  });

  // If vault is locked, show Master Password Unlock Screen
  if (!masterState.isUnlocked) {
    return (
      <div className="min-h-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 select-none">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            Amazer Passwords Vault Locked
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter your Master Password to decrypt and view saved credentials.
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="relative">
              <input
                type="password"
                value={unlockInput}
                onChange={(e) => setUnlockInput(e.target.value)}
                placeholder="Enter Master Password..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                autoFocus
              />
            </div>

            {unlockError && (
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] text-left">
                {unlockError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Vault</span>
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Hint: Default key is <code className="text-amber-600 dark:text-amber-400 font-mono">amazer2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Password Manager
              </h1>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{logins.length} saved credentials</span>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Multiple Logins per Domain Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChangeMasterOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Change Master Password
          </button>

          <button
            onClick={handleLock}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Vault</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saved Login</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="my-5">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved sites, usernames, or domains..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Logins Listing Grouped by Domain */}
      <div className="space-y-6">
        {Object.keys(loginsByDomain).length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No saved logins found
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Add a new login manually or save them automatically when browsing sites.
            </div>
          </div>
        ) : (
          Object.entries(loginsByDomain).map(([domain, domainLogins]) => (
            <div
              key={domain}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
            >
              {/* Domain Header Strip */}
              <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {domainLogins[0].site}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({domain})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {domainLogins.length} saved account{domainLogins.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Accounts under this domain */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {domainLogins.map((login) => {
                  const isRevealed = !!revealedIds[login.id];
                  return (
                    <div
                      key={login.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                    >
                      {/* Left: Username & Note */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-slate-900 dark:text-slate-100 font-mono">
                            {login.username}
                          </span>
                          {login.category && (
                            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded">
                              {login.category}
                            </span>
                          )}
                        </div>

                        {login.note && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {login.note}
                          </div>
                        )}
                      </div>

                      {/* Right: Password controls & actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Password display container */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                          <span className="tracking-widest">
                            {isRevealed ? login.password : '••••••••••••'}
                          </span>

                          <button
                            onClick={() => toggleReveal(login.id)}
                            title={isRevealed ? 'Hide password' : 'Show password'}
                            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => copyToClipboard(login.password, `pass-${login.id}`)}
                            title="Copy password"
                            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            {copiedId === `pass-${login.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Copy username */}
                        <button
                          onClick={() => copyToClipboard(login.username, `user-${login.id}`)}
                          title="Copy username"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                        >
                          {copiedId === `user-${login.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => onDeleteLogin(login.id)}
                          title="Delete saved login"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Login Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-xs text-slate-800 dark:text-slate-200">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Add Saved Login
            </h3>

            <form onSubmit={handleCreateLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GitHub, AWS, Netflix"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Domain / URL *
                </label>
                <input
                  type="text"
                  placeholder="e.g. github.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Username or Email *
                </label>
                <input
                  type="text"
                  placeholder="Username, email, or handle"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-medium"
                  >
                    Generate Strong Password
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <div className="flex gap-2">
                  {(['personal', 'work', 'finance', 'social'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`flex-1 py-1 rounded text-[11px] capitalize border ${
                        newCategory === cat
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional 2FA backup codes or account memo"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Master Password Modal */}
      {isChangeMasterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-xs text-slate-800 dark:text-slate-200">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Update Master Password
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Your master password protects all logins stored on this device.
            </p>

            <form onSubmit={handleChangeMasterPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Current Master Password
                </label>
                <input
                  type="password"
                  value={oldMasterPass}
                  onChange={(e) => setOldMasterPass(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  New Master Password
                </label>
                <input
                  type="password"
                  value={newMasterPass}
                  onChange={(e) => setNewMasterPass(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              {changeError && (
                <div className="text-[11px] text-rose-500 p-2 rounded bg-rose-50 dark:bg-rose-950/40">
                  {changeError}
                </div>
              )}

              {changeSuccess && (
                <div className="text-[11px] text-emerald-500 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Master password updated!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChangeMasterOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
