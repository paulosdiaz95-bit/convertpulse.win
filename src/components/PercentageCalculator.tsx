import React, { useState } from "react";
import { Percent, Copy, Check } from "lucide-react";

export default function PercentageCalculator() {
  // Option 1: What is X% of Y?
  const [x1, setX1] = useState("15");
  const [y1, setY1] = useState("200");
  const [r1, setR1] = useState<number | null>(30);

  // Option 2: X is what percent of Y?
  const [x2, setX2] = useState("30");
  const [y2, setY2] = useState("200");
  const [r2, setR2] = useState<number | null>(15);

  // Option 3: Percent change from X to Y?
  const [x3, setX3] = useState("100");
  const [y3, setY3] = useState("150");
  const [r3, setR3] = useState<number | null>(50);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const triggerCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const calculate1 = (valX: string, valY: string) => {
    setX1(valX);
    setY1(valY);
    const px = parseFloat(valX);
    const py = parseFloat(valY);
    if (!isNaN(px) && !isNaN(py) && py !== 0) {
      setR1((px / 100) * py);
    } else {
      setR1(null);
    }
  };

  const calculate2 = (valX: string, valY: string) => {
    setX2(valX);
    setY2(valY);
    const px = parseFloat(valX);
    const py = parseFloat(valY);
    if (!isNaN(px) && !isNaN(py) && py !== 0) {
      setR2((px / py) * 100);
    } else {
      setR2(null);
    }
  };

  const calculate3 = (valX: string, valY: string) => {
    setX3(valX);
    setY3(valY);
    const px = parseFloat(valX);
    const py = parseFloat(valY);
    if (!isNaN(px) && !isNaN(py) && px !== 0) {
      setR3(((py - px) / px) * 100);
    } else {
      setR3(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Percent className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Percentage Calculator Tool
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Calculate Value
            </h4>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
              What is <span className="text-brand-600 font-bold">{x1 || "?"}%</span> of <span className="text-brand-600 font-bold">{y1 || "?"}</span>?
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Percentage (%)</label>
                <input
                  type="number"
                  value={x1}
                  onChange={(e) => calculate1(e.target.value, y1)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Total Value</label>
                <input
                  type="number"
                  value={y1}
                  onChange={(e) => calculate1(x1, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Result</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                {r1 !== null ? Number(r1.toFixed(4)) : "—"}
              </div>
            </div>
            {r1 !== null && (
              <button
                onClick={() => triggerCopy(`${x1}% of ${y1} is ${r1}`, 1)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Calculate Percentage
            </h4>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
              <span className="text-brand-600 font-bold">{x2 || "?"}</span> is what percent of <span className="text-brand-600 font-bold">{y2 || "?"}</span>?
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Value X</label>
                <input
                  type="number"
                  value={x2}
                  onChange={(e) => calculate2(e.target.value, y2)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Value Y</label>
                <input
                  type="number"
                  value={y2}
                  onChange={(e) => calculate2(x2, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Result</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                {r2 !== null ? `${Number(r2.toFixed(4))}%` : "—"}
              </div>
            </div>
            {r2 !== null && (
              <button
                onClick={() => triggerCopy(`${x2} is ${r2.toFixed(2)}% of ${y2}`, 2)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Calculate Change
            </h4>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
              What is the % change from <span className="text-brand-600 font-bold">{x3 || "?"}</span> to <span className="text-brand-600 font-bold">{y3 || "?"}</span>?
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">From (Old Value)</label>
                <input
                  type="number"
                  value={x3}
                  onChange={(e) => calculate3(e.target.value, y3)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">To (New Value)</label>
                <input
                  type="number"
                  value={y3}
                  onChange={(e) => calculate3(x3, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Result</span>
              <div className={`text-base font-bold ${r3 !== null && r3 > 0 ? "text-emerald-600 dark:text-emerald-400" : r3 !== null && r3 < 0 ? "text-red-500" : "text-slate-800 dark:text-slate-100"}`}>
                {r3 !== null ? `${r3 > 0 ? "+" : ""}${Number(r3.toFixed(4))}%` : "—"}
              </div>
            </div>
            {r3 !== null && (
              <button
                onClick={() => triggerCopy(`The percent change from ${x3} to ${y3} is ${r3.toFixed(2)}%`, 3)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
              >
                {copiedIndex === 3 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
