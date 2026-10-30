import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Lock,
  LockOpen,
  Star,
  MoreVertical,
  Layers,
  BookOpen,
  Code,
  Moon,
  Monitor,
  Search,
  Settings,
  Shield,
  Download,
  Clock,
  Bookmark as BookmarkIcon,
  Plus,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Wallet,
  Flame
} from 'lucide-react';
import { Tab, SearchEngine } from '../types/browser';
import { SEARCH_ENGINES } from '../data/searchEngines';

interface ToolbarProps {
  currentTab: Tab;
  tabsCount: number;
  isBookmarked: boolean;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onToggleBookmark: () => void;
  onOpenTabsDrawer: () => void;
  onOpenTonWallet: () => void;
  walletAgenBalance: number;
  pendingReward: number;
  onOpenSslDialog: () => void;
  onOpenAdBlockModal: () => void;
  onOpenBookmarksModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenDownloadsModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenFindInPage: () => void;
  onNewTab: (incognito?: boolean) => void;
  onToggleReaderMode: () => void;
  onToggleViewSource: () => void;
  onToggleDesktopMode: () => void;
  onToggleInvertColors: () => void;
  onAdjustZoom: (delta: number) => void;
  accentColor: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentTab,
  tabsCount,
  isBookmarked,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  onToggleBookmark,
  onOpenTabsDrawer,
  onOpenTonWallet,
  walletAgenBalance,
  pendingReward,
  onOpenSslDialog,
  onOpenAdBlockModal,
  onOpenBookmarksModal,
  onOpenHistoryModal,
  onOpenDownloadsModal,
  onOpenSettingsModal,
  onOpenFindInPage,
  onNewTab,
  onToggleReaderMode,
  onToggleViewSource,
  onToggleDesktopMode,
  onToggleInvertColors,
  onAdjustZoom,
  accentColor
}) => {
  const [inputUrl, setInputUrl] = useState(currentTab.url === 'fulguris://home' ? '' : currentTab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input URL when active tab or tab's url changes
  useEffect(() => {
    setInputUrl(currentTab.url === 'fulguris://home' ? '' : currentTab.url);
  }, [currentTab.url, currentTab.id]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Compute suggestions when typing
  useEffect(() => {
    if (!isFocused || !inputUrl.trim()) {
      setSuggestions([]);
      return;
    }
    const q = inputUrl.trim().toLowerCase();
    const mockList = [
      'https://github.com/Slion/Fulguris',
      'https://en.wikipedia.org/wiki/Main_Page',
      'https://duckduckgo.com',
      'https://news.ycombinator.com',
      'https://developer.mozilla.org',
      'https://reddit.com'
    ];
    const filtered = mockList.filter(item => item.toLowerCase().includes(q));
    if (!filtered.includes(inputUrl)) {
      if (!inputUrl.startsWith('http') && !inputUrl.includes('.')) {
        filtered.unshift(`Search DuckDuckGo: "${inputUrl}"`);
        filtered.unshift(`Search Google: "${inputUrl}"`);
      }
    }
    setSuggestions(filtered.slice(0, 5));
  }, [inputUrl, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setIsFocused(false);
    inputRef.current?.blur();
    setSuggestions([]);

    const trimmed = inputUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('fulguris://')) {
      onNavigate(trimmed);
    } else if (trimmed.includes('.') && !trimmed.includes(' ')) {
      onNavigate(`https://${trimmed}`);
    } else {
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
      onNavigate(searchUrl);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    if (sug.startsWith('Search DuckDuckGo: "')) {
      const q = sug.replace('Search DuckDuckGo: "', '').replace(/"$/, '');
      onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`);
    } else if (sug.startsWith('Search Google: "')) {
      const q = sug.replace('Search Google: "', '').replace(/"$/, '');
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
    } else {
      onNavigate(sug);
    }
    setIsFocused(false);
    setSuggestions([]);
  };

  const isSecure = currentTab.url.startsWith('https://');

  return (
    <div className="relative z-30 flex items-center gap-1.5 px-3 py-2 bg-slate-900 border-y border-slate-800 text-slate-200 select-none">
      {/* Navigation Controls */}
      <button
        onClick={onGoBack}
        disabled={!currentTab.canGoBack}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        title="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <button
        onClick={onGoForward}
        disabled={!currentTab.canGoForward}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        title="Forward"
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={onReload}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        title={currentTab.isLoading ? 'Stop' : 'Reload'}
      >
        {currentTab.isLoading ? (
          <X className="w-4 h-4 text-rose-400 animate-spin" />
        ) : (
          <RotateCw className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={onGoHome}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        title="Homepage"
      >
        <Home className="w-4 h-4" />
      </button>

      {/* Omnibox / Address Bar */}
      <div className="relative flex-1">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full px-3 py-1.5 rounded-xl bg-slate-800/90 border transition-all ${
            isFocused
              ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20 bg-slate-800'
              : 'border-slate-700/70 hover:border-slate-600'
          }`}
        >
          {/* SSL Lock indicator */}
          <button
            type="button"
            onClick={onOpenSslDialog}
            className="p-0.5 mr-2 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
            title="View Site Information"
          >
            {isSecure ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : currentTab.url === 'fulguris://home' ? (
              <Shield className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <LockOpen className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* URL text input */}
          <input
            ref={inputRef}
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              inputRef.current?.select();
            }}
            onBlur={() => {
              // Delay blur to allow suggestion clicking
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Search or enter web address"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />

          {/* Quick Clear button */}
          {inputUrl && isFocused && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setInputUrl('');
              }}
              className="p-1 text-slate-400 hover:text-slate-200 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bookmark toggle button */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-1 rounded transition-colors ${
              isBookmarked
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </form>

        {/* Live suggestions drop-down */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
            {suggestions.map((sug, i) => (
              <div
                key={i}
                onMouseDown={() => handleSuggestionClick(sug)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-700/70 cursor-pointer text-sm text-slate-200 border-b border-slate-700/40 last:border-b-0"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{sug}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TON Wallet Button with AGEN balance */}
      <button
        onClick={onOpenTonWallet}
        className="flex items-center gap-1.5 h-7 px-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all shadow-sm shrink-0"
        title="TON Native Wallet & AGEN Rewards"
      >
        <Wallet className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-mono text-[11px] font-bold text-amber-300">{walletAgenBalance.toFixed(1)}</span>
        {pendingReward > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      {/* Tabs Drawer Button (shows badge with active tabs count) */}
      <button
        onClick={onOpenTabsDrawer}
        className="flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-colors"
        title="Show all tabs"
      >
        <span className="text-[11px] leading-none">{tabsCount}</span>
      </button>

      {/* Action / Overflow Menu (⋮) */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Menu"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu Modal */}
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-sm">
            {/* Quick action strip */}
            <div className="flex items-center justify-around px-2 py-1.5 border-b border-slate-700/70 mb-1">
              <button
                onClick={() => {
                  onGoBack();
                  setIsMenuOpen(false);
                }}
                disabled={!currentTab.canGoBack}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onGoForward();
                  setIsMenuOpen(false);
                }}
                disabled={!currentTab.canGoForward}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                title="Forward"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onToggleBookmark();
                  setIsMenuOpen(false);
                }}
                className={`p-2 rounded-lg hover:bg-slate-700 ${isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Bookmark"
              >
                <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                onClick={() => {
                  onReload();
                  setIsMenuOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Reload"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Actions */}
            <button
              onClick={() => {
                onNewTab(false);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>New tab</span>
            </button>
            <button
              onClick={() => {
                onNewTab(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-purple-300 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>New incognito tab</span>
            </button>

            <div className="h-px bg-slate-700/70 my-1.5" />

            {/* Reading, Page & Developer tools */}
            <button
              onClick={() => {
                onToggleReaderMode();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700/60 transition-colors ${
                currentTab.isReaderMode ? 'text-blue-400 font-medium' : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Reader view</span>
              </div>
              {currentTab.isReaderMode && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Active</span>}
            </button>

            <button
              onClick={() => {
                onToggleDesktopMode();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700/60 transition-colors ${
                currentTab.isDesktopMode ? 'text-blue-400 font-medium' : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-indigo-400" />
                <span>Desktop site</span>
              </div>
              <input
                type="checkbox"
                checked={!!currentTab.isDesktopMode}
                readOnly
                className="rounded accent-blue-500"
              />
            </button>

            <button
              onClick={() => {
                onToggleInvertColors();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Invert page colors</span>
              </div>
              <input
                type="checkbox"
                checked={!!currentTab.isInverted}
                readOnly
                className="rounded accent-blue-500"
              />
            </button>

            <button
              onClick={() => {
                onToggleViewSource();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700/60 transition-colors ${
                currentTab.isViewSource ? 'text-blue-400 font-medium' : 'text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>View page source</span>
              </div>
              {currentTab.isViewSource && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">Active</span>}
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center justify-between px-4 py-2 text-slate-200">
              <span className="text-xs text-slate-400">Page zoom</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdjustZoom(-0.1)}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono min-w-[42px] text-center">
                  {Math.round(currentTab.zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => onAdjustZoom(0.1)}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-700/70 my-1.5" />

            {/* Tools & Managers */}
            <button
              onClick={() => {
                onOpenFindInPage();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Find in page</span>
            </button>

            <button
              onClick={() => {
                onOpenBookmarksModal();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <BookmarkIcon className="w-4 h-4 text-amber-400" />
              <span>Bookmarks</span>
            </button>

            <button
              onClick={() => {
                onOpenHistoryModal();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>History</span>
            </button>

            <button
              onClick={() => {
                onOpenDownloadsModal();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Downloads</span>
            </button>

            <button
              onClick={() => {
                onOpenAdBlockModal();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>AdBlocker & Privacy</span>
            </button>

            <button
              onClick={() => {
                onOpenTonWallet();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-700/60 text-amber-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>TON Wallet (AGEN)</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                {walletAgenBalance.toFixed(1)} AGEN
              </span>
            </button>

            <div className="h-px bg-slate-700/70 my-1.5" />

            {/* Settings */}
            <button
              onClick={() => {
                onOpenSettingsModal();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/60 text-slate-200 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
