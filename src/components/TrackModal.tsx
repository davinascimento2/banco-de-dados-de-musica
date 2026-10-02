import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MusicTrack } from '../types';

interface TrackModalProps {
  trackToEdit?: MusicTrack | null;
  onSave: (track: Omit<MusicTrack, 'id' | 'audioFrequencySequence'>) => void;
  onClose: () => void;
}

export const TrackModal: React.FC<TrackModalProps> = ({
  trackToEdit,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(trackToEdit?.title || '');
  const [artist, setArtist] = useState(trackToEdit?.artist || '');
  const [album, setAlbum] = useState(trackToEdit?.album || '');
  const [year, setYear] = useState(trackToEdit?.year || 2024);
  const [genre, setGenre] = useState(trackToEdit?.genre || 'Synthwave');
  const [bpm, setBpm] = useState(trackToEdit?.bpm || 120);
  const [duration, setDuration] = useState(trackToEdit?.duration || '3:30');
  const [keySignature, setKeySignature] = useState(trackToEdit?.keySignature || 'A min');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    onSave({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Single',
      year: Number(year),
      genre,
      bpm: Number(bpm),
      duration,
      keySignature,
      isFavorite: trackToEdit?.isFavorite || false
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg max-w-md w-full p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">
            {trackToEdit ? 'Edit Music Record' : 'Insert New Track'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">TITLE *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
              placeholder="Track title"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">ARTIST *</label>
              <input
                type="text"
                required
                value={artist}
                onChange={e => setArtist(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
                placeholder="Artist name"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">ALBUM</label>
              <input
                type="text"
                value={album}
                onChange={e => setAlbum(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
                placeholder="Album title"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">YEAR</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">BPM</label>
              <input
                type="number"
                value={bpm}
                onChange={e => setBpm(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">KEY</label>
              <input
                type="text"
                value={keySignature}
                onChange={e => setKeySignature(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">GENRE</label>
              <input
                type="text"
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">DURATION</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-medium"
            >
              {trackToEdit ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
