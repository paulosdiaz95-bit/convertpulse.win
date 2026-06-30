import { UnitCategory } from "./types";
import { UNIT_CATEGORIES } from "./unitsData";
import { enrichToolRegistryItem } from "./seoEngine";

export type ToolCategory =
  | "unit-converters"
  | "calculators"
  | "finance"
  | "health"
  | "developer-tools"
  | "text-utilities";

export interface ToolRegistryItem {
  id: string;
  slug: string;
  title: string;
  category: ToolCategory;
  categoryLabel: string;
  description: string;
  keywords: string[];
  schemaType: "WebApplication" | "MathSolver" | "QuantitativeValue";
  formula?: string;
  sitemapInclusion: boolean;
  breadcrumbs: { label: string; url: string }[];
  relatedToolIds: string[];
  reusableContent: {
    introduction: string;
    explanation: string;
    workedExamples?: { input: string; output: string; steps: string }[];
    faq: { question: string; answer: string }[];
    tips?: string[];
    commonMistakes?: string[];
    references?: string[];
  };
}

// 1. Programmatic Unit Converter Registry Builders
export function getUnitConverterTools(): ToolRegistryItem[] {
  const tools: ToolRegistryItem[] = [];

  UNIT_CATEGORIES.forEach((cat) => {
    const majorUnits = cat.units.slice(0, 5);

    majorUnits.forEach((fromUnit) => {
      majorUnits.forEach((toUnit) => {
        if (fromUnit.id === toUnit.id) return;

        const id = `${fromUnit.id}-to-${toUnit.id}`;
        const slug = `${cat.id}/${fromUnit.id}-to-${toUnit.id}`;
        const title = `${fromUnit.name} to ${toUnit.name} Converter`;

        tools.push({
          id,
          slug,
          title,
          category: "unit-converters",
          categoryLabel: `${cat.name} Converters`,
          description: `Free online ${fromUnit.name} to ${toUnit.name} conversion tool.`,
          keywords: [
            `${fromUnit.id} to ${toUnit.id}`,
            `convert ${fromUnit.pluralName} to ${toUnit.pluralName}`,
          ],
          schemaType: "QuantitativeValue",
          formula:
            cat.id === "temperature"
              ? fromUnit.id === "C" && toUnit.id === "F"
                ? "°F = (°C × 1.8) + 32"
                : "°C = (°F - 32) / 1.8"
              : `1 ${fromUnit.symbol} = ${
                  fromUnit.factor / toUnit.factor
                } ${toUnit.symbol}`,
          sitemapInclusion: true,
          breadcrumbs: [
            { label: "Home", url: "/" },
            { label: cat.name, url: `/?cat=${cat.id}` },
            { label: `${fromUnit.symbol} to ${toUnit.symbol}`, url: `/${slug}` },
          ],
          relatedToolIds: [],
          reusableContent: {
            introduction: "",
            explanation: "",
            faq: [],
          },
        });
      });
    });
  });

  return tools;
}

// 2. CUSTOM TOOLS
export const CUSTOM_TOOLS: ToolRegistryItem[] = [
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    category: "calculators",
    categoryLabel: "Math Calculators",
    description:
      "An advanced, intuitive Percentage Calculator to find percentage values.",
    keywords: [
      "percentage calculator",
      "calculate percentage",
      "percentage change",
    ],
    schemaType: "WebApplication", // ✅ FIXED
    formula: "Percentage = (Part / Whole) × 100",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Calculators", url: "/?type=calculators" },
      { label: "Percentage Calculator", url: "/percentage-calculator" },
    ],
    relatedToolIds: ["bmi-calculator", "loan-calculator"],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    title: "Body Mass Index (BMI) Calculator",
    category: "health",
    categoryLabel: "Health & Fitness",
    description: "Calculate your Body Mass Index instantly.",
    keywords: ["bmi calculator", "body mass index"],
    schemaType: "WebApplication", // ✅ FIXED
    formula: "BMI = kg / m²",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Health", url: "/?type=health" },
      { label: "BMI Calculator", url: "/bmi-calculator" },
    ],
    relatedToolIds: ["percentage-calculator", "loan-calculator"],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    title: "Loan Payment & Amortization Calculator",
    category: "finance",
    categoryLabel: "Finance Calculators",
    description: "Calculate monthly loan payments.",
    keywords: ["loan calculator", "mortgage calculator"],
    schemaType: "WebApplication", // ✅ FIXED
    formula: "PMT formula",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Finance", url: "/?type=finance" },
      { label: "Loan Calculator", url: "/loan-calculator" },
    ],
    relatedToolIds: ["percentage-calculator", "bmi-calculator"],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
  {
    id: "password-generator",
    slug: "password-generator",
    title: "Secure Password Generator",
    category: "developer-tools",
    categoryLabel: "Developer & Security",
    description: "Generate secure passwords.",
    keywords: ["password generator"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Developer", url: "/?type=developer-tools" },
      { label: "Password Generator", url: "/password-generator" },
    ],
    relatedToolIds: [],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    category: "developer-tools",
    categoryLabel: "Developer Utilities",
    description: "Format and validate JSON.",
    keywords: ["json formatter"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Developer", url: "/?type=developer-tools" },
      { label: "JSON Formatter", url: "/json-formatter" },
    ],
    relatedToolIds: [],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
  {
    id: "case-converter",
    slug: "case-converter",
    title: "Text Case Converter Utility",
    category: "text-utilities",
    categoryLabel: "Text Utilities",
    description: "Convert text case instantly.",
    keywords: ["case converter"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Text Utilities", url: "/?type=text-utilities" },
      { label: "Case Converter", url: "/case-converter" },
    ],
    relatedToolIds: [],
    reusableContent: {
      introduction: "",
      explanation: "",
      faq: [],
    },
  },
];

// Combine all tools
let cachedAllTools: ToolRegistryItem[] | null = null;

export function getAllTools(): ToolRegistryItem[] {
  if (!cachedAllTools) {
    const rawTools = [...CUSTOM_TOOLS, ...getUnitConverterTools()];
    cachedAllTools = rawTools.map((t) => enrichToolRegistryItem(t));
  }
  return cachedAllTools;
}

export function getToolBySlug(slug: string) {
  return getAllTools().find((t) => t.slug === slug || t.id === slug);
}
