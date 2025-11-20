'use client';

import { useEffect, useState } from 'react';

export default function AnimatedCounter({
  number = 0,
  duration = 80,
  label = 'Count',
  size = 'medium',
  color = '',
  decimals = 0
}) {
  const [displayCount, setDisplayCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Size configurations
  const sizeConfig = {
    small: {
      numberSize: '',
      labelSize: '',
      padding: '',
      gap: ''
    },
    medium: {
      numberSize: 'text-6xl',
      labelSize: 'text-sm',
      padding: 'p-6',
      gap: 'gap-2'
    },
    large: {
      numberSize: 'text-8xl',
      labelSize: 'text-lg',
      padding: 'p-8',
      gap: 'gap-3'
    }
  };

  // Color configurations
  const colorConfig = {
    blue: 'from-blue-600 to-indigo-700',
    green: 'from-green-600 to-emerald-700',
    purple: 'from-purple-600 to-pink-700',
    orange: 'from-orange-500 to-red-600',
    red: 'from-red-600 to-pink-700',
    teal: 'from-teal-600 to-cyan-700',
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const bgGradient = colorConfig[color] || '';

  useEffect(() => {
    if (Math.abs(displayCount - number) < 0.01) {
      setDisplayCount(number);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const increment = (number - displayCount) / 30;
    const timer = setTimeout(() => {
      setDisplayCount(prev => {
        const newValue = prev + increment;
        // Ensure we reach exactly the target number
        if (Math.abs(newValue - number) < 0.1) {
          return number;
        }
        return newValue;
      });
    }, duration / 30);

    return () => clearTimeout(timer);
  }, [displayCount, number, duration, decimals]);

  // Display logic: show whole numbers during animation, decimals only after animation completes
  const displayValue = !isAnimating && decimals > 0
    ? number.toFixed(decimals)
    : Math.floor(Math.min(displayCount, number)).toLocaleString('en-IN');

  return (
    <div className={`flex  bg-linear-to-br ${bgGradient} rounded-lg shadow-lg min-w-max ${config.padding}`}>
      {/* Counter Display */}
      <div className={`${config.numberSize} font-black text-white  tracking-wider`}>
        {displayValue}
      </div>

      {/* Label */}
      {label && (
        <div className={`${config.labelSize}  text-blue-100  uppercase tracking-widest`}>
          &nbsp;{label}
        </div>
      )}
    </div>
  );
}
