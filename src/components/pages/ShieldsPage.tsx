import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  Filter
} from 'lucide-react';
import { EasyListRule, ScamPopupEvent } from '../../types/browser';
import { easyListEngine } from '../../services/easyListEngine';

interface ShieldsPageProps {
  rules: EasyListRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (syntax: string, category: EasyListRule['category']) => void;
  onDeleteRule: (id: string) => void;
  onResetRules: () => void;
  scamEvents: ScamPopupEvent[];
  onClearScamEvents: () => void;
}

export const ShieldsPage: React.FC<ShieldsPageProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
  onResetRules,
  scamEvents,
  onClearScamEvents
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'tester' | 'scams'>('rules');
  const [testUrl, setTestUrl] = useState('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  const [testResult, setTestResult] = useState<{
    blocked: boolean;
    rule?: EasyListRule;
    category?: string;
    reason?: string;
  } | null>(null);

  const [newRuleSyntax, setNewRuleSyntax] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<EasyListRule['category']>('ads');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTestUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl.trim()) return;
    const res = easyListEngine.evaluateRequest(testUrl);
    setTestResult(res);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleSyntax.trim()) return;
    onAddRule(newRuleSyntax.trim(), newRuleCategory);
    setNewRuleSyntax('');
  };

  const filteredRules = rules.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.rawSyntax.toLowerCase().includes(q) ||
      r.pattern.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Amazer Shields & EasyList Engine
              </h1>
              <div className="text-xs text-slate-500">
                Zero-latency stream filtering · Official EasyList & EasyPrivacy parser · Scam pop-up killer
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetRules}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard EasyList</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1 my-5 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'rules'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Active Rules ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'tester'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Interactive Rule Tester
        </button>
        <button
          onClick={() => setActiveTab('scams')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'scams'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>Scam Pop-ups Intercepted</span>
          {scamEvents.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {scamEvents.length}
            </span>
          )}
        </button>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Add custom rule form */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Add Custom EasyList Filter Rule
            </h3>
            <form onSubmit={handleCreateRule} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="e.g. ||badads.com^, @@||whitelist.org^, or ###sponsored-post"
                value={newRuleSyntax}
                onChange={(e) => setNewRuleSyntax(e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <select
                value={newRuleCategory}
                onChange={(e) => setNewRuleCategory(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="ads">Ad Block</option>
                <option value="scam">Scam / Pop-up</option>
                <option value="privacy">Tracker</option>
                <option value="annoyances">Cosmetic</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            </form>
            <div className="text-[11px] text-slate-400 mt-2">
              Supports standard EasyList format: <code className="font-mono">||domain.com^</code>, <code className="font-mono">@@whitelist</code>, <code className="font-mono">##selector</code>, <code className="font-mono">$popup</code>
            </div>
          </div>

          {/* Search rules */}
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search active EasyList rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
          </div>

          {/* Rule Cards Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${
                      rule.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                        rule.enabled ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {rule.rawSyntax}
                      </code>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 px-1 py-0.2 rounded">
                        {rule.category}
                      </span>
                    </div>
                    {rule.description && (
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {rule.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                      {rule.hitCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">hits</div>
                  </div>

                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    title="Delete rule"
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tester Tab */}
      {activeTab === 'tester' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Test URL Against Amazer EasyList Engine
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Type any script, banner, or redirect URL to test whether Amazer will block or allow it.
            </p>

            <form onSubmit={handleTestUrl} className="flex gap-2 mb-3">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="Enter URL to test..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Evaluate</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-slate-400">Quick Test Samples:</span>
              {[
                'https://pagead2.googlesyndication.com/ads.js',
                'https://urgent-security-warning.xyz/win-prize',
                'https://hotjar.com/tracker.js',
                'https://github.com/react/bundle.js'
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setTestUrl(sample);
                    const res = easyListEngine.evaluateRequest(sample);
                    setTestResult(res);
                  }}
                  className="font-mono text-slate-600 dark:text-slate-400 hover:underline"
                >
                  {sample.split('/')[2]}
                </button>
              ))}
            </div>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border ${
                testResult.blocked
                  ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {testResult.blocked ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {testResult.blocked ? 'BLOCKED BY AMAZER SHIELDS' : 'ALLOWED BY AMAZER SHIELDS'}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                <div>URL: {testUrl}</div>
                {testResult.rule && (
                  <div>Matched EasyList Rule: <span className="font-semibold text-rose-600 dark:text-rose-400">{testResult.rule.rawSyntax}</span></div>
                )}
                {testResult.reason && (
                  <div>Reason: {testResult.reason}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scams Intercepted Log */}
      {activeTab === 'scams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Scam pop-ups, phishing interstitials, and tech-support lockups blocked this session.
            </div>
            {scamEvents.length > 0 && (
              <button
                onClick={onClearScamEvents}
                className="text-xs text-rose-600 hover:underline"
              >
                Clear Log
              </button>
            )}
          </div>

          {scamEvents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                All clear! No scam pop-ups attempting breach.
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                You can test Amazer's scam killer anytime in the Ad & Scam Sandbox.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {scamEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {evt.reason}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate max-w-lg">
                        Blocked target: {evt.attemptedUrl}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Triggered from: {evt.sourceUrl} · {new Date(evt.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 shrink-0">
                    KILLED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
