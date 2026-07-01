import { useState, useEffect } from "react";
import { HistoryItem, FavoriteItem } from "./types";

export function useUserPreferences() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("converter_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem("converter_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("converter_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("converter_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addHistoryItem = (cat: string, from: string, to: string, val: number) => {
    if (val === 0 || isNaN(val)) return;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      category: cat,
      fromUnitId: from,
      toUnitId: to,
      value: val
    };

    setHistory(prev => {
      const filtered = prev.filter(item => !(item.fromUnitId === from && item.toUnitId === to && item.value === val));
      return [newItem, ...filtered].slice(0, 20);
    });
  };

  const toggleFavorite = (category: string, fromUnitId: string, toUnitId: string) => {
    const isFav = favorites.some(f => f.fromUnitId === fromUnitId && f.toUnitId === toUnitId);
    if (isFav) {
      setFavorites(prev => prev.filter(f => !(f.fromUnitId === fromUnitId && f.toUnitId === toUnitId)));
    } else {
      const newFav: FavoriteItem = {
        id: Math.random().toString(36).substring(2, 9),
        category,
        fromUnitId,
        toUnitId
      };
      setFavorites(prev => [newFav, ...prev]);
    }
  };

  return { history, favorites, setHistory, setFavorites, addHistoryItem, toggleFavorite };
}
