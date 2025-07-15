"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

// Remove all variants of the googtrans cookie (with different domains/paths)
function removeAllGoogTransCookies() {
  // The main cookie removal
  document.cookie = "googtrans=; path=/; max-age=0;";

  // Attempt to remove with domain variations if any
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  // e.g. ["www", "example", "com"]
  // Try progressively shorter domains: "example.com", "com"
  for (let i = 0; i < domainParts.length; i++) {
    const domain = domainParts.slice(i).join(".");
    document.cookie = `googtrans=; domain=${domain}; path=/; max-age=0;`;
    document.cookie = `googtrans=; domain=.${domain}; path=/; max-age=0;`;
  }
}

// Set a single googtrans cookie with path="/"
function setGoogTransCookie(value: string) {
  removeAllGoogTransCookies();
  document.cookie = `googtrans=${value}; path=/;`;
}

// Helper to read the current googtrans cookie
function getGoogTransCookie(): string {
  const match = document.cookie.match(/(^| )googtrans=([^;]+)/);
  return match ? match[2] : "";
}

// Define the languages you want to support (now includes English & Hindi)
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ru", label: "Russian" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "ar", label: "Arabic" },
];

const LanguageSelect: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    // existing cookie-reading & script-loading logic
    const cookieValue = getGoogTransCookie();
    if (cookieValue && cookieValue.startsWith("/en/")) {
      setSelectedLang(cookieValue.replace("/en/", ""));
    }
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map(l => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === selectedLang) return;
    setGoogTransCookie(`/en/${langCode}`);
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Desktop: inline buttons */}
      <div className="hidden md:flex items-center space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded text-sm transition ${
              selectedLang === lang.code
                ? "bg-white text-[#081530] font-semibold"
                : "bg-transparent border border-white text-white hover:bg-white hover:text-[#081530]"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Mobile: native dropdown */}
      <div className="flex md:hidden pr-4">
        <select
        title="Select Language"
          value={selectedLang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-3 py-1 rounded text-sm bg-transparent border border-white text-white"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-black">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <style jsx global>{`
        .notranslate {
          translate: no !important;
        }
        .goog-te-banner-frame.skiptranslate,
        .goog-te-menu-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-text-highlight {
          display: none !important;
          box-shadow: none !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default LanguageSelect;
