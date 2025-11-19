import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track the visit
    const trackVisit = async () => {
      try {
        await fetch('/api/visitors/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname || '/',
          }),
        });
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    trackVisit();
  }, [pathname]);
}

export async function fetchTodayVisitors() {
  try {
    const response = await fetch('/api/visitors/stats?type=today');
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch today visitors:', error);
    return null;
  }
}

export async function fetchPageStats(page) {
  try {
    const response = await fetch(`/api/visitors/stats?type=page&page=${encodeURIComponent(page)}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch page stats:', error);
    return null;
  }
}

export async function fetchVisitorHistory(limit = 30) {
  try {
    const response = await fetch(`/api/visitors/stats?type=history&limit=${limit}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Failed to fetch visitor history:', error);
    return null;
  }
}
