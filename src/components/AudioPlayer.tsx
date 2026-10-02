import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react';
import { MusicTrack } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface AudioPlayerProps {
  currentTrack: MusicTrack | null;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  onNextTrack,
  onPrevTrack
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    audioSynth.onStateChange = (playing) => {
      setIsPlaying(playing);
    };
  }, []);

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioSynth.stop();
    } else {
      audioSynth.playNotes(currentTrack.audioFrequencySequence, currentTrack.bpm);
    }
  };

  useEffect(() => {
    if (currentTrack && isPlaying) {
      audioSynth.playNotes(currentTrack.audioFrequencySequence, currentTrack.bpm);
    }
  }, [currentTrack]);

  // Real-time canvas audio visualizer
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      audioSynth.getFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 32) * 1.5;
      let x = 0;

      for (let i = 0; i < 32; i++) {
        const barHeight = isPlaying ? (dataArray[i] / 255) * canvas.height : 2;
        ctx.fillStyle = isPlaying ? '#f4f4f5' : '#3f3f46';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-3 flex items-center justify-between gap-4 z-30">
      {/* Current Playing Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
        <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
          <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin text-zinc-100' : 'text-zinc-500'}`} />
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-zinc-100 truncate">
            {currentTrack ? currentTrack.title : 'No track selected'}
          </p>
          <p className="text-[11px] text-zinc-500 truncate">
            {currentTrack ? `${currentTrack.artist} • ${currentTrack.album}` : 'Select a track from the database'}
          </p>
        </div>
      </div>

      {/* Center Controls & Mini Visualizer */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevTrack}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            disabled={!currentTrack}
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 transition-colors disabled:opacity-40"
            title={isPlaying ? 'Pause' : 'Play Synthesizer'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />}
          </button>

          <button
            onClick={onNextTrack}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time spectrum canvas */}
        <canvas
          ref={canvasRef}
          width={180}
          height={16}
          className="rounded bg-zinc-900/40 px-1"
        />
      </div>

      {/* Meta & Audio Engine Details */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px] text-xs font-mono text-zinc-400">
        {currentTrack && (
          <>
            <span>{currentTrack.bpm} BPM</span>
            <span>{currentTrack.keySignature}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 uppercase">
              {currentTrack.genre}
            </span>
          </>
        )}
        <Volume2 className="w-4 h-4 text-zinc-500" />
      </div>
    </div>
  );
};
