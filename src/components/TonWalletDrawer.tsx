import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Coins,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Key,
  Flame,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { TonWallet, WalletTransaction, AGEN_TOKEN_CONFIG } from '../types/token';
import { getCirculatingSupply } from '../services/tonWalletService';

interface TonWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: TonWallet;
  transactions: WalletTransaction[];
  pendingReward: number;
  onClaimReward: () => void;
  onSendToken: (token: 'TON' | 'AGEN', amount: number, toAddress: string, comment?: string) => boolean;
  onWalletBackupConfirmed: () => void;
}

export const TonWalletDrawer: React.FC<TonWalletDrawerProps> = ({
  isOpen,
  onClose,
  wallet,
  transactions,
  pendingReward,
  onClaimReward,
  onSendToken,
  onWalletBackupConfirmed
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'send' | 'receive' | 'backup'>('balance');
  const [copied, setCopied] = useState(false);
  const [sendToken, setSendToken] = useState<'TON' | 'AGEN'>('AGEN');
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [comment, setComment] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showSeed, setShowSeed] = useState(false);

  if (!isOpen) return null;

  const circulating = getCirculatingSupply();
  const circulatingPercent = ((circulating / AGEN_TOKEN_CONFIG.maxSupply) * 100).toFixed(2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) {
      setSendError('Please enter a valid amount');
      return;
    }
    const max = sendToken === 'TON' ? wallet.tonBalance : wallet.agenBalance;
    if (amt > max) {
      setSendError(`Insufficient ${sendToken} balance`);
      return;
    }
    if (!recipient.trim()) {
      setSendError('Please provide a valid destination TON address');
      return;
    }

    const success = onSendToken(sendToken, amt, recipient.trim(), comment.trim());
    if (success) {
      setSendSuccess(true);
      setSendAmount('');
      setRecipient('');
      setComment('');
      setTimeout(() => {
        setSendSuccess(false);
        setActiveTab('balance');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0f1118] via-[#0b0d13] to-[#07080b] border-l border-[#232838] flex flex-col h-full shadow-2xl text-slate-100">
        {/* Luxury Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232838] bg-[#121520]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center text-amber-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-white">TON Native Wallet</h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#0098EA]/20 text-[#0098EA] border border-[#0098EA]/30">
                  TON Network
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCopy(wallet.address)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy TON Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-[#232838] bg-[#0c0e15] px-2 pt-2">
          <button
            onClick={() => setActiveTab('balance')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'balance'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Balances
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'send'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Send
          </button>
          <button
            onClick={() => setActiveTab('receive')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'receive'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Receive
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center justify-center gap-1 ${
              activeTab === 'backup'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3 h-3" />
            <span>Seed</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'balance' && (
            <>
              {/* Luxury Gold & Obsidian Card */}
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1a1c26] via-[#12141d] to-[#0a0b10] border border-amber-500/30 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#0098EA]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400/90">
                      Primary Asset
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      TEP-74 Jetton
                    </span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>

                {/* AGEN Balance */}
                <div className="mb-4">
                  <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-2">
                    <span>{wallet.agenBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                    <span className="text-lg font-bold text-amber-400">{AGEN_TOKEN_CONFIG.symbol}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ≈ ${ (wallet.agenBalance * 0.18).toFixed(2) } USD (Simulated Market Rate)
                  </div>
                </div>

                {/* TON Gas Balance */}
                <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                  <div className="text-slate-400">TON Network Balance (Gas):</div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0098EA]" />
                    <span>{wallet.tonBalance.toFixed(3)} TON</span>
                  </div>
                </div>
              </div>

              {/* Browse-to-Earn Rewards Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">Browse-to-Earn Pending</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-400">
                    +{pendingReward.toFixed(4)} AGEN
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Accumulated live from active browsing, bookmarking, and tab engagement.
                </p>
                <button
                  onClick={onClaimReward}
                  disabled={pendingReward <= 0}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  Claim {pendingReward > 0 ? `${pendingReward.toFixed(4)} AGEN` : 'Rewards'}
                </button>
              </div>

              {/* Strict Max Supply Cap Specification Indicator */}
              <div className="p-4 rounded-2xl bg-[#121520] border border-[#232838]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">AGEN Maximum Token Supply</span>
                  <span className="font-mono text-amber-400 font-bold">4,000,000,000 AGEN</span>
                </div>
                <div className="w-full bg-[#0b0d14] rounded-full h-2 overflow-hidden border border-[#232838]">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, parseFloat(circulatingPercent))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Circulating: {circulating.toLocaleString()}</span>
                  <span>{circulatingPercent}% minted</span>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                  Transaction History
                </h4>
                <div className="space-y-2">
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No transactions recorded yet.
                    </div>
                  ) : (
                    transactions.map(tx => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#121520]/60 border border-[#232838] text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            tx.type === 'reward'
                              ? 'bg-amber-500/10 text-amber-400'
                              : tx.type === 'send'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {tx.type === 'reward' && <Flame className="w-3.5 h-3.5" />}
                            {tx.type === 'send' && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {tx.type === 'receive' && <ArrowDownLeft className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 capitalize">
                              {tx.type === 'reward' ? 'Browse-to-Earn Reward' : tx.type}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.comment || 'TON Transfer'}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-mono font-bold ${
                            tx.type === 'send' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                          </div>
                          <span className="text-[10px] text-emerald-400">Confirmed</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Send Tab */}
          {activeTab === 'send' && (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Asset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSendToken('AGEN')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sendToken === 'AGEN'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-[#232838] bg-[#121520] text-slate-400'
                    }`}
                  >
                    <span>AGEN Token</span>
                    <span className="font-mono text-[10px] opacity-75">({wallet.agenBalance.toFixed(1)})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendToken('TON')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sendToken === 'TON'
                        ? 'border-[#0098EA] bg-[#0098EA]/10 text-[#0098EA]'
                        : 'border-[#232838] bg-[#121520] text-slate-400'
                    }`}
                  >
                    <span>TON Coin</span>
                    <span className="font-mono text-[10px] opacity-75">({wallet.tonBalance.toFixed(2)})</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Destination TON Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="UQ... or EQ..."
                  className="w-full bg-[#121520] border border-[#232838] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Amount</label>
                  <button
                    type="button"
                    onClick={() => setSendAmount((sendToken === 'TON' ? wallet.tonBalance : wallet.agenBalance).toString())}
                    className="text-[10px] text-amber-400 hover:underline font-semibold"
                  >
                    Max
                  </button>
                </div>
                <input
                  type="number"
                  step="any"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-[#121520] border border-[#232838] rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Comment / Memo (Optional)
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. For services"
                  className="w-full bg-[#121520] border border-[#232838] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {sendError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {sendSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Transaction broadcast successfully to TON network!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Sign & Send {sendToken}
              </button>
            </form>
          )}

          {/* Receive Tab */}
          {activeTab === 'receive' && (
            <div className="space-y-4 text-center">
              <div className="p-6 bg-[#121520] border border-[#232838] rounded-2xl flex flex-col items-center">
                {/* Simulated QR Code for TON address */}
                <div className="w-44 h-44 bg-white rounded-xl p-3 shadow-xl mb-4 flex items-center justify-center">
                  <div className="w-full h-full border-4 border-slate-950 flex flex-col items-center justify-center bg-slate-950 p-2 text-white">
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            (i % 2 === 0 || i % 7 === 0) ? 'bg-slate-950' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-1">
                  Your TON & AGEN Deposit Address
                </div>
                <p className="text-[11px] font-mono text-amber-400/90 break-all bg-[#0b0d14] p-2.5 rounded-xl border border-[#232838] w-full text-center select-all">
                  {wallet.address}
                </p>

                <button
                  onClick={() => handleCopy(wallet.address)}
                  className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 bg-[#121520]/50 p-3 rounded-xl border border-[#232838]">
                Send only <strong>TON</strong> or <strong>AGEN Jettons</strong> to this address. Other chain assets sent here may be lost permanently.
              </div>
            </div>
          )}

          {/* Seed Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Non-Custodial Security</span>
                </div>
                Your 24-word secret phrase gives full access to your funds on the TON blockchain. Never share these words with anyone.
              </div>

              {!showSeed ? (
                <div className="text-center py-6 bg-[#121520] border border-[#232838] rounded-2xl p-6">
                  <Key className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-200 mb-1">Reveal Recovery Phrase</div>
                  <p className="text-[11px] text-slate-400 mb-4">
                    Make sure nobody is looking at your screen.
                  </p>
                  <button
                    onClick={() => setShowSeed(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    View 24 Words
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 bg-[#121520] p-3.5 rounded-2xl border border-[#232838]">
                    {wallet.mnemonic.map((word, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#0b0d14] border border-[#232838] text-[11px]"
                      >
                        <span className="text-slate-500 font-mono text-[9px] w-4">{i + 1}.</span>
                        <span className="font-mono text-slate-200 font-medium">{word}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(wallet.mnemonic.join(' '))}
                      className="flex-1 py-2 rounded-xl bg-[#121520] border border-[#232838] hover:border-slate-600 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Words</span>
                    </button>
                    <button
                      onClick={() => {
                        onWalletBackupConfirmed();
                        setShowSeed(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      I've Backed It Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
