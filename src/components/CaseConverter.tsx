import React, { useState } from "react";
import { CaseSensitive, Copy, Check, Trash2 } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("the quick brown fox jumps over the lazy dog. converting cases has never been easier.");
  const [copied, setCopied] = useState(false);

  const convertUpper = () => {
    setText(text.toUpperCase());
  };

  const convertLower = () => {
    setText(text.toLowerCase());
  };

  const convertTitle = () => {
    const minorWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "by", "for", "from", "of", "in", "with"];
    const converted = text
      .toLowerCase()
      .split(" ")
      .map((word, idx, arr) => {
        if (idx !== 0 && idx !== arr.length - 1 && minorWords.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    setText(converted);
  };

  const convertSentence = () => {
    const converted = text
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    setText(converted);
  };

  const convertCamel = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(" ")
      .filter(Boolean)
      .map((word, idx) => {
        if (idx === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
    setText(converted);
  };

  const convertSlug = () => {
    const converted = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .split(" ")
      .filter(Boolean)
      .join("-");
    setText(converted);
  };

  const triggerCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <CaseSensitive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Case Converter & Word Counter
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerCopy}
            disabled={!text}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/85 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            title="Copy Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setText("")}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 cursor-pointer transition-colors"
            title="Clear Text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text content here..."
            rows={8}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/85 rounded-xl p-4 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-indigo-600 dark:focus:border-indigo-500"
          />
        </div>

        {/* Casing filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "UPPERCASE", action: convertUpper },
            { label: "lowercase", action: convertLower },
            { label: "Title Case", action: convertTitle },
            { label: "Sentence case", action: convertSentence },
            { label: "camelCase", action: convertCamel },
            { label: "slug-case", action: convertSlug }
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200 rounded-md cursor-pointer transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Text Analytics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Words</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">{wordCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Characters</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">{charCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Sentences</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">{sentenceCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
