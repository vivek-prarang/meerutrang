"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";

// ==========================================
// Sub-Components
// ==========================================

/**
 * AccordionSection
 * Reusable accordion item with expandable/collapsible state.
 */
const AccordionSection = ({ title, subtitle, isOpen, onToggle, children }) => {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full text-left px-5 py-3 font-semibold flex justify-between items-center transition-colors ${isOpen
          ? "bg-blue-50 text-blue-700"
          : "hover:bg-gray-50 text-gray-700"
          }`}
      >
        <div className="flex flex-col">
          <span>{title}</span>
          {subtitle && (
            <span className="text-[11px] font-medium text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
        <span
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * ItemGrid
 * Reusable grid for displaying cities or countries.
 */
const ItemGrid = ({ items, linkPrefix, nameKey, slugKey }) => {
  if (!items || items.length === 0) {
    return <div className="text-center text-gray-400 py-2">कोई डेटा नहीं</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <a
          key={i}
          href={`${linkPrefix}${encodeURIComponent(item[slugKey])}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-200 text-gray-600 rounded-lg px-3 py-2 font-bold text-center text-xs hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
        >
          {item[nameKey]}
        </a>
      ))}
    </div>
  );
};

/**
 * EncyclopediaModal
 * Unified modal for both Indian and World encyclopedias.
 * Handles search, filtering, and accordion rendering.
 */
const EncyclopediaModal = ({ type, data, onClose, isLoading }) => {
  const [openSection, setOpenSection] = useState(null);

  // Determine modal title and labels
  const config = {
    india: {
      title: "प्रारंग ए.आई. (A.I.) विश्वकोश - भारत",
      sectionSubtitle: (count) => `शहर: ${count}`,
    },
    world: {
      title: "प्रारंग ए.आई. (A.I.) विश्वकोश - अन्य देश",
      sectionSubtitle: (count) => `देश: ${count}`,
    },
  };

  const { title, sectionSubtitle } = config[type];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex justify-between items-center shadow-md shrink-0">
          <h3 className="font-bold text-xl flex items-center gap-2">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-50/50 custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-500">लोड हो रहा है...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              कोई परिणाम नहीं मिला
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((group) => (
                <AccordionSection
                  key={group.name}
                  title={group.name}
                  subtitle={sectionSubtitle(group.items.length)}
                  isOpen={openSection === group.name}
                  onToggle={() =>
                    setOpenSection(openSection === group.name ? null : group.name)
                  }
                >
                  <ItemGrid
                    items={group.items}
                    linkPrefix="https://hindi.prarang.in/ai/"
                    nameKey={type === 'india' ? 'city' : 'country'}
                    slugKey={type === 'india' ? 'city_slug' : 'country_slug'}
                  />
                </AccordionSection>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================

const WorldMap = () => {
  const [activeModal, setActiveModal] = useState(null); // 'india' | 'world' | null
  const [indiaData, setIndiaData] = useState([]);
  const [worldData, setWorldData] = useState([]);
  const [loading, setLoading] = useState({ india: false, world: false });

  /* =========================
     FETCH DATA: INDIA
     ========================= */
  useEffect(() => {
    const fetchCityData = async () => {
      setLoading(prev => ({ ...prev, india: true }));
      try {
        const response = await api.get("cities", {
          client: "analytics",
          params: { locale: "hi" },
        });

        const cities = response?.data?.data?.cities;

        if (Array.isArray(cities)) {
          const groupedData = cities.reduce((acc, c) => {
            if (!acc[c.state]) {
              acc[c.state] = {
                name: c.state,
                items: [],
                totalPop: 0,
                type: c.state_ut // 'state' or 'ut'
              };
            }
            acc[c.state].items.push(c);
            acc[c.state].totalPop += Number(c.MSTR5) || 0;
            return acc;
          }, {});

          // Sort by population and format for UI
          const grouped = Object.values(groupedData).sort(
            (a, b) => b.totalPop - a.totalPop
          );
          setIndiaData(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      } finally {
        setLoading(prev => ({ ...prev, india: false }));
      }
    };

    fetchCityData();
  }, []);

  /* =========================
     FETCH DATA: WORLD
     ========================= */
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, world: true }));
      try {
        const response = await api.get("countries", {
          client: "analytics",
          params: { locale: "hi" },
        });

        const countries = response?.data?.data?.countries;
        if (Array.isArray(countries)) {


          const continentMap = {
            1: "Asia",
            2: "Africa",
            3: "North America",
            4: "South America",
            5: "Europe",
            6: "South East Asia and Oceania",
            7: "Central America and the Caribbean"
          };

          const continentNamesHi = {
            "Asia": "एशिया",
            "Africa": "अफ्रीका",
            "North America": "उत्तरी अमेरिका",
            "South America": "दक्षिणी अमेरिका",
            "Europe": "यूरोप",
            "South East Asia and Oceania": "दक्षिण-पूर्व एशिया",
            "Central America and the Caribbean": "मध्य अमेरिका"
          };

          const grouped = countries.reduce((acc, c) => {
            // Try to find a group name
            let groupName = c.continent; // Fallback

            // If continent is an ID, map it
            if (continentMap[c.continent_id]) {
              groupName = continentMap[c.continent_id];
            }

            // If we have a Hindi name for it, use that for display?
            // Or keep English for key and add display name.
            // Let's use the Hindi name as the main display name for the Accordion Title.

            const displayName = continentNamesHi[groupName] || groupName || "Other";

            if (!acc[displayName]) {
              acc[displayName] = {
                name: displayName,
                items: []
              };
            }
            acc[displayName].items.push(c);
            return acc;
          }, {});

          setWorldData(Object.values(grouped));
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
      } finally {
        setLoading(prev => ({ ...prev, world: false }));
      }
    };

    fetchCountries();
  }, []);


  return (
    <div className="w-full">
      {/* MAIN CARD */}
      <div className="bg-white overflow-hidden rounded-xl bg-gradient-to-b from-amber-200 to-amber-50">
        <div className="p-2 sm:p-8">
          <h3 className="mb-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
            <span className="block text-left text-lg px-6  tracking-wide font-medium">
              प्रारंग ए.आई. (A.I.)
            </span>

            <span className="block text-center text-2xl font-extrabold tracking-wider mt-1">
              विश्वकोश
            </span>
          </h3>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* INDIA */}
            <button
              onClick={() => setActiveModal('india')}
              className="
                group relative overflow-hidden
                rounded-2xl h-48
                bg-gradient-to-br from-blue-600 to-blue-700
                text-white
                shadow-lg hover:shadow-blue-500/30
                transition-all duration-300
                transform hover:-translate-y-1 hover:scale-[1.02]
                flex flex-col items-center justify-center
                border border-white/20
              "
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-all"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-xl group-hover:bg-black/20 transition-all"></div>

              <img
                src="https://cdn.pixabay.com/photo/2023/08/26/05/23/india-map-8214176_1280.png"
                alt="India Map"
                className="w-[70px] h-auto relative z-10 mb-3 filter drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="relative z-10 text-2xl font-bold tracking-wider text-shadow-sm">
                भारत
              </span>
              <span className="relative z-10 text-[10px] font-medium text-indigo-100 mt-1 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity bg-white/10 px-3 py-1 rounded-full">
                {/* Indian Encyclopedia */}
              </span>
            </button>

            {/* WORLD */}
            <button
              onClick={() => setActiveModal('world')}
              className="
                group relative overflow-hidden
                rounded-2xl h-48
                bg-gradient-to-br from-blue-500 to-sky-600
                text-white
                shadow-lg hover:shadow-blue-500/30
                transition-all duration-300
                transform hover:-translate-y-1 hover:scale-[1.02]
                flex flex-col items-center justify-center
                border border-white/20
              "
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-all"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-xl group-hover:bg-black/20 transition-all"></div>

              <img
                src="https://i.ibb.co/7Jc2hpBZ/Untitled-design-2-removebg-preview.png"
                alt="World Map"
                className="w-full h-[200px] relative z-10 mb-3 filter drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="relative z-10 text-2xl font-bold tracking-wider text-shadow-sm">
                अन्य देश
              </span>
              <span className="relative z-10 text-[10px] font-medium text-blue-100 mt-1 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity bg-white/10 px-3 py-1 rounded-full">
                {/* World Encyclopedia */}
              </span>
            </button>
          </div>
        </div>
      </div>


      {/* MODALS */}
      {activeModal === 'india' && (
        <EncyclopediaModal
          type="india"
          data={indiaData}
          isLoading={loading.india}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'world' && (
        <EncyclopediaModal
          type="world"
          data={worldData}
          isLoading={loading.world}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default WorldMap;
