import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API = 'http://localhost:4000';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('login failed');
      const data = await res.json();
      if (data && data.token) {
        localStorage.setItem('adminToken', data.token);
      } else {
        // fallback
        localStorage.setItem('adminKey', password);
      }
      toast.success('Logged in');
      navigate('/admin');
    } catch (err) {
      toast.error('Login failed — check server config/adminKey');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-gray-900/60 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Admin Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <label className="text-sm text-gray-300">Admin Key</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 rounded border bg-gray-800 text-white" />
          <div className="flex gap-2 justify-between">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading? 'Logging...' : 'Login'}</button>
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 bg-gray-600 text-white rounded">Back</button>
          </div>
        </form>
        <div className="text-xs text-gray-400 mt-3">Use the admin key configured in the server (or login will fallback to storing the key locally).</div>
      </div>
    </div>
  );
}
