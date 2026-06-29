import React, { useState, useEffect } from "react";
import { Activity, Copy, Check } from "lucide-react";

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Metric fields
  const [weightKg, setWeightKg] = useState("70");
  const [heightCm, setHeightCm] = useState("175");

  // Imperial fields
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");

  const [bmi, setBmi] = useState<number | null>(22.86);
  const [category, setCategory] = useState("Normal Weight");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recalculate();
  }, [unitSystem, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const recalculate = () => {
    if (unitSystem === "metric") {
      const w = parseFloat(weightKg);
      const hCm = parseFloat(heightCm);
      if (!isNaN(w) && !isNaN(hCm) && hCm > 0) {
        const hM = hCm / 100;
        const score = w / (hM * hM);
        setBmi(score);
        setCategory(getBmiCategory(score));
      } else {
        setBmi(null);
      }
    } else {
      const wLbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn);
      const totalInches = (isNaN(ft) ? 0 : ft * 12) + (isNaN(inches) ? 0 : inches);
      if (!isNaN(wLbs) && totalInches > 0) {
        const score = (wLbs / (totalInches * totalInches)) * 703;
        setBmi(score);
        setCategory(getBmiCategory(score));
      } else {
        setBmi(null);
      }
    }
  };

  const getBmiCategory = (score: number) => {
    if (score < 18.5) return "Underweight";
    if (score < 25) return "Normal Weight";
    if (score < 30) return "Overweight";
    return "Obese";
  };

  const triggerCopy = () => {
    if (bmi === null) return;
    const text = `My BMI is ${bmi.toFixed(2)} (${category}). Calculated via Universal Tools Platform.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
          BMI Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Panel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
            <button
              onClick={() => setUnitSystem("metric")}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                unitSystem === "metric" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => setUnitSystem("imperial")}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                unitSystem === "imperial" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Imperial (lbs, ft/in)
            </button>
          </div>

          {unitSystem === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400">Height (ft)</label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400">Height (in)</label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-brand-600 dark:focus:border-brand-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">BMI Analysis</span>
              {bmi !== null && (
                <button
                  onClick={triggerCopy}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 cursor-pointer"
                  title="Copy BMI Score"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-mono">
                {bmi !== null ? bmi.toFixed(1) : "—"}
              </div>
              <div className={`text-xs font-bold mt-2 ${
                category === "Normal Weight" ? "text-emerald-500" :
                category === "Underweight" ? "text-blue-500" :
                category === "Overweight" ? "text-amber-500" : "text-red-500"
              }`}>
                {category}
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              {category === "Normal Weight" && "🌟 Outstanding! You are inside the healthy, recommended World Health Organization (WHO) index range."}
              {category === "Underweight" && "⚠️ Caution: Your index suggests you are under the standard threshold. Ensure nutrition and clinical advice are synchronized."}
              {category === "Overweight" && "⚠️ Your index sits above standard normal bounds. Consider tracking metabolic profiles and daily fitness goals."}
              {category === "Obese" && "🚨 High Index: Body Mass suggests metabolic obesity category. It is recommended to check cardiovascular health with clinicians."}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Normal: 18.5 – 24.9</span>
            <span>Over: 25.0 – 29.9</span>
          </div>
        </div>

      </div>
    </div>
  );
}
