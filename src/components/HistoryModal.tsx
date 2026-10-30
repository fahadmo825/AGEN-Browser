import React, { useState } from 'react';
import { X, Clock, Search, Trash2, Globe, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types/browser';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onNavigate,
  onDeleteHistoryItem,
  onClearHistory
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter(h =>
    (h.title || '').toLowerCase().includes(search.toLowerCase()) ||
    h.url.toLowerCase().includes(search.toLowerCase())
  );

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Browsing History</h3>
              <p className="text-xs text-slate-400">{history.length} records in database</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800 bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No browsing history found.
            </div>
          ) : (
            filteredHistory.map(item => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-colors"
              >
                <div
                  onClick={() => {
                    onNavigate(item.url);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {item.title || item.url}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                      <span className="font-mono">{item.url}</span>
                      <span>•</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      onNavigate(item.url);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-md hover:bg-slate-700/60 transition-colors"
                    title="Open url"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-700/60 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
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
