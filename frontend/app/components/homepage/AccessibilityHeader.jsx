"use client";

import { useEffect, useState } from "react";

const AccessibilityHeader = () => {
  const [activeLanguage, setActiveLanguage] = useState("sv");
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  const [isEasyReadingMode, setIsEasyReadingMode] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(0);

  const fontSizes = ["default", "large", "extra large"];

  // Change active language
  useEffect(() => {
    console.log(`Current language is: ${activeLanguage === "en" ? "English" : "Swedish"}.`);
  }, [activeLanguage]);

  // Toggle contrast mode
  useEffect(() => {
    console.log(`High contrast mode ${isHighContrastMode ? "enabled" : "disabled"}.`);
  }, [isHighContrastMode]);

  // Toggle easy reading mode
  useEffect(() => {
    console.log(`Easy reading mode ${isEasyReadingMode ? "enabled" : "disabled"}.`);
  }, [isEasyReadingMode]);

  // Change font size
  useEffect(() => {
    document.documentElement.style.fontSize =
      currentFontSize === 0 ? "100%" : currentFontSize === 1 ? "110%" : "120%";
    console.log(`Font size set to ${fontSizes[currentFontSize]}.`);
  }, [currentFontSize]);

  function changeFontSize(operator) {
    // Early return to prevent too small or too big font size (Available sizes: 0, 1, 2)
    if (currentFontSize === 0 && operator === "decrease") return;
    if (currentFontSize === 2 && operator === "increase") return;

    // Increase or decrease the font size based on operator argument
    if (operator === "increase") setCurrentFontSize(currentFontSize + 1);
    if (operator === "decrease") setCurrentFontSize(currentFontSize - 1);
  }

  return (
    <div className="navbar bg-background h-10 min-h-10 justify-end border-b border-slate-200 px-4">
      <div className="flex items-center gap-6">
        {/* Font controls  */}
        <button
          onClick={() => changeFontSize("increase")}
          aria-label="Increase font size"
          className="btn btn-link link-hover h-6 px-0 text-base font-normal"
        >
          A+
        </button>
        <button
          onClick={() => changeFontSize("decrease")}
          aria-label="Decrease font size"
          className="btn btn-link link-hover h-6 px-0 text-base font-normal"
        >
          A-
        </button>

        {/* High contrast mode toggle */}
        <button
          onClick={() => setIsHighContrastMode(!isHighContrastMode)}
          className="btn btn-link link-hover h-6 px-0 text-base font-normal"
        >
          Hög kontrast
        </button>

        {/* Easy reading mode toggle  */}
        <button
          onClick={() => setIsEasyReadingMode(!isEasyReadingMode)}
          className="btn btn-link link-hover h-6 px-0 text-base font-normal"
        >
          Läsvänlig text
        </button>

        {/* Language selector  */}
        <div className="flex items-center gap-2">
          <label htmlFor="language-select">Språk:</label>
          <select
            onChange={(e) => {
              setActiveLanguage(e.target.value);
            }}
            id="language-select"
            className="select h-8"
            value={activeLanguage}
          >
            <option value={"sv"}>Svenska</option>
            <option value={"en"}>English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityHeader;
