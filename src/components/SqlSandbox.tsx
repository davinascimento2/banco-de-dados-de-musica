import React, { useState } from 'react';
import { Play, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { MusicTrack, SqlQueryResult } from '../types';

interface SqlSandboxProps {
  tracks: MusicTrack[];
}

export const SqlSandbox: React.FC<SqlSandboxProps> = ({ tracks }) => {
  const [query, setQuery] = useState(
    "SELECT id, titulo, artista, album, ano, genero, bpm FROM musicas WHERE ano >= 2014 ORDER BY bpm DESC;"
  );
  const [result, setResult] = useState<SqlQueryResult | null>(null);

  const sampleQueries = [
    { label: 'All tracks >= 2014', sql: 'SELECT id, titulo, artista, album, ano, bpm FROM musicas WHERE ano >= 2014;' },
    { label: 'Synthwave BPM > 100', sql: "SELECT id, titulo, artista, bpm, duracao FROM musicas WHERE genero = 'Synthwave' AND bpm > 100;" },
    { label: 'Top Artists Count', sql: 'SELECT artista, COUNT(*) as total_faixas, AVG(bpm) as media_bpm FROM musicas GROUP BY artista;' },
  ];

  const executeQuery = () => {
    const start = performance.now();
    const clean = query.trim();

    try {
      // Simple client-side SQLite SQL execution simulator
      const lower = clean.toLowerCase();

      if (lower.startsWith('select')) {
        let filtered = [...tracks];

        if (lower.includes("where ano >=") || lower.includes("where ano >")) {
          const match = lower.match(/ano\s*>=?\s*(\d+)/);
          if (match) {
            const minYear = parseInt(match[1]);
            filtered = filtered.filter(t => t.year >= minYear);
          }
        }

        if (lower.includes("genero =")) {
          const match = clean.match(/genero\s*=\s*'([^']+)'/i);
          if (match) {
            const genre = match[1];
            filtered = filtered.filter(t => t.genre.toLowerCase() === genre.toLowerCase());
          }
        }

        if (lower.includes("order by bpm desc")) {
          filtered.sort((a, b) => b.bpm - a.bpm);
        } else if (lower.includes("order by bpm asc")) {
          filtered.sort((a, b) => a.bpm - b.bpm);
        }

        if (lower.includes("group by artista")) {
          const grouped: Record<string, { count: number; totalBpm: number }> = {};
          tracks.forEach(t => {
            if (!grouped[t.artist]) grouped[t.artist] = { count: 0, totalBpm: 0 };
            grouped[t.artist].count += 1;
            grouped[t.artist].totalBpm += t.bpm;
          });

          const rows = Object.entries(grouped).map(([art, d]) => [
            art,
            d.count,
            Math.round(d.totalBpm / d.count)
          ]);

          const end = performance.now();
          setResult({
            columns: ['artista', 'total_faixas', 'media_bpm'],
            rows,
            rowCount: rows.length,
            executionTimeMs: Number((end - start).toFixed(2))
          });
          return;
        }

        const columns = ['id', 'titulo', 'artista', 'album', 'ano', 'genero', 'bpm'];
        const rows = filtered.map(t => [t.id, t.title, t.artist, t.album, t.year, t.genre, t.bpm]);
        const end = performance.now();

        setResult({
          columns,
          rows,
          rowCount: rows.length,
          executionTimeMs: Number((end - start).toFixed(2))
        });
      } else {
        const end = performance.now();
        setResult({
          columns: ['status'],
          rows: [['Query statement executed successfully (Simulated 1 row affected)']],
          rowCount: 1,
          executionTimeMs: Number((end - start).toFixed(2))
        });
      }
    } catch (err: any) {
      setResult({
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: `SQL Syntax Error: ${err.message || 'Invalid statement'}`
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Query Editor Box */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="bg-zinc-900/60 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SQLite Sandbox Console</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="p-3">
          <textarea
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 font-mono text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 resize-y"
            placeholder="Write SQL statement..."
          />
        </div>

        {/* Quick query presets & Run button */}
        <div className="px-4 py-2.5 bg-zinc-900/40 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Quick Templates:</span>
            <div className="flex gap-1.5 flex-wrap">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(sq.sql)}
                  className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={executeQuery}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs font-mono transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Execute (Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      {/* Query Results Table */}
      {result && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <div className="bg-zinc-900/40 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{result.rowCount} rows returned</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>{result.executionTimeMs}ms execution time</span>
            </div>
          </div>

          {result.error ? (
            <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/20">
              {result.error}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] text-zinc-400 uppercase">
                  <tr>
                    {result.columns.map((col, idx) => (
                      <th key={idx} className="py-2 px-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {result.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-zinc-900/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 text-zinc-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
