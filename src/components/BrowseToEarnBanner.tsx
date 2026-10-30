import React from 'react';
import { Flame, Sparkles, Wallet, ChevronRight } from 'lucide-react';
import { AGEN_TOKEN_CONFIG } from '../types/token';

interface BrowseToEarnBannerProps {
  pendingReward: number;
  isActive: boolean;
  onOpenWallet: () => void;
  onClaim: () => void;
}

export const BrowseToEarnBanner: React.FC<BrowseToEarnBannerProps> = ({
  pendingReward,
  isActive,
  onOpenWallet,
  onClaim
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 bg-[#0e1017]/95 border border-amber-500/30 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-xs transition-all hover:border-amber-400">
      {/* Activity Indicator */}
      <div className="flex items-center gap-2 pl-1.5">
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/30">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          {isActive && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0e1017] animate-pulse" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>+{pendingReward.toFixed(4)}</span>
            <span className="text-amber-400 font-extrabold">{AGEN_TOKEN_CONFIG.symbol}</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span>Browse-to-Earn</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 pl-2 border-l border-[#232838]">
        {pendingReward >= 0.05 && (
          <button
            onClick={onClaim}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-[11px] shadow-sm transition-all"
            title="Claim to TON Wallet"
          >
            Claim
          </button>
        )}

        <button
          onClick={onOpenWallet}
          className="p-1.5 rounded-xl bg-[#151824] hover:bg-[#1d2233] text-amber-300 border border-[#232838] transition-colors"
          title="Open TON Wallet"
        >
          <Wallet className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
