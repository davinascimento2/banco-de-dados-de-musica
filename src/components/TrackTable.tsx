import React, { useState } from 'react';
import { MusicTrack } from '../types';
import { Play, Pause, Heart, Edit2, Trash2, ArrowUpDown, Search, Filter } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface TrackTableProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onSelectTrack: (track: MusicTrack) => void;
  onEditTrack: (track: MusicTrack) => void;
  onDeleteTrack: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  currentTrack,
  onSelectTrack,
  onEditTrack,
  onDeleteTrack,
  onToggleFavorite
}) => {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'artist' | 'year' | 'bpm'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const genres = ['All', ...Array.from(new Set(tracks.map(t => t.genre)))];

  const handleSort = (field: 'id' | 'title' | 'artist' | 'year' | 'bpm') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const filteredTracks = tracks
    .filter(t => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.artist.toLowerCase().includes(search.toLowerCase()) ||
        t.album.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === 'All' || t.genre === selectedGenre;
      return matchSearch && matchGenre;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (a[sortBy] < b[sortBy]) cmp = -1;
      if (a[sortBy] > b[sortBy]) cmp = 1;
      return sortAsc ? cmp : -cmp;
    });

  const isPlaying = audioSynth.getIsPlaying();

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, artist, or album..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 font-mono"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-density Structured Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 font-mono text-[11px] text-zinc-400">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">
                <button onClick={() => handleSort('id')} className="hover:text-zinc-200 inline-flex items-center gap-1">
                  # <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="py-2.5 px-3">
                <button onClick={() => handleSort('title')} className="hover:text-zinc-200 inline-flex items-center gap-1">
                  TITLE <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="py-2.5 px-3">
                <button onClick={() => handleSort('artist')} className="hover:text-zinc-200 inline-flex items-center gap-1">
                  ARTIST <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="py-2.5 px-3">ALBUM</th>
              <th className="py-2.5 px-3">
                <button onClick={() => handleSort('year')} className="hover:text-zinc-200 inline-flex items-center gap-1">
                  YEAR <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="py-2.5 px-3">GENRE</th>
              <th className="py-2.5 px-3">
                <button onClick={() => handleSort('bpm')} className="hover:text-zinc-200 inline-flex items-center gap-1">
                  BPM <ArrowUpDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredTracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <tr
                  key={track.id}
                  className={`hover:bg-zinc-900/40 transition-colors group ${isCurrent ? 'bg-zinc-900/30' : ''}`}
                >
                  <td className="py-2.5 px-3 text-center font-mono text-zinc-500">
                    <button
                      onClick={() => onSelectTrack(track)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-100"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>

                  <td className="py-2.5 px-3 font-medium text-zinc-100 flex items-center gap-2">
                    <button
                      onClick={() => onToggleFavorite(track.id)}
                      className={`p-0.5 rounded ${track.isFavorite ? 'text-rose-500' : 'text-zinc-600 opacity-0 group-hover:opacity-100'} hover:text-rose-400 transition-opacity`}
                    >
                      <Heart className={`w-3 h-3 ${track.isFavorite ? 'fill-rose-500' : ''}`} />
                    </button>
                    <span>{track.title}</span>
                  </td>

                  <td className="py-2.5 px-3 text-zinc-400">{track.artist}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{track.album}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{track.year}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {track.genre}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400">{track.bpm}</td>

                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTrack(track)}
                        className="p-1 text-zinc-500 hover:text-zinc-200"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTrack(track.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTracks.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono">
            No records match the current filter query.
          </div>
        )}
      </div>
    </div>
  );
};
