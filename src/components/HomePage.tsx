import React, { useState } from 'react';
import {
  Search,
  Zap,
  Globe,
  ArrowRight,
  Wallet,
  Sparkles,
  Flame,
  ShieldCheck,
  Bot
} from 'lucide-react';
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
  onOpenAiAssistant?: () => void;
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
  onOpenAiAssistant,
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

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:py-16 flex flex-col items-center justify-between max-w-4xl mx-auto w-full select-none">
      {/* Top Utility Pill Bar */}
      <div className="w-full flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center gap-2">
          {/* Incognito badge */}
          {isIncognito ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
              Private Mode
            </span>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#121520]/80 border border-[#202636] px-3 py-1 rounded-full backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shield Active</span>
              <span className="text-[10px] text-slate-500">({adBlockStats.adsBlockedThisSession} blocked)</span>
            </div>
          )}
        </div>

        {/* Right Quick Controls: AI Assistant & TON Wallet */}
        <div className="flex items-center gap-2">
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Assistant</span>
            </button>
          )}

          {onOpenTonWallet && (
            <button
              onClick={onOpenTonWallet}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all hover:scale-105"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{walletAgenBalance.toFixed(1)} AGEN</span>
              {pendingReward > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Central Hero Branding & Minimalist Search Bar */}
      <div className="w-full flex flex-col items-center text-center my-auto max-w-2xl">
        {/* Sleek Carbon Logo */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0c12] rounded-[22px] flex items-center justify-center text-amber-400">
              <Zap className="w-8 h-8 fill-current drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2">
          <span>Carbon</span>
          <span className="text-amber-400 font-light">Browser</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-md mb-8">
          Decentralized, privacy-focused Web3 browsing with native TON wallet and open-source AI intelligence.
        </p>

        {/* Minimalist Central Omnibar */}
        <form onSubmit={handleSearchSubmit} className="w-full mb-10">
          <div className="relative flex items-center rounded-2xl bg-[#0f121c]/90 border border-[#23293c] shadow-2xl shadow-black/80 focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-500/15 backdrop-blur-xl transition-all">
            {/* Search Engine Picker */}
            <div className="pl-3.5 pr-2 py-3.5 flex items-center border-r border-[#202538]">
              <select
                value={selectedEngineId}
                onChange={(e) => setSelectedEngineId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer pr-1"
              >
                {SEARCH_ENGINES.map(engine => (
                  <option key={engine.id} value={engine.id} className="bg-[#0f121c] text-white">
                    {engine.icon} {engine.name}
                  </option>
                ))}
              </select>
            </div>

            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${selectedEngine.name} or type a web address...`}
              className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />

            {/* Submit or AI Prompt trigger */}
            {query.trim() ? (
              <button
                type="submit"
                className="mr-2 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-transform hover:scale-105"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : onOpenAiAssistant ? (
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="mr-2 p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                title="Ask Open-Source AI"
              >
                <Bot className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </form>

        {/* Streamlined Speed Dial Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 w-full mb-10">
          {SPEED_DIAL_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.url)}
              className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#121520]/80 group-hover:bg-[#1a1f2e] border border-[#212739] group-hover:border-amber-400/40 flex items-center justify-center text-xl shadow-lg transition-all">
                {item.icon}
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-slate-200 truncate max-w-[64px]">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Discreet Web3 & Browse-to-Earn Status Bar */}
      <div className="w-full max-w-2xl bg-[#0d0f17]/80 border border-[#1f2434] rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Browse-to-Earn Active</span>
              <span className="text-[10px] text-emerald-400 font-mono">+{AGEN_TOKEN_CONFIG.baseRewardPerMinute} AGEN/min</span>
            </div>
            <div className="text-[11px] text-slate-500">
              TON Jetton • Strict Max Cap: <strong>4 Billion AGEN</strong>
            </div>
          </div>
        </div>

        {onOpenTonWallet && (
          <button
            onClick={onOpenTonWallet}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
          >
            TON Wallet
          </button>
        )}
      </div>
    </div>
  );
};
