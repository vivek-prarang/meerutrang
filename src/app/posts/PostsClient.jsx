"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "../../lib/api";
import Heading from "@/components/ui/Heading";

function AllPostsContent() {
  const [posts, setPosts] = useState([]);
  const [grouped, setGrouped] = useState(false); // 🔹 Check if data grouped by month
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [canAutoLoad, setCanAutoLoad] = useState(true);
  const [location, setLocation] = useState("");
  const [tagId, setTagId] = useState("");
  const [tagName, setTagName] = useState("");

  const searchParams = useSearchParams();

  // 🔹 Fetch posts
  const fetchPosts = async (pageNum = 1, append = false, cityParam = null, tagIdParam = null) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params = {
        client: "prarang",
        params: {
          language: "hi",
          page: pageNum,
          per_page: 31,
          location: "c2",
        },
      };

      if (cityParam || location) params.params.city = cityParam || location;
      if (tagIdParam || tagId) params.params.tag_id = tagIdParam || tagId;

      const { data, error } = await api.get("/daily-posts/list", params);
      if (error) throw new Error(error);

      if (data?.success && data?.data?.posts) {
        setLastPage(data.data.pagination.last_page || 1);
        setPage(data.data.pagination.current_page || 1);

        const fetchedPosts = data.data.posts;
        const isGrouped = typeof fetchedPosts === "object" && !Array.isArray(fetchedPosts);

        setGrouped(isGrouped);

        if (isGrouped) {
          // 🔹 Flatten grouped posts but keep month info
          const postsWithMonth = [];
          Object.entries(fetchedPosts).forEach(([month, monthPosts]) => {
            if (Array.isArray(monthPosts)) {
              monthPosts.forEach((post) => {
                postsWithMonth.push({ ...post, month });
              });
            }
          });

          setPosts((prev) => (append ? [...prev, ...postsWithMonth] : postsWithMonth));
        } else {
          // 🔹 Plain list of posts
          setPosts((prev) => (append ? [...prev, ...fetchedPosts] : fetchedPosts));
        }
      } else {
        setErrorMsg("कोई पोस्ट नहीं मिली।");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setErrorMsg("पोस्ट प्राप्त करने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial fetch
  useEffect(() => {
    const city = searchParams.get("city");
    const tag_id = searchParams.get("tagid");
    const tag_name = searchParams.get("tagname");

    setLocation(city || "");
    setTagId(tag_id || "");
    setTagName(tag_name || "");

    fetchPosts(1, false, city, tag_id);
  }, []);

  // 🔹 Infinite Scroll (with 5-load limit)
  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        page < lastPage &&
        canAutoLoad
      ) {
        await fetchPosts(page + 1, true);
        setAutoLoadCount((count) => count + 1);
        if (autoLoadCount + 1 >= 5) setCanAutoLoad(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, lastPage, canAutoLoad, autoLoadCount]);

  // 🔹 Manual Load More
  const handleLoadMore = async () => {
    if (page < lastPage) {
      await fetchPosts(page + 1, true);
      setAutoLoadCount(0);
      setCanAutoLoad(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 🔹 Heading */}
      <Heading title={tagName || "मेरठ दैनिक लेख"} />

      {/* City Tag */}
      {location && (
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              शहर: {location}
            </span>
          </p>
        </div>
      )}

      {/* 🔹 Render grouped or flat posts */}
      {Array.isArray(posts) && posts.length > 0 ? (
        grouped ? (
          // 🧩 Grouped by month
          (() => {
            let currentMonth = null;
            const monthGroups = [];
            let currentGroup = [];

            posts.forEach((post) => {
              if (post.month !== currentMonth) {
                if (currentGroup.length > 0)
                  monthGroups.push({ month: currentMonth, posts: currentGroup });
                currentMonth = post.month;
                currentGroup = [post];
              } else {
                currentGroup.push(post);
              }
            });

            if (currentGroup.length > 0)
              monthGroups.push({ month: currentMonth, posts: currentGroup });

            return monthGroups.map((group) => (
              <div key={group.month}>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-600 mt-1 pb-1">
                  {group.month}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {group.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ));
          })()
        ) : (
          // 🧩 Flat list view
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
      ) : (
        !loading && (
          <div className="text-center text-gray-500 mt-8">कोई पोस्ट नहीं मिली।</div>
        )
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-8 text-blue-600 animate-pulse">
          पोस्ट लोड हो रही हैं...
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="text-center text-red-600 bg-red-50 mt-6 p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !canAutoLoad && page < lastPage && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
          >
            और पोस्ट लोड करें
          </button>
        </div>
      )}

      {/* End Message */}
      {!loading && page === lastPage && posts.length > 0 && (
        <p className="text-center text-gray-500 mt-8">🎉 आपने सभी पोस्ट देख लीं।</p>
      )}
    </div>
  );
}

// 🔹 Reusable Post Card Component
function PostCard({ post }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform-gpu">
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        <div className="absolute bottom-2 left-2 text-black text-xs bg-white px-2 py-1 rounded">
          {post.createDate}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between h-full" style={{ backgroundColor: post.color || "#ffffff" }}>
        <div>
          <Link href={`/posts/${post.id}/${post.title.replace(/\s+/g, "-")}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 transition">
              {post.title}
            </h3>
          </Link>
          <p
            className="text-gray-600 text-sm leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: post.short_description || "",
            }}
          />
          <span className="bg-blue-50 px-2 text-blue-700 py-1 rounded-full text-xs font-semibold">
            {post.tags || "पोस्ट"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AllPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-blue-600 animate-pulse">लोड हो रहा है...</div>
        </div>
      }
    >
      <AllPostsContent />
    </Suspense>
  );
}
