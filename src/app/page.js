"use client";

import Carousel from "@/components/home/carousel";
import Header from "@/components/home/Header";
import TagLists from "@/components/home/TagLists";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Nav from "@/components/home/Nav";
import WeatherWidget from "@/components/home/WeatherWidget";
import Subscriber from "@/components/home/Subscriber";

export default function Home() {
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
    
        <Header />
       
    <section className="w-full px-4 py-6">
  <div className="container mx-auto flex flex-col lg:flex-row gap-6">
    {/* Left Side */}
    <div className="w-full lg:w-3/12 bg-white/10 rounded-md order-2 lg:order-1">
    <Nav />
      <div className="bg-white  rounded p-3">
        <div className="py-1 mb-2 text-xl font-bold border-b-1  "><i className="fas fa-location"></i> स्थानीय जानकारी</div>
        <div className="" dangerouslySetInnerHTML={{__html: portal?.local_matrics}} />
      </div>
    </div>

    {/* Middle Section */}
    <div className="w-full lg:w-6/12 order-1 lg:order-2">
      <div className="">
        <div className="mb-2 p-3 py-5 flex justify-center items-center w-full" style={{backgroundColor: "rgba(0,0,0,0.63)"}}>
          <h2 className="text-3xl font-bold text-center text-white">{portal?.city_slogan}</h2>
        </div>
        <div className="bg-white  m-1 shadow p-4">
          <Carousel />
        <TagLists />
        </div>
        <div className="bg-white p-1 m-1 mt-3 ">
            <a href={`https://hindi.prarang.in/${portal?.slug}`} target="_blank">
              <img src="https://www.prarang.in/assets/portal/images/matrix-24.jpg" alt="Login" className="w-full" />
            </a>
          
           </div>
      </div>
    </div>

    {/* Right Side */}
    <div className="w-full lg:w-3/12 order-3 lg:order-3">
    <Subscriber />
      <div className="p-3 flex items-center justify-items-center  bg-weth">
        <WeatherWidget className="w-full"  code={portal?.weather_widget_code} />
      </div>
      
       <div className=" p-1 m-1 mt-3 ">
            <a href={`https://hindi.prarang.in/${portal?.slug}`} target="_blank">
              <img src="https://www.prarang.in/assets/images/yellowpages.jpg" alt="Login" className="w-full" />
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
    </main>


  );
}
