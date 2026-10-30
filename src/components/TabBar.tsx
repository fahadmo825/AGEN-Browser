import React from 'react';
import { X, Plus, ShieldAlert, Globe } from 'lucide-react';
import { Tab } from '../types/browser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNewTab: (incognito?: boolean) => void;
  accentColor: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  accentColor
}) => {
  const getTabBorderClass = (tab: Tab, isActive: boolean) => {
    if (!isActive) return 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';
    if (tab.isIncognito) return 'border-purple-500 bg-purple-950/40 text-purple-200';
    switch (accentColor) {
      case 'amber':
        return 'border-amber-500 bg-slate-800 text-amber-200 shadow-sm';
      case 'emerald':
        return 'border-emerald-500 bg-slate-800 text-emerald-200 shadow-sm';
      case 'purple':
        return 'border-purple-500 bg-slate-800 text-purple-200 shadow-sm';
      case 'rose':
        return 'border-rose-500 bg-slate-800 text-rose-200 shadow-sm';
      default:
        return 'border-blue-500 bg-slate-800 text-slate-100 shadow-sm';
    }
  };

  return (
    <div className="flex items-center bg-slate-950 px-2 pt-1 border-b border-slate-800 select-none overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2 max-w-[200px] min-w-[120px] px-3 py-1.5 rounded-t-xl border-t-2 cursor-pointer transition-all ${getTabBorderClass(
                tab,
                isActive
              )}`}
              title={tab.title || tab.url}
            >
              {/* Tab Icon */}
              {tab.isIncognito ? (
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              ) : tab.favicon ? (
                <img
                  src={tab.favicon}
                  alt=""
                  className="w-3.5 h-3.5 rounded shrink-0 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}

              {/* Tab Title */}
              <span className="text-xs font-medium truncate flex-1">
                {tab.title || (tab.url === 'fulguris://home' ? 'New Tab' : tab.url)}
              </span>

              {/* Close Tab Button */}
              <button
                type="button"
                onClick={(e) => onCloseTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-slate-700/60 text-slate-400 hover:text-white transition-opacity shrink-0"
                title="Close Tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* New Tab Button */}
      <button
        onClick={() => onNewTab(false)}
        className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
        title="Open new tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
