import React, { useState } from 'react';
import { Search, ShieldCheck, Zap, Globe, Bookmark, Clock, ArrowRight, Wallet, Coins, Flame, Sparkles } from 'lucide-react';
import { SPEED_DIAL_ITEMS } from '../data/defaultBookmarks';
import { SEARCH_ENGINES } from '../data/searchEngines';
import { AdBlockStats, Bookmark as BookmarkType, HistoryItem } from '../types/browser';
import { AGEN_TOKEN_CONFIG } from '../types/token';

interface HomePageProps {
  onNavigate: (url: string) => void;
  defaultEngineId: string;
  adBlockStats: AdBlockStats;
  bookmarks: BookmarkType[];
  history: HistoryItem[];
  accentColor: string;
  isIncognito: boolean;
  onOpenTonWallet?: () => void;
  walletAgenBalance?: number;
  pendingReward?: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  defaultEngineId,
  adBlockStats,
  bookmarks,
  history,
  accentColor,
  isIncognito,
  onOpenTonWallet,
  walletAgenBalance = 0,
  pendingReward = 0
}) => {
  const [query, setQuery] = useState('');
  const [selectedEngineId, setSelectedEngineId] = useState(defaultEngineId);

  const selectedEngine = SEARCH_ENGINES.find(e => e.id === selectedEngineId) || SEARCH_ENGINES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const trimmed = query.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      onNavigate(trimmed);
    } else if (trimmed.includes('.') && !trimmed.includes(' ')) {
      onNavigate(`https://${trimmed}`);
    } else {
      const searchUrl = selectedEngine.searchUrl.replace('%s', encodeURIComponent(trimmed));
      onNavigate(searchUrl);
    }
  };

  const getAccentGradient = () => {
    switch (accentColor) {
      case 'amber':
        return 'from-amber-500 to-orange-500 text-amber-400';
      case 'emerald':
        return 'from-emerald-500 to-teal-500 text-emerald-400';
      case 'purple':
        return 'from-purple-500 to-indigo-500 text-purple-400';
      case 'rose':
        return 'from-rose-500 to-pink-500 text-rose-400';
      default:
        return 'from-blue-500 to-indigo-500 text-blue-400';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12 flex flex-col items-center max-w-4xl mx-auto w-full">
      {/* Brand & Logo */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className={`p-4 rounded-3xl bg-gradient-to-tr ${getAccentGradient()} shadow-lg shadow-blue-500/10 mb-3 flex items-center justify-center text-white`}>
          <Zap className="w-10 h-10 fill-current" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
          <span>Fulguris</span>
          {isIncognito && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
              Incognito
            </span>
          )}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {isIncognito
            ? 'Private browsing mode — history and cookies are not saved.'
            : 'Fast, modern, and privacy-focused web browsing.'}
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mb-8">
        <div className="relative flex items-center rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          {/* Engine Selector */}
          <div className="pl-3 pr-2 py-3 flex items-center border-r border-slate-700/60">
            <select
              value={selectedEngineId}
              onChange={(e) => setSelectedEngineId(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              {SEARCH_ENGINES.map(engine => (
                <option key={engine.id} value={engine.id} className="bg-slate-800 text-white">
                  {engine.icon} {engine.name}
                </option>
              ))}
            </select>
          </div>

          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search with ${selectedEngine.name} or type a URL...`}
            className="w-full bg-transparent px-3 py-3.5 text-base text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query.trim() && (
            <button
              type="submit"
              className="mr-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Speed Dial Grid */}
      <div className="w-full mb-10">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 px-1">
          Speed Dial
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPEED_DIAL_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.url)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-left transition-all hover:scale-[1.02] group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shrink-0 shadow`}>
                {item.icon}
              </div>
              <div className="truncate">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {item.url.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AGEN Token & TON Native Wallet Ecosystem Card */}
      <div className="w-full bg-gradient-to-br from-[#161924] via-[#0f1118] to-[#0a0b10] border border-amber-500/30 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">AGEN Token & TON Ecosystem</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  4 Billion Max Cap
                </span>
              </div>
              <p className="text-xs text-slate-400">Non-custodial native TON blockchain wallet with active Browse-to-Earn</p>
            </div>
          </div>

          {onOpenTonWallet && (
            <button
              onClick={onOpenTonWallet}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/10 flex items-center gap-1.5 transition-all shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Open TON Wallet ({walletAgenBalance.toFixed(1)} AGEN)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#0e1017] border border-[#232838] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Strict Max Supply</span>
              <span className="font-mono text-xs font-bold text-amber-400">4,000,000,000 AGEN</span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400/80" />
          </div>

          <div className="p-3 rounded-xl bg-[#0e1017] border border-[#232838] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Blockchain Protocol</span>
              <span className="font-mono text-xs font-bold text-[#0098EA]">TON Network (TEP-74)</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#0098EA]" />
          </div>

          <div className="p-3 rounded-xl bg-[#0e1017] border border-[#232838] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Browse-to-Earn Rate</span>
              <span className="font-mono text-xs font-bold text-emerald-400">+{AGEN_TOKEN_CONFIG.baseRewardPerMinute} AGEN / min</span>
            </div>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Privacy Shield Stats Card */}
      <div className="w-full bg-gradient-to-br from-slate-800/60 to-slate-850/60 border border-slate-700/60 rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Fulguris Privacy Shield</h3>
              <p className="text-xs text-slate-400">ABP AdBlocker & Anti-Tracking Engine Active</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Protected
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="text-xl font-bold text-emerald-400">
              {adBlockStats.adsBlockedThisSession}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Ads Blocked</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="text-xl font-bold text-blue-400">
              {adBlockStats.trackersBlockedThisSession}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Trackers Stopped</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="text-xl font-bold text-amber-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">HTTPS Enforced</div>
          </div>
        </div>
      </div>

      {/* Recent History or Bookmarks Shortcuts */}
      {bookmarks.length > 0 && (
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Bookmarks
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmarks.slice(0, 6).map(bm => (
              <button
                key={bm.id}
                onClick={() => onNavigate(bm.url)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[140px]">{bm.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isIncognito && history.length > 0 && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recently Visited
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 5).map(h => (
              <button
                key={h.id}
                onClick={() => onNavigate(h.url)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[160px]">{h.title || h.url}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
