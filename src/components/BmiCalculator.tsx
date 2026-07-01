import React, { useState, useEffect } from "react";
import { Activity, Copy, Check } from "lucide-react";

function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState("70");
  const [heightCm, setHeightCm] = useState("175");
  const [weightLbs, setWeightLbs] = useState("154");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [bmi, setBmi] = useState<number | null>(22.86);
  const [category, setCategory] = useState("Normal Weight");
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "https://universal-tools-platform.pages.dev/bmi-calculator";

  useEffect(() => {
    document.title = "Body Mass Index (BMI) Calculator | Health & Wellness Calculator";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', "Calculate your Body Mass Index (BMI) instantly. Supports both Metric and Imperial units for weight and height with immediate WHO health categorization.");
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', "https://universal-tools-platform.pages.dev/bmi-calculator");
  }, [pageUrl]);

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
      } else { setBmi(null); }
    } else {
      const wLbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt);
      const inches = parseFloat(heightIn);
      const totalInches = (ft || 0) * 12 + (inches || 0);
      if (!isNaN(wLbs) && totalInches > 0) {
        const score = (wLbs / (totalInches * totalInches)) * 703;
        setBmi(score);
        setCategory(getBmiCategory(score));
      } else { setBmi(null); }
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
    navigator.clipboard.writeText(`My BMI is ${bmi.toFixed(2)} (${category}).`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-fit">
        <button onClick={() => setUnitSystem("metric")} className={`px-4 py-2 text-xs font-semibold rounded-md ${unitSystem === "metric" ? "bg-white dark:bg-slate-800 shadow-xs" : "text-slate-500"}`}>Metric (kg/cm)</button>
        <button onClick={() => setUnitSystem("imperial")} className={`px-4 py-2 text-xs font-semibold rounded-md ${unitSystem === "imperial" ? "bg-white dark:bg-slate-800 shadow-xs" : "text-slate-500"}`}>Imperial (lbs/in)</button>
      </div>
      <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /><h3 className="font-bold text-lg">BMI Calculator</h3></div>
      <div className="grid md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        {unitSystem === "metric" ? (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="weight-kg">Weight (kg)</label>
              <input id="weight-kg" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 70" className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="height-cm">Height (cm)</label>
              <input id="height-cm" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 175" className="w-full p-2.5 border rounded-lg" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="weight-lbs">Weight (lbs)</label>
              <input id="weight-lbs" type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} placeholder="e.g. 154" className="w-full p-2.5 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="height-ft">Height (ft)</label>
                <input id="height-ft" type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="Feet" className="w-full p-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="height-in">Height (in)</label>
                <input id="height-in" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="Inches" className="w-full p-2.5 border rounded-lg" />
              </div>
            </div>
          </>
        )}
      </div>
      <button onClick={triggerCopy} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">{copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}{copied ? "Copied!" : "Copy Result"}</button>
    </div>
  );
}
export default BmiCalculator;
