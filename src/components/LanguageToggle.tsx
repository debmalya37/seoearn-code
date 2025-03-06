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
    // Parse the cookie to see if we already have a language set (like "/en/es")
    const cookieValue = getGoogTransCookie(); // e.g. "/en/es"
    if (cookieValue && cookieValue.startsWith("/en/")) {
      setSelectedLang(cookieValue.replace("/en/", "")); // e.g. "es"
    }

    // Dynamically load Google Translate script if not present
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          // Add all your supported languages here, including "hi" and "en"
          includedLanguages: "en,hi,ru,de,es,fr,pt,nl,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // If the user selects the current language, do nothing
    if (langCode === selectedLang) return;

    // Otherwise, set the cookie (from "en" to the selected language), then reload
    setGoogTransCookie(`/en/${langCode}`);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <>
      {/* Hidden element required by Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Dropdown List for Languages */}
      <div className="relative inline-block">
        <label htmlFor="language-select" className="mr-2 font-semibold">
          Select Language:
        </label>
        <select
          id="language-select"
          className="appearance-none border border-gray-300 bg-white px-3 py-2 rounded shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          value={selectedLang}
          onChange={(e) => {
            handleLanguageChange(e.target.value);
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hide Google Translate top banner and icons */}
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
