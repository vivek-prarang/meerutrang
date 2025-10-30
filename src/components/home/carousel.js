"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../lib/api";
import Modal from "../ui/Modal";
import Heading from "../ui/Heading";
import SubscriptionModal from "../SubscriptionModal";

// Constants
const AUTOPLAY_DELAY = 3000;
const TRANSITION_DURATION = 500;
const MOBILE_BREAKPOINT = 767;

// Utility function to format API posts
const formatPost = (post) => ({
  id: post.id,
  image: post.image_url,
  title: post.title,
  excerpt: post.short_description,
  category: post.tags,
  description: post.description,
  createdDate: post.createDate,
});

export default function Carousel() {
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsPerView, setPostsPerView] = useState(3);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  // Memoized extended posts for infinite scroll
  const extendedPosts = useMemo(() => {
    if (posts.length === 0) return [];
    return [
      ...posts.slice(-postsPerView),
      ...posts,
      ...posts.slice(0, postsPerView),
    ];
  }, [posts, postsPerView]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await api.get("/daily-posts/list",  { client: "prarang",params: {'language': 'hi' } });
        
        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }
        
        if (data?.success && data?.data?.posts) {
          const formattedPosts = data.data.posts.map(formatPost);
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    
    fetchPosts();
  }, []);

  // Handle responsive posts per view
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handleResize = () => setPostsPerView(mediaQuery.matches ? 2 : 3);
    
    handleResize();
    mediaQuery.addEventListener?.("change", handleResize);
    
    return () => mediaQuery.removeEventListener?.("change", handleResize);
  }, []);

  // Initialize carousel position when posts load
  useEffect(() => {
    if (posts.length > 0) {
      setCurrentIndex(postsPerView);
    }
  }, [postsPerView, posts.length]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (isTransitioning || posts.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Jump back to real first slide if we're at the cloned end
      if (currentIndex + 1 >= posts.length + postsPerView) {
        setIsTransitioning(true);
        setCurrentIndex(postsPerView);
        setTimeout(() => setIsTransitioning(false), 20);
      }
    }, TRANSITION_DURATION);
  }, [isTransitioning, posts.length, currentIndex, postsPerView]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || posts.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Jump to real last slide if we're at the cloned start
      if (currentIndex - 1 < postsPerView) {
        setIsTransitioning(true);
        setCurrentIndex(posts.length + postsPerView - 1);
        setTimeout(() => setIsTransitioning(false), 20);
      }
    }, TRANSITION_DURATION);
  }, [isTransitioning, posts.length, currentIndex, postsPerView]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setCurrentIndex(index + postsPerView);
  }, [isTransitioning, postsPerView]);

  // Autoplay
  useEffect(() => {
    if (isHovered || isTransitioning || posts.length === 0) return;
    
    const interval = setInterval(handleNext, AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [isHovered, isTransitioning, posts.length, handleNext]);

  // Calculate active dot index
  const activeDotIndex = useMemo(() => {
    if (posts.length === 0) return 0;
    return ((currentIndex - postsPerView + posts.length) % posts.length);
  }, [currentIndex, postsPerView, posts.length]);

  // Loading state
  if (posts.length === 0) {
    return (
      <section className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
          <p className="text-gray-100">Loading posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* <Heading title="ज्ञान के रंग" /> */}
      <div
        className="relative rounded-2xl  overflow-hidden bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden">
          <div
            className="flex gap-2 p-2 h-full items-stretch"
            style={{
              width: `${(extendedPosts.length / postsPerView) * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / extendedPosts.length}%)`,
              transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease` : "none",
            }}
          >
            {extendedPosts.map((post, idx) => (
              <CarouselCard
                key={`${post.id}-${idx}`}
                post={post}
                width={`${100 / extendedPosts.length}%`}
                isMobile={postsPerView <= 2}
                onClick={() => {
                  setModalPost(post);
                  setIsPostModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        <CarouselControls
          posts={posts}
          activeDotIndex={activeDotIndex}
          isTransitioning={isTransitioning}
          onPrev={handlePrev}
          onNext={handleNext}
          onDotClick={goToSlide}
        />
      </div>

      {/* Post details modal with header and footer */}
      <Modal
        open={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        ariaLabel="post details"
        header={modalPost ? (
          <div className="flex  justify-between">
            <div className="">             
              <div className="text-lg font-semibold">{modalPost.title}</div>
              {modalPost.createdDate && <div className="text-xs text-gray-500">{modalPost.createdDate}</div>}
               <div className="text-sm text-black text-start">{modalPost.category}</div>
            </div>
          </div>
        ) : null}
        footer={modalPost ? (
          <div className="flex gap-2 justify-end">
          
            <button onClick={() => setIsPostModalOpen(false)} className="px-3 py-1 border rounded text-sm">Close</button>
          </div>
        ) : null}
      >
        {modalPost ? (
          <article className="flex flex-col gap-4">
            {modalPost.image && (
              <img src={modalPost.image} alt={modalPost.title} className="w-full object-cover rounded" />
            )}

            <div className="prose prose-sm text-gray-900 max-w-none text-justify">
              <div dangerouslySetInnerHTML={{ __html: modalPost.description || modalPost.excerpt || "" }} />
            </div>
          </article>
        ) : null}
      </Modal>

                      {/* Action Buttons */}
                      {/* <div className="grid grid-cols-2 gap-10 px-4">
                        <a
                          href='/posts'
                          className="bg-gradient-to-r from-blue-700 to-blue-400 text-white font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 text-center py-2 px-3 text-sm rounded-lg"
                        >
                         सभी पोस्ट देखें 
                        </a>
                         
                        <button
                          onClick={() => setIsSubscriptionModalOpen(true)}
                          className="bg-gradient-to-r from-blue-400 to-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 py-2 px-3 text-sm rounded-lg"
                        >
                       सब्सक्राइब करें
                        </button>
                      </div> */}
                      <SubscriptionModal
            isOpen={isSubscriptionModalOpen}
            onClose={() => setIsSubscriptionModalOpen(false)}
          />
    </section>
  );
}

// Carousel Card Component
function CarouselCard({ post, width, onClick, isMobile = false }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden group/card flex-shrink-0 ${isMobile ? 'cursor-pointer' : ''}`}
      style={{ width }}
      {...(isMobile
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onClick,
            onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }
          }
        : {})}
    >
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-[9px] font-semibold rounded-full mb-1.5">
          {post.category}
        </span>
        <h3 className="text-sm md:text-base font-bold text-white mb-1.5 leading-tight line-clamp-2 group-hover/card:line-clamp-3 transition-all">
          {post.title}
        </h3>
        <p className="text-gray-200 text-[10px] md:text-xs mb-2 line-clamp-1 group-hover/card:line-clamp-2 transition-all">
          {post.excerpt}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="inline-flex items-center gap-1 px-2 py-1 bg-white text-gray-900 text-[10px] font-semibold rounded-md hover:bg-blue-50 transition-all duration-300 shadow-md opacity-0 group-hover/card:opacity-100"
        >
          पढ़ें
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Carousel Controls Component
function CarouselControls({ posts, activeDotIndex, isTransitioning, onPrev, onNext, onDotClick }) {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
      {/* Dots Indicator */}
      <div className="flex gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1.5 rounded-full">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`transition-all duration-300 rounded-full ${
              i === activeDotIndex
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white hover:bg-white/75"
            }`}
            aria-label={`स्लाइड ${i + 1} पर जाएं`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={onPrev}
          disabled={isTransitioning}
          className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="पिछली स्लाइड"
        >
          <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button2
          onClick={onNext}
          disabled={isTransitioning}
          className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="अगली स्लाइड"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button2>
      </div>
    </div>
    
  );
}