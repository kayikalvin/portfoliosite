import React, { useState } from 'react';

export default function GradientModal({ open, onClose, onSelect, initialGradient }) {
  const [colors, setColors] = useState(() => {
    if (initialGradient) {
      // Try to extract colors from a linear-gradient string
      const match = initialGradient.match(/#([0-9a-fA-F]{6})/g);
      return match || ['#4f46e5', '#a21caf'];
    }
    return ['#4f46e5', '#a21caf'];
  });

  function handleColorChange(idx, value) {
    setColors(c => c.map((col, i) => (i === idx ? value : col)));
  }

  function addColor() {
    setColors(c => [...c, '#ffffff']);
  }

  function removeColor(idx) {
    if (colors.length > 2) setColors(c => c.filter((_, i) => i !== idx));
  }

  function handleSelect() {
    const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;
    onSelect(gradient);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold mb-4 text-purple-300">Choose Gradient Colors</h2>
        <div className="flex flex-col gap-4 mb-4">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => handleColorChange(idx, e.target.value)}
                className="w-10 h-10 border-none bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={e => handleColorChange(idx, e.target.value)}
                className="w-28 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-100"
              />
              {colors.length > 2 && (
                <button type="button" onClick={() => removeColor(idx)} className="text-red-400 px-2">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addColor} className="text-blue-400 mt-2">+ Add Color</button>
        </div>
        <div className="h-12 w-full rounded mb-4" style={{ background: `linear-gradient(90deg, ${colors.join(', ')})` }} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg">Cancel</button>
          <button type="button" onClick={handleSelect} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">Select</button>
        </div>
      </div>
    </div>
  );
}
