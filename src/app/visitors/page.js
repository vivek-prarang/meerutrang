'use client';

import { useEffect, useState } from 'react';
import { fetchTodayVisitors, fetchVisitorHistory } from '@/lib/useVisitorTracker';

export default function VisitorsDashboard() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageVisitors, setPageVisitors] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (activeTab === 'today') {
          const data = await fetchTodayVisitors();
          if (data) {
            setTotalVisitors(data.total || 0);
            setPageVisitors(data.pages || []);
          }
        } else if (activeTab === 'history') {
          const historyData = await fetchVisitorHistory(30);
          setHistory(historyData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('hi-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupByDate = (visitors) => {
    const grouped = {};
    visitors.forEach((visitor) => {
      if (!grouped[visitor.date]) {
        grouped[visitor.date] = [];
      }
      grouped[visitor.date].push(visitor);
    });
    return grouped;
  };

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : activeTab === 'today' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Visitors Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                    Total Visitors Today
                  </p>
                  <p className="text-5xl font-bold text-blue-600">
                    {totalVisitors.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">{getTodayDate()}</p>
                </div>
                <div className="text-6xl">👥</div>
              </div>
            </div>

            {/* Page Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Visitors by Page
              </h2>
              {pageVisitors.length > 0 ? (
                <div className="space-y-3">
                  {pageVisitors
                    .sort((a, b) => b.visit_count - a.visit_count)
                    .map((visitor, idx) => (
                      <div
                        key={visitor.page}
                        className="flex items-center justify-between p-3 bg-linear-to-r from-slate-50 to-transparent rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-lg font-bold text-blue-600 w-6">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold truncate">
                              {visitor.page || '/'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Updated:{' '}
                              {new Date(visitor.updated_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {visitor.visit_count}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No visitors tracked yet today</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Visitor History (Last 30 Days)
            </h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Page
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Visitors
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {history.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.page || '/'}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600 text-right">
                          {item.visit_count}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(item.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No history data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
