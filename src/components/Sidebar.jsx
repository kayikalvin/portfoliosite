import React from 'react';

// navSection: current section string
// setNavSection: function to change section
export default function Sidebar({ open, onToggle, onLogout, onNavigate, navSection }) {
  // small icons for collapsed state
  const Icon = ({ name }) => {
    if (name === 'projects') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/></svg>);
    if (name === 'uploads') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.34v6h6.66V9h3.34L12 2z" fill="currentColor"/></svg>);
    if (name === 'settings') return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19.14 12.94a7.98 7.98 0 000-1.88l2.03-1.58a.5.5 0 00.12-.65l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a8.12 8.12 0 00-1.6-.93l-.36-2.54A.5.5 0 0013.8 2h-3.6a.5.5 0 00-.49.42l-.36 2.54c-.57.22-1.1.5-1.6.93l-2.39-.96a.5.5 0 00-.6.22L2.7 9.83a.5.5 0 00.12.65L4.85 12a7.98 7.98 0 000 1.88L2.82 15.46a.5.5 0 00-.12.65l1.92 3.32c.16.28.49.39.78.28l2.39-.96c.5.43 1.03.79 1.6.93l.36 2.54c.05.27.28.47.55.47h3.6c.27 0 .5-.2.55-.47l.36-2.54c.57-.22 1.1-.5 1.6-.93l2.39.96c.29.11.62 0 .78-.28l1.92-3.32a.5.5 0 00-.12-.65l-2.03-1.58z" fill="currentColor"/></svg>);
    return null;
  };

  return (
    <aside className={`fixed top-0 left-0 h-full z-30 flex-shrink-0 ${open ? 'w-56' : 'w-14'} transition-all duration-200 bg-gray-900/60 border-r border-gray-700 p-3 flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold">{open ? 'Admin' : 'A'}</div>
        </div>
        <button type="button" onClick={onToggle} className="text-sm text-gray-300 px-2 py-1 rounded hover:bg-gray-800">{open ? '«' : '»'}</button>
      </div>
      <nav className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-200 ${navSection === 'dashboard' ? 'bg-gray-800 font-semibold' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/></svg>
          {open && <span>Dashboard</span>}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-200 ${navSection === 'projects' ? 'bg-gray-800 font-semibold' : ''}`}
        >
          <Icon name="projects" />
          {open && <span>Projects</span>}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('uploads')}
          className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-200 ${navSection === 'uploads' ? 'bg-gray-800 font-semibold' : ''}`}
        >
          <Icon name="uploads" />
          {open && <span>Uploads</span>}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 text-gray-200 ${navSection === 'settings' ? 'bg-gray-800 font-semibold' : ''}`}
        >
          <Icon name="settings" />
          {open && <span>Settings</span>}
        </button>
      </nav>
      <div className="mt-auto pt-4">
        <button type="button" onClick={onLogout} className="w-full px-3 py-2 bg-red-600 rounded text-white flex items-center gap-3 justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" fill="currentColor"/></svg>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
