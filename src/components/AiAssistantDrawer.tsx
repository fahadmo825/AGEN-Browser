import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Settings,
  Cpu,
  Globe,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { OPEN_SOURCE_MODELS, OpenSourceAiModel, AiChatMessage, AiAssistantConfig } from '../types/ai';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageTitle?: string;
  currentPageUrl?: string;
  config: AiAssistantConfig;
  onUpdateConfig: (newConfig: Partial<AiAssistantConfig>) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentPageTitle,
  currentPageUrl,
  config,
  onUpdateConfig
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am your Carbon AI Assistant integrated with open-source LLMs. You are currently using **${
        OPEN_SOURCE_MODELS.find(m => m.id === config.selectedModelId)?.name || 'DeepSeek R1'
      }**.\n\nYou can ask me to summarize the current web page, answer complex queries, write code, or analyze blockchain transactions.`,
      timestamp: Date.now() - 60000,
      modelUsed: config.selectedModelId
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedModel = OPEN_SOURCE_MODELS.find(m => m.id === config.selectedModelId) || OPEN_SOURCE_MODELS[0];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulated streaming response from selected open source model
    setTimeout(() => {
      let reply = '';
      let reasoning: string | undefined = undefined;

      const qLower = query.toLowerCase();

      if (qLower.includes('summarize') || qLower.includes('this page')) {
        reply = `### Page Summary: ${currentPageTitle || 'Active Document'}\n\n- **Target URL**: \`${currentPageUrl || 'fulguris://home'}\`\n- **Key Takeaways**: The document demonstrates privacy-first browsing architectures, native TON non-custodial wallet mechanics, and strict 4 Billion AGEN tokenomics.\n- **Performance**: Zero ad-network telemetry intercepted by the local ABP blocker.\n- **Recommended Action**: Bookmark this page or claim pending browse rewards.`;
        if (selectedModel.id === 'deepseek-r1') {
          reasoning = `Analyzed DOM nodes of active viewport (${currentPageUrl}). Filtered tracking scripts. Extracted semantic headers and core sentences for succinct bulleted digest.`;
        }
      } else if (qLower.includes('ton') || qLower.includes('agen') || qLower.includes('wallet')) {
        reply = `### TON Blockchain & AGEN Token Overview\n\n- **Network**: The Open Network (TON), utilizing high-throughput sharding and proof-of-stake.\n- **Token**: **AGEN (Agent Network Token)** adhering to the TEP-74 Jetton smart contract standard.\n- **Hard Cap**: Strictly enforced at **4,000,000,000 AGEN (4 Billion)**. No further issuance can occur past this threshold.\n- **Browse-to-Earn**: Active browsing yields continuous micro-rewards into your non-custodial wallet without transmitting your private browsing data.`;
        if (selectedModel.id === 'deepseek-r1') {
          reasoning = `Recalled smart contract specs for TEP-74 Jettons. Checked max_supply constant: exactly 4,000,000,000. Verified non-custodial cryptographic key isolation.`;
        }
      } else {
        reply = `**[${selectedModel.name}] Response:**\n\nRegarding your question "${query}":\n\nOpen-source intelligence allows you to execute reasoning and content generation with full sovereignty. When running via **${selectedModel.name}** (Context: ${selectedModel.contextWindow}), your inputs stay private, with no vendor lock-in. You can also configure an offline local **Ollama** endpoint in settings for 100% on-device inference!`;
        if (selectedModel.id === 'deepseek-r1') {
          reasoning = `Synthesized response using Chain-of-Thought for query "${query}". Checked privacy guarantees of open-weights inference. Formatted response with markdown clarity.`;
        }
      }

      const assistantMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: Date.now(),
        modelUsed: selectedModel.name,
        reasoning
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 750);
  };

  const quickPrompts = [
    'Summarize this page',
    'Explain AGEN Token & TON Wallet',
    'What are the best privacy settings?',
    'How do I connect local Ollama?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#0b0d14] via-[#090b10] to-[#06070a] border-l border-[#1f2433] flex flex-col h-full shadow-2xl text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2433] bg-[#0f121b]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b0d14] rounded-[10px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Open-Source AI</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {selectedModel.provider}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Sovereign & Local LLM Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showConfig
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="AI Model & Endpoint Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model Selector Strip */}
        <div className="px-4 py-2 bg-[#0e1017] border-b border-[#1f2433] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1 mr-2">
            <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={config.selectedModelId}
              onChange={(e) => onUpdateConfig({ selectedModelId: e.target.value })}
              className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer truncate w-full"
            >
              {OPEN_SOURCE_MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] font-mono text-slate-500 shrink-0">
            {selectedModel.contextWindow}
          </span>
        </div>

        {/* Model Configuration Dropdown Panel */}
        {showConfig && (
          <div className="p-4 bg-[#11141e] border-b border-[#1f2433] text-xs space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Model & Inference Endpoint</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Custom Endpoint URL (Ollama, vLLM, or OpenRouter)
              </label>
              <input
                type="text"
                value={config.customEndpointUrl || ''}
                onChange={(e) => onUpdateConfig({ customEndpointUrl: e.target.value })}
                placeholder="http://localhost:11434/v1"
                className="w-full bg-[#0a0c12] border border-[#1f2433] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                API Key (Optional for local Ollama)
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => onUpdateConfig({ apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full bg-[#0a0c12] border border-[#1f2433] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-300">Web Search Grounding</span>
              <input
                type="checkbox"
                checked={config.webSearchGrounding}
                onChange={(e) => onUpdateConfig({ webSearchGrounding: e.target.checked })}
                className="rounded accent-cyan-500 w-3.5 h-3.5"
              />
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Sparkles className="w-8 h-8 text-cyan-400/40 mx-auto mb-2" />
              <p>Start a new conversation with your open-source model.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500">
                    {isAssistant ? (
                      <>
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span className="text-cyan-400/90 font-medium">{msg.modelUsed || 'AI'}</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-slate-400" />
                        <span>You</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`relative group max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-[#121520] border border-[#212738] text-slate-200 shadow-sm'
                        : 'bg-cyan-600/90 text-white shadow-md'
                    }`}
                  >
                    {/* DeepSeek R1 Thought Chain Collapsible */}
                    {msg.reasoning && (
                      <div className="mb-2 p-2 rounded-lg bg-[#0a0c12] border border-[#1c2233] text-[11px] text-slate-400 font-mono">
                        <span className="text-cyan-400 block font-bold mb-0.5">💭 Chain of Thought:</span>
                        {msg.reasoning}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {isAssistant && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#0a0c12] text-slate-400 hover:text-white transition-opacity"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#121520] border border-[#212738] text-slate-400 text-xs w-28">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-3 py-1.5 border-t border-[#1a1f2c] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#121520] hover:bg-[#1a1e2e] border border-[#212738] text-[10px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0d0f17] border-t border-[#1f2433]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 rounded-xl bg-[#121520] border border-[#212738] px-3 py-1.5 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/20"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${selectedModel.name}...`}
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
