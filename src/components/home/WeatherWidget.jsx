"use client";

import { useEffect, useRef } from "react";

export default function WeatherWidget({ code }) {
  const widgetRef = useRef();

  useEffect(() => {
    if (code && widgetRef.current) {
      widgetRef.current.innerHTML = code;
      const scripts = widgetRef.current.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        widgetRef.current.appendChild(newScript);
      });
    }
  }, [code]);

  return <div className="flex items-center" ref={widgetRef}></div>;
}