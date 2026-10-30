import React, { useState } from 'react';
import { X, Bookmark, Plus, Search, Trash2, ExternalLink, Download, Upload, Folder } from 'lucide-react';
import { Bookmark as BookmarkType } from '../types/browser';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onNavigate: (url: string) => void;
  onAddBookmark: (title: string, url: string, folder?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onImportBookmarks: (imported: BookmarkType[]) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onNavigate,
  onAddBookmark,
  onDeleteBookmark,
  onImportBookmarks
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolder, setNewFolder] = useState('Favorites');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  if (!isOpen) return null;

  const folders = Array.from(new Set(bookmarks.map(b => b.folder || 'Unsorted')));

  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.url.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || (b.folder || 'Unsorted') === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    onAddBookmark(newTitle.trim(), url, newFolder.trim() || 'Favorites');
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  const handleExport = () => {
    // Generate Netscape bookmark format HTML
    const htmlHeader = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
    const htmlItems = bookmarks.map(b => 
      `    <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(b.dateAdded / 1000)}">${b.title}</A>`
    ).join('\n');
    const htmlFooter = `\n</DL><p>`;

    const blob = new Blob([htmlHeader + htmlItems + htmlFooter], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `fulguris_bookmarks_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed: BookmarkType[] = [];
      const linkRegex = /<A\s+HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
      let match;
      while ((match = linkRegex.exec(text)) !== null) {
        parsed.push({
          id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: match[2],
          url: match[1],
          folder: 'Imported',
          dateAdded: Date.now()
        });
      }
      if (parsed.length > 0) {
        onImportBookmarks(parsed);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Bookmarks Manager</h3>
              <p className="text-xs text-slate-400">{bookmarks.length} saved bookmarks</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExport}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Export Bookmarks (Netscape format)"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Import HTML Bookmarks"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".html,.dat,.json" onChange={handleImportFile} className="hidden" />
            </label>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Add Bookmark Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-850 border-b border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300">Add New Bookmark</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Folder"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Save Bookmark
              </button>
            </div>
          </form>
        )}

        {/* Folder Filter chips */}
        {folders.length > 1 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedFolder === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              All
            </button>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  selectedFolder === folder ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Folder className="w-3 h-3" />
                <span>{folder}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bookmark List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No bookmarks found.
            </div>
          ) : (
            filteredBookmarks.map(bm => (
              <div
                key={bm.id}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-colors"
              >
                <div
                  onClick={() => {
                    onNavigate(bm.url);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {bm.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                      <span>{bm.url}</span>
                      {bm.folder && (
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">
                          {bm.folder}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      onNavigate(bm.url);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-md hover:bg-slate-700/60 transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteBookmark(bm.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-700/60 transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
