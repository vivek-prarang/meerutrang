"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

export default function SubscriptionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const dropdownRef = useRef(null);

  // Check for #subscribe in URL and ?subscriber query parameter
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#subscribe") {
        setIsModalOpen(true);
      }
    };

    const checkQueryParameter = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has("subscriber")) {
        setIsModalOpen(true);
      }
    };

    // Check on component mount and page load
    if (typeof window !== "undefined") {
      // Initial checks
      handleHashChange();
      checkQueryParameter();

      // Listen for hash changes
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  // Expose openSubscriptionModal function to window for external JS calls
  useEffect(() => {
    window.openSubscriptionModal = () => {
      setIsModalOpen(true);
    };

    window.closeSubscriptionModal = () => {
      setIsModalOpen(false);
      window.history.replaceState(null, "", window.location.pathname);
    };

    return () => {
      delete window.openSubscriptionModal;
      delete window.closeSubscriptionModal;
    };
  }, []);

  // Sync with parent isOpen prop
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get("cities", {
          client: "analytics",
          params: { locale: "hi", group: 1 },
        });

        if (response.data?.data?.cities) {
          const allCities = [];
          Object.keys(response.data.data.cities).forEach((stateId) => {
            const stateCities = response.data.data.cities[stateId];
            stateCities.forEach((city) => {
              allCities.push({
                id: city.id,
                name: city.city,
                englishName: city.local_name,
                state: city.state,
                slug: city.city_slug,
              });
            });
          });

          allCities.sort((a, b) => a.name.localeCompare(b.name, "hi"));
          setCities(allCities);

          const meerutCity = allCities.find(
            city => city.englishName?.toLowerCase() === "meerut" || city.name?.toLowerCase().includes("मेरठ")
          );
          if (meerutCity) {
            setFormData((prev) => ({ ...prev, city: meerutCity.name }));
            setSearchTerm(meerutCity.name);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    if (isModalOpen) {
      fetchCities();
    }
  }, [isModalOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on search term
  const filteredCities = cities.filter((city) => {
    const search = searchTerm.toLowerCase();
    return (
      city.name.toLowerCase().includes(search) ||
      city.englishName.toLowerCase().includes(search) ||
      city.state.toLowerCase().includes(search)
    );
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "कृपया अपना नाम दर्ज करें";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "नाम कम से कम 2 अक्षर का होना चाहिए";
    } else if (!/^[a-zA-Z\s\u0900-\u097F]+$/.test(formData.name)) {
      newErrors.name = "नाम में केवल अक्षर होने चाहिए";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "कृपया अपना मोबाइल नंबर दर्ज करें";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें";
    }

    if (!formData.email.trim()) {
      newErrors.email = "कृपया अपना ईमेल दर्ज करें";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "कृपया वैध ईमेल दर्ज करें";
    }

    if (!formData.city) {
      newErrors.city = "कृपया अपना शहर चुनें";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For mobile, only allow numbers and limit to 10 digits
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city: city.name }));
    setSearchTerm(city.name);
    setIsDropdownOpen(false);
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("subscribe", {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
      });

      console.log("Subscription successful:", response.data);
      setIsSubmitted(true);
      setFormData({ name: "", mobile: "", email: "", city: "" });
      setSearchTerm("");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("सब्सक्रिप्शन में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", mobile: "", city: "" });
      setErrors({});
      setIsSubmitted(false);
      setSearchTerm("");
      setIsDropdownOpen(false);
      setIsModalOpen(false);
      // Remove hash from URL
      window.history.replaceState(null, "", window.location.pathname);
      onClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-t-2xl relative overflow-hidden sticky top-0 z-10">

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isSubmitted ? "🎉 धन्यवाद!" : "सब्सक्राइब करें"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-shrink-0 text-white hover:bg-white/20 transition-all p-2 rounded-lg hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
              title="Close"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gradient-to-b from-white to-gray-50">
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="mb-6 inline-flex p-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg">
                  <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  सफलतापूर्वक सब्सक्राइब किया गया!
                </h3>
                <p className="text-gray-600 mb-4">
                  {formData.name || "आप"}, आपको जल्द ही अपडेट मिलने लगेंगे।
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
              </div>

              {/* Social Media Icons */}
              <div className="border-t-2 border-gray-200 pt-6">
                <p className="text-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">हमें फॉलो करें</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Instagram */}
                  <a
                    href="https://www.indusappstore.com/apps/news-and-magazines/prarang/com.riversanskiriti.prarang?page=details&id=com.riversanskiriti.prarang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Indus App Store पर फॉलो करें"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                    <span>Mobile App</span>
                  </a>


                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Instagram पर फॉलो करें"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                    <span>Instagram</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="WhatsApp ग्रुप ज्वाइन करें"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>WhatsApp</span>
                  </a>

                  {/* Twitter */}
                  {/* <a
                    href="https://twitter.com/prarang_in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Twitter पर फॉलो करें"
                  >
                    <i className="fab fa-twitter text-lg"></i>
                    <span>Twitter</span>
                  </a> */}

                  {/* ShareChat */}
                  <a
                    href="https://sharechat.com/profile/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="ShareChat पर फॉलो करें"
                  >
                    <i className="fab fa-share-alt text-lg"></i>
                    <span>ShareChat</span>
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                बंद करें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="अपना पूरा नाम दर्ज करें"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  मोबाइल नंबर <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="10 अंकों का नंबर"
                    maxLength={10}
                    className={`w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${errors.mobile
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  ईमेल <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* City Field */}
              <div className="relative" ref={dropdownRef}>
                <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  शहर <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={isLoadingCities ? "शहर लोड हो रहे हैं..." : "शहर खोजें या चुनें"}
                    disabled={isLoadingCities}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${errors.city
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } ${isLoadingCities ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isLoadingCities ? (
                      <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && !isLoadingCities && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-gray-800">{city.name}</div>
                          <div className="text-sm text-gray-500">
                            {city.englishName} • {city.state}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        कोई शहर नहीं मिला
                      </div>
                    )}
                  </div>
                )}

                {errors.city && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    सबमिट हो रहा है...
                  </>
                ) : (
                  <>
                    सब्सक्राइब करें
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Social Media Icons */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <p className="text-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">हमें फॉलो करें</p>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://www.indusappstore.com/apps/news-and-magazines/prarang/com.riversanskiriti.prarang?page=details&id=com.riversanskiriti.prarang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Indus App Store पर फॉलो करें"
                  >
                    <i className="fab fa-google-play text-lg"></i>
                    <span>Mobile App</span>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Instagram पर फॉलो करें"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                    <span>Instagram</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="WhatsApp ग्रुप ज्वाइन करें"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>WhatsApp</span>
                  </a>

                  {/* Twitter */}
                  {/* <a
                    href="https://twitter.com/prarang_in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Twitter पर फॉलो करें"
                  >
                    <i className="fab fa-twitter text-lg"></i>
                    <span>Twitter</span>
                  </a> */}

                  {/* ShareChat */}
                  <a
                    href="https://sharechat.com/profile/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="ShareChat पर फॉलो करें"
                  >
                    <i className="fas fa-share-alt text-lg"></i>
                    <span>ShareChat</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div >
  );
}
