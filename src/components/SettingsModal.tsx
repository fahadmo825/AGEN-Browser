import React, { useState } from 'react';
import {
  X,
  Settings,
  Palette,
  Shield,
  Search,
  Sliders,
  Info,
  Check,
  Zap,
  Globe,
  Layers,
  Bot,
  Sparkles,
  Cpu
} from 'lucide-react';
import { BrowserSettings, ThemeMode, AccentColor } from '../types/browser';
import { SEARCH_ENGINES } from '../data/searchEngines';
import { OPEN_SOURCE_MODELS, AiAssistantConfig } from '../types/ai';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  aiConfig?: AiAssistantConfig;
  onUpdateAiConfig?: (newConfig: Partial<AiAssistantConfig>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  aiConfig,
  onUpdateAiConfig
}) => {
  const [activeCategory, setActiveCategory] = useState<'appearance' | 'privacy' | 'search' | 'ai' | 'about'>('appearance');

  if (!isOpen) return null;

  const accentColors: { id: AccentColor; label: string; class: string }[] = [
    { id: 'blue', label: 'Electric Blue', class: 'bg-blue-500' },
    { id: 'amber', label: 'Amber Bolt', class: 'bg-amber-500' },
    { id: 'emerald', label: 'Emerald Teal', class: 'bg-emerald-500' },
    { id: 'purple', label: 'Cyber Violet', class: 'bg-purple-500' },
    { id: 'rose', label: 'Ruby Red', class: 'bg-rose-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-blue-400 border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Fulguris Settings</h3>
              <p className="text-xs text-slate-400">Customization, Privacy & Controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with Sidebar tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-48 bg-slate-950/60 border-r border-slate-800/80 p-3 space-y-1">
            <button
              onClick={() => setActiveCategory('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'appearance'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveCategory('privacy')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'privacy'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Privacy & Security</span>
            </button>

            <button
              onClick={() => setActiveCategory('search')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'search'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Engine</span>
            </button>

            <button
              onClick={() => setActiveCategory('ai')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'ai'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveCategory('about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'about'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About Fulguris</span>
            </button>
          </div>

          {/* Settings Panels */}
          <div className="flex-1 overflow-y-auto p-6 text-sm">
            {/* Appearance */}
            {activeCategory === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                    Theme Mode
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'black', 'light'] as ThemeMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => onUpdateSettings({ themeMode: mode })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          settings.themeMode === mode
                            ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                            : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="capitalize text-xs">{mode === 'black' ? 'AMOLED Black' : mode}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                    Accent Color
                  </h4>
                  <div className="grid grid-cols-5 gap-2.5">
                    {accentColors.map(c => (
                      <button
                        key={c.id}
                        onClick={() => onUpdateSettings({ accentColor: c.id })}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                          settings.accentColor === c.id
                            ? 'border-blue-500 bg-slate-800 text-white'
                            : 'border-slate-800 bg-slate-850/50 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full ${c.class} flex items-center justify-center text-white`}>
                          {settings.accentColor === c.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-[10px] truncate max-w-full">{c.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                    Toolbar Placement
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onUpdateSettings({ toolbarPosition: 'top' })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        settings.toolbarPosition === 'top'
                          ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-medium">Top of Screen (Classic)</div>
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ toolbarPosition: 'bottom' })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        settings.toolbarPosition === 'bottom'
                          ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-medium">Bottom of Screen (Fulguris Reach)</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security */}
            {activeCategory === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">ABP AdBlocker</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Filter ads and promotional banners</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.adBlockEnabled}
                    onChange={(e) => onUpdateSettings({ adBlockEnabled: e.target.checked })}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">Block Tracking Beacons</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Stop third-party analytics and fingerprints</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.blockTrackers}
                    onChange={(e) => onUpdateSettings({ blockTrackers: e.target.checked })}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">Send "Do Not Track" Header</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Notify servers not to log browsing activity</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.doNotTrack}
                    onChange={(e) => onUpdateSettings({ doNotTrack: e.target.checked })}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">Clear History on Exit</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Automatically purge browsing records upon close</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.clearHistoryOnExit}
                    onChange={(e) => onUpdateSettings({ clearHistoryOnExit: e.target.checked })}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                </div>
              </div>
            )}

            {/* Search Engine */}
            {activeCategory === 'search' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">
                  Select your default search engine for omnibox queries:
                </p>
                {SEARCH_ENGINES.map(engine => (
                  <div
                    key={engine.id}
                    onClick={() => onUpdateSettings({ defaultSearchEngine: engine.id })}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      settings.defaultSearchEngine === engine.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{engine.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs">{engine.name}</div>
                        <div className="text-[11px] text-slate-400">{engine.description}</div>
                      </div>
                    </div>
                    {settings.defaultSearchEngine === engine.id && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Open-Source AI Assistant */}
            {activeCategory === 'ai' && aiConfig && onUpdateAiConfig && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Default Open-Source Model
                  </h4>
                  <div className="space-y-2">
                    {OPEN_SOURCE_MODELS.map(model => (
                      <div
                        key={model.id}
                        onClick={() => onUpdateAiConfig({ selectedModelId: model.id })}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          aiConfig.selectedModelId === model.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 text-xs">{model.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                              {model.provider}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{model.description}</div>
                        </div>
                        {aiConfig.selectedModelId === model.id && (
                          <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Inference Host & Local Endpoint
                  </h4>
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Endpoint URL (e.g. Ollama localhost:11434, vLLM, or OpenRouter)
                      </label>
                      <input
                        type="text"
                        value={aiConfig.customEndpointUrl || ''}
                        onChange={(e) => onUpdateAiConfig({ customEndpointUrl: e.target.value })}
                        placeholder="http://localhost:11434/v1"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        API Key (Optional for local models)
                      </label>
                      <input
                        type="password"
                        value={aiConfig.apiKey || ''}
                        onChange={(e) => onUpdateAiConfig({ apiKey: e.target.value })}
                        placeholder="sk-..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div>
                        <div className="font-semibold text-slate-200 text-xs">Web Search Grounding</div>
                        <div className="text-slate-400 text-[11px]">Enables real-time retrieval for current events</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiConfig.webSearchGrounding}
                        onChange={(e) => onUpdateAiConfig({ webSearchGrounding: e.target.checked })}
                        className="rounded accent-cyan-500 w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Fulguris */}
            {activeCategory === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
                    <Zap className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Fulguris Web Browser</h4>
                    <p className="text-xs text-slate-400">Version 5.1.0-web (Slion Agent Release)</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-slate-300 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                  <p>
                    <strong>Fulguris</strong> (Latin for <em>lightning</em>) is an open-source, privacy-first web browser originally authored by Stéphane Lenclud (Slion) and based on Lightning Browser by Anthony Restaino.
                  </p>
                  <p>
                    Licensed under the Common Public Attribution License Version 1.0 (CPAL-1.0) and Mozilla Public License 2.0 (MPL-2.0).
                  </p>
                  <p className="pt-2 text-slate-400">
                    Migrated and fully operational in AI Studio with built-in tab switcher, ABP ad blocker, Reader mode, and developer code inspector.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-850 border-t border-slate-800 flex justify-end">
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
