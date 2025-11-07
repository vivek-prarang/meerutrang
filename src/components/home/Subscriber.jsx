"use client";

import { useState } from "react";
import SubscriptionModal from "../SubscriptionModal";

export default function Subscriber({ size = "", className = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-center w-full">
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 1); }
          33% { transform: scale(1.02); color: #fbbf24; text-shadow: 0 0 15px rgba(251, 191, 36, 1); }
          66% { transform: scale(1); color: #3b82f6; text-shadow: 0 0 15px rgba(59, 130, 246, 1); }
          100% { transform: scale(1); color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 1); }
        }

        .heartbeat-effect {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        /* Paragraph */
        .cursor-pointer .absolute p {
          padding-left: 154px;
          padding-top: 0px;
        }

        .cursor-pointer .items-center p {
          line-height: 1.1em;
        }

        ${size === "square" ? `.cursor-pointer .items-center p {
          padding-left: 59px !important;
        }` : ""}
      `}</style>

      <div
        className={`w-full relative rounded inline-block cursor-pointer hover:opacity-95 transition-all duration-300 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        {size === "square" ? (
          <img
            src="https://www.prarang.in/images/sub-6-bg.png"
            alt="Get Daily Posts on WhatsApp every day"
            className="h-full w-full rounded object-cover"
          />
        ) : (
          <img
            src="https://www.prarang.in/images/sub-main-bg.png"
            alt="Get Daily Posts on WhatsApp every day"
            className="h-full w-full rounded object-cover"
          />
        )}

        <div className="absolute inset-0 flex items-center pitsquirp">
          <p className=" squirp text-lg md:text-xl font-bold text-center bg-opacity-50 heartbeat-effect" style={{ fontSize: 30 }}>
            प्रारंग के मेरठ दैनिक पोस्ट (Post) को प्रतिदिन WhatsApp पर पाए
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
