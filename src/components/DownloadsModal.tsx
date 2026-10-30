import React from 'react';
import { X, Download, FileText, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { DownloadItem } from '../types/browser';

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadItem[];
  onClearDownloads: () => void;
}

export const DownloadsModal: React.FC<DownloadsModalProps> = ({
  isOpen,
  onClose,
  downloads,
  onClearDownloads
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Downloads</h3>
              <p className="text-xs text-slate-400">{downloads.length} items</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloads.length > 0 && (
              <button
                onClick={onClearDownloads}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Clear All
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

        {/* Downloads List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {downloads.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No files downloaded yet.
            </div>
          ) : (
            downloads.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50"
              >
                <div className="flex items-center gap-3 overflow-hidden mr-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {item.fileName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.fileSize}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    </div>
                  </div>
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
