'use client';

import { useState } from 'react';

export default function VisitorsDashboard() {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Visitor Dashboard
          </h1>
          <p className="text-gray-600">Track and analyze your website visitors</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'today'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Today's Visitors
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            History
          </button>
        </div>

        {activeTab === 'today' ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">This feature has been disabled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">This feature has been disabled.</p>
          </div>
        )}
      </div>
    </div>
  );
}
