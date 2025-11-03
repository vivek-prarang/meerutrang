"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

export default function SubscriptionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get("cities", {
          client: "analytics",
          params: { locale: "hi", group: 1 },
        });

        if (response.data?.data?.cities) {
          // Flatten all cities from all states
          const allCities = [];
          Object.keys(response.data.data.cities).forEach((stateId) => {
            const stateCities = response.data.data.cities[stateId];
            stateCities.forEach((city) => {
              allCities.push({
                id: city.id,
                name: city.city, // Hindi name
                englishName: city.local_name, // English name
                state: city.state,
                slug: city.city_slug,
              });
            });
          });

          // Sort cities alphabetically by Hindi name
          allCities.sort((a, b) => a.name.localeCompare(b.name, "hi"));
          setCities(allCities);

          // Auto-select Meerut
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

    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

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

  // Load Facebook SDK when modal opens
  useEffect(() => {
    if (isOpen) {
      if (window.FB) {
        window.FB.XFBML.parse();
      } else {
        // Load Facebook SDK script
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v24.0&appId=990630689876973";
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "कृपया अपना नाम दर्ज करें";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "नाम कम से कम 2 अक्षर का होना चाहिए";
    } else if (!/^[a-zA-Z\s\u0900-\u097F]+$/.test(formData.name)) {
      newErrors.name = "नाम में केवल अक्षर होने चाहिए";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "कृपया अपना मोबाइल नंबर दर्ज करें";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें";
    }

    // City validation
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
      // API call to subscribe endpoint
      const response = await api.post("subscribe", {
        name: formData.name,
        mobile: formData.mobile,
        city: formData.city,
      });

      console.log("Subscription successful:", response.data);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", mobile: "", city: "" });
        setSearchTerm("");
        setIsDropdownOpen(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Subscription error:", error);
      // Show error message to user
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
      onClose();
    }
  };

  if (!isOpen) return null;

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
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-8 rounded-t-2xl relative overflow-hidden sticky top-0 z-10">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute top-0 right-0 w-40 h-40 text-white" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="15" opacity="0.3" />
              <circle cx="80" cy="80" r="20" opacity="0.2" />
            </svg>
          </div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSubmitted ? "🎉 धन्यवाद!" : "📬 सब्सक्राइब करें"}
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                {isSubmitted
                  ? "आपकी सदस्यता सफल रही है"
                  : "नवीनतम समाचार और अपडेट प्राप्त करें"}
              </p>
            </div>
            {!isSubmitting && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gradient-to-b from-white to-gray-50">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="mb-6 inline-flex p-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                सफलतापूर्वक सब्सक्राइब किया गया!
              </h3>
              <p className="text-gray-600 mb-4">
                {formData.name}, आपको जल्द ही अपडेट मिलने लगेंगे।
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
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

              {/* Social Links Section */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h3 className="text-center font-bold text-gray-700 uppercase tracking-wider text-sm mb-4">हमें फॉलो करें</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div className="flex justify-center items-start">
                    <div id="fb-root"></div>
                    <div
                      className="fb-page"
                      data-href="https://www.facebook.com/prarang.in"
                      data-tabs=""
                      data-width="240"
                      data-height="280"
                      data-small-header="true"
                      data-adapt-container-width="true"
                      data-hide-cover="true"
                      data-show-facepile="true"
                    >
                      <blockquote cite="https://www.facebook.com/prarang.in" className="fb-xfbml-parse-ignore">
                        <a href="https://www.facebook.com/prarang.in" className="text-blue-600 hover:underline">Prarang हिंदी</a>
                      </blockquote>
                    </div>
                  </div>

                  {/* WhatsApp Group Link */}
                  <div className="flex flex-row items-start">
                    <a
                      href="https://chat.whatsapp.com/HpjFX0qe7Du7q9fi3DQR7P"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group"
                    >
                      <i className="fa-brands fa-whatsapp text-3xl group-hover:animate-bounce"></i>
                      <span className="text-sm text-center leading-tight font-semibold">मेरठ रंग<br />ग्रुप ज्वाइन करें</span>
                    </a>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div >
    </div >
  );
}
