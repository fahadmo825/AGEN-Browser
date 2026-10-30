import { SearchEngine } from '../types/browser';

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com/?q=%s',
    suggestionUrl: 'https://duckduckgo.com/ac/?q=%s&type=list',
    icon: '🦆',
    description: 'Privacy-focused search engine that does not track you.'
  },
  {
    id: 'google',
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=%s',
    suggestionUrl: 'https://suggestqueries.google.com/complete/search?client=firefox&q=%s',
    icon: '🔍',
    description: 'World leading search index and algorithmic ranking.'
  },
  {
    id: 'brave',
    name: 'Brave Search',
    searchUrl: 'https://search.brave.com/search?q=%s',
    icon: '🦁',
    description: 'Independent search index with privacy first architecture.'
  },
  {
    id: 'ecosia',
    name: 'Ecosia',
    searchUrl: 'https://www.ecosia.org/search?q=%s',
    icon: '🌳',
    description: 'The search engine that plants trees with its profits.'
  },
  {
    id: 'startpage',
    name: 'Startpage',
    searchUrl: 'https://www.startpage.com/do/search?q=%s',
    icon: '🛡️',
    description: 'Google results protected with strict European privacy.'
  },
  {
    id: 'qwant',
    name: 'Qwant',
    searchUrl: 'https://www.qwant.com/?q=%s',
    icon: '⚡',
    description: 'The European search engine that respects privacy.'
  },
  {
    id: 'bing',
    name: 'Bing',
    searchUrl: 'https://www.bing.com/search?q=%s',
    icon: '🌐',
    description: 'Microsoft web search and intelligent answers.'
  }
];

export const DEFAULT_SEARCH_ENGINE_ID = 'duckduckgo';
