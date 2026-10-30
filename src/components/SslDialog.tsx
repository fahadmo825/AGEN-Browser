import React from 'react';
import { X, ShieldCheck, ShieldAlert, Lock, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface SslDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const SslDialog: React.FC<SslDialogProps> = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  const isHttps = url.startsWith('https://');
  const isInternal = url.startsWith('fulguris://');

  let domain = 'Local Application';
  try {
    if (!isInternal && url) {
      domain = new URL(url).hostname;
    }
  } catch {
    domain = url;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            {isHttps ? (
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : isInternal ? (
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-100">Site Information</h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px]">{domain}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          {/* Status Badge */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isHttps
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : isInternal
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            {isHttps ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : isInternal ? (
              <Lock className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-white">
                {isHttps
                  ? 'Connection is Secure (HTTPS)'
                  : isInternal
                  ? 'Fulguris Internal Protocol'
                  : 'Connection is Not Encrypted'}
              </div>
              <div className="text-xs opacity-90 mt-0.5 leading-relaxed">
                {isHttps
                  ? 'Your information (such as passwords or credit card numbers) is private when sent to this site.'
                  : isInternal
                  ? 'This page is generated securely by Fulguris Web Browser.'
                  : 'You should not enter any sensitive information on this site.'}
              </div>
            </div>
          </div>

          {/* Certificate Technical Specs */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Certificate Credentials
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">TLS Protocol</span>
                <span className="font-mono text-slate-200">{isHttps ? 'TLS 1.3 / QUIC' : 'None'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Cipher Suite</span>
                <span className="font-mono text-slate-200">{isHttps ? 'AES-256-GCM' : 'None'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Certificate Authority</span>
                <span className="font-medium text-slate-200">{isHttps ? 'DigiCert Global CA' : 'Unsigned'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Validity</span>
                <span className="text-slate-200">{isHttps ? 'Expires 2027-10-29' : 'N/A'}</span>
              </div>
            </div>
          </div>
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
