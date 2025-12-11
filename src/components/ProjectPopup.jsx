
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import GradientModal from './GradientModal';

export default function ProjectPopup({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tech: '',
    code: '',
    url: '',
    markdown: '',
    gradient: '',
    image: '' // image URL
  });
  const [showGradientModal, setShowGradientModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        title: initialData?.title || '',
        description: initialData?.description || '',
        tech: Array.isArray(initialData?.tech) ? initialData.tech.join(', ') : (initialData?.tech || ''),
        code: initialData?.code || '',
        url: initialData?.url || '',
        markdown: initialData?.markdown || '',
        gradient: initialData?.gradient || '',
        image: initialData?.image || ''
      });
      setTimeout(() => { firstInputRef.current?.focus(); }, 200);
    }
  }, [open, initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, tech: form.tech.split(',').map(t => t.trim()) });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Use the same upload endpoint as admin (adjust if needed)
      const fd = new FormData();
      fd.append('file', file, file.name);
      const res = await fetch('http://localhost:4000/api/uploads', {
        method: 'POST',
        headers: {},
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data && data.url) {
        setForm(f => ({ ...f, image: data.url }));
      }
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-4xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-300 text-center tracking-wide">
            {initialData ? 'Edit Project' : 'Add Project'}
          </h2>
          <div className="space-y-8">
            {/* Basic Info Section */}
            <div>
              <div className="text-lg font-semibold text-gray-200 mb-3">Basic Info</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  ref={firstInputRef}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                  required
                />
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                />
                <input
                  name="tech"
                  value={form.tech}
                  onChange={handleChange}
                  placeholder="Tech (comma separated)"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                />
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Code/Repo URL"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                />
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="Live URL"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                />
                {/* Image upload */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-gray-300">Project Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-gray-100" />
                  {uploading && <div className="text-xs text-blue-400">Uploading...</div>}
                  {form.image && (
                    <img src={form.image} alt="Project" className="mt-2 rounded max-h-32 object-contain border border-gray-700" />
                  )}
                </div>
              </div>
            </div>
            {/* Markdown Section */}
            <div>
              <div className="text-lg font-semibold text-gray-200 mb-3">Project Description (Markdown)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]" style={{height: '30vh'}}>
                <div className="flex flex-col h-full">
                  <textarea
                    name="markdown"
                    value={form.markdown}
                    onChange={handleChange}
                    placeholder="Markdown Description"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100 resize-none overflow-y-scroll"
                    style={{ minHeight: '200px', maxHeight: '300px', height: '100%' }}
                  />
                </div>
                <div className="flex flex-col h-full bg-gray-800 border border-gray-700 rounded p-3 overflow-y-scroll" style={{ minHeight: '200px', maxHeight: '300px' }}>
                  <div className="text-xs text-gray-400 mb-1">Live Preview</div>
                  <div className="prose prose-invert max-w-none flex-1">
                    <ReactMarkdown>{form.markdown || '*Nothing to preview*'}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
            {/* Gradient Picker Section */}
            <div>
              <div className="text-lg font-semibold text-gray-200 mb-3">Gradient (optional)</div>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <input
                  name="gradient"
                  value={form.gradient}
                  onChange={handleChange}
                  placeholder="Gradient (optional)"
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGradientModal(true)}
                    className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg"
                  >
                    Pick Gradient
                  </button>
                  {form.gradient && (
                    <div className="w-20 h-8 rounded border border-gray-700" style={{ background: form.gradient }} title={form.gradient} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all duration-200">
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
      <GradientModal
        open={showGradientModal}
        onClose={() => setShowGradientModal(false)}
        onSelect={g => setForm(f => ({ ...f, gradient: g }))}
        initialGradient={form.gradient}
      />
    </>
  );
}
