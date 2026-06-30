import React, { useState, useEffect } from "react";
import { Activity, Copy, Check } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Metric states
  const [weightKg, setWeightKg] = useState("70");
  const [heightCm, setHeightCm] = useState("175");

  // Imperial states
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");

  // Calculation states
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
        const score = w / Math.pow(hCm / 100, 2);
        setBmi(score);
        setCategory(getBmiCategory(score));
      } else {
        setBmi(null);
      }
    } else {
      const wLbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn);

      const totalInches = (ft || 0) * 12 + (inches || 0);

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
    navigator.clipboard.writeText(
      `My BMI is ${bmi.toFixed(2)} (${category}).`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Body Mass Index (BMI) Calculator",
    description: "Calculate BMI instantly using metric or imperial units.",
    url: pageUrl,
    inLanguage: "en",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "HTML5 and JavaScript required",
    keywords: "bmi calculator, body mass index, health calculator",
    usageInfo: "Enter your height and weight to calculate BMI instantly. Data stays in your browser."
  };

  return (
    <HelmetProvider>
      <div className="space-y-6">
        {/* Helmet injecting SEO & JSON-LD properly into Head */}
        <Helmet>
          <title>Body Mass Index (BMI) Calculator | Health & Wellness Calculator</title>
          <meta
            name="description"
            content="Calculate your Body Mass Index (BMI) instantly. Supports both Metric and Imperial units for weight and height with immediate WHO health categorization."
          />
          <link rel="canonical" href="https://universal-tools-platform.pages.dev/bmi-calculator" />
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        </Helmet>

        {/* Unit Toggle Buttons */}
        <div className="flex gap-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setUnitSystem("metric")}
            className={`px-4 py-2 text-xs font-semibold rounded-md cursor-pointer transition-all ${
              unitSystem === "metric"
                ? "bg-white dark:bg-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnitSystem("imperial")}
            className={`px-4 py-2 text-xs font-semibold rounded-md cursor-pointer transition-all ${
              unitSystem === "imperial"
                ? "bg-white dark:bg-slate-800 shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Imperial (lbs/in)
          </button>
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-lg">BMI Calculator</h3>
        </div>

        {/* INPUTS */}
        <div className="grid md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {unitSystem === "metric" ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 70"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="e.g. 175"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  placeholder="e.g. 154"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Height (ft)</label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="Feet"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Height (in)</label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="Inches"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* RESULT */}
        <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl text-center">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase mb-1">
            Your BMI Score
          </div>
          <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-50">
            {bmi ? bmi.toFixed(1) : "—"}
          </div>
          <div className="mt-2 inline-flex px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
            {category}
          </div>
        </div>

        {/* COPY BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={triggerCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl cursor-pointer transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Result Copied!" : "Copy Result"}
          </button>
        </div>
      </div>
    </HelmetProvider>
  );
}
