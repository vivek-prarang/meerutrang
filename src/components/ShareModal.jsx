"use client";

import { useState } from "react";

export default function ShareModal({ url, title, description }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use current URL if url prop is invalid
  const shareUrl = (url && url !== "d") ? url : typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title}\n${description}\n${shareUrl}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${title}\n${shareUrl}`
    )}`,
    instagram: "https://www.instagram.com/", // Instagram doesn't support direct share via link
  };

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("लिंक कॉपी करने में त्रुटि हुई।");
    }
  };

  return (
    <>
      {/* 🔘 Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md w-full justify-center"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12v.01M12 4v.01M12 20v.01M20 12v.01M6.343 17.657l.707-.707M17.657 6.343l.707-.707M17.657 17.657l.707.707M6.343 6.343l.707.707"
          />
        </svg>
        शेयर करें
      </button>

      {/* 🪟 Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              🔗 इस पोस्ट को शेयर करें
            </h3>

            {/* Social Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                title="WhatsApp पर शेयर करें"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                title="Facebook पर शेयर करें"
              >
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                title="X पर शेयर करें"
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
              <a
                href={shareLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                title="Instagram पर शेयर करें"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>

            {/* Copy Link */}
            <div className="flex justify-center">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-blue-600 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 17l4 4 4-4m0-5l-4-4-4 4"
                  />
                </svg>
                {copied ? "✅ कॉपी हुआ!" : "लिंक कॉपी करें"}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
