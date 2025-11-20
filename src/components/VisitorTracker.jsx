'use client';

import { useVisitorTracker } from '@/lib/useVisitorTracker';

export default function VisitorTracker() {
  useVisitorTracker();
  return null; // This component doesn't render anything, just tracks
}
