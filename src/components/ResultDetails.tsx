import React, { useState } from "react";
import { ConversionResult, FavoriteItem } from "../types";
import { formatValue } from "../unitsEngine";
import { AdBanner, AdInline, NativeAd, ArticleAd } from "./AdPlacements";
import ConversionTables from "./ConversionTables";
import ArticlesSection from "./ArticlesSection";
import { 
  Copy, ArrowLeftRight, Share2, Star, Check, HelpCircle, Info, RefreshCw, Sparkles 
} from "lucide-react";

interface ResultProps {
  result: ConversionResult;
  onSwap: () => void;
  onSelectUnitPair: (fromId: string, toId: string) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: () => void;
}

export default function ResultDetails({
  result,
  onSwap,
  onSelectUnitPair,
  favorites,
  onToggleFavorite,
}: ResultProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const isFavorite = favorites.some(
    (f) =>
      f.category === result.fromUnit.id && // Category check or unit matching
      f.fromUnitId === result.fromUnit.id &&
      f.toUnitId === result.toUnit.id
  ) || favorites.some(
    (f) => 
      f.fromUnitId === result.fromUnit.id && 
      f.toUnitId === result.toUnit.id
  );

  const handleCopy = () => {
    const text = `${result.inputValue} ${result.fromUnit.pluralName} is equals to ${formatValue(result.outputValue)} ${result.toUnit.pluralName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `${window.location.origin}/${result.fromUnit.id}-to-${result.toUnit.id}?v=${result.inputValue}`;
    navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Display Block */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative mesh */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-brand-300 uppercase font-semibold">
              {result.category} Conversion
            </span>
            <div className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-100">
              {result.inputValue} <span className="text-brand-400 font-normal">{result.fromUnit.pluralName}</span>
            </div>
          </div>

          <div className="flex items-center justify-center p-2 rounded-full bg-slate-800/80 border border-slate-700/50 text-brand-400">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>

          <div className="space-y-1">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {formatValue(result.outputValue)}{" "}
              <span className="text-emerald-400 font-semibold">{result.toUnit.pluralName}</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              1 {result.fromUnit.symbol} = {formatValue(result.outputValue / (result.inputValue || 1))} {result.toUnit.symbol}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 pt-4 w-full justify-center max-w-sm">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/40 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={onSwap}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/40 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
              <span>Swap</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/40 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shared ? "Linked!" : "Share"}</span>
            </button>

            <button
              onClick={onToggleFavorite}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700/40 text-slate-400 hover:text-amber-400"
              }`}
              title="Add to Favorites"
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real-World Context Section (Only shown if analogy data is available) */}
      {result.realWorld && (
        <div className="bg-emerald-50/60 border border-emerald-100/60 rounded-xl p-5 flex items-start gap-4 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Real-World Visualization
            </h4>
            <div className="mt-1.5 space-y-1 text-sm text-slate-700 font-medium">
              {result.realWorld.map((analogy, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{analogy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner Ad Slot positioned right after conversion details */}
      <AdBanner slotType="headerBanner" />
      <AdInline />

      {/* 3. Also Equals Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Also Equals (Alternative Units)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {result.alsoEquals.map((alt, idx) => (
            <div
              key={idx}
              onClick={() => onSelectUnitPair(result.fromUnit.id, alt.unit.id)}
              className="p-3 border border-slate-100 dark:border-slate-800/40 rounded-lg hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 cursor-pointer transition-colors"
            >
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{alt.unit.name}</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {formatValue(alt.value)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{alt.unit.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Formula Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs flex items-start gap-4">
        <div className="p-2 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-lg shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Formula & Conversion Steps
          </h4>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 px-3 py-1.5 rounded-md inline-block">
            {result.formula}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            <strong>Calculation:</strong> {result.steps}
          </p>
        </div>
      </div>

      {/* 5. Reference Tables (useful for SEO value tracking) */}
      <ConversionTables
        fromUnit={result.fromUnit}
        toUnit={result.toUnit}
        referenceTable={result.referenceTable}
      />

      {/* 6. Smart Suggestions for link depth */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Smart Suggestions & Related Conversions
        </h4>
        <div className="flex flex-wrap gap-2">
          {result.smartSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSelectUnitPair(result.toUnit.id, sug.unit.id)}
              className="px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50/20 dark:bg-brand-950/20 border border-brand-100/40 dark:border-brand-900/30 hover:bg-brand-50 dark:hover:bg-brand-950/35 rounded-lg cursor-pointer transition-all"
            >
              {sug.label} &rarr;
            </button>
          ))}
        </div>
      </div>

      {/* Native Sponsored Promotion Slot */}
      <NativeAd campaign="neon" />

      {/* 7. FAQ Generator Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-1.5 mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Frequently Asked Questions
          </h4>
        </div>
        <div className="space-y-4">
          {result.faqs.map((faq, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{faq.question}</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Articles Section */}
      <ArticlesSection categoryName={result.category} />
    </div>
  );
}
