export interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  bpm: number;
  duration: string;
  keySignature: string;
  audioFrequencySequence: number[];
  isFavorite?: boolean;
}

export interface SqlQueryResult {
  columns: string[];
  rows: (string | number)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export type ActiveView = 'all_tracks' | 'albums' | 'genres' | 'sql_console' | 'schema_docs';
