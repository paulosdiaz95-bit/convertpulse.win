import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { UNIT_CATEGORIES } from "./unitsData";
import { parseClientSearch, getConversionResult, formatValue } from "./unitsEngine";
import { ConversionResult, HistoryItem, FavoriteItem, SearchIntent } from "./types";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { useSEO } from "./useSEO"; // Import the new hook
import ResultDetails from "./components/ResultDetails";
import HistoryPanel from "./components/HistoryPanel";
import FavoritesPanel from "./components/FavoritesPanel";
import { StickyBottomAd } from "./components/AdPlacements";
import { motion, AnimatePresence } from "motion/react";

// Interactive custom productivity, finance, health, and developer tools
import PercentageCalculator from "./components/PercentageCalculator";
import BmiCalculator from "./components/BmiCalculator";
import LoanCalculator from "./components/LoanCalculator";
import PasswordGenerator from "./components/PasswordGenerator";
import JsonFormatter from "./components/JsonFormatter";
import CaseConverter from "./components/CaseConverter";
import { useUserPreferences } from "./useUserPreferences";

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
  const [searchError, setSearchError] = useState("");
  
  // Universal Tools Platform Active custom tool
  const [activeCustomTool, setActiveCustomTool] = useState<string | null>(null);

  // History and Favorites managed by custom hook
  const { history, favorites, addHistoryItem, toggleFavorite, clearHistory } = useUserPreferences();

  // References for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Apply dark mode CSS class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // SEO URL routing listener
  useEffect(() => {
    const parseUrlRoute = () => {
      const path = window.location.pathname;
      if (path && path !== "/") {
        const segments = path.split("/").filter(Boolean);
        
        if (segments.length === 1) {
          const toolId = segments[0];
          const isCustomTool = [
            "percentage-calculator", "bmi-calculator", "loan-calculator", 
            "password-generator", "json-formatter", "case-converter"
          ].includes(toolId);
          
          if (isCustomTool) {
            setActiveCustomTool(toolId);
            return;
          }
        }
        
        if (segments.length === 2) {
          const categoryId = segments[0];
          const unitPair = segments[1];
          const parts = unitPair.split("-to-");
          
          if (parts.length === 2) {
            const cat = UNIT_CATEGORIES.find(c => c.id === categoryId);
            if (cat) {
              const fromU = cat.units.find(u => u.id === parts[0]);
              const toU = cat.units.find(u => u.id === parts[1]);
              if (fromU && toU) {
                setActiveCustomTool(null);
                setActiveCategory(categoryId);
                setFromUnitId(fromU.id);
                setToUnitId(toU.id);
                
                const params = new URLSearchParams(window.location.search);
                const queryVal = params.get("v");
                if (queryVal) {
                  const valNum = parseFloat(queryVal);
                  if (!isNaN(valNum)) setInputValue(valNum);
                }
              }
            }
          }
        }
      } else {
        setActiveCustomTool(null);
      }
    };

    parseUrlRoute();
    window.addEventListener("popstate", parseUrlRoute);
    return () => window.removeEventListener("popstate", parseUrlRoute);
  }, []);

  // Helper to trigger URL updates
  const updateUrlRoute = (catId: string, fromId: string, toId: string, value: number) => {
    const newPath = `/${catId}/${fromId}-to-${toId}${value !== 1 ? `?v=${value}` : ""}`;
    window.history.pushState({ path: newPath }, "", newPath);
  };

  // ==========================================
  // CLEAN SEO IMPLEMENTATION (ONE-LINER)
  // ==========================================
  const seoData = useSEO(activeCategory, fromUnitId, toUnitId, activeCustomTool, inputValue);
  const activeBreadcrumbs = seoData ? seoData.breadcrumbs : [{ label: "Home", url: "/" }];
  // ==========================================

  // Keyboard shortcut for Command+K or Search key focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "/") {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers
  const handleSelectCategory = (catId: string) => {
    const cat = UNIT_CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setActiveCustomTool(null);
      setActiveCategory(catId);
      const defaultFrom = cat.units[0].id;
      const defaultTo = cat.units[1]?.id || cat.units[0].id;
      setFromUnitId(defaultFrom);
      setToUnitId(defaultTo);
      updateUrlRoute(catId, defaultFrom, defaultTo, inputValue);
    }
  };

  const handleSelectCustomTool = (toolId: string) => {
    setActiveCustomTool(toolId);
    window.history.pushState({ path: `/${toolId}` }, "", `/${toolId}`);
  };

  const handleSelectFromUnit = (unitId: string) => {
    setFromUnitId(unitId);
    updateUrlRoute(activeCategory, unitId, toUnitId, inputValue);
    addHistoryItem(activeCategory, unitId, toUnitId, inputValue);
  };

  const handleSelectToUnit = (unitId: string) => {
    setToUnitId(unitId);
    updateUrlRoute(activeCategory, fromUnitId, unitId, inputValue);
    addHistoryItem(activeCategory, fromUnitId, unitId, inputValue);
  };

  const handleValueChange = (val: number) => {
    setInputValue(val);
    updateUrlRoute(activeCategory, fromUnitId, toUnitId, val);
  };

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
    updateUrlRoute(activeCategory, toUnitId, temp, inputValue);
    addHistoryItem(activeCategory, toUnitId, temp, inputValue);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(activeCategory, fromUnitId, toUnitId);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    setIsAiLoading(true);
    setSearchError("");
    const lowerQuery = trimmedQuery.toLowerCase();

    const toolMatch =
      lowerQuery.includes("bmi") ? "bmi-calculator" :
      lowerQuery.includes("percent") ? "percentage-calculator" :
      (lowerQuery.includes("loan") || lowerQuery.includes("finance")) ? "loan-calculator" :
      (lowerQuery.includes("password") || lowerQuery.includes("key")) ? "password-generator" :
      (lowerQuery.includes("json") || lowerQuery.includes("format")) ? "json-formatter" :
      (lowerQuery.includes("case") || lowerQuery.includes("text")) ? "case-converter" :
      null;

    if (toolMatch) {
      handleSelectCustomTool(toolMatch);
      setIsAiLoading(false);
      return;
    }

    const clientIntent = parseClientSearch(trimmedQuery);
    if (clientIntent.categoryId && clientIntent.fromUnitId && clientIntent.toUnitId) {
      setActiveCustomTool(null);
      setActiveCategory(clientIntent.categoryId);
      setFromUnitId(clientIntent.fromUnitId);
      setToUnitId(clientIntent.toUnitId);

      const resolvedValue = clientIntent.value !== undefined ? clientIntent.value : inputValue;
      if (clientIntent.value !== undefined) {
        setInputValue(clientIntent.value);
      }
      updateUrlRoute(clientIntent.categoryId, clientIntent.fromUnitId, clientIntent.toUnitId, resolvedValue);
      addHistoryItem(clientIntent.categoryId, clientIntent.fromUnitId, clientIntent.toUnitId, resolvedValue);
    } else {
      setSearchError(`Couldn't find a match for "${trimmedQuery}". Try something like "10kg to lbs" or "5 feet to cm".`);
    }
    setIsAiLoading(false);
  };

  const activeCategoryObj = UNIT_CATEGORIES.find(c => c.id === activeCategory) || UNIT_CATEGORIES[0];
  const conversionResult = getConversionResult(activeCategory, fromUnitId, toUnitId, inputValue);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/55 dark:border-slate-800/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => {
            window.history.pushState({}, "", "/");
            setSearchQuery("");
            setInputValue(1);
          }}>
            <div className="p-1.5 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Icons.RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <strong className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 block">ConvertPulse</strong>
              <span className="text-[10px] font-medium text-slate-400 font-mono">Fast, Accurate, Simple Tools</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-mono border border-slate-200/50 dark:border-slate-700/50">
              <Icons.Keyboard className="w-3 h-3" />
              <span>Press / to Search</span>
            </span>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Icons.Sun className="w-4.5 h-4.5" /> : <Icons.Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Canvas */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Category Drawer + Simple Quick links */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 shadow-xs">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">
              Conversion Categories
            </h3>
            <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
              {UNIT_CATEGORIES.map(cat => {
                const IconComp = (Icons as any)[cat.icon] || Icons.HelpCircle;
                const isSelected = cat.id === activeCategory && !activeCustomTool;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 shadow-xs">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">
              Calculators & Security
            </h3>
            <div className="space-y-1">
              {[
                { id: "percentage-calculator", name: "Percentage Calc", icon: Icons.Percent },
                { id: "bmi-calculator", name: "BMI Weight Index", icon: Icons.Activity },
                { id: "loan-calculator", name: "Loan & Finance", icon: Icons.Coins },
                { id: "password-generator", name: "Password Generator", icon: Icons.Key },
                { id: "json-formatter", name: "JSON Format Code", icon: Icons.FileCode },
                { id: "case-converter", name: "Case Converter", icon: Icons.CaseSensitive },
              ].map(tool => {
                const isSelected = tool.id === activeCustomTool;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectCustomTool(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400"
                    }`}
                  >
                    <tool.icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 shadow-xs">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 px-1">
              Popular Landing Pages
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { title: "cm to inches", cat: "length", from: "cm", to: "inch" },
                { title: "feet to cm", cat: "length", from: "foot", to: "cm" },
                { title: "kg to lb", cat: "weight", from: "kg", to: "pound" },
                { title: "psi to bar", cat: "pressure", from: "psi", to: "bar" },
                { title: "cups to ml", cat: "volume", from: "cup", to: "ml" },
                { title: "mph to kmh", cat: "speed", from: "mph", to: "km_h" },
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCustomTool(null);
                    setActiveCategory(link.cat);
                    setFromUnitId(link.from);
                    setToUnitId(link.to);
                    updateUrlRoute(link.cat, link.from, link.to, inputValue);
                  }}
                  className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:underline transition-colors block"
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Search + Converter core + Results */}
        <section className="lg:col-span-6 space-y-6">
          
          <nav aria-label="Breadcrumb" id="breadcrumb-navigation" className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 px-4 py-2.5 rounded-xl shadow-xs">
            {activeBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <Icons.ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />}
                {idx === activeBreadcrumbs.length - 1 ? (
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[300px]">
                    {crumb.label}
                  </span>
                ) : (
                  <a
                    href={crumb.url}
                    onClick={(e) => {
                      e.preventDefault();
                      if (crumb.url === "/") {
                        setActiveCustomTool(null);
                        setActiveCategory("length");
                        window.history.pushState({}, "", "/");
                      } else if (crumb.url.includes("?type=")) {
                        const type = crumb.url.split("?type=")[1];
                        const firstTool = getAllTools().find(t => t.category === type);
                        if (firstTool) {
                          setActiveCustomTool(firstTool.id);
                          window.history.pushState({}, "", `/${firstTool.slug}`);
                        }
                      } else if (crumb.url.includes("?cat=")) {
                        const cat = crumb.url.split("?cat=")[1];
                        setActiveCustomTool(null);
                        setActiveCategory(cat);
                        window.history.pushState({}, "", "/");
                      } else {
                        const cleanedSlug = crumb.url.replace(/^\//, "");
                        const tool = getToolBySlug(cleanedSlug);
                        if (tool) {
                          if (tool.category === "unit-converters") {
                            setActiveCustomTool(null);
                            const pathParts = tool.id.split("-to-");
                            if (pathParts.length === 2) {
                              const category = tool.slug.split("/")[0];
                              setActiveCategory(category);
                              setFromUnitId(pathParts[0]);
                              setToUnitId(pathParts[1]);
                            }
                          } else {
                            setActiveCustomTool(tool.id);
                          }
                          window.history.pushState({}, "", `/${tool.slug}`);
                        }
                      }
                    }}
                    className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
                  >
                    {idx === 0 && <Icons.Home className="w-3 h-3" />}
                    <span>{crumb.label}</span>
                  </a>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {activeCustomTool 
                ? (getToolBySlug(activeCustomTool)?.title || "Calculation Tool")
                : `${activeCategoryObj.name} Conversion Calculator`}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {activeCustomTool
                ? (getToolBySlug(activeCustomTool)?.description || "High precision calculations and productivity options.")
                : `Convert ${activeCategoryObj.name} units dynamically with high precision, formula explanations, and complete lookup reference tables.`}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Quick Search & Tool Launcher
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Type a tool name (BMI, Loan, JSON) or unit conversion (e.g., 10kg to lbs).
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-4 relative flex items-center">
              <Icons.Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Examples: 5 feet to cm, 150 lbs to kg, 250 psi to bar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError("");
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 pl-10 pr-24 py-3 rounded-xl text-sm focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white text-xs font-semibold px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <Icons.Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles className="w-3.5 h-3.5" />
                    <span>Go</span>
                  </>
                )}
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-3 flex items-center gap-1.5">
                <Icons.AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{searchError}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                "5 feet to cm",
                "150 lbs to kg",
                "250 psi to bar",
                "3 cups to ml",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setSearchQuery(example);
                    const clientIntent = parseClientSearch(example);
                    if (clientIntent.categoryId && clientIntent.fromUnitId && clientIntent.toUnitId) {
                      setActiveCategory(clientIntent.categoryId);
                      setFromUnitId(clientIntent.fromUnitId);
                      setToUnitId(clientIntent.toUnitId);
                      if (clientIntent.value !== undefined) {
                        setInputValue(clientIntent.value);
                        updateUrlRoute(clientIntent.categoryId, clientIntent.fromUnitId, clientIntent.toUnitId, clientIntent.value);
                      }
                    }
                  }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/80 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {activeCustomTool ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCustomTool}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeCustomTool === "percentage-calculator" && <PercentageCalculator />}
                  {activeCustomTool === "bmi-calculator" && <BmiCalculator />}
                  {activeCustomTool === "loan-calculator" && <LoanCalculator />}
                  {activeCustomTool === "password-generator" && <PasswordGenerator />}
                  {activeCustomTool === "json-formatter" && <JsonFormatter />}
                  {activeCustomTool === "case-converter" && <CaseConverter />}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Calculator Config
                  </span>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 font-mono">
                    {activeCategoryObj.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      From Unit
                    </label>
                    <div className="relative">
                      <select
                        value={fromUnitId}
                        onChange={(e) => handleSelectFromUnit(e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 px-3 py-2.5 rounded-lg focus:outline-hidden cursor-pointer"
                      >
                        {activeCategoryObj.units.map(unit => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.symbol})
                          </option>
                        ))}
                      </select>
                      <Icons.ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
                      placeholder="Enter numeric value..."
                      className="w-full mt-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold pl-3 pr-3 py-2.5 rounded-lg focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      To Unit
                    </label>
                    <div className="relative">
                      <select
                        value={toUnitId}
                        onChange={(e) => handleSelectToUnit(e.target.value)}
                        className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 px-3 py-2.5 rounded-lg focus:outline-hidden cursor-pointer"
                      >
                        {activeCategoryObj.units.map(unit => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.symbol})
                          </option>
                        ))}
                      </select>
                      <Icons.ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {conversionResult && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${fromUnitId}-${toUnitId}-${inputValue}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResultDetails
                      result={conversionResult}
                      onSwap={handleSwap}
                      onSelectUnitPair={(fromId, toId) => {
                        setFromUnitId(fromId);
                        setToUnitId(toId);
                        updateUrlRoute(activeCategory, fromId, toId, inputValue);
                        addHistoryItem(activeCategory, fromId, toId, inputValue);
                      }}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}  
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}

          {seoData && seoData.relatedTools && seoData.relatedTools.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Icons.Link2 className="w-4 h-4 text-brand-600 dark:text-brand-500" />
                <span>Related Calculators & Tools</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Explore more high-precision {activeCategoryObj?.name || "universal"} tools and conversion resources:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {seoData.relatedTools.map((relTool) => (
                  <a
                    key={relTool.id}
                    href={`/${relTool.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const tool = getToolBySlug(relTool.slug);
                      if (tool) {
                        if (tool.category === "unit-converters") {
                          setActiveCustomTool(null);
                          const pathParts = tool.id.split("-to-");
                          if (pathParts.length === 2) {
                            const category = tool.slug.split("/")[0];
                            setActiveCategory(category);
                            setFromUnitId(pathParts[0]);
                            setToUnitId(pathParts[1]);
                          }
                        } else {
                          setActiveCustomTool(tool.id);
                        }
                        window.history.pushState({}, "", `/${relTool.slug}`);
                      }
                    }}
                    className="flex flex-col justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/65 dark:border-slate-800/65 rounded-xl hover:border-brand-500 hover:shadow-xs group transition-all text-left"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-brand-600 dark:text-brand-500 uppercase tracking-wider block">
                        {relTool.category.replace("-", " ")}
                      </span>
                      <strong className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2 leading-snug">
                        {relTool.title}
                      </strong>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-brand-600 flex items-center gap-0.5 mt-3 transition-colors">
                      <span>Launch Tool</span>
                      <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Hand: Favorites, Recent History Panel */}
        <aside className="lg:col-span-3 space-y-6">
          <FavoritesPanel
            favorites={favorites}
            onSelect={(fav) => {
              setActiveCategory(fav.category);
              setFromUnitId(fav.fromUnitId);
              setToUnitId(fav.toUnitId);
              updateUrlRoute(fav.category, fav.fromUnitId, fav.toUnitId, inputValue);
              addHistoryItem(fav.category, fav.fromUnitId, fav.toUnitId, inputValue);
            }}
            onRemove={(fav, e) => {
              e.stopPropagation();
              toggleFavorite(fav.category, fav.fromUnitId, fav.toUnitId);
            }}
          />

          <HistoryPanel
            history={history}
            onSelect={(hist) => {
              setActiveCategory(hist.category);
              setFromUnitId(hist.fromUnitId);
              setToUnitId(hist.toUnitId);
              setInputValue(hist.value);
              updateUrlRoute(hist.category, hist.fromUnitId, hist.toUnitId, hist.value);
            }}
            onClear={() => clearHistory()}
          />

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 shadow-xs text-center">
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Secure Client Engine</span>
            <p className="text-[11px] text-slate-500 mt-1">
              Your calculations are secure. No cookies, cloud storage trackers, or sign-in walls exist. Privacy first.
            </p>
          </div>
        </aside>
      </main>

      {/* 3. Footer Section */}
      <footer className="border-t border-slate-200/55 dark:border-slate-800/60 bg-white dark:bg-slate-950 py-12 mt-16 text-slate-400">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">ConvertPulse</h4>
            <p className="text-[11px] mt-2 leading-relaxed text-slate-400">
              The premier resource for scientific, financial, physical, and custom dimensional measurement standardizations. Built with speed, offline compliance, and user safety in mind.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Supported Standards</h4>
            <p className="text-[11px] mt-2 leading-relaxed text-slate-400">
              Governed by the International System of Units (SI), NIST standard reference indexes, and modern European Forex indices.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Future Roadmap</h4>
            <p className="text-[11px] mt-2 leading-relaxed text-slate-400">
              Future releases include offline progressive web apps (PWA), OCR image scanning, voice searching, and multi-language support.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 border-t border-slate-200/40 dark:border-slate-800/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div>&copy; 2026 ConvertPulse. All Rights Reserved.</div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span className="cursor-pointer hover:underline">Reference Index</span>
          </div>
        </div>
      </footer>
      <StickyBottomAd />
    </div>
  );
}
