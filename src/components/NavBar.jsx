"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [tags, setTags] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [subCategoryHover, setSubCategoryHover] = useState(null);
  const navRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen(null);
        setSubCategoryHover(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape and on scroll to keep UI tidy
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(null);
        setSubCategoryHover(null);
        setIsOpen(false);
      }
    };

    const onScroll = () => {
      setDropdownOpen(null);
      setSubCategoryHover(null);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile menu when clicking on a link
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/tags", {
        client: "prarang",
        params: { language: "hi" },
      });

      if (response.data?.data) {
        // Extract main categories
        const mainCats = Object.entries(response.data.data.categories.maincategories).map(
          ([key, value]) => ({
            id: key,
            name: value.category_name,
            count: value.count,
            icon: value.icon,
          })
        );
        setMainCategories(mainCats);

        // Extract sub categories
        const subCats = Object.entries(response.data.data.categories.subcategories).map(
          ([key, value]) => ({
            id: key,
            name: value.category_name,
            count: value.count,
            icon: value.icon,
            // include parent information when available from API
            parentCategory: value.parent_category || value.parentCategory || null,
          })
        );
        setSubCategories(subCats);

        // Extract tags
        setTags(response.data.data.tags || {});
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMainCategories([]);
      setSubCategories([]);
      setTags({});
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    setDropdownOpen(null);
    setSubCategoryHover(null);
  };

  const handleCategoryHover = (categoryId) => {
    if (window.innerWidth >= 768) {
      setDropdownOpen(categoryId);
    }
  };

  const handleCategoryLeave = () => {
    if (window.innerWidth >= 768) {
      // Small delay to allow moving to subcategory dropdown
      setTimeout(() => {
        setDropdownOpen(null);
        setSubCategoryHover(null);
      }, 200);
    }
  };

  const handleCategoryKeyDown = (e, categoryId) => {
    // keyboard accessibility for menu buttons
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (window.innerWidth < 768) {
        setDropdownOpen(dropdownOpen === categoryId ? null : categoryId);
      } else {
        // open dropdown on desktop
        setDropdownOpen(categoryId);
        // focus first interactive element inside dropdown
        setTimeout(() => {
          const sel = document.querySelector(`[data-dropdown="${categoryId}"] a, [data-dropdown="${categoryId}"] button`);
          if (sel) sel.focus();
        }, 50);
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDropdownOpen(categoryId);
      setTimeout(() => {
        const sel = document.querySelector(`[data-dropdown="${categoryId}"] a, [data-dropdown="${categoryId}"] button`);
        if (sel) sel.focus();
      }, 50);
    }
  };

  const handleSubCategoryHover = (subCategoryId) => {
    if (window.innerWidth >= 768) {
      setSubCategoryHover(subCategoryId);
    }
  };

  const handleSubCategoryLeave = () => {
    if (window.innerWidth >= 768) {
      setSubCategoryHover(null);
    }
  };

  // Get tags for a specific subcategory
  const getTagsForSubCategory = (subCategoryId) => {
    const tagKey = `tag_${subCategoryId}`;
    return tags[tagKey] || [];
  };

  // Blocklist for tags that should not be shown in dropdowns.
  // The user requested excluding these names/ids.
  const blockedTagNames = [
    "समय - सीमा",
    "मानव और उनकी इंद्रियाँ",
    "मानव और उनके आविष्कार",
  ];
  const blockedTagIds = [1099, 4199, 3285];

  const filterTags = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((t) => {
      if (!t) return false;
      const name = (t.tagName || "").trim();
      const id = Number(t.tagId);
      if (blockedTagNames.includes(name)) return false;
      if (!Number.isNaN(id) && blockedTagIds.includes(id)) return false;
      return true;
    });
  };

  // Aggregate tags for a main category by collecting tags from all its subcategories.
  // Deduplicate by tagId and return an array of tags (most recent order preserved by iteration).
  const getTagsForMainCategory = (mainCategoryId) => {
    const subs = getSubCategoriesForMainCategory(mainCategoryId) || [];
    const map = new Map();
    subs.forEach((sub) => {
      const list = getTagsForSubCategory(sub.id);
      if (!Array.isArray(list)) return;
      list.forEach((t) => {
        if (!map.has(t.tagId)) map.set(t.tagId, t);
      });
    });
    return Array.from(map.values());
  };

  // Determine which subcategories belong to a main category.
  // Prefer explicit parentCategory from API. If not available, fallback to index grouping of 3 per main category
  // (matching the way TagLists groups subcategories: 3 per main category).
  const getSubCategoriesForMainCategory = (mainCategoryId) => {
    if (!Array.isArray(subCategories) || subCategories.length === 0) return [];

    // If API provides parentCategory for subcategories, use that mapping
    const hasParentInfo = subCategories.some((s) => s.parentCategory);
    if (hasParentInfo) {
      return subCategories.filter((s) => String(s.parentCategory) === String(mainCategoryId));
    }

    // Fallback: group by index using 3 subcategories per main category (1,2,3 => main 0; 4,5,6 => main 1, etc.)
    const mainIndex = mainCategories.findIndex((c) => c.id === mainCategoryId);
    const startIndex = mainIndex >= 0 ? mainIndex * 3 : 0;
    return subCategories.slice(startIndex, startIndex + 3);
  };

  const displayCategoryName = (category) => {
    // map certain English ids to Hindi display names
    if (!category || !category.id) return category?.name || "";
    if (category.id === "culture" || /culture/i.test(category.id)) return "संस्कृति";
    if (category.id === "nature" || /nature/i.test(category.id)) return "प्रकृति";
    return category.name || "";
  };

  return (
    <nav ref={navRef} className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-16 py-2 px-4">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition"
          onClick={handleLinkClick}
        >
          <img
            src="https://prarang.s3.amazonaws.com/posts-2017-24/logo2.png"
            alt="Logo"
            className="h-12 inline-block mr-2"
          />
        </Link>

        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          role="menubar"
          className={`md:flex md:space-x-6 md:items-center absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 transition-all duration-300 ${
            isOpen
              ? 'flex flex-col space-y-4 md:space-y-0'
              : 'hidden'
          }`}
        >
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition block md:inline py-2 md:py-0"
              onClick={handleLinkClick}
            >
             पोर्टल
            </Link>
          </li>
          <li>
            <Link
              href="/लेख"
              className="text-gray-700 hover:text-purple-600 transition block md:inline py-2 md:py-0"
              onClick={handleLinkClick}
            >
              दैनिक लेख
            </Link>
          </li>

          {mainCategories.map((category) => {
            const relatedSubCats = getSubCategoriesForMainCategory(category.id);

            return (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category.id)}
                onMouseLeave={handleCategoryLeave}
              >
                <button
                  role="menuitem"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen === category.id}
                  onKeyDown={(e) => handleCategoryKeyDown(e, category.id)}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setDropdownOpen(dropdownOpen === category.id ? null : category.id);
                    } else {
                      // navigate to main category page on desktop
                      router.push(`/posts?main_category=${category.id}`);
                    }
                  }}
                  className="text-gray-700 hover:text-purple-600 transition flex items-center gap-1 w-full text-left py-2 md:py-0"
                >
                  {displayCategoryName(category) || category.name}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen === category.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Main Dropdown Menu with Subcategories */}
                {dropdownOpen === category.id && (
                  <div className="md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 mt-2 md:mt-0 w-full md:w-[760px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                      {/* Left: category header + subcategories */}
                      <div className="md:w-1/2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                          {displayCategoryName(category) || category.name}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {relatedSubCats.map((subCat) => {
                            const subCatTags = getTagsForSubCategory(subCat.id);

                            return (
                              <div
                                key={subCat.id}
                                className="relative group"
                                onMouseEnter={() => handleSubCategoryHover(subCat.id)}
                                onMouseLeave={handleSubCategoryLeave}
                              >
                                <Link
                                  href={`/posts?category=${subCat.id}`}
                                  className="flex items-center justify-between p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors border border-transparent hover:border-purple-200"
                                  onClick={handleLinkClick}
                                >
                                  <div className="flex items-center space-x-3">
                                    {subCat.icon && (
                                      <img
                                        src={subCat.icon}
                                        alt={subCat.name}
                                        className="w-6 h-6 object-contain"
                                      />
                                    )}
                                    <span className="font-medium">{subCat.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                      {subCat.count}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: tags preview for hovered subcategory (on desktop) */}
                      <div className="md:w-1/2">
                        <div className="p-2 bg-gray-50 rounded">
                          {subCategoryHover ? (
                            (() => {
                              const hoverTags = getTagsForSubCategory(subCategoryHover);
                              if (!hoverTags || hoverTags.length === 0) return <div className="text-sm text-gray-500">No tags</div>;
                              return (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">टैग सूची</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                                    {hoverTags.slice(0, 30).map((tag) => (
                                      <Link
                                        key={tag.tagId}
                                        href={`/posts?tag=${tag.tagId}`}
                                        className="block p-2 text-sm text-gray-700 hover:bg-white hover:text-purple-600 rounded transition-colors"
                                        onClick={handleLinkClick}
                                      >
                                        <div className="flex items-center space-x-2">
                                          {tag.tagIcon && (
                                            <img src={tag.tagIcon} alt={tag.tagName} className="w-4 h-4 object-contain" />
                                          )}
                                          <span className="truncate">{tag.tagName}</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            (() => {
                              const aggregated = getTagsForMainCategory(category.id) || [];
                              if (!aggregated || aggregated.length === 0) return <div className="text-sm text-gray-500">No tags</div>;
                              return (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">टैग सूची</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                                    {aggregated.slice(0, 30).map((tag) => (
                                      <Link
                                        key={tag.tagId}
                                        href={`/posts?tag=${tag.tagId}`}
                                        className="block p-2 text-sm text-gray-700 hover:bg-white hover:text-purple-600 rounded transition-colors"
                                        onClick={handleLinkClick}
                                      >
                                        <div className="flex items-center space-x-2">
                                          {tag.tagIcon && (
                                            <img src={tag.tagIcon} alt={tag.tagName} className="w-4 h-4 object-contain" />
                                          )}
                                          <span className="truncate">{tag.tagName}</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <Link
                        href="/categories"
                        className="block text-center p-3 mt-3 text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
                        onClick={handleLinkClick}
                      >
                        View all categories →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
