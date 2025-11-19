'use client';

import { useEffect, useState } from 'react';
import { fetchTodayVisitors } from '@/lib/useVisitorTracker';

export default function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageVisitors, setPageVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indianTime, setIndianTime] = useState('');

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const data = await fetchTodayVisitors();
        if (data) {
          setTotalVisitors(data.total || 0);
          setPageVisitors(data.pages || []);
        }
      } catch (error) {
        console.error('Error loading visitors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVisitors();
    // Refresh every 30 seconds
    const interval = setInterval(loadVisitors, 30000);

    // Update Indian time every second
    const updateTime = () => {
      const now = new Date();
      const indianTimeString = now.toLocaleString('hi-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setIndianTime(indianTimeString);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);
  return (
    <div className=" bg-black-500/10 border rounded p-3 justify-center text-center text-white">
      <div className="flex flex-col items-start justify-between gap-1">
        <div className="text-left">
          {/* <p className="text-xs uppercase tracking-widest text-gray-300 m-0 mb-1">
            भारतीय समय
          </p> */}
          <p className=" font-mono font-bold text-white">
            समय {indianTime}
          </p>
        </div>
        <div className='flex'>
          <p className="text-lg uppercase tracking-widest text-blue-100 m-0">

          </p>
          <p className=" font-bold"> आज के विज़िटर: {new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(totalVisitors)}</p>
        </div>

      </div>
    </div>
  );
}
