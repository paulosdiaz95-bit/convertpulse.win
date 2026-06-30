import React, { useState, useEffect } from "react";
import { Activity, Copy, Check } from "lucide-react";

export default function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  const [weightKg, setWeightKg] = useState("70");
  const [heightCm, setHeightCm] = useState("175");

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

  return (
    <div className="space-y-6">

      {/* ✅ FIXED JSON-LD (THIS IS WHAT GOOGLE WANTS) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Body Mass Index (BMI) Calculator",
            description:
              "Calculate BMI instantly using metric or imperial units.",
            url: pageUrl,
            inLanguage: "en",
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            browserRequirements: "HTML5 and JavaScript required",
            keywords:
              "bmi calculator, body mass index, health calculator",
            usageInfo:
              "Enter your height and weight to calculate BMI instantly. Data stays in your browser."
          })
        }}
      />

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold">BMI Calculator</h3>
      </div>

      {/* INPUT */}
      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="number"
          value={unitSystem === "metric" ? weightKg : weightLbs}
          onChange={(e) =>
            unitSystem === "metric"
              ? setWeightKg(e.target.value)
              : setWeightLbs(e.target.value)
          }
          placeholder="Weight"
          className="p-2 border rounded"
        />

        <input
          type="number"
          value={unitSystem === "metric" ? heightCm : heightFt}
          onChange={(e) =>
            unitSystem === "metric"
              ? setHeightCm(e.target.value)
              : setHeightFt(e.target.value)
          }
          placeholder="Height"
          className="p-2 border rounded"
        />
      </div>

      {/* RESULT */}
      <div className="mt-4 text-center">
        <div className="text-3xl font-bold">
          {bmi ? bmi.toFixed(1) : "—"}
        </div>
        <div>{category}</div>
      </div>

      <button onClick={triggerCopy} className="mt-2 flex items-center gap-2">
        {copied ? <Check /> : <Copy />}
        Copy Result
      </button>

    </div>
  );
}
