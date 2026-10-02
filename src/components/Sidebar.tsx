import React from 'react';
import { Disc3, Terminal, Database, Bookmark, Layers, Plus, HardDrive } from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  trackCount: number;
  genreCount: number;
  albumCount: number;
  onOpenNewTrack: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  trackCount,
  genreCount,
  albumCount,
  onOpenNewTrack
}) => {
  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between shrink-0 h-full p-4">
      {/* Top Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs tracking-tighter">
              AV
            </div>
            <div>
              <h2 className="text-xs font-semibold text-zinc-100 tracking-tight">AudioVault DB</h2>
              <p className="text-[10px] text-zinc-500 font-mono">SQLite v3.45 • Engine</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            PROD
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenNewTrack}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors duration-150 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Record</span>
        </button>

        {/* Navigation Sections */}
        <div className="space-y-5">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-2 block mb-1">
              Data Catalog
            </span>
            <nav className="space-y-0.5">
              <button
                onClick={() => setActiveView('all_tracks')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  activeView === 'all_tracks'
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Disc3 className="w-3.5 h-3.5" />
                  <span>Tracks</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{trackCount}</span>
              </button>

              <button
                onClick={() => setActiveView('albums')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  activeView === 'albums'
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Albums</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{albumCount}</span>
              </button>

              <button
                onClick={() => setActiveView('genres')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  activeView === 'genres'
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Genres</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{genreCount}</span>
              </button>
            </nav>
          </div>

          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-2 block mb-1">
              Database Tools
            </span>
            <nav className="space-y-0.5">
              <button
                onClick={() => setActiveView('sql_console')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  activeView === 'sql_console'
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>SQL Query Console</span>
              </button>

              <button
                onClick={() => setActiveView('schema_docs')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  activeView === 'schema_docs'
                    ? 'bg-zinc-900 text-zinc-100 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Schema Architecture</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Storage Footer */}
      <div className="pt-4 border-t border-zinc-900 text-zinc-500 text-[11px]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3 h-3" />
            <span>SQLite Local DB</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">READY</span>
        </div>
        <p className="text-[10px] text-zinc-600 font-mono">musicas.db (In-Memory + Storage)</p>
      </div>
    </aside>
  );
};
