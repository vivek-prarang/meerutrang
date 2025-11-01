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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [modalTags, setModalTags] = useState([]);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape and scroll
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(null);
        setSubCategoryHover(null);
        setIsOpen(false);
        setModalOpen(false);
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

  // Responsive reset
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/tags", {
        client: "prarang",
        params: { language: "hi" },
      });

      if (response.data?.data) {
        const mainCats = Object.entries(response.data.data.categories.maincategories).map(
          ([key, value]) => ({
            id: key,
            name: value.category_name,
            count: value.count,
            icon: value.icon,
          })
        );
        setMainCategories(mainCats);

        const subCats = Object.entries(response.data.data.categories.subcategories).map(
          ([key, value]) => ({
            id: key,
            name: value.category_name,
            count: value.count,
            icon: value.icon,
            parentCategory: value.parent_category || value.parentCategory || null,
          })
        );
        setSubCategories(subCats);
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
    if (window.innerWidth >= 768) setDropdownOpen(categoryId);
  };

  const handleCategoryLeave = () => {
    if (window.innerWidth >= 768) {
      setTimeout(() => {
        setDropdownOpen(null);
        setSubCategoryHover(null);
      }, 200);
    }
  };

  const handleSubCategoryHover = (subCategoryId) => {
    if (window.innerWidth >= 768) setSubCategoryHover(subCategoryId);
  };

  const handleSubCategoryLeave = () => {
    if (window.innerWidth >= 768) setSubCategoryHover(null);
  };

  const blockedTagNames = ["समय - सीमा", "मानव और उनकी इंद्रियाँ", "मानव और उनके आविष्कार"];
  const blockedTagIds = [1099, 4199, 3285];

  const filterTags = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((t) => {
      const name = (t.tagName || "").trim();
      const id = Number(t.tagId);
      return !blockedTagNames.includes(name) && !blockedTagIds.includes(id);
    });
  };

  const getTagsForSubCategory = (subCategoryId) => {
    const tagKey = `tag_${subCategoryId}`;
    return filterTags(tags[tagKey] || []);
  };

  const getTagsForMainCategory = (mainCategoryId) => {
    const subs = getSubCategoriesForMainCategory(mainCategoryId) || [];
    const map = new Map();
    subs.forEach((sub) => {
      const list = getTagsForSubCategory(sub.id);
      list.forEach((t) => {
        if (!map.has(t.tagId)) map.set(t.tagId, t);
      });
    });
    return Array.from(map.values());
  };

  const getSubCategoriesForMainCategory = (mainCategoryId) => {
    if (!Array.isArray(subCategories) || subCategories.length === 0) return [];
    const hasParentInfo = subCategories.some((s) => s.parentCategory);
    if (hasParentInfo) {
      return subCategories.filter((s) => String(s.parentCategory) === String(mainCategoryId));
    }
    const mainIndex = mainCategories.findIndex((c) => c.id === mainCategoryId);
    const startIndex = mainIndex >= 0 ? mainIndex * 3 : 0;
    return subCategories.slice(startIndex, startIndex + 3);
  };

  const displayCategoryName = (category) => {
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

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none p-2"
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
        {/* Navigation */}
        <ul
          className={`md:flex md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-white shadow-md md:shadow-none p-4 md:p-0 transition-all duration-300 ${isOpen ? "flex flex-col space-y-4" : "hidden"
            }`}
        >
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 block"
              onClick={handleLinkClick}
            >
              पोर्टल
            </Link>
          </li>
          <li>
            <Link
              href="javascript:void(0)"
              className="text-gray-700 hover:text-purple-600 block"
              onClick={() => window.location.href = "/%E0%A4%B2%E0%A5%87%E0%A4%96"}
            >
              दैनिक लेख
            </Link>
          </li>

          {mainCategories.map((category) => (
            <li
              key={category.id}
              className="relative"
              onMouseEnter={() => handleCategoryHover(category.id)}
              onMouseLeave={handleCategoryLeave}
            >
              <button
                className="text-gray-700 hover:text-purple-600 flex items-center gap-1"
                onClick={() => {
                  if (category.id === "culture" || /culture/i.test(category.id)) {
                    const tags = getTagsForMainCategory(category.id).slice(0, 30);
                    setModalTags(tags);
                    setModalCategory(category);
                    setModalOpen(true);
                    return;
                  }
                  if (category.id === "nature" || /nature/i.test(category.id)) {
                    const tags = getTagsForMainCategory(category.id).slice(0, 30);
                    setModalTags(tags);
                    setModalCategory(category);
                    setModalOpen(true);
                    return;
                  }
                  router.push(`/लेख?main_category=${category.id}`);
                }}
              >
                {displayCategoryName(category) || category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🌸 Modal for Culture / Nature */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-[90%] md:w-[800px] max-h-[80vh] rounded-lg shadow-lg p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {displayCategoryName(modalCategory)}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 text-lg"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {modalTags.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {modalTags.map((tag) => (
                  <Link
                    key={tag.tagId}
                    href={`/लेख?tagid=${tag.tagId}&tagname=${encodeURIComponent(tag.tagName)}`}
                    className="p-2 bg-gray-50 hover:bg-purple-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-purple-200 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/लेख?tagid=${tag.tagId}&tagname=${encodeURIComponent(tag.tagName)}`;
                    }}
                  >
                    {tag.tagIcon && (
                      <img src={tag.tagIcon} alt={tag.tagName} className="w-5 h-5 object-contain" />
                    )}
                    <span className="truncate text-sm text-gray-700">{tag.tagName}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">कोई टैग उपलब्ध नहीं है</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
