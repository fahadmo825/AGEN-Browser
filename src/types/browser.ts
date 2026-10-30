export type ThemeMode = 'dark' | 'black' | 'light';

export type AccentColor = 'blue' | 'amber' | 'emerald' | 'purple' | 'rose';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  historyIndex: number;
  isIncognito: boolean;
  isReaderMode?: boolean;
  isViewSource?: boolean;
  isDesktopMode?: boolean;
  isInverted?: boolean;
  zoomLevel: number; // 100% = 1
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder?: string;
  favicon?: string;
  dateAdded: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  favicon?: string;
  visitCount: number;
}

export interface DownloadItem {
  id: string;
  fileName: string;
  url: string;
  fileSize: string;
  date: number;
  status: 'completed' | 'downloading' | 'failed';
}

export interface SearchEngine {
  id: string;
  name: string;
  searchUrl: string; // e.g. https://duckduckgo.com/?q=%s
  suggestionUrl?: string;
  icon: string;
  description: string;
}

export interface BrowserSettings {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  toolbarPosition: 'top' | 'bottom';
  defaultSearchEngine: string;
  adBlockEnabled: boolean;
  blockTrackers: boolean;
  doNotTrack: boolean;
  clearHistoryOnExit: boolean;
  desktopModeDefault: boolean;
  javascriptEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'huge';
  homepageUrl: string;
}

export interface AdBlockStats {
  adsBlockedThisSession: number;
  trackersBlockedThisSession: number;
  totalAdsBlocked: number;
  whitelistDomains: string[];
  customFilterRules: string[];
}

export interface SslInfo {
  domain: string;
  protocol: string;
  cipher: string;
  certificateIssuer: string;
  validUntil: string;
  isSecure: boolean;
  mixedContent: boolean;
}
