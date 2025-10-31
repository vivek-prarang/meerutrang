"use client";

import { useState, useEffect, useRef } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translateY, setTranslateY] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://www.amarujala.com/rss/meerut.xml");
        if (!response.ok) throw new Error("Failed to fetch news");
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");
        const newsData = Array.from(items).slice(0, 30).map((item) => ({
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          description: item.querySelector("description")?.textContent || "",
        }));
        setNews(newsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (itemRef.current && news.length > 0) {
      setItemHeight(itemRef.current.offsetHeight);
    }
  }, [news]);

  useEffect(() => {
    if (itemHeight > 0 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setTranslateY((prev) => {
          const next = prev - itemHeight;
          if (Math.abs(next) >= news.length * itemHeight) {
            return 0;
          }
          return next;
        });
      }, 3000); // Scroll one item every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [itemHeight, news.length, isHovered]);

  if (loading) return <div className="h-120 flex items-center justify-center">Loading news...</div>;
  if (error) return <div className="h-120 flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div
      className="h-120 overflow-hidden relative bg-white rounded p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{ transform: `translateY(${translateY}px)` }}
        className="transition-transform duration-500"
      >
        {news.map((item, index) => (
          <a
            key={index}
            ref={index === 0 ? itemRef : null}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 border-b border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
            {item.description && <p className="text-xs text-gray-600 mt-1">{item.description.slice(0, 100)}...</p>}
          </a>
        ))}
        {/* Duplicate for seamless scroll */}
        {news.map((item, index) => (
          <a
            key={`dup-${index}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 border-b border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
            {item.description && <p className="text-xs text-gray-600 mt-1">{item.description.slice(0, 100)}...</p>}
          </a>
        ))}
      </div>
    </div>
  );
}
