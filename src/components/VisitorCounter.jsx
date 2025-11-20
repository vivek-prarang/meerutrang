'use client';

import { useEffect, useState } from 'react';
import { fetchTodayVisitors } from '@/lib/useVisitorTracker';
import WeatherWidget from './home/WeatherWidget';

export default function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageVisitors, setPageVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indianTime, setIndianTime] = useState('');
  const [indianDate, setIndianDate] = useState('');

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
      const indianDateString = now.toLocaleString('hi-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setIndianTime(indianTimeString);
      setIndianDate(indianDateString);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);
  return (
    <div className=" bg-black border rounded p-3 justify-center text-center text-white">
      <div className="flex flex-col items-start justify-between gap-1">
        <div className="text-left">
          <p className="  text-center">मेरठ का समय </p>
          <p className=" font-mono  text-white">
            <i className="fas fa-clock "></i> {indianTime}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            <i className="fas fa-calendar font-bold "></i> {indianDate}
          </p>
        </div>

      </div>
    </div>
  );
}
