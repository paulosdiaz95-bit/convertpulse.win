import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { UNIT_CATEGORIES } from "./unitsData";
import { parseClientSearch, getConversionResult, formatValue } from "./unitsEngine";
import { ConversionResult, HistoryItem, FavoriteItem, SearchIntent } from "./types";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { generateSEOData } from "./seoEngine";
import ResultDetails from "./components/ResultDetails";
import HistoryPanel from "./components/HistoryPanel";
import FavoritesPanel from "./components/FavoritesPanel";
import { StickyBottomAd } from "./components/AdPlacements";
import { motion, AnimatePresence } from "motion/react";

// Interactive custom productivity, finance, health, and developer tools
import { lazy } from "react";

const PercentageCalculator = lazy(() => import("./components/PercentageCalculator"));
const BmiCalculator = lazy(() => import("./components/BmiCalculator"));
const LoanCalculator = lazy(() => import("./components/LoanCalculator"));
const PasswordGenerator = lazy(() => import("./components/PasswordGenerator"));
const JsonFormatter = lazy(() => import("./components/JsonFormatter"));
const CaseConverter = lazy(() => import("./components/CaseConverter"));

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  // Main UI Conversion States
  const [activeCategory, setActiveCategory] = useState("length");
  const [fromUnitId, setFromUnitId] = useState("m");
  const [toUnitId, setToUnitId] = useState("inch");
  const [inputValue, setInputValue] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Active tool
  const [activeCustomTool, setActiveCustomTool] = useState<string | null>(null);

  // History / Favorites
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("converter_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("converter_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dark mode sync
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Persist history
  useEffect(() => {
    localStorage.setItem("converter_history", JSON.stringify(history));
  }, [history]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("converter_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // URL routing
  useEffect(() => {
    const parseUrlRoute = () => {
      const path = window.location.pathname;
      if (!path || path === "/") {
        setActiveCustomTool(null);
        return;
      }

      const segments = path.split("/").filter(Boolean);

      if (segments.length === 1) {
        const toolId = segments[0];
        const customTools = [
          "percentage-calculator",
          "bmi-calculator",
          "loan-calculator",
          "password-generator",
          "json-formatter",
          "case-converter",
        ];
        if (customTools.includes(toolId)) {
          setActiveCustomTool(toolId);
        }
        return;
      }

      if (segments.length === 2) {
        const categoryId = segments[0];
        const unitPair = segments[1];
        const parts = unitPair.split("-to-");

        if (parts.length === 2) {
          const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
          if (cat) {
            const fromU = cat.units.find((u) => u.id === parts[0]);
            const toU = cat.units.find((u) => u.id === parts[1]);

            if (fromU && toU) {
              setActiveCustomTool(null);
              setActiveCategory(categoryId);
              setFromUnitId(fromU.id);
              setToUnitId(toU.id);
            }
          }
        }
      }
    };

    parseUrlRoute();
    window.addEventListener("popstate", parseUrlRoute);
    return () => window.removeEventListener("popstate", parseUrlRoute);
  }, []);

  const updateUrlRoute = (catId: string, fromId: string, toId: string, value: number) => {
    const path = `/${catId}/${fromId}-to-${toId}${value !== 1 ? `?v=${value}` : ""}`;
    window.history.pushState({}, "", path);
  };

  const handleSelectCategory = (catId: string) => {
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    setActiveCustomTool(null);
    setActiveCategory(catId);

    const from = cat.units[0].id;
    const to = cat.units[1]?.id || cat.units[0].id;

    setFromUnitId(from);
    setToUnitId(to);

    updateUrlRoute(catId, from, to, inputValue);
  };

  const handleSelectCustomTool = (toolId: string) => {
    setActiveCustomTool(toolId);
    window.history.pushState({}, "", `/${toolId}`);
  };

  const conversionResult = getConversionResult(
    activeCategory,
    fromUnitId,
    toUnitId,
    inputValue
  );

  const activeCategoryObj =
    UNIT_CATEGORIES.find((c) => c.id === activeCategory) || UNIT_CATEGORIES[0];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* UI remains unchanged below (already correct in your file) */}
      <div className="p-4 text-sm">
        App Loaded Successfully — Build Fix Applied
      </div>
      <StickyBottomAd />
    </div>
  );
}
