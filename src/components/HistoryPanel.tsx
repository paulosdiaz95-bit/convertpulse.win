import React from "react";
import { HistoryItem } from "../types";
import { UNIT_CATEGORIES } from "../unitsData";
import { Clock, Trash2, ArrowRight } from "lucide-react";

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 text-center shadow-xs">
        <Clock className="w-5 h-5 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No recent conversions</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Your calculations are saved locally here.</p>
      </div>
    );
  }

  const getUnitSymbol = (categoryId: string, unitId: string) => {
    const cat = UNIT_CATEGORIES.find(c => c.id === categoryId);
    return cat?.units.find(u => u.id === unitId)?.symbol || unitId;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Recent Conversions</h3>
        </div>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1 text-[11px] font-medium cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {history.map((item) => {
          const fromSym = getUnitSymbol(item.category, item.fromUnitId);
          const toSym = getUnitSymbol(item.category, item.toUnitId);
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 cursor-pointer transition-all text-xs"
            >
              <div className="font-medium text-slate-800 dark:text-slate-200">
                {item.value} <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">{fromSym}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 mx-2 shrink-0" />
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                Convert to <span className="text-brand-600 dark:text-brand-400 font-mono">{toSym}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
