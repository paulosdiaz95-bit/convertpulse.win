import { useState, useEffect } from "react";
import { HistoryItem, FavoriteItem } from "./types";

export function useUserPreferences() {
  // Use a wrapper to safely read from localStorage
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load once on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("converter_history");
    const savedFavorites = localStorage.getItem("converter_favorites");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save whenever history or favorites change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("converter_history", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("converter_favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const addHistoryItem = (cat: string, from: string, to: string, val: number) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      category: cat,
      fromUnitId: from,
      toUnitId: to,
      value: val
    };

    setHistory(prev => [newItem, ...prev].slice(0, 20));
  };

  const toggleFavorite = (category: string, fromUnitId: string, toUnitId: string) => {
    // ... same toggle logic as before
  };

  return { history, favorites, setHistory, setFavorites, addHistoryItem, toggleFavorite };
}
