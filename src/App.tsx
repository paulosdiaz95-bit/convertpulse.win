import React, { useState, useEffect, useRef, lazy } from "react";
import * as Icons from "lucide-react";
import { UNIT_CATEGORIES } from "./unitsData";
import { getConversionResult } from "./unitsEngine";
import { HistoryItem, FavoriteItem } from "./types";
import { StickyBottomAd } from "./components/AdPlacements";

// Lazy tools
const PercentageCalculator = lazy(() => import("./components/PercentageCalculator"));
const BmiCalculator = lazy(() => import("./components/BmiCalculator"));
const LoanCalculator = lazy(() => import("./components/LoanCalculator"));
const PasswordGenerator = lazy(() => import("./components/PasswordGenerator"));
const JsonFormatter = lazy(() => import("./components/JsonFormatter"));
const CaseConverter = lazy(() => import("./components/CaseConverter"));

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [activeCategory, setActiveCategory] = useState("length");
  const [fromUnitId, setFromUnitId] = useState("m");
  const [toUnitId, setToUnitId] = useState("inch");
  const [inputValue, setInputValue] = useState(1);

  const [activeCustomTool, setActiveCustomTool] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  // URL routing (SAFE VERSION)
  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 1) {
      const tools = [
        "percentage-calculator",
        "bmi-calculator",
        "loan-calculator",
        "password-generator",
        "json-formatter",
        "case-converter",
      ];

      if (tools.includes(segments[0])) {
        setActiveCustomTool(segments[0]);
      }
      return;
    }

    if (segments.length === 2) {
      const cat = UNIT_CATEGORIES.find((c) => c.id === segments[0]);
      if (!cat) return;

      const [from, to] = segments[1].split("-to-");
      const fromU = cat.units.find((u) => u.id === from);
      const toU = cat.units.find((u) => u.id === to);

      if (fromU && toU) {
        setActiveCustomTool(null);
        setActiveCategory(cat.id);
        setFromUnitId(fromU.id);
        setToUnitId(toU.id);
      }
    }
  }, []);

  const updateUrl = (cat: string, from: string, to: string, value: number) => {
    const path = `/${cat}/${from}-to-${to}${value !== 1 ? `?v=${value}` : ""}`;
    window.history.pushState({}, "", path);
  };

  const handleCategory = (id: string) => {
    const cat = UNIT_CATEGORIES.find((c) => c.id === id);
    if (!cat) return;

    setActiveCustomTool(null);
    setActiveCategory(id);

    const from = cat.units[0].id;
    const to = cat.units[1]?.id || cat.units[0].id;

    setFromUnitId(from);
    setToUnitId(to);

    updateUrl(id, from, to, inputValue);
  };

  const handleTool = (id: string) => {
    setActiveCustomTool(id);
    window.history.pushState({}, "", `/${id}`);
  };

  const handleSwap = () => {
    const f = fromUnitId;
    const t = toUnitId;

    setFromUnitId(t);
    setToUnitId(f);

    updateUrl(activeCategory, t, f, inputValue);
  };

  const result = getConversionResult(
    activeCategory,
    fromUnitId,
    toUnitId,
    inputValue
  );

  const category =
    UNIT_CATEGORIES.find((c) => c.id === activeCategory) || UNIT_CATEGORIES[0];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-white text-black`}>
      
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between">
        <h1 className="font-bold">Universal Tools Platform</h1>

        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle Theme
        </button>
      </div>

      {/* SIMPLE UI (SAFE TEST VERSION) */}
      <div className="p-6 space-y-4">

        <h2 className="font-bold text-lg">
          {activeCustomTool
            ? activeCustomTool
            : `${category.name} Converter`}
        </h2>

        {!activeCustomTool && (
          <>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="border p-2"
              />

              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
              >
                {category.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <button onClick={handleSwap}>Swap</button>

              <select
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
              >
                {category.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 border rounded">
              Result: {result?.value}
            </div>
          </>
        )}

        {activeCustomTool === "percentage-calculator" && (
          <PercentageCalculator />
        )}
        {activeCustomTool === "bmi-calculator" && <BmiCalculator />}
        {activeCustomTool === "loan-calculator" && <LoanCalculator />}
        {activeCustomTool === "password-generator" && (
          <PasswordGenerator />
        )}
        {activeCustomTool === "json-formatter" && <JsonFormatter />}
        {activeCustomTool === "case-converter" && <CaseConverter />}
      </div>

      {/* ADS */}
      <StickyBottomAd />
    </div>
  );
}
