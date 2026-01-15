"use client";

import Carousel from "@/components/home/carousel";
import Header from "@/components/home/Header";
import TagLists from "@/components/home/TagLists";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Nav from "@/components/home/Nav";
import AiPages from "@/components/home/AiPages";
import WeatherWidget from "@/components/home/WeatherWidget";
import Subscriber from "@/components/home/Subscriber";
import NewsFeed from "@/components/home/NewsFeed";
import SubscriptionModal from "@/components/SubscriptionModal";
import SocialMediaStrip from "@/components/SocialMediaStrip";
import AdSpace from "@/components/AdSpace";
import Modal from "@/components/ui/Modal";
import CirusData from "@/components/CirusData";
import InternateData from "@/components/InternateData";
import MeerutLinks from "@/components/home/MeerutLinks";

export default function Home() {
  // const [portal, setPortal] = useState(null);
  const [portal, setPortal] = useState(null);
  const [openMap, setOpenMap] = useState(false);

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

  const mapHtml = portal?.map_link ?? "<p>मानचित्र उपलब्ध नहीं है।</p>";
  return (
    <main className="min-h-screen w-full bg-cover bg-no-repeat bg-center home-bg" style={{ backgroundImage: `url(${portal?.image_base + portal?.header_image})` }}>
      <Header />
      <section className="w-full px-4 py-6">
        <div className="container mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="w-full lg:w-3/12 bg-white/10 rounded-md order-2 lg:order-1">
            <Nav />

            <div className="bg-white   p-3 mb-3">
              <div className="py-1 mb-2 text-xl font-bold border-b-1"><i className="fas fa-newspaper"></i> मेरठ के समाचार</div>
              <NewsFeed />
            </div>
            <div className="bg-white   p-3 ">
              <AiPages />
            </div>

            {/* Meerut Links */}
            <div className="w-full mt-3 bg-white p-1  shadow">
              <MeerutLinks data={portal} />
            </div>
            {/* <AdSpace
              title="विज्ञापन स्थान 2"
              size="medium"
              subtext="" /> */}
          </div>
          {/* Middle Section */}
          <div className="w-full lg:w-6/12 order-1 lg:order-2">


            <div className="">

              <div className="mb-2 w-full mt-2">
                <div className="relative w-full overflow-hidden">
                  {/* Image */}
                  <img
                    src={`${portal?.image_base}${portal?.header_image}`}
                    alt={portal?.slug || "header image"}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* Slug overlay at bottom */}
                  {/* <div className="absolute bottom-0 font-bold w-full bg-black/60 text-white text-center py-2 text-sm tracking-wide rounded-lg">
                    {portal?.city_slogan}
                  </div> */}
                </div>
              </div>

              <div className="bg-white  m-1 shadow p-4">
                <Carousel />
                <TagLists />
              </div>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-1 pt-3 rounded cursor-pointer">
                <a className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md py-3" href={`https://hindi.prarang.in/${portal?.slug}?data`} target="_blank">
                  <h3 className="text-xl font-bold text-center"> मेरठ के आंकड़े </h3>
                </a>
                <a className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md py-3" href={`https://hindi.prarang.in/ai/${portal?.slug}`} target="_blank">
                  <h3 className="text-xl font-bold text-center"> मेरठ ए.आई. रिपोर्ट </h3>
                </a>
              </div>
              <div className="w-full px-1 mt-3">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  <div className="w-full ">
                    <div className="py-3 bg-white p-3">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Market Planners Card */}
                        <div className="group relative bg-blue-500 p-8 shadow-xl hover:shadow-2xl transition-all duration-500  overflow-hidden">
                          {/* Background Animation */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-50"></div>
                          </div>

                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-center mb-6">
                              <div>
                                <h5 className="text-3xl text-center md:text-4xl font-extrabold text-white mb-2 ">
                                  बिज़नेस का यंत्र
                                </h5>
                                <p className="text-blue-50 text-sm md:text-base font-medium text-center">अपने बिज़नेस के लिए नए अवसर खोजें</p>
                              </div>
                            </div>

                            <div className="space-y-4 mb-6">
                              <a
                                href="https://hindi.prarang.in/india/market-planner/states?city=-667" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform ">
                                    भारत में नए अवसर खोजें
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <small>(शहरों का चयन करें)</small>
                              </a>

                              <a
                                href="https://hindi.prarang.in/world/market-planner?country=63" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    विश्व में नए अवसर खोजें
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <small>(देशों का चयन करें)</small>
                              </a>
                            </div>
                          </div>
                        </div>
                        {/* Development Planners Card */}
                        <div className="group relative bg-green-600 p-8 shadow-xl hover:shadow-2xl transition-all duration-500  overflow-hidden">
                          {/* Background Animation */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-50"></div>
                          </div>
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-center mb-6">
                              <div>
                                <h5 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight text-center">
                                  विकास का यंत्र
                                </h5>
                                <p className="text-green-50 text-sm md:text-base text-center font-medium">अपने शहर/देश की प्रगति की तुलना करें </p>
                              </div>
                            </div>

                            <div className="space-y-4 mb-6">
                              <a
                                href="https://hindi.prarang.in/india/development-planners?city=-667" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    भारत में विकास की तुलना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <small>(शहरों का चयन करें)</small>
                              </a>

                              <a
                                href="https://hindi.prarang.in/world/development-planner?country=63" target="_blank"
                                className="block p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group/link border border-white/30 hover:border-white/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-bold text-base md:text-lg group-hover/link:translate-x-1 transition-transform">
                                    विश्व में विकास की तुलना
                                  </span>
                                  <span className="text-white/70 group-hover/link:text-white text-xl transition-all">→</span>
                                </div>
                                <small>(देशों का चयन करें)</small>
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
            <SocialMediaStrip />
            <InternateData />
            <CirusData />
            <div className="p-3 flex items-center justify-items-center  bg-weth">
              <WeatherWidget className="w-full" code={portal?.weather_widget_code} />
            </div>
            <button
              className="theme-btn font-bold py-2 px-4 mt-2 w-full"
              onClick={() => setOpenMap(true)}
            >
              <i className="fas fa-map mr-2"></i> शहर का नक्शा
            </button>

            <div className=" p-1 m-1 mt-3  ">
              <a href={`https://prarang.in/yp/meerut`} target="_blank" className="relative block">
                <div className="absolute top-[20px] w-full text-center z-10">
                  <h2 className="text-[40px]  font-bold text-black">{portal?.city_name_local}  व्यवसाय</h2>
                  <h4 className="text-sm font-bold text-gray-700">हिंदी येलो पेज (Yellow Pages)</h4>
                </div>
                <img src="/images/yellow-pages-row.png" alt="Login" className=" w-full shadow-lg border  border-gray-200 hover:border-gray-400 hover:rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-gray-400" />
              </a>
            </div>
          </div>
        </div>

      </section>
      <section className="px-3 container mx-auto mb-2">
        {/* <AdSpace
          title="विज्ञापन स्थान 3"
          size="small"
          subtext="" /> */}
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
      <SubscriptionModal />
      {/* MODAL */}
      <Modal
        className="max-w-5xl min-h-[100vh]"
        open={openMap}
        onClose={() => setOpenMap(false)}
        ariaLabel="city-map"
        fullWidth={true}
        header={
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">शहर का नक्शा</h3>
          </div>
        }
      >
        <div className="w-full h-full">
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: mapHtml }}
          />
        </div>
      </Modal>
    </main >
  );
}
