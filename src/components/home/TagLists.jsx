"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Heading from "../ui/Heading";

export default function TagLists() {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [tags, setTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags", {
          client: "prarang",
          params: { language: "hi", location: 'c2' },
        });

        if (response.error) {
          setLoading(false);
          return;
        }

        if (response.data?.data?.categories) {
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

          // Extract sub categories with parent category info
          const subCats = Object.entries(response.data.data.categories.subcategories).map(
            ([key, value]) => ({
              id: key,
              name: value.category_name,
              count: value.count,
              icon: value.icon,
              parentCategory: value.parent_category || value.parentCategory, // Get parent from API
            })
          );
          setSubCategories(subCats);

          console.log('Main Categories:', mainCats);
          console.log('Sub Categories:', subCats);

          // Extract tags
          const allTags = response.data.data.tags;
          setTags(allTags);
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleSubCategoryClick = (categoryId, categoryName) => {
    const categoryKey = `tag_${categoryId}`;
    setSelectedCategory({ id: categoryId, name: categoryName });
    setSelectedTags(tags[categoryKey] || []);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (mainCategories.length === 0 && subCategories.length === 0) {
    return (
      <div className="w-full mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-center text-gray-600">
          टैग डेटा लोड नहीं हो पा रहा है।
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-3 px-3 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 rounded-2xl shadow-sm border border-gray-100/50">

      {/* <Heading title="हिन्दी शहर - प्रारंग ज्ञान के रंग" /> */}

      {/* Desktop Layout - Side by Side */}
      <div className="hidden md:block">
        {/* Main Categories Section - 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden  border border-gray-300 rounded-lg"
            >
              {/* Category Header */}
              <div className="text-center py-1 px-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{category.name}</h3>
                <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-5 py-2 rounded-lg shadow-md">
                  {category.count}
                </div>
              </div>
              {/* Colored Boxes - Placeholder for visual design */}
              <div className="flex h-12">
                {category.id === 'culture' ? (
                  <>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1 bg-red-500"></div>
                    <div className="flex-1 bg-[#ffff19]"></div>
                    <div className="flex-1 bg-[#0000fe]"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                  </>
                ) : (
                  <>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1 bg-[#faff98]"></div>
                    <div className="flex-1 bg-[#c8ff01]"></div>
                    <div className="flex-1 bg-[#339933]"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Sub Categories Section - 2 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mainCategories.map((mainCat, mainIndex) => {
            // Calculate which subcategories belong to this main category
            // Assuming first 3 subcategories for first main cat, next 3 for second main cat
            const startIndex = mainIndex * 3;
            const relatedSubCats = subCategories.slice(startIndex, startIndex + 3);

            console.log(`Main Category: ${mainCat.name}, Related Subcats:`, relatedSubCats);

            if (relatedSubCats.length === 0) return null;

            return (
              <div key={mainCat.id} className="space-y-3">

                {relatedSubCats.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => handleSubCategoryClick(category.id, category.name)}
                    className="w-full group bg-white border-2 border-gray-200 rounded-xl p-1 hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Side - Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                        {/* Different icons for each category */}
                        {index === 0 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                        {index === 1 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                        )}
                        {index === 2 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                          </svg>
                        )}
                        {index === 3 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {index === 4 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                          </svg>
                        )}
                        {index === 5 && (
                          <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* Center - Category Name */}
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-base">
                          {category.name}
                        </h5>
                      </div>

                      {/* Right Side - Count Badge */}
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 rounded-lg min-w-[50px] text-center shadow-sm group-hover:shadow-md transition-all duration-300">
                          {category.count}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Layout - One by One */}
      <div className="md:hidden space-y-6">
        {mainCategories.map((category, mainIndex) => {
          const startIndex = mainIndex * 3;
          const relatedSubCats = subCategories.slice(startIndex, startIndex + 3);

          return (
            <div key={category.id} className="space-y-3">
              {/* Main Category */}
              <div className="overflow-hidden border border-gray-300 rounded-lg">
                <div className="text-center py-1 px-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{category.name}</h3>
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-5 py-2 rounded-lg shadow-md">
                    {category.count}
                  </div>
                </div>
                <div className="flex h-12">
                  {category.id === 'culture' ? (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1 bg-red-500"></div>
                      <div className="flex-1 bg-[#ffff19]"></div>
                      <div className="flex-1 bg-[#0000fe]"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1 bg-[#faff98]"></div>
                      <div className="flex-1 bg-[#c8ff01]"></div>
                      <div className="flex-1 bg-[#339933]"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Sub Categories for this Main Category */}
              {relatedSubCats.map((subCat, index) => (
                <button
                  key={subCat.id}
                  onClick={() => handleSubCategoryClick(subCat.id, subCat.name)}
                  className="w-full group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                      {index === 0 && (
                        <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-base">
                        {subCat.name}
                      </h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 rounded-lg min-w-[50px] text-center shadow-sm group-hover:shadow-md transition-all duration-300">
                        {subCat.count}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal for Tags */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabel="tags list"
        header={
          selectedCategory && (
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedCategory.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                कुल टैग: {selectedTags.length}
              </p>
            </div>
          )
        }
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              बंद करें
            </button>
          </div>
        }
      >
        {selectedTags.length > 0 && (
          <div className="space-y-3 max-h-100 overflow-y-auto">
            {selectedTags.map((tag) => (
              <a
                key={tag.tagId}
                href={`/लेख?tagid=${tag.tagId}&tagname=${encodeURIComponent(tag.tagName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white  rounded-full  hover:border-blue-400 transition-all duration-300  p-2 border"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left Side - Icon */}
                  <div className="w-20 rounded-full flex items-center justify-center flex-shrink-0">
                    {tag.tagIcon ? (
                      <img
                        src={tag.tagIcon}
                        alt={tag.tagName}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Center - Tag Name */}
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 text-base leading-snug">
                      {tag.tagName}
                    </h5>
                    <p className="text-xs text-gray-500 mt-1">
                      {/* {tag.tagCategoryInEnglish} */}
                    </p>
                  </div>

                  {/* Right Side - Count Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-blue-500 text-white font-bold px-3 py-1  min-w-[50px] text-center">
                      {tag.count}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
