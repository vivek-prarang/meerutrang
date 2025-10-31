"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "../../../../lib/api";
import RecentPosts from "../../../../components/RecentPosts";
import Subscriber from "@/components/home/Subscriber";

export default function PostDetailPage() {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 🔹 Share function
  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.short_description || post.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert("शेयर फीचर इस ब्राउज़र में उपलब्ध नहीं है।\n\nURL: " + window.location.href);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        alert("शेयर करने में त्रुटि हुई।");
        console.error("Share error:", err);
      }
    }
  };

  // 🔹 Fetch post details
  const fetchPost = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await api.get("/post", {
        client: "prarang",
        params: { language: "hi", id: postId },
      });

      if (error) throw new Error(error);

      if (data?.success && data?.data) {
        setPost(data.data);
      } else {
        setErrorMsg("पोस्ट नहीं मिली।");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setErrorMsg("पोस्ट प्राप्त करने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* 🔹 Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
        }
      `}</style>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* 🔹 Back Button */}
        <div className="mb-10">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-all"
          >
            <span className="text-xl">←</span> <span>वापस जाएं</span>
          </Link>
        </div>

        {/* 🔹 Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
            <div className="lg:col-span-8 space-y-6">
              <div className="shimmer h-10 rounded-lg"></div>
              <div className="shimmer h-6 w-1/2 rounded"></div>
              <div className="shimmer w-full h-96 rounded-xl"></div>
              <div className="space-y-4">
                <div className="shimmer h-5 w-full rounded"></div>
                <div className="shimmer h-5 w-5/6 rounded"></div>
                <div className="shimmer h-5 w-3/4 rounded"></div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="shimmer h-80 rounded-xl"></div>
              <div className="shimmer h-48 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* 🔹 Error Message */}
        {errorMsg && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 🔹 Post Details */}
        {post && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 ">
            {/* Main Content */}
            <div className="lg:col-span-8 post">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-snug">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 text-sm">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-semibold">
                  {post.tags || "पोस्ट"}
                </span>
                <span>{post.createDate}</span>
              </div>

              {post.image_url && (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm mb-8">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed text-justify prose-img:w-full"
                dangerouslySetInnerHTML={{
                  __html: post.content || post.description || "",
                }}
              />
            </div>

            {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-0 space-y-6">
  <div className="shadow mb-4 rounded"><Subscriber /></div>
  <RecentPosts />
</div>
          </div>
        )}
      </div>
    </div>
  );
}
