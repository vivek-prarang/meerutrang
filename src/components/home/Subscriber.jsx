"use client";

import { useState } from "react";
import SubscriptionModal from "../SubscriptionModal";


export default function Subscriber() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className=" flex justify-center">
      <div className="w-[80%]  relative rounded inline-block cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsModalOpen(true)}>
        <img
          src="https://www.prarang.in/images/sub-6-bg.png"
          alt="Get Daily Posts on WhatsApp every day"
          className=""
        />
        <div className="absolute inset-0"  >
          <p className="text-black text-lg md:text-xl font-bold text-cente bg-opacity-50 px-4 py-2 rounded" style={{ fontSize: 30 }}>
            दैनिक पोस्ट (Post) को प्रतिदिन WhatsApp पर पाए
          </p>
        </div>
      </div>
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
