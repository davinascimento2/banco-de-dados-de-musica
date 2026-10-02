import { useState, useEffect } from 'react';
import { MusicTrack, ActiveView } from './types';
import { INITIAL_TRACKS } from './data/defaultTracks';
import { Sidebar } from './components/Sidebar';
import { TrackTable } from './components/TrackTable';
import { SqlSandbox } from './components/SqlSandbox';
import { AudioPlayer } from './components/AudioPlayer';
import { TrackModal } from './components/TrackModal';
import { Database, Download, FileCode, Check } from 'lucide-react';

export function App() {
  const [tracks, setTracks] = useState<MusicTrack[]>(() => {
    const saved = localStorage.getItem('audiovault_tracks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRACKS;
      }
    }
    return INITIAL_TRACKS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [activeView, setActiveView] = useState<ActiveView>('all_tracks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<MusicTrack | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    localStorage.setItem('audiovault_tracks', JSON.stringify(tracks));
  }, [tracks]);

  const currentTrack = tracks[currentTrackIndex] || null;

  const handleNextTrack = () => {
    setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSelectTrack = (track: MusicTrack) => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
  };

  const handleToggleFavorite = (id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  const handleDeleteTrack = (id: number) => {
    setTracks(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveTrack = (trackData: Omit<MusicTrack, 'id' | 'audioFrequencySequence'>) => {
    if (trackToEdit) {
      setTracks(prev => prev.map(t => t.id === trackToEdit.id ? { ...t, ...trackData } : t));
    } else {
      const newTrack: MusicTrack = {
        ...trackData,
        id: Math.max(...tracks.map(t => t.id), 0) + 1,
        audioFrequencySequence: [330, 392, 440, 523.25, 440]
      };
      setTracks(prev => [newTrack, ...prev]);
    }
    setIsModalOpen(false);
    setTrackToEdit(null);
  };

  const exportSqlDump = () => {
    let sql = `-- AudioVault SQLite Database Dump\n-- Generated on ${new Date().toISOString()}\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS musicas (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  titulo TEXT NOT NULL,\n  artista TEXT NOT NULL,\n  album TEXT NOT NULL,\n  ano INTEGER NOT NULL,\n  genero TEXT DEFAULT 'Synthwave',\n  bpm INTEGER DEFAULT 120,\n  duracao TEXT DEFAULT '3:45'\n);\n\n`;

    tracks.forEach(t => {
      sql += `INSERT INTO musicas (titulo, artista, album, ano, genero, bpm, duracao) VALUES ('${t.title.replace(/'/g, "''")}', '${t.artist.replace(/'/g, "''")}', '${t.album.replace(/'/g, "''")}', ${t.year}, '${t.genre}', ${t.bpm}, '${t.duration}');\n`;
    });

    const dl = document.createElement('a');
    dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sql));
    dl.setAttribute('download', `musicas-dump-${Date.now()}.sql`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  const copySchemaSql = () => {
    const schema = `CREATE TABLE musicas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  artista TEXT NOT NULL,
  album TEXT NOT NULL,
  ano INTEGER NOT NULL,
  genero TEXT DEFAULT 'Synthwave',
  bpm INTEGER DEFAULT 120,
  duracao TEXT DEFAULT '3:45'
);`;
    navigator.clipboard.writeText(schema);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const albumsCount = new Set(tracks.map(t => t.album)).size;
  const genresCount = new Set(tracks.map(t => t.genre)).size;

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-zinc-100 selection:text-zinc-950">
      {/* Top Application Bar */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-100">AudioVault</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-mono">SQLite Workspace</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500 capitalize">{activeView.replace('_', ' ')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSqlDump}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SQL Dump</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          trackCount={tracks.length}
          genreCount={genresCount}
          albumCount={albumsCount}
          onOpenNewTrack={() => {
            setTrackToEdit(null);
            setIsModalOpen(true);
          }}
        />

        {/* Central Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeView === 'all_tracks' && (
              <div>
                <div className="mb-4">
                  <h1 className="text-lg font-semibold text-zinc-100">All Music Records</h1>
                  <p className="text-xs text-zinc-400">Query and manage audio tracks registered in the SQLite relational storage.</p>
                </div>
                <TrackTable
                  tracks={tracks}
                  currentTrack={currentTrack}
                  onSelectTrack={handleSelectTrack}
                  onEditTrack={(t) => {
                    setTrackToEdit(t);
                    setIsModalOpen(true);
                  }}
                  onDeleteTrack={handleDeleteTrack}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}

            {activeView === 'albums' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-lg font-semibold text-zinc-100">Album Discs Index</h1>
                  <p className="text-xs text-zinc-400">Aggregated albums cataloged across artist discs.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from(new Set(tracks.map(t => t.album))).map(alb => {
                    const albTracks = tracks.filter(t => t.album === alb);
                    const artist = albTracks[0]?.artist || 'Unknown';
                    const year = albTracks[0]?.year || 2024;
                    return (
                      <div key={alb} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30 hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-sm text-zinc-100">{alb}</h3>
                          <span className="font-mono text-xs text-zinc-500">{year}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-3">{artist}</p>
                        <div className="pt-2 border-t border-zinc-900 flex justify-between text-[11px] font-mono text-zinc-500">
                          <span>{albTracks.length} Tracks</span>
                          <span>BPM Avg: {Math.round(albTracks.reduce((acc, c) => acc + c.bpm, 0) / albTracks.length)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeView === 'genres' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-lg font-semibold text-zinc-100">Genre Distribution</h1>
                  <p className="text-xs text-zinc-400">Audio catalog categorization and telemetry.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from(new Set(tracks.map(t => t.genre))).map(gen => {
                    const genTracks = tracks.filter(t => t.genre === gen);
                    return (
                      <div key={gen} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-semibold text-sm text-zinc-100">{gen}</h3>
                          <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {genTracks.length} tracks
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          {((genTracks.length / tracks.length) * 100).toFixed(1)}% of total library
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeView === 'sql_console' && (
              <div>
                <div className="mb-4">
                  <h1 className="text-lg font-semibold text-zinc-100">SQL Query Console</h1>
                  <p className="text-xs text-zinc-400">Direct SQL execution sandbox against in-memory dataset.</p>
                </div>
                <SqlSandbox tracks={tracks} />
              </div>
            )}

            {activeView === 'schema_docs' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-lg font-semibold text-zinc-100">Database Schema Architecture</h1>
                  <p className="text-xs text-zinc-400">Physical DDL definitions and relational table structure for SQLite backend.</p>
                </div>

                <div className="border border-zinc-800 rounded-lg bg-zinc-900/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <Database className="w-4 h-4 text-zinc-400" />
                      <span>Table: <strong>musicas</strong></span>
                    </div>
                    <button
                      onClick={copySchemaSql}
                      className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-100"
                    >
                      {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
                      <span>{copyFeedback ? 'Copied DDL' : 'Copy DDL'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS musicas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    artista TEXT NOT NULL,
    album TEXT NOT NULL,
    ano INTEGER NOT NULL,
    genero TEXT DEFAULT 'Synthwave',
    bpm INTEGER DEFAULT 120,
    duracao TEXT DEFAULT '3:45'
);`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Persistent Bottom Audio Player Bar */}
      <AudioPlayer
        currentTrack={currentTrack}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
      />

      {/* Modal for Add/Edit Track */}
      {isModalOpen && (
        <TrackModal
          trackToEdit={trackToEdit}
          onSave={handleSaveTrack}
          onClose={() => {
            setIsModalOpen(false);
            setTrackToEdit(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
