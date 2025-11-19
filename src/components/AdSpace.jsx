"use client";

import React from "react";

export default function AdSpace({
  title = "विज्ञापन स्थान",
  size = "medium",
  subtext = "आपके विज्ञापन यहाँ प्रदर्शित होंगे",
  bgColor = "from-blue-50 to-indigo-50",
  borderColor = "border-blue-200",
  accentColor = "from-blue-400 to-indigo-500",
}) {
  // Define size configurations
  const sizeConfig = {
    small: {
      height: "h-32",
      padding: "p-4",
      titleSize: "text-lg",
      subtextSize: "text-xs",
      iconSize: "w-8 h-8",
    },
    medium: {
      height: "h-64",
      padding: "p-6",
      titleSize: "text-2xl",
      subtextSize: "text-sm",
      iconSize: "w-12 h-12",
    },
    large: {
      height: "h-96",
      padding: "p-8",
      titleSize: "text-3xl",
      subtextSize: "text-base",
      iconSize: "w-16 h-16",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div
      className={`${config.height} w-full rounded-2xl border-2 ${borderColor} bg-linear-to-br ${bgColor}
                   ${config.padding} flex flex-col items-center justify-center relative overflow-hidden
                   hover:shadow-lg transition-all duration-300 cursor-pointer group`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-indigo-400 rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-3">
        {/* Icon */}
        <div className={`${config.iconSize} mx-auto relative group/icon`}>
          <div className={`absolute inset-0 bg-linear-to-r ${accentColor} rounded-full opacity-20 blur-lg group-hover/icon:opacity-30 transition-opacity`}></div>
          <div className={`relative w-full h-full rounded-full bg-linear-to-r ${accentColor} flex items-center justify-center shadow-lg`}>
            <svg
              className="w-1/2 h-1/2 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2v-13a2 2 0 00-2-2H7a2 2 0 00-2 2v13a2 2 0 002 2h10a2 2 0 002-2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`${config.titleSize} font-bold text-gray-800 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:${accentColor} group-hover:bg-clip-text transition-all`}
        >
          {title}
        </h3>

        {/* Subtext */}
        <p className={`${config.subtextSize} text-gray-600 font-medium max-w-xs group-hover:text-gray-700 transition-colors`}>
          {subtext}
        </p>

        {/* CTA Button */}

      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-colors"></div>
    </div>
  );
}
