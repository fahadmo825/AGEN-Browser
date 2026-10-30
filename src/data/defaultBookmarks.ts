import { Bookmark } from '../types/browser';

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-github',
    title: 'GitHub - Fulguris Browser',
    url: 'https://github.com/Slion/Fulguris',
    folder: 'Development',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg',
    dateAdded: Date.now() - 86400000 * 5
  },
  {
    id: 'bm-wikipedia',
    title: 'Wikipedia - The Free Encyclopedia',
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    folder: 'Reference',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    dateAdded: Date.now() - 86400000 * 4
  },
  {
    id: 'bm-duckduckgo',
    title: 'DuckDuckGo - Privacy Browser',
    url: 'https://duckduckgo.com',
    folder: 'Search',
    favicon: 'https://duckduckgo.com/favicon.ico',
    dateAdded: Date.now() - 86400000 * 3
  },
  {
    id: 'bm-hackernews',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    folder: 'News',
    favicon: 'https://news.ycombinator.com/favicon.ico',
    dateAdded: Date.now() - 86400000 * 2
  },
  {
    id: 'bm-mdn',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    folder: 'Development',
    favicon: 'https://developer.mozilla.org/favicon-48x48.png',
    dateAdded: Date.now() - 86400000
  },
  {
    id: 'bm-reddit',
    title: 'Reddit - Dive into anything',
    url: 'https://www.reddit.com',
    folder: 'Social',
    favicon: 'https://www.redditstatic.com/shreddit/assets/favicon/192x192.png',
    dateAdded: Date.now()
  }
];

export const SPEED_DIAL_ITEMS = [
  { title: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆', color: 'from-orange-500 to-amber-600' },
  { title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', icon: '📖', color: 'from-slate-600 to-slate-800' },
  { title: 'GitHub', url: 'https://github.com/Slion/Fulguris', icon: '🐙', color: 'from-zinc-700 to-zinc-900' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰', color: 'from-amber-600 to-orange-700' },
  { title: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '💻', color: 'from-blue-600 to-indigo-800' },
  { title: 'BBC News', url: 'https://www.bbc.com/news', icon: '🌍', color: 'from-red-600 to-rose-800' },
  { title: 'Reddit', url: 'https://www.reddit.com', icon: '🤖', color: 'from-orange-600 to-red-600' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '⚡', color: 'from-amber-500 to-orange-600' }
];
