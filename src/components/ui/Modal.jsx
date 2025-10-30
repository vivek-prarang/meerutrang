"use client";

import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, children, ariaLabel = "modal", header = null, footer = null }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    // set focus to content for better UX
    setTimeout(() => contentRef.current?.focus?.(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Content container: centered box with a header, scrollable body, and optional footer */}
      <div className="relative max-w-4xl w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden z-10 max-h-[95vh] flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 z-20 text-2xl leading-none px-3"
        >
          ×
        </button>

        {/* Header (optional) - sticky at top of modal */}
        {header ? (
          <div className="sticky top-0 bg-white z-20 border-b">
            <div className="px-6 py-4">
              {header}
            </div>
          </div>
        ) : null}

        {/* Body - fills available space and scrolls vertically */}
        <div
          ref={contentRef}
          tabIndex={-1}
          className="p-6 overflow-y-auto flex-1 prose prose-sm sm:prose md:prose-lg"
        >
          {children}
        </div>

        {/* Footer (nullable) - not rendered if null; can be sticky or flow depending on content */}
        {footer ? (
          <div className="border-t bg-white z-20">
            <div className="px-6 py-3">
              {footer}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
