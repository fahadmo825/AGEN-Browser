import React, { useState, useEffect } from 'react';
import { Tab, AdBlockStats, Bookmark, HistoryItem } from '../types/browser';
import { HomePage } from './HomePage';
import { getSamplePage } from '../data/samplePages';
import { BookOpen, Code, Copy, Check, Type, ArrowLeft } from 'lucide-react';

interface WebViewProps {
  tab: Tab;
  onNavigate: (url: string) => void;
  defaultEngineId: string;
  adBlockStats: AdBlockStats;
  bookmarks: Bookmark[];
  history: HistoryItem[];
  accentColor: string;
  onToggleReaderMode: () => void;
  onToggleViewSource: () => void;
  onOpenTonWallet?: () => void;
  onOpenAiAssistant?: () => void;
  walletAgenBalance?: number;
  pendingReward?: number;
}

export const WebView: React.FC<WebViewProps> = ({
  tab,
  onNavigate,
  defaultEngineId,
  adBlockStats,
  bookmarks,
  history,
  accentColor,
  onToggleReaderMode,
  onToggleViewSource,
  onOpenTonWallet,
  onOpenAiAssistant,
  walletAgenBalance = 0,
  pendingReward = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [readerFontSize, setReaderFontSize] = useState<number>(18);

  const isHomepage = tab.url === 'fulguris://home' || !tab.url;
  const sample = getSamplePage(tab.url);

  // If homepage
  if (isHomepage) {
    return (
      <HomePage
        onNavigate={onNavigate}
        defaultEngineId={defaultEngineId}
        adBlockStats={adBlockStats}
        bookmarks={bookmarks}
        history={history}
        accentColor={accentColor}
        isIncognito={tab.isIncognito}
        onOpenTonWallet={onOpenTonWallet}
        onOpenAiAssistant={onOpenAiAssistant}
        walletAgenBalance={walletAgenBalance}
        pendingReward={pendingReward}
      />
    );
  }

  // Reader Mode View (inspired by Fulguris ReadingActivity)
  if (tab.isReaderMode) {
    const article = sample.readerArticle || {
      title: sample.title,
      author: 'Unknown Author',
      publishedDate: 'Recently',
      readingTime: '2 min read',
      content: ['No article content could be extracted from this page.']
    };

    const getThemeBg = () => {
      switch (readerTheme) {
        case 'sepia':
          return 'bg-[#f4ecd8] text-[#433422]';
        case 'light':
          return 'bg-white text-slate-800';
        default:
          return 'bg-slate-900 text-slate-200';
      }
    };

    return (
      <div className={`flex-1 overflow-y-auto ${getThemeBg()} transition-colors duration-200`}>
        {/* Reader Floating Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-black/10 dark:border-white/10 backdrop-blur-md bg-inherit/80">
          <button
            onClick={onToggleReaderMode}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Reader</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Theme switcher */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setReaderTheme('light')}
                className={`w-6 h-6 rounded-md bg-white border border-slate-300 ${readerTheme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
                title="Light"
              />
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`w-6 h-6 rounded-md bg-[#e4d3b6] border border-[#cfbe9e] ${readerTheme === 'sepia' ? 'ring-2 ring-blue-500' : ''}`}
                title="Sepia"
              />
              <button
                onClick={() => setReaderTheme('dark')}
                className={`w-6 h-6 rounded-md bg-slate-900 border border-slate-700 ${readerTheme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
                title="Dark"
              />
            </div>

            {/* Font size adjustments */}
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setReaderFontSize(s => Math.max(14, s - 2))}
                className="px-2 py-0.5 text-xs font-bold hover:opacity-75"
                title="Smaller text"
              >
                A-
              </button>
              <span className="text-xs font-mono px-1">{readerFontSize}px</span>
              <button
                onClick={() => setReaderFontSize(s => Math.min(26, s + 2))}
                className="px-2 py-0.5 text-xs font-bold hover:opacity-75"
                title="Larger text"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Reader Article Body */}
        <article className="max-w-2xl mx-auto px-6 py-10">
          <header className="mb-8 border-b border-black/10 dark:border-white/10 pb-6">
            <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs opacity-75 font-sans">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.publishedDate}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
          </header>

          <div
            className="font-serif leading-relaxed space-y-5"
            style={{ fontSize: `${readerFontSize}px` }}
          >
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  // View Source Mode (inspired by Fulguris CodeEditorActivity)
  if (tab.isViewSource) {
    const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${sample.title}</title>
  <link rel="canonical" href="${sample.url}">
</head>
<body>
  ${sample.contentHtml}
</body>
</html>`;

    const handleCopy = () => {
      navigator.clipboard.writeText(rawHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="flex-1 overflow-y-auto bg-slate-950 text-emerald-400 font-mono text-xs flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-xs text-white">Fulguris Source Code Viewer:</span>
            <span className="text-slate-400 truncate max-w-sm">{sample.url}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Source'}</span>
            </button>
            <button
              onClick={onToggleViewSource}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Back to Page
            </button>
          </div>
        </div>

        <pre className="p-4 overflow-x-auto leading-relaxed select-text whitespace-pre-wrap">
          {rawHtml}
        </pre>
      </div>
    );
  }

  // Standard Web Page View
  return (
    <div
      className={`flex-1 overflow-y-auto relative bg-slate-900 ${
        tab.isInverted ? 'filter invert hue-rotate-180 bg-slate-100 text-slate-900' : 'text-slate-100'
      }`}
      style={{
        transform: `scale(${tab.zoomLevel})`,
        transformOrigin: 'top left',
        width: `${100 / tab.zoomLevel}%`,
        height: `${100 / tab.zoomLevel}%`
      }}
    >
      {/* Loading Bar */}
      {tab.isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden z-20">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 animate-[pulse_1s_infinite] w-2/3" />
        </div>
      )}

      {/* Rendered Web Content */}
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: sample.contentHtml }}
      />
    </div>
  );
};
