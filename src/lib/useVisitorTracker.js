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


