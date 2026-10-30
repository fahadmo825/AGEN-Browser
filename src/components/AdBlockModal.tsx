import React, { useState } from 'react';
import { X, Shield, Plus, Trash2, CheckCircle, Sliders, ListFilter } from 'lucide-react';
import { AdBlockStats } from '../types/browser';

interface AdBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AdBlockStats;
  adBlockEnabled: boolean;
  onToggleAdBlock: () => void;
  onAddWhitelist: (domain: string) => void;
  onRemoveWhitelist: (domain: string) => void;
  onAddCustomRule: (rule: string) => void;
  onRemoveCustomRule: (rule: string) => void;
}

export const AdBlockModal: React.FC<AdBlockModalProps> = ({
  isOpen,
  onClose,
  stats,
  adBlockEnabled,
  onToggleAdBlock,
  onAddWhitelist,
  onRemoveWhitelist,
  onAddCustomRule,
  onRemoveCustomRule
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'whitelist' | 'rules'>('stats');
  const [newDomain, setNewDomain] = useState('');
  const [newRule, setNewRule] = useState('');

  if (!isOpen) return null;

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    onAddWhitelist(newDomain.trim().toLowerCase());
    setNewDomain('');
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    onAddCustomRule(newRule.trim());
    setNewRule('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Fulguris ABP AdBlocker</h3>
              <p className="text-xs text-slate-400">Content Blocker & Anti-Tracking Shield</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Switch */}
        <div className="p-4 bg-slate-850/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${adBlockEnabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'}`} />
            <span className="text-sm font-semibold text-slate-200">Ad & Tracker Blocking</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={adBlockEnabled}
              onChange={onToggleAdBlock}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-3 pt-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('whitelist')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'whitelist'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Whitelisted Sites ({stats.whitelistDomains.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom ABP Rules ({stats.customFilterRules.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {stats.adsBlockedThisSession}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Ads Blocked Today</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.trackersBlockedThisSession}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Trackers Blocked</div>
                </div>
              </div>

              {/* Filter Subscriptions */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Active Filter Subscriptions
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'EasyList Standard (AdBlock Plus)', count: '48,209 rules', active: true },
                    { name: 'EasyPrivacy Tracking Protection', count: '32,114 rules', active: true },
                    { name: 'AdGuard URL Tracking Protection', count: '14,890 rules', active: true },
                    { name: 'Fanboy Annoyances & Cookie Popups', count: '18,502 rules', active: true }
                  ].map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{sub.name}</div>
                        <div className="text-slate-500 mt-0.5">{sub.count}</div>
                      </div>
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whitelist' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Ads and trackers will not be blocked on domains in your whitelist.
              </p>

              <form onSubmit={handleAddWhitelist} className="flex gap-2">
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. example.com"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>

              <div className="space-y-1.5 pt-2">
                {stats.whitelistDomains.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No whitelisted domains yet.
                  </div>
                ) : (
                  stats.whitelistDomains.map((domain, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700/50 text-xs"
                    >
                      <span className="font-mono text-slate-300">{domain}</span>
                      <button
                        onClick={() => onRemoveWhitelist(domain)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Add custom Adblock Plus (ABP) syntax filter rules (e.g. <code className="text-blue-400">||ads.example.com^</code>).
              </p>

              <form onSubmit={handleAddRule} className="flex gap-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="||evil-tracker.com^"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>

              <div className="space-y-1.5 pt-2">
                {stats.customFilterRules.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No custom rules defined.
                  </div>
                ) : (
                  stats.customFilterRules.map((rule, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700/50 text-xs"
                    >
                      <span className="font-mono text-slate-300 truncate mr-2">{rule}</span>
                      <button
                        onClick={() => onRemoveCustomRule(rule)}
                        className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-850 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
