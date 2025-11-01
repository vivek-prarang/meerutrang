"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/api";

export default function RecentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const { data, error } = await api.get("/daily-posts/list", {
          client: "prarang",
          params: { language: 'hi', per_page: 10, page: 1 ,location: 'c2' },
        });

        if (error) throw new Error(error);

        if (data?.success && data?.data?.posts) {
          let recentPosts = [];
          if (Array.isArray(data.data.posts)) {
            // If posts is a flat array, just take first 5
            recentPosts = data.data.posts.slice(0, 10);
          } else {
            // If grouped by month, flatten and take first 5
            Object.values(data.data.posts).forEach(monthPosts => {
              if (Array.isArray(monthPosts)) {
                recentPosts.push(...monthPosts.slice(0, 5 - recentPosts.length));
              }
            });
            recentPosts = recentPosts.slice(0, 5);
          }
          setPosts(recentPosts);
        }
      } catch (err) {
        console.error("Error fetching recent posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">हाल की पोस्ट</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">हाल की पोस्ट</h3>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-100 pb-3 last:border-b-0">
            <div className="flex items-start space-x-3">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/posts/${post.id}/${post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post'}`}>
                  <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500">{post.createDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
