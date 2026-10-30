import React, { useState, useEffect, useCallback } from 'react';
import { Tab, BrowserSettings, AdBlockStats, Bookmark, HistoryItem, DownloadItem } from './types/browser';
import { TonWallet, WalletTransaction, AGEN_TOKEN_CONFIG } from './types/token';
import {
  getOrCreateWallet,
  saveWallet,
  getTransactions,
  saveTransactions,
  getCirculatingSupply,
  recordSupplyMinted
} from './services/tonWalletService';
import { DEFAULT_BOOKMARKS } from './data/defaultBookmarks';
import { DEFAULT_SEARCH_ENGINE_ID } from './data/searchEngines';
import { TabBar } from './components/TabBar';
import { Toolbar } from './components/Toolbar';
import { WebView } from './components/WebView';
import { TabDrawer } from './components/TabDrawer';
import { SslDialog } from './components/SslDialog';
import { AdBlockModal } from './components/AdBlockModal';
import { BookmarksModal } from './components/BookmarksModal';
import { HistoryModal } from './components/HistoryModal';
import { DownloadsModal } from './components/DownloadsModal';
import { SettingsModal } from './components/SettingsModal';
import { FindInPage } from './components/FindInPage';
import { TonWalletDrawer } from './components/TonWalletDrawer';
import { BrowseToEarnBanner } from './components/BrowseToEarnBanner';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AiAssistantConfig } from './types/ai';
import { getSamplePage } from './data/samplePages';

const INITIAL_SETTINGS: BrowserSettings = {
  themeMode: 'dark',
  accentColor: 'amber', // Modern luxury gold accent by default
  toolbarPosition: 'top',
  defaultSearchEngine: DEFAULT_SEARCH_ENGINE_ID,
  adBlockEnabled: true,
  blockTrackers: true,
  doNotTrack: true,
  clearHistoryOnExit: false,
  desktopModeDefault: false,
  javascriptEnabled: true,
  fontSize: 'medium',
  homepageUrl: 'fulguris://home'
};

const INITIAL_STATS: AdBlockStats = {
  adsBlockedThisSession: 14,
  trackersBlockedThisSession: 29,
  totalAdsBlocked: 412,
  whitelistDomains: ['github.com'],
  customFilterRules: ['||analytics.google.com^', '||ads.twitter.com^']
};

export const App: React.FC = () => {
  // Settings
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    try {
      const saved = localStorage.getItem('fulguris_settings');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // TON Native Wallet & AGEN Tokens
  const [wallet, setWallet] = useState<TonWallet>(() => getOrCreateWallet());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => getTransactions());
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Open-Source AI Assistant State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>(() => {
    try {
      const saved = localStorage.getItem('fulguris_ai_config');
      return saved ? JSON.parse(saved) : {
        selectedModelId: 'deepseek-r1',
        temperature: 0.7,
        systemPrompt: 'You are a sovereign, privacy-preserving AI assistant integrated directly into the browser.',
        webSearchGrounding: true
      };
    } catch {
      return {
        selectedModelId: 'deepseek-r1',
        temperature: 0.7,
        systemPrompt: 'You are a sovereign, privacy-preserving AI assistant integrated directly into the browser.',
        webSearchGrounding: true
      };
    }
  });

  // Browse-to-Earn Rewards State
  const [pendingReward, setPendingReward] = useState<number>(0.05);
  const [isBrowsingActive, setIsBrowsingActive] = useState<boolean>(true);
  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());

  // Tabs
  const [tabs, setTabs] = useState<Tab[]>(() => [
    {
      id: 'tab-1',
      title: 'Homepage',
      url: 'fulguris://home',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['fulguris://home'],
      historyIndex: 0,
      isIncognito: false,
      zoomLevel: 1
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Bookmarks & History
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('fulguris_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('fulguris_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'hist-1',
          title: 'GitHub - Fulguris Browser',
          url: 'https://github.com/Slion/Fulguris',
          timestamp: Date.now() - 3600000,
          visitCount: 3
        },
        {
          id: 'hist-2',
          title: 'Wikipedia, the free encyclopedia',
          url: 'https://en.wikipedia.org/wiki/Main_Page',
          timestamp: Date.now() - 7200000,
          visitCount: 1
        }
      ];
    } catch {
      return [];
    }
  });

  // Downloads
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: 'dl-1',
      fileName: 'fulguris-5.1.0-agent.apk',
      url: 'https://github.com/Slion/Fulguris/releases',
      fileSize: '4.8 MB',
      date: Date.now() - 86400000,
      status: 'completed'
    }
  ]);

  // AdBlock Stats
  const [adBlockStats, setAdBlockStats] = useState<AdBlockStats>(INITIAL_STATS);

  // Modals state
  const [isTabsDrawerOpen, setIsTabsDrawerOpen] = useState(false);
  const [isSslDialogOpen, setIsSslDialogOpen] = useState(false);
  const [isAdBlockModalOpen, setIsAdBlockModalOpen] = useState(false);
  const [isBookmarksModalOpen, setIsBookmarksModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFindInPageOpen, setIsFindInPageOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fulguris_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('fulguris_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('fulguris_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useEffect(() => {
    if (!settings.clearHistoryOnExit) {
      localStorage.setItem('fulguris_history', JSON.stringify(history));
    }
  }, [history, settings.clearHistoryOnExit]);

  // Save wallet and transactions whenever updated
  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Browse-to-Earn Active Engagement Engine
  // Listens to user interactions and accumulates rewards based on engagement while respecting the 4 Billion max supply cap
  const registerUserActivity = useCallback(() => {
    setLastActiveTime(Date.now());
    setIsBrowsingActive(true);
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, registerUserActivity, { passive: true }));
    return () => {
      events.forEach(evt => window.removeEventListener(evt, registerUserActivity));
    };
  }, [registerUserActivity]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const isRecentlyActive = now - lastActiveTime < 45000; // Active within 45 seconds

      if (isRecentlyActive) {
        setIsBrowsingActive(true);
        // Check current supply against strict 4,000,000,000 AGEN max cap
        const circulating = getCirculatingSupply();
        if (circulating + pendingReward < AGEN_TOKEN_CONFIG.maxSupply) {
          // Add ~0.00625 AGEN per 2.5s (yielding ~0.15 AGEN per active minute)
          const increment = 0.00625;
          setPendingReward(prev => Number((prev + increment).toFixed(5)));
        }
      } else {
        setIsBrowsingActive(false);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [lastActiveTime, pendingReward]);

  // Claim Browse-to-Earn rewards into TON wallet
  const handleClaimReward = () => {
    if (pendingReward <= 0) return;
    const circulating = getCirculatingSupply();
    const allowedMint = Math.min(pendingReward, AGEN_TOKEN_CONFIG.maxSupply - circulating);

    if (allowedMint <= 0) {
      alert('Strict maximum supply cap of 4,000,000,000 AGEN has been reached. No further tokens can be minted.');
      return;
    }

    recordSupplyMinted(allowedMint);

    const newBalance = wallet.agenBalance + allowedMint;
    const updatedWallet = { ...wallet, agenBalance: newBalance };
    setWallet(updatedWallet);

    const newTx: WalletTransaction = {
      id: `tx-reward-${Date.now()}`,
      txHash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      type: 'reward',
      amount: parseFloat(allowedMint.toFixed(4)),
      token: 'AGEN',
      timestamp: Date.now(),
      fromAddress: 'EQ_AGEN_REWARDS_POOL_MASTER',
      toAddress: wallet.address,
      status: 'confirmed',
      comment: 'Browse-to-Earn Session Reward'
    };

    setTransactions(prev => [newTx, ...prev]);
    setPendingReward(0);
  };

  // Send Token from TON wallet
  const handleSendToken = (token: 'TON' | 'AGEN', amount: number, toAddress: string, comment?: string): boolean => {
    if (token === 'TON') {
      if (wallet.tonBalance < amount) return false;
      setWallet(prev => ({ ...prev, tonBalance: prev.tonBalance - amount }));
    } else {
      if (wallet.agenBalance < amount) return false;
      setWallet(prev => ({ ...prev, agenBalance: prev.agenBalance - amount }));
    }

    const newTx: WalletTransaction = {
      id: `tx-send-${Date.now()}`,
      txHash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      type: 'send',
      amount,
      token,
      timestamp: Date.now(),
      fromAddress: wallet.address,
      toAddress,
      status: 'confirmed',
      comment
    };

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const handleWalletBackupConfirmed = () => {
    setWallet(prev => ({ ...prev, isBackedUp: true }));
  };

  // Active Tab
  const currentTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Navigation handlers
  const navigate = (url: string) => {
    const sample = getSamplePage(url);
    const title = url === 'fulguris://home' ? 'Homepage' : sample.title;

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const newHist = [...t.history.slice(0, t.historyIndex + 1), url];
        return {
          ...t,
          url,
          title,
          isLoading: false,
          history: newHist,
          historyIndex: newHist.length - 1,
          canGoBack: newHist.length > 1,
          canGoForward: false,
          isReaderMode: false,
          isViewSource: false
        };
      }
      return t;
    }));

    // Add to history if not incognito and not home
    if (!currentTab.isIncognito && url !== 'fulguris://home') {
      setHistory(prev => [
        {
          id: `hist-${Date.now()}`,
          title,
          url,
          timestamp: Date.now(),
          visitCount: 1
        },
        ...prev.filter(h => h.url !== url)
      ]);

      // Increment adblock count
      if (settings.adBlockEnabled) {
        setAdBlockStats(prev => ({
          ...prev,
          adsBlockedThisSession: prev.adsBlockedThisSession + 1,
          trackersBlockedThisSession: prev.trackersBlockedThisSession + 2,
          totalAdsBlocked: prev.totalAdsBlocked + 1
        }));
      }

      // Interaction boost for Browse-to-Earn
      setPendingReward(prev => Number((prev + 0.01).toFixed(5)));
    }
  };

  const goBack = () => {
    if (!currentTab.canGoBack) return;
    const newIndex = currentTab.historyIndex - 1;
    const targetUrl = currentTab.history[newIndex];
    const sample = getSamplePage(targetUrl);
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return {
          ...t,
          url: targetUrl,
          title: targetUrl === 'fulguris://home' ? 'Homepage' : sample.title,
          historyIndex: newIndex,
          canGoBack: newIndex > 0,
          canGoForward: true
        };
      }
      return t;
    }));
  };

  const goForward = () => {
    if (!currentTab.canGoForward) return;
    const newIndex = currentTab.historyIndex + 1;
    const targetUrl = currentTab.history[newIndex];
    const sample = getSamplePage(targetUrl);
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return {
          ...t,
          url: targetUrl,
          title: targetUrl === 'fulguris://home' ? 'Homepage' : sample.title,
          historyIndex: newIndex,
          canGoBack: true,
          canGoForward: newIndex < t.history.length - 1
        };
      }
      return t;
    }));
  };

  const reload = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, isLoading: true };
      }
      return t;
    }));
    setTimeout(() => {
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          return { ...t, isLoading: false };
        }
        return t;
      }));
    }, 400);
  };

  const goHome = () => {
    navigate('fulguris://home');
  };

  const openNewTab = (incognito = false) => {
    const newId = `tab-${Date.now()}`;
    const newTabObj: Tab = {
      id: newId,
      title: incognito ? 'Incognito Tab' : 'New Tab',
      url: 'fulguris://home',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['fulguris://home'],
      historyIndex: 0,
      isIncognito: incognito,
      zoomLevel: 1
    };
    setTabs(prev => [...prev, newTabObj]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      setTabs([{
        id: `tab-${Date.now()}`,
        title: 'Homepage',
        url: 'fulguris://home',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        history: ['fulguris://home'],
        historyIndex: 0,
        isIncognito: false,
        zoomLevel: 1
      }]);
      setActiveTabId(tabs[0].id);
      return;
    }

    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextIdx = Math.max(0, idx - 1);
      setActiveTabId(newTabs[nextIdx].id);
    }
  };

  const closeAllTabs = (incognitoOnly = false) => {
    if (incognitoOnly) {
      const remaining = tabs.filter(t => !t.isIncognito);
      if (remaining.length === 0) {
        openNewTab(false);
      } else {
        setTabs(remaining);
        if (currentTab.isIncognito) {
          setActiveTabId(remaining[0].id);
        }
      }
    } else {
      const newId = `tab-${Date.now()}`;
      setTabs([{
        id: newId,
        title: 'Homepage',
        url: 'fulguris://home',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        history: ['fulguris://home'],
        historyIndex: 0,
        isIncognito: false,
        zoomLevel: 1
      }]);
      setActiveTabId(newId);
    }
  };

  const isCurrentBookmarked = bookmarks.some(b => b.url === currentTab.url && currentTab.url !== 'fulguris://home');

  const toggleBookmark = () => {
    if (currentTab.url === 'fulguris://home') return;
    if (isCurrentBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== currentTab.url));
    } else {
      setBookmarks(prev => [
        ...prev,
        {
          id: `bm-${Date.now()}`,
          title: currentTab.title || currentTab.url,
          url: currentTab.url,
          folder: 'Favorites',
          dateAdded: Date.now()
        }
      ]);
      // Small bonus reward for bookmarking engagement
      setPendingReward(prev => Number((prev + 0.05).toFixed(5)));
    }
  };

  const toggleReaderMode = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, isReaderMode: !t.isReaderMode, isViewSource: false };
      }
      return t;
    }));
  };

  const toggleViewSource = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, isViewSource: !t.isViewSource, isReaderMode: false };
      }
      return t;
    }));
  };

  const toggleDesktopMode = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, isDesktopMode: !t.isDesktopMode };
      }
      return t;
    }));
  };

  const toggleInvertColors = () => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, isInverted: !t.isInverted };
      }
      return t;
    }));
  };

  const adjustZoom = (delta: number) => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const next = Math.max(0.5, Math.min(2.0, t.zoomLevel + delta));
        return { ...t, zoomLevel: Number(next.toFixed(1)) };
      }
      return t;
    }));
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${
      settings.themeMode === 'black' ? 'bg-[#050608] text-slate-100' : 'bg-[#090b10] text-slate-100'
    }`}>
      {/* Desktop Tab Bar (top strip) */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={closeTab}
        onNewTab={openNewTab}
        accentColor={settings.accentColor}
      />

      {/* Find in page widget */}
      <FindInPage
        isOpen={isFindInPageOpen}
        onClose={() => setIsFindInPageOpen(false)}
      />

      {/* Main Toolbar (Top placement) */}
      {settings.toolbarPosition === 'top' && (
        <Toolbar
          currentTab={currentTab}
          tabsCount={tabs.length}
          isBookmarked={isCurrentBookmarked}
          onNavigate={navigate}
          onGoBack={goBack}
          onGoForward={goForward}
          onReload={reload}
          onGoHome={goHome}
          onToggleBookmark={toggleBookmark}
          onOpenTabsDrawer={() => setIsTabsDrawerOpen(true)}
          onOpenTonWallet={() => setIsWalletOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          walletAgenBalance={wallet.agenBalance}
          pendingReward={pendingReward}
          onOpenSslDialog={() => setIsSslDialogOpen(true)}
          onOpenAdBlockModal={() => setIsAdBlockModalOpen(true)}
          onOpenBookmarksModal={() => setIsBookmarksModalOpen(true)}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenFindInPage={() => setIsFindInPageOpen(true)}
          onNewTab={openNewTab}
          onToggleReaderMode={toggleReaderMode}
          onToggleViewSource={toggleViewSource}
          onToggleDesktopMode={toggleDesktopMode}
          onToggleInvertColors={toggleInvertColors}
          onAdjustZoom={adjustZoom}
          accentColor={settings.accentColor}
        />
      )}

      {/* Web Rendering Surface */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-[#090b10]">
        <WebView
          tab={currentTab}
          onNavigate={navigate}
          defaultEngineId={settings.defaultSearchEngine}
          adBlockStats={adBlockStats}
          bookmarks={bookmarks}
          history={history}
          accentColor={settings.accentColor}
          onToggleReaderMode={toggleReaderMode}
          onToggleViewSource={toggleViewSource}
          onOpenTonWallet={() => setIsWalletOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          walletAgenBalance={wallet.agenBalance}
          pendingReward={pendingReward}
        />
      </div>

      {/* Main Toolbar (Bottom placement option) */}
      {settings.toolbarPosition === 'bottom' && (
        <Toolbar
          currentTab={currentTab}
          tabsCount={tabs.length}
          isBookmarked={isCurrentBookmarked}
          onNavigate={navigate}
          onGoBack={goBack}
          onGoForward={goForward}
          onReload={reload}
          onGoHome={goHome}
          onToggleBookmark={toggleBookmark}
          onOpenTabsDrawer={() => setIsTabsDrawerOpen(true)}
          onOpenTonWallet={() => setIsWalletOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          walletAgenBalance={wallet.agenBalance}
          pendingReward={pendingReward}
          onOpenSslDialog={() => setIsSslDialogOpen(true)}
          onOpenAdBlockModal={() => setIsAdBlockModalOpen(true)}
          onOpenBookmarksModal={() => setIsBookmarksModalOpen(true)}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenFindInPage={() => setIsFindInPageOpen(true)}
          onNewTab={openNewTab}
          onToggleReaderMode={toggleReaderMode}
          onToggleViewSource={toggleViewSource}
          onToggleDesktopMode={toggleDesktopMode}
          onToggleInvertColors={toggleInvertColors}
          onAdjustZoom={adjustZoom}
          accentColor={settings.accentColor}
        />
      )}

      {/* Floating Browse-to-Earn Rewards Widget */}
      <BrowseToEarnBanner
        pendingReward={pendingReward}
        isActive={isBrowsingActive}
        onOpenWallet={() => setIsWalletOpen(true)}
        onClaim={handleClaimReward}
      />

      {/* TON Native Wallet Slide-over Drawer */}
      <TonWalletDrawer
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        wallet={wallet}
        transactions={transactions}
        pendingReward={pendingReward}
        onClaimReward={handleClaimReward}
        onSendToken={handleSendToken}
        onWalletBackupConfirmed={handleWalletBackupConfirmed}
      />

      {/* Open-Source AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentPageTitle={currentTab.title}
        currentPageUrl={currentTab.url}
        config={aiConfig}
        onUpdateConfig={(updates) => setAiConfig(prev => ({ ...prev, ...updates }))}
      />

      {/* Tabs Drawer Modal */}
      <TabDrawer
        isOpen={isTabsDrawerOpen}
        onClose={() => setIsTabsDrawerOpen(false)}
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={closeTab}
        onNewTab={openNewTab}
        onCloseAllTabs={closeAllTabs}
        accentColor={settings.accentColor}
      />

      {/* SSL Dialog */}
      <SslDialog
        isOpen={isSslDialogOpen}
        onClose={() => setIsSslDialogOpen(false)}
        url={currentTab.url}
      />

      {/* AdBlock Modal */}
      <AdBlockModal
        isOpen={isAdBlockModalOpen}
        onClose={() => setIsAdBlockModalOpen(false)}
        stats={adBlockStats}
        adBlockEnabled={settings.adBlockEnabled}
        onToggleAdBlock={() => setSettings(s => ({ ...s, adBlockEnabled: !s.adBlockEnabled }))}
        onAddWhitelist={(dom) => setAdBlockStats(s => ({ ...s, whitelistDomains: [...s.whitelistDomains, dom] }))}
        onRemoveWhitelist={(dom) => setAdBlockStats(s => ({ ...s, whitelistDomains: s.whitelistDomains.filter(d => d !== dom) }))}
        onAddCustomRule={(rule) => setAdBlockStats(s => ({ ...s, customFilterRules: [...s.customFilterRules, rule] }))}
        onRemoveCustomRule={(rule) => setAdBlockStats(s => ({ ...s, customFilterRules: s.customFilterRules.filter(r => r !== rule) }))}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksModalOpen}
        onClose={() => setIsBookmarksModalOpen(false)}
        bookmarks={bookmarks}
        onNavigate={navigate}
        onAddBookmark={(title, url, folder) => setBookmarks(b => [...b, { id: `bm-${Date.now()}`, title, url, folder, dateAdded: Date.now() }])}
        onDeleteBookmark={(id) => setBookmarks(b => b.filter(bm => bm.id !== id))}
        onImportBookmarks={(imported) => setBookmarks(b => [...b, ...imported])}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onNavigate={navigate}
        onDeleteHistoryItem={(id) => setHistory(h => h.filter(item => item.id !== id))}
        onClearHistory={() => setHistory([])}
      />

      {/* Downloads Modal */}
      <DownloadsModal
        isOpen={isDownloadsModalOpen}
        onClose={() => setIsDownloadsModalOpen(false)}
        downloads={downloads}
        onClearDownloads={() => setDownloads([])}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings(s => ({ ...s, ...newVals }))}
        aiConfig={aiConfig}
        onUpdateAiConfig={(updates) => setAiConfig(prev => ({ ...prev, ...updates }))}
      />
    </div>
  );
};

export default App;
