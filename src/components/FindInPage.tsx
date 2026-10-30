import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Search } from 'lucide-react';

interface FindInPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FindInPage: React.FC<FindInPageProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }
    // Simulate finding matches on page
    const count = Math.max(1, (searchTerm.length % 5) + 1);
    setTotalMatches(count);
    setCurrentMatch(1);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (totalMatches === 0) return;
    setCurrentMatch(curr => (curr % totalMatches) + 1);
  };

  const handlePrev = () => {
    if (totalMatches === 0) return;
    setCurrentMatch(curr => (curr === 1 ? totalMatches : curr - 1));
  };

  return (
    <div className="absolute top-12 right-4 z-40 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 flex items-center gap-2 text-xs animate-in slide-in-from-top-2 duration-150">
      <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Find in page..."
        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
        autoFocus
      />

      <span className="text-[11px] font-mono text-slate-400 min-w-[36px] text-center">
        {totalMatches > 0 ? `${currentMatch}/${totalMatches}` : '0/0'}
      </span>

      <div className="flex items-center gap-0.5 border-l border-slate-800 pl-1">
        <button
          onClick={handlePrev}
          disabled={totalMatches === 0}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
          title="Previous"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          disabled={totalMatches === 0}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
          title="Next"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
        title="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
