'use client';

import { useEffect, useState } from 'react';

export default function CirusData() {
  const [cirusData, setCirusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCirusData = async () => {
      try {
        // Check if data exists in localStorage
        const cachedData = localStorage.getItem('cirusData_667');

        if (cachedData) {
          // Use cached data if available
          setCirusData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // Fetch from API if no cached data
        const response = await fetch('https://api.apratyaksh.org/api/v1/cirus/dhq', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        if (result.success && result.data) {
          // Filter for record id 665
          const filteredData = result.data.find(item => item.id === '667');

          if (filteredData) {
            // Store in localStorage
            localStorage.setItem('cirusData_667', JSON.stringify(filteredData));
            setCirusData(filteredData);
          } else {
            setError('Record with id 667 not found');
          }
        } else {
          setError('Invalid API response');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch CIRUS data');
        console.error('Error fetching CIRUS data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCirusData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">त्रुटि</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!cirusData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">कोई डेटा उपलब्ध नहीं है</p>
      </div>
    );
  }

  return (
    <div className="bg-white  shadow-lg p-6">
      <div className="mb-1">
        <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
          <i className="fas fa-shield-alt text-red-600"></i> मेरठ में साइबर सुरक्षा
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">साइबर जोखिम सूचकांक:</span>
            <span className="font-bold text-red-900">{cirusData.risk_index}</span>
          </div>
        </div>
      </div>
      {/* Footer Note */}
      {/* <div className="mt-6 text-xs text-gray-500 text-center">
        <p>अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')}</p>
      </div> */}
      <div className='flex justify-end items-end mt-2'>
        <a href="https://prarang.in/cirus" className='text-bold text-blue-800 hover:text-blue-400' target='_blank'>अधिक देखे और समझे </a>
      </div>
    </div>
  );
}
