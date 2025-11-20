"use client";

import Carousel from "@/components/home/carousel";
import Header from "@/components/home/Header";
import TagLists from "@/components/home/TagLists";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Nav from "@/components/home/Nav";
import WeatherWidget from "@/components/home/WeatherWidget";
import Subscriber from "@/components/home/Subscriber";
import NewsFeed from "@/components/home/NewsFeed";

// Inline Subscription Modal Component
function SubscriptionModal({ router }) {
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

  // Always keep modal open
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

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

    // Email is optional
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
      router.push("/");
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
                  आपका सब्सक्रिप्शन पूरा हो गया है।
                </h3>
                <p className="text-gray-600 mb-4">
                  आपको बहुत जल्द अपडेट मिलने शुरू हो जाएंगे।
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
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Indus App Store पर फॉलो करें"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                    <span>Mobile App</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="WhatsApp ग्रुप ज्वाइन करें"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => router.push("/")}
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
                  ईमेल <span className="text-gray-400 text-xs">(वैकल्पिक)</span>
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
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full  bg-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Indus App Store पर फॉलो करें"
                  >
                    <i className="fab fa-google-play text-lg"></i>
                    <span>Mobile App</span>
                  </a>
                  {/* Instagram */}
                  {/* <a
                    href="https://www.instagram.com/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="Instagram पर फॉलो करें"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                    <span>Instagram</span>
                  </a> */}

                  {/* WhatsApp */}
                  <a
                    href="https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
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
                  {/* <a
                    href="https://sharechat.com/profile/prarang_meerut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium text-sm"
                    title="ShareChat पर फॉलो करें"
                  >
                    <i className="fas fa-share-alt text-lg"></i>
                    <span>ShareChat</span>
                  </a> */}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  // const [portal, setPortal] = useState(null);
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        const { data } = await api.get("/portal", { client: "prarang", params: { slug: "meerut" } });
        setPortal(data.data.portal);
        console.log("Portal data:", data.data.portal);
      } catch (err) {
        console.error("Error fetching portal data:", err);
      }
    };
    fetchPortal();
  }, []);

  return (
    <main className="min-h-screen w-full bg-cover bg-no-repeat bg-center home-bg" style={{ backgroundImage: `url(${portal?.image_base + portal?.header_image})` }}>
      <Header data={portal} />
      <section className="w-full px-4 py-6">
        <div className="container mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="w-full lg:w-3/12 bg-white/10 rounded-md order-2 lg:order-1">
            <Nav />
            <div className="bg-white  rounded p-3 mb-3">
              <div className="py-1 mb-2 text-xl font-bold border-b-1  "><i className="fas fa-location"></i> स्थानीय जानकारी</div>
              <div className="" dangerouslySetInnerHTML={{ __html: portal?.local_matrics }} />
            </div>
            <div className="bg-white  rounded p-3">
              <div className="py-1 mb-2 text-xl font-bold border-b-1"><i className="fas fa-newspaper"></i> मेरठ का समाचार</div>
              <NewsFeed />
            </div>
          </div>
          {/* Middle Section */}
          <div className="w-full lg:w-6/12 order-1 lg:order-2">
            <Subscriber />
            <div className="">
              <div className="mb-2 p-3 py-5 flex justify-center items-center w-full" style={{ backgroundColor: "rgba(0,0,0,0.63)" }}>
                <h2 className="text-3xl font-bold text-center text-white">{portal?.city_slogan}</h2>
              </div>
              <div className="bg-white  m-1 shadow p-4">
                <Carousel />
                <TagLists />
              </div>
              <div className="bg-white p-1 pt-2 m-1 mt-3 ">
                <h3 className="text-xl font-bold text-center">मेरठ आंकड़े</h3>
                <a href={`https://g2c.prarang.in/ai/${portal?.slug}?lang=hi`} target="_blank">
                  <img src="https://www.prarang.in/assets/portal/images/matrix-24.jpg" alt="Login" className="w-full" />
                </a>
              </div>
              <div className="w-full px-1 mt-3">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                  {/* Left Section - Planners */}
                  <div className="w-full ">
                    <div className="py-3 bg-white p-3">


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Market Planners Card */}
                        <div className="group relative bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400  p-8 shadow-xl hover:shadow-2xl transition-all duration-500  overflow-hidden">
                          {/* Background Animation */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-50"></div>
                          </div>

                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h5 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                  बाजार योजना
                                </h5>
                                <p className="text-blue-50 text-sm md:text-base font-medium">बाजार की जानकारी और विश्लेषण</p>
                              </div>
                            </div>

                            <div className="space-y-4 mb-6">
                              <a
                                href="https://hindi.prarang.in/india/market-planner/states" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    🇮🇳 भारत बाजार योजना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <p className="text-white/70 text-xs mt-2">भारत बाजार योजनाकार</p>
                              </a>

                              <a
                                href="https://hindi.prarang.in/world/market-planner" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    🌍 विश्व बाजार योजना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <p className="text-white/70 text-xs mt-2">विश्व बाजार योजनाकार</p>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Development Planners Card */}
                        <div className="group relative bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400  p-8 shadow-xl hover:shadow-2xl transition-all duration-500  overflow-hidden">
                          {/* Background Animation */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-50"></div>
                          </div>
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h5 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                  विकास योजना
                                </h5>
                                <p className="text-green-50 text-sm md:text-base font-medium">विकास रणनीति और वृद्धि</p>
                              </div>
                            </div>

                            <div className="space-y-4 mb-6">
                              <a
                                href="https://hindi.prarang.in/india/development-planners" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    🇮🇳 भारत विकास योजना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <p className="text-white/70 text-xs mt-2">भारत विकास योजनाकार</p>
                              </a>

                              <a
                                href="https://hindi.prarang.in/world/development-planner" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    🌍 विश्व विकास योजना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <p className="text-white/70 text-xs mt-2">विश्व विकास योजनाकार</p>
                              </a>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full lg:w-3/12 order-3 lg:order-3">

            <div className="p-3 flex items-center justify-items-center  bg-weth">
              <WeatherWidget className="w-full" code={portal?.weather_widget_code} />
            </div>

            <div className=" p-1 m-1 mt-3 ">
              <a href={`https://prarang.in/yp/meerut`} target="_blank">
                <img src="https://www.prarang.in/assets/images/yellowpages.jpg" alt="Login" className="h-[420px] w-full" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12 px-4 relative overflow-hidden" style={{ backgroundImage: `url('${portal?.image_base}${portal?.footer_image}')` }}>
        {/* Background overlay for image */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left transform  transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">प्रारंग के बारे में</h4>
              <p className="text-sm leading-relaxed opacity-90">प्रारंग प्रदान करता है, देश-विदेश के शहरों को समझने हेतु संपूर्ण जानकारी। जिसमें शामिल है स्थानीय भाषा में शहर की प्रकृति-संस्कृति के नॉलेज वेब, शहर की व्यवसाय सूची के येलो पेज, शहर के मेट्रिक्स या आंकड़ों का विस्तृत विश्लेषण, तथा AI द्वारा संचालित शहरवासियों से प्राप्त विशिष्ट सांकेतिकता।</p>
            </div>
            <div className="text-center transform  transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-10 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"></h4>
              <div className="grid grid-cols-2 gap-6">
                <a href="https://www.facebook.com/prarang.in" target="_blank" className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="p-3 bg-blue-600 rounded-full shadow-lg group-hover:bg-blue-500 group-hover:shadow-xl mb-3">
                    <i className="fab fa-facebook fa-lg text-white"></i>
                  </div>
                  <span className="text-sm font-semibold group-hover:text-blue-300">Facebook</span>
                </a>
                <a href="javascript:void(0)" onClick={(e) => { e.preventDefault(); alert('Coming Soon'); }} target="_blank" className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="p-3 bg-blue-400 rounded-full shadow-lg group-hover:bg-blue-300 group-hover:shadow-xl mb-3">
                    <i className="fab fa-twitter fa-lg text-white"></i>
                  </div>
                  <span className="text-sm font-semibold group-hover:text-blue-200">Twitter</span>
                </a>
                <a href="https://www.instagram.com/prarang_in/?hl=en" target="_blank" className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl mb-3">
                    <i className="fab fa-instagram fa-lg text-white"></i>
                  </div>
                  <span className="text-sm font-semibold group-hover:text-pink-300">Instagram</span>
                </a>
                <a href="https://www.linkedin.com/company/indeur-prarang/" target="_blank" className="flex flex-col items-center group hover:scale-110 transition-all duration-300">
                  <div className="p-3 bg-blue-700 rounded-full shadow-lg group-hover:bg-blue-600 group-hover:shadow-xl mb-3">
                    <i className="fab fa-linkedin fa-lg text-white"></i>
                  </div>
                  <span className="text-sm font-semibold group-hover:text-blue-300">LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="text-center md:text-left md:pl-4 transform  transition-transform duration-300">
              <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"><i className="fas fa-map-marker-alt mr-2"></i> पता</h4>
              <div className="space-y-2 text-sm opacity-90">
                <p>ऑफिस #25, 11th फ्लोर, दा आई-थम, A40,</p>
                <p>सेक्टर 62, नॉएडा (U.P), इंडिया 201309</p>
                <p><i className="fas fa-phone mr-2"></i>0120-4561284</p>
                <p><i className="fas fa-envelope mr-2"></i><a href="mailto:query@prarang.in" className="hover:text-blue-400 transition-colors underline">Query@prarang.in</a></p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm opacity-75">&copy; 2025 प्रारंग. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <SubscriptionModal router={router} />
    </main>
  );
}
