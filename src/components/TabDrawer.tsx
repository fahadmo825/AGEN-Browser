import React, { useState } from 'react';
import { X, Plus, ShieldAlert, Globe, Trash2, Check } from 'lucide-react';
import { Tab } from '../types/browser';

interface TabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNewTab: (incognito?: boolean) => void;
  onCloseAllTabs: (incognitoOnly?: boolean) => void;
  accentColor: string;
}

export const TabDrawer: React.FC<TabDrawerProps> = ({
  isOpen,
  onClose,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseAllTabs,
  accentColor
}) => {
  const [filterMode, setFilterMode] = useState<'standard' | 'incognito'>('standard');

  if (!isOpen) return null;

  const normalTabs = tabs.filter(t => !t.isIncognito);
  const incognitoTabs = tabs.filter(t => t.isIncognito);

  const displayedTabs = filterMode === 'standard' ? normalTabs : incognitoTabs;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          {/* Tabs Filter Toggle: Standard vs Incognito */}
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setFilterMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'standard'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Standard ({normalTabs.length})</span>
            </button>
            <button
              onClick={() => setFilterMode('incognito')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'incognito'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Incognito ({incognitoTabs.length})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {displayedTabs.length > 0 && (
            <button
              onClick={() => onCloseAllTabs(filterMode === 'incognito')}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Close all in this mode"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onNewTab(filterMode === 'incognito')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow transition-transform hover:scale-105 ${
              filterMode === 'incognito' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close switcher"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {displayedTabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 mb-4 text-slate-500">
              {filterMode === 'incognito' ? (
                <ShieldAlert className="w-12 h-12 text-purple-400/60" />
              ) : (
                <Globe className="w-12 h-12 text-slate-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-300">
              No {filterMode === 'incognito' ? 'Incognito' : 'Standard'} Tabs Open
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
              {filterMode === 'incognito'
                ? 'Incognito tabs leave no trace in your browsing history or cookies.'
                : 'Open a new standard tab to start browsing.'}
            </p>
            <button
              onClick={() => onNewTab(filterMode === 'incognito')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow ${
                filterMode === 'incognito' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Open New {filterMode === 'incognito' ? 'Incognito' : ''} Tab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {displayedTabs.map(tab => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    onClose();
                  }}
                  className={`group relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 flex flex-col h-48 bg-slate-900 hover:scale-[1.02] ${
                    isActive
                      ? tab.isIncognito
                        ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/40'
                        : 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-950/40'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Tab Card Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-850 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      {tab.isIncognito ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {tab.title || (tab.url === 'fulguris://home' ? 'New Tab' : tab.url)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id, e);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors shrink-0"
                      title="Close tab"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tab Preview Thumbnail */}
                  <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="text-[11px] font-mono text-slate-400 truncate mb-2">
                      {tab.url}
                    </div>

                    {tab.url === 'fulguris://home' ? (
                      <div className="flex flex-col items-center justify-center flex-1 text-slate-600">
                        <span className="text-2xl mb-1">⚡</span>
                        <span className="text-[11px]">Homepage</span>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-lg border border-slate-800/80 bg-slate-950/80 p-2 overflow-hidden">
                        <div className="h-2 w-1/3 bg-slate-800 rounded mb-2" />
                        <div className="h-1.5 w-full bg-slate-800/60 rounded mb-1.5" />
                        <div className="h-1.5 w-4/5 bg-slate-800/60 rounded mb-1.5" />
                        <div className="h-1.5 w-2/3 bg-slate-800/60 rounded" />
                      </div>
                    )}

                    {isActive && (
                      <div className="mt-2 flex items-center justify-end">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          tab.isIncognito ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          <Check className="w-2.5 h-2.5" /> Current Tab
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
