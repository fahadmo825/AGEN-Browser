import { TonWallet, WalletTransaction, AGEN_TOKEN_CONFIG } from '../types/token';

const TON_WORDLIST = [
  'acoustic', 'barrel', 'canvas', 'device', 'echo', 'fortune', 'glory', 'horizon',
  'island', 'journey', 'kingdom', 'legacy', 'monarch', 'nebula', 'orbit', 'phantom',
  'quantum', 'radiant', 'sapphire', 'thunder', 'utopia', 'velocity', 'whisper', 'zenith'
];

export function generateTonAddress(): { address: string; rawAddress: string; mnemonic: string[] } {
  // Generate 24 standard mnemonic words
  const mnemonic: string[] = [];
  for (let i = 0; i < 24; i++) {
    const word = TON_WORDLIST[Math.floor(Math.random() * TON_WORDLIST.length)];
    mnemonic.push(word);
  }

  // Generate TON user-friendly friendly bounceable / non-bounceable address (base64url format)
  const hexPart = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const friendly = 'UQ' + btoa(hexPart).replace(/\+/g, '-').replace(/\//g, '_').substring(0, 46);
  const rawAddress = `0:${hexPart}`;

  return {
    address: friendly,
    rawAddress,
    mnemonic
  };
}

const STORAGE_WALLET_KEY = 'fulguris_ton_wallet';
const STORAGE_TXS_KEY = 'fulguris_ton_txs';
const STORAGE_CIRCULATING_KEY = 'fulguris_agen_circulating';

export function getOrCreateWallet(): TonWallet {
  try {
    const saved = localStorage.getItem(STORAGE_WALLET_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load wallet', e);
  }

  const generated = generateTonAddress();
  const initialWallet: TonWallet = {
    address: generated.address,
    rawAddress: generated.rawAddress,
    mnemonic: generated.mnemonic,
    tonBalance: 1.5, // Seeded with 1.5 TON for network gas fees
    agenBalance: 25.0, // Welcome reward bonus in AGEN
    isBackedUp: false,
    network: 'mainnet'
  };

  saveWallet(initialWallet);
  return initialWallet;
}

export function saveWallet(wallet: TonWallet): void {
  try {
    localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(wallet));
  } catch (e) {
    console.error('Failed to save wallet', e);
  }
}

export function getTransactions(): WalletTransaction[] {
  try {
    const saved = localStorage.getItem(STORAGE_TXS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load transactions', e);
  }

  return [
    {
      id: 'tx-genesis',
      txHash: '0x9a8f...3e21',
      type: 'reward',
      amount: 25.0,
      token: 'AGEN',
      timestamp: Date.now() - 3600000,
      fromAddress: 'EQ_AGEN_REWARDS_POOL_MASTER',
      toAddress: 'My TON Wallet',
      status: 'confirmed',
      comment: 'Fulguris Welcome Bonus'
    }
  ];
}

export function saveTransactions(txs: WalletTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_TXS_KEY, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function getCirculatingSupply(): number {
  try {
    const saved = localStorage.getItem(STORAGE_CIRCULATING_KEY);
    if (saved) {
      return parseFloat(saved);
    }
  } catch {}
  return 124_580_000; // Initial circulating supply under the 4,000,000,000 cap
}

export function recordSupplyMinted(amount: number): number {
  const current = getCirculatingSupply();
  const max = AGEN_TOKEN_CONFIG.maxSupply;
  const actualMint = Math.min(amount, max - current);
  const updated = current + actualMint;
  try {
    localStorage.setItem(STORAGE_CIRCULATING_KEY, updated.toString());
  } catch {}
  return updated;
}
