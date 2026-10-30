export interface TonWallet {
  address: string; // e.g. UQC4B...
  rawAddress: string; // 0:...
  mnemonic: string[]; // 24 words
  tonBalance: number; // in TON
  agenBalance: number; // in AGEN
  isBackedUp: boolean;
  network: 'mainnet' | 'testnet';
}

export interface WalletTransaction {
  id: string;
  txHash: string;
  type: 'reward' | 'send' | 'receive';
  amount: number;
  token: 'TON' | 'AGEN';
  timestamp: number;
  fromAddress: string;
  toAddress: string;
  status: 'confirmed' | 'pending' | 'failed';
  comment?: string;
}

export interface BrowseToEarnState {
  isActive: boolean;
  activeSeconds: number;
  pendingReward: number; // in AGEN
  totalClaimedReward: number; // in AGEN
  engagementMultiplier: number;
  lastActiveTimestamp: number;
}

export const AGEN_TOKEN_CONFIG = {
  name: 'Agent Network Token',
  symbol: 'AGEN',
  decimals: 9,
  maxSupply: 4_000_000_000, // Strictly 4,000,000,000 (4 Billion)
  baseRewardPerMinute: 0.15, // AGEN per active browsing minute
  tonJettonStandard: 'TEP-74',
  network: 'TON (The Open Network)'
};
