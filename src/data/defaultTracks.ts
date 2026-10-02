import { MusicTrack } from '../types';

export const INITIAL_TRACKS: MusicTrack[] = [
  {
    id: 1,
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    year: 2014,
    genre: 'Chillwave',
    bpm: 105,
    duration: '3:32',
    keySignature: 'F# min',
    audioFrequencySequence: [440, 554.37, 659.25, 440, 523.25, 659.25, 783.99],
    isFavorite: true
  },
  {
    id: 2,
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    year: 2010,
    genre: 'Synthwave',
    bpm: 94,
    duration: '4:19',
    keySignature: 'A min',
    audioFrequencySequence: [220, 261.63, 329.63, 220, 246.94, 293.66],
    isFavorite: true
  },
  {
    id: 3,
    title: 'Tech Noir',
    artist: 'Gunship',
    album: 'Gunship',
    year: 2015,
    genre: 'Darksynth',
    bpm: 112,
    duration: '4:57',
    keySignature: 'D min',
    audioFrequencySequence: [293.66, 349.23, 440, 523.25, 440, 349.23]
  },
  {
    id: 4,
    title: 'Turbo Killer',
    artist: 'Carpenter Brut',
    album: 'Trilogy',
    year: 2015,
    genre: 'Cyberpunk',
    bpm: 140,
    duration: '3:28',
    keySignature: 'C min',
    audioFrequencySequence: [261.63, 311.13, 392, 523.25, 392, 311.13],
    isFavorite: true
  },
  {
    id: 5,
    title: 'Sunset',
    artist: 'The Midnight',
    album: 'Endless Summer',
    year: 2016,
    genre: 'Retrowave',
    bpm: 118,
    duration: '5:26',
    keySignature: 'G maj',
    audioFrequencySequence: [392, 493.88, 587.33, 783.99, 587.33, 493.88]
  },
  {
    id: 6,
    title: 'Days of Thunder',
    artist: 'The Midnight',
    album: 'Days of Thunder',
    year: 2014,
    genre: 'Retrowave',
    bpm: 110,
    duration: '4:42',
    keySignature: 'E min',
    audioFrequencySequence: [329.63, 392, 493.88, 659.25, 493.88]
  },
  {
    id: 7,
    title: 'Vortex Protocol',
    artist: 'Davi Nascimento',
    album: 'Cyber Chronos',
    year: 2026,
    genre: 'Electronic',
    bpm: 128,
    duration: '3:50',
    keySignature: 'B min',
    audioFrequencySequence: [493.88, 587.33, 739.99, 987.77, 739.99]
  },
  {
    id: 8,
    title: 'Running in the Night',
    artist: 'FM-84 ft. Ollie Wride',
    album: 'Atlas',
    year: 2016,
    genre: 'Synthwave',
    bpm: 115,
    duration: '4:30',
    keySignature: 'C# min',
    audioFrequencySequence: [277.18, 329.63, 415.30, 554.37, 415.30],
    isFavorite: true
  }
];
