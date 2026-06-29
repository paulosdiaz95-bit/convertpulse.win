import React from "react";
import { FavoriteItem } from "../types";
import { UNIT_CATEGORIES } from "../unitsData";
import { Star, RefreshCw } from "lucide-react";

interface FavoritesProps {
  favorites: FavoriteItem[];
  onSelect: (item: FavoriteItem) => void;
  onRemove: (item: FavoriteItem, e: React.MouseEvent) => void;
}

export default function FavoritesPanel({ favorites, onSelect, onRemove }: FavoritesProps) {
  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 text-center shadow-xs">
        <Star className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No favorite unit pairings</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Click the star button on any result to save.</p>
      </div>
    );
  }

  const getUnitSymbols = (item: FavoriteItem) => {
    const cat = UNIT_CATEGORIES.find(c => c.id === item.category);
    const fromUnit = cat?.units.find(u => u.id === item.fromUnitId);
    const toUnit = cat?.units.find(u => u.id === item.toUnitId);
    return {
      fromSym: fromUnit?.symbol || item.fromUnitId,
      toSym: toUnit?.symbol || item.toUnitId,
      catName: cat?.name || item.category
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-1.5 mb-4">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">My Favorite Units</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
        {favorites.map((item) => {
          const { fromSym, toSym, catName } = getUnitSymbols(item);
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative flex flex-col items-start p-3 rounded-lg border border-slate-100 dark:border-slate-800/40 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 cursor-pointer transition-all text-xs"
            >
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase mb-1">{catName}</span>
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold text-xs mt-0.5">
                <span>{fromSym}</span>
                <RefreshCw className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                <span>{toSym}</span>
              </div>
              <button
                onClick={(e) => onRemove(item, e)}
                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                title="Remove favorite"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
