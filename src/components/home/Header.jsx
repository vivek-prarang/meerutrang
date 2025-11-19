"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import VisitorCounter from "../VisitorCounter";

export default function Header({ data }) {
  const [openMap, setOpenMap] = useState(false);

  const mapHtml = data?.map_link ?? "<p>मानचित्र उपलब्ध नहीं है।</p>";

  return (
    <header className="flex justify-between items-center p-4">
      <div id="left" className="flex justify-center items-center gap-4">
        {/* logo */}
        <img src="https://i.ibb.co/ZzN35wW5/prarang-light-logo.png" alt="Login" className="w-24 md:w-32" />
        <div className="">
          <VisitorCounter />
        </div>
      </div>
      <div id="right" className="flex justify-around items-center gap-4">
        <div className="p-3 bg-black-500/10 border rounded text-white">
          <div>
            <h3 className="font-bold text-lg">सब्सक्राइबर: {data?.subscribers}  </h3>
            <h3 className="font-bold text-lg">मासिक इम्प्रेशन: 3 </h3>
          </div>
        </div>
        <button
          className="theme-btn font-bold py-2 px-4 rounded"
          onClick={() => setOpenMap(true)}
        >
          <i className="fas fa-map mr-2"></i>शहर का नक्शा
        </button>
      </div>

      {/* Full-width modal that shows the raw HTML from data.map_link. We render using dangerouslySetInnerHTML because the content is expected to be embed HTML (iframe/script). Only do this for trusted content. */}
      <Modal className="max-w-5xl min-h-[100vh]"
        open={openMap}
        onClose={() => setOpenMap(false)}
        ariaLabel="city-map"
        fullWidth={true}
        header={<div className="flex items-center justify-between"><h3 className="text-lg font-semibold">शहर का नक्शा</h3></div>}
      >
        <div className="w-full h-full ">
          <div className="mb-4 w-100 h-100"
            dangerouslySetInnerHTML={{ __html: mapHtml }}
            className="w-full h-full"
          />
        </div>

      </Modal>
    </header>
  );
}

