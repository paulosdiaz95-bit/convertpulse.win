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

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://universal-tools-platform.pages.dev/bmi-calculator";

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

      const totalInches =
        (isNaN(ft) ? 0 : ft * 12) + (isNaN(inches) ? 0 : inches);

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

      {/* ✅ SEO SCHEMA FIX (THIS FIXES YOUR CRAWL ERRORS) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Body Mass Index (BMI) Calculator",
            description:
              "Calculate your Body Mass Index (BMI) instantly using metric or imperial units with WHO health categorization.",
            url: pageUrl,
            inLanguage: "en",
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            browserRequirements: "Requires HTML5 and JavaScript",
            keywords:
              "bmi calculator, body mass index, healthy weight calculator, body fat estimator",
            usageInfo: {
              "@type": "CreativeWork",
              text:
                "Use this BMI calculator by entering your weight and height to instantly compute your body mass index and health category."
            }
          })
        }}
      />

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
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md ${
                unitSystem === "metric"
                  ? "bg-white dark:bg-slate-800"
                  : "text-slate-500"
              }`}
            >
              Metric (kg, cm)
            </button>

            <button
              onClick={() => setUnitSystem("imperial")}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md ${
                unitSystem === "imperial"
                  ? "bg-white dark:bg-slate-800"
                  : "text-slate-500"
              }`}
            >
              Imperial (lbs, ft/in)
            </button>
          </div>

          {unitSystem === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Weight (kg)"
                className="p-2 border rounded"
              />

              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Height (cm)"
                className="p-2 border rounded"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                placeholder="Weight (lbs)"
                className="p-2 border rounded w-full"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="Feet"
                  className="p-2 border rounded"
                />

                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="Inches"
                  className="p-2 border rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between">

          <div>
            <div className="flex justify-between">
              <span className="text-xs font-bold">BMI Analysis</span>

              {bmi !== null && (
                <button onClick={triggerCopy}>
                  {copied ? <Check /> : <Copy />}
                </button>
              )}
            </div>

            <div className="text-center py-4">
              <div className="text-3xl font-bold">
                {bmi ? bmi.toFixed(1) : "—"}
              </div>
              <div>{category}</div>
            </div>
          </div>

          <div className="text-xs text-gray-500 border-t pt-2">
            Normal: 18.5 – 24.9 | Overweight: 25 – 29.9
          </div>
        </div>
      </div>
    </div>
  );
}
