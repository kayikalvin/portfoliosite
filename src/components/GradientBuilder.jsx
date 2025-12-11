import React, { useEffect, useState } from 'react';

// Simple visual gradient builder.
// Emits a Tailwind-friendly gradient class using bracket notation for hex colors.
export default function GradientBuilder({ initial = '', onChange = () => {} }) {
  const [start, setStart] = useState('#6366f1'); // indigo-500
  const [mid, setMid] = useState('');
  const [end, setEnd] = useState('#ec4899'); // pink-500
  const presets = [
    ['#6366f1', '#8b5cf6', '#ec4899'],
    ['#34d399', '', '#3b82f6'],
    ['#facc15', '#fb923c', '#ef4444'],
    ['#60a5fa', '', '#4f46e5'],
  ];

  useEffect(() => {
    // if initial is a known pattern like "bg-gradient-to-r from-indigo-...", don't parse; just emit initial
    if (initial && initial.startsWith('bg-')) {
      onChange(initial);
      return;
    }
    // otherwise generate class from hex values
    const from = start.replace('#', '') ? `from-[#${start.replace('#','')}]` : '';
    const via = mid ? `via-[#${mid.replace('#','')}]` : '';
    const to = end.replace('#', '') ? `to-[#${end.replace('#','')}]` : '';
    const cls = `bg-gradient-to-r ${from} ${via} ${to}`.trim().replace(/\s+/g, ' ');
    onChange(cls);
  }, [start, mid, end, initial, onChange]);

  function applyPreset(p) {
    setStart(p[0] || '');
    setMid(p[1] || '');
    setEnd(p[2] || '');
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="text-sm">Start</label>
        <input type="color" value={start} onChange={e=>setStart(e.target.value)} className="w-10 h-8 p-0 border-0" />
        <label className="text-sm ml-2">Middle (optional)</label>
        <input type="color" value={mid} onChange={e=>setMid(e.target.value)} className="w-10 h-8 p-0 border-0" />
        <label className="text-sm ml-2">End</label>
        <input type="color" value={end} onChange={e=>setEnd(e.target.value)} className="w-10 h-8 p-0 border-0" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((p, i) => (
          <button key={i} type="button" onClick={() => applyPreset(p)} className="border rounded overflow-hidden">
            <div style={{ width: 120, height: 28, background: `linear-gradient(90deg, ${p.filter(Boolean).join(',')})` }} />
          </button>
        ))}
      </div>

      <div className="mt-2 text-sm">Preview</div>
      <div className="h-12 rounded flex items-center justify-center text-white font-medium" style={{ background: `linear-gradient(90deg, ${[start, mid, end].filter(Boolean).join(',')})` }}>
        Gradient Preview
      </div>

      <div className="text-xs text-gray-400">Generated Tailwind class (editable):</div>
      <input value={`bg-gradient-to-r from-[#${start.replace('#','')}] ${mid?`via-[#${mid.replace('#','')}]`:''} to-[#${end.replace('#','')}]`.replace(/\s+/g,' ').trim()} onChange={e=>onChange(e.target.value)} className="w-full p-2 rounded border bg-transparent text-sm" />
    </div>
  );
}
