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
import PercentageCalculator from "./components/PercentageCalculator";
import BmiCalculator from "./components/BmiCalculator";
import LoanCalculator from "./components/LoanCalculator";
import PasswordGenerator from "./components/PasswordGenerator";
import JsonFormatter from "./components/JsonFormatter";
import CaseConverter from "./components/CaseConverter";

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
  const [aiError, setAiError] = useState("");

  // Universal Tools Platform Active custom tool (e.g. Percentage Calculator)
  const [activeCustomTool, setActiveCustomTool] = useState<string | null>(null);

  // History and Favorites persisted in localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("converter_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("converter_favorites");
    return saved ? JSON.parse(saved) : [];
  });

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

  // Sync history and favorites with localStorage
  useEffect(() => {
    localStorage.setItem("converter_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("converter_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // SEO URL routing listener (e.g. /length/cm-to-inch or /percentage-calculator)
  useEffect(() => {
    const parseUrlRoute = () => {
      const path = window.location.pathname;
      if (path && path !== "/") {
        const segments = path.split("/").filter(Boolean);
        
        // Single segment route (e.g. /percentage-calculator)
        if (segments.length === 1) {
          const toolId = segments[0];
          const isCustomTool = [
            "percentage-calculator",
            "bmi-calculator",
            "loan-calculator",
            "password-generator",
            "json-formatter",
            "case-converter"
          ].includes(toolId);
          if (isCustomTool) {
            setActiveCustomTool(toolId);
            return;
          }
        }

        // Two segment route (e.g. /length/cm-to-inch)
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
                
                // Read optional value from query string
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
        // Root path
        setActiveCustomTool(null);
      }
    };

    parseUrlRoute();
    window.addEventListener("popstate", parseUrlRoute);
    return () => window.removeEventListener("popstate", parseUrlRoute);
  }, []);

  // Helper to trigger URL updates to keep SEO page-depth and shareability intact
  const updateUrlRoute = (catId: string, fromId: string, toId: string, value: number) => {
    const newPath = `/${catId}/${fromId}-to-${toId}${value !== 1 ? `?v=${value}` : ""}`;
    window.history.pushState({ path: newPath }, "", newPath);
  };

  // Dynamic SEO Metadata and JSON-LD structured schema update
  useEffect(() => {
    let toolObj: any = null;

    if (activeCustomTool) {
      toolObj = getToolBySlug(activeCustomTool);
    } else {
      const slug = `${activeCategory}/${fromUnitId}-to-${toUnitId}`;
      toolObj = getToolBySlug(slug);

      if (!toolObj) {
        // Fallback for custom activeCategory when no exact pairwise tool exists yet
        const catObj = UNIT_CATEGORIES.find(c => c.id === activeCategory);
        toolObj = {
          id: activeCategory,
          slug: `?cat=${activeCategory}`,
          title: `${catObj?.name || "Unit"} Conversion Calculator`,
          category: "unit-converters",
          categoryLabel: `${catObj?.name || "Unit"} Converters`,
          description: `Convert ${catObj?.name || "unit"} units seamlessly. Includes formulas, live step-by-step math explanations, and interactive reference tables.`,
          sitemapInclusion: false
        };
      }
    }

    if (!toolObj) return;

    // Generate comprehensive SEO dataset using our configuration-driven engine
    const seo = generateSEOData(toolObj, getAllTools(), inputValue);

    // 1. Update Title
    document.title = seo.title;

    // 2. Helper to set meta tags
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        const matches = selector.match(/meta\[(name|property)="([^"]+)"\]/);
        if (matches) {
          element = document.createElement("meta");
          if (matches[1] === "name") {
            element.setAttribute("name", matches[2]);
          } else {
            element.setAttribute("property", matches[2]);
          }
          document.head.appendChild(element);
        }
      }
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    // 3. Helper to set canonical link
    const setCanonicalLink = (url: string) => {
      let element = document.head.querySelector("link[rel='canonical']");
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", url);
    };

    setMetaTag('meta[name="description"]', 'content', seo.description);
    setCanonicalLink(seo.canonicalUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'content', seo.openGraph.title);
    setMetaTag('meta[property="og:description"]', 'content', seo.openGraph.description);
    setMetaTag('meta[property="og:url"]', 'content', seo.openGraph.url);
    setMetaTag('meta[property="og:type"]', 'content', seo.openGraph.type);
    setMetaTag('meta[property="og:image"]', 'content', seo.openGraph.image);

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'content', seo.twitter.card);
    setMetaTag('meta[name="twitter:title"]', 'content', seo.twitter.title);
    setMetaTag('meta[name="twitter:description"]', 'content', seo.twitter.description);
    setMetaTag('meta[name="twitter:image"]', 'content', seo.twitter.image);

    // 4. Update JSON-LD Script tag containing both breadcrumb path and entity schemas
    let ldScript = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "jsonld-schema";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.text = JSON.stringify(seo.jsonLd, null, 2);

  }, [activeCategory, fromUnitId, toUnitId, activeCustomTool, inputValue]);


  // Keyboard shortcut for Command+K or Search key focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "/") {
        // Focus search if not inside an input
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update URL whenever standard selects change
  const handleSelectCategory = (catId: string) => {
    const cat = UNIT_CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setActiveCustomTool(null);
      setActiveCategory(catId);
