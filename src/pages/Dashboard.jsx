import React from 'react';

export default function Dashboard({ stats }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-blue-900/60 border border-blue-700 rounded-xl p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-blue-300">{stats?.projects ?? 0}</div>
          <div className="text-lg text-blue-100 mt-2">Projects</div>
        </div>
        {/* Add more stat cards here if needed */}
      </div>
    </div>
  );
}
