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
    // Generate programmatic pairwise converters for major units to prevent thin pages
    // and provide high-value targeted landing pages
    const majorUnits = cat.units.slice(0, 5); // Focus on most popular combinations for index
    
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
          description: `Free online ${fromUnit.name} to ${toUnit.name} conversion tool. Accurately convert ${fromUnit.pluralName} to ${toUnit.pluralName} with our instant calculator, conversion tables, and step-by-step mathematical formulas.`,
          keywords: [
            `${fromUnit.id} to ${toUnit.id}`,
            `convert ${fromUnit.pluralName} to ${toUnit.pluralName}`,
            `${fromUnit.name} to ${toUnit.name} formula`,
            `how to convert ${fromUnit.id} to ${toUnit.id}`,
            `${fromUnit.pluralName} to ${toUnit.pluralName} conversion chart`
          ],
          schemaType: "QuantitativeValue",
          formula: cat.id === "temperature" 
            ? fromUnit.id === "C" && toUnit.id === "F" ? "°F = (°C × 1.8) + 32" : "°C = (°F - 32) / 1.8"
            : `1 ${fromUnit.symbol} = ${fromUnit.factor / toUnit.factor} ${toUnit.symbol}`,
          sitemapInclusion: true,
          breadcrumbs: [
            { label: "Home", url: "/" },
            { label: cat.name, url: `/?cat=${cat.id}` },
            { label: `${fromUnit.symbol} to ${toUnit.symbol}`, url: `/${slug}` }
          ],
          relatedToolIds: majorUnits
            .filter(u => u.id !== fromUnit.id && u.id !== toUnit.id)
            .slice(0, 3)
            .map(u => `${toUnit.id}-to-${u.id}`),
          reusableContent: {
            introduction: `This premium conversion tool allows you to instantly compute the relationship between ${fromUnit.pluralName} and ${toUnit.pluralName}. Perfect for engineers, students, and professional applications where accuracy and speed are required.`,
            explanation: `The conversion of ${fromUnit.pluralName} to ${toUnit.pluralName} is governed by standard physical ratios. A ${fromUnit.name} represents a different scale of dimension compared to a ${toUnit.name}, which requires multiplying by the standard conversion factor of ${fromUnit.factor / toUnit.factor}.`,
            workedExamples: [
              {
                input: `10 ${fromUnit.symbol}`,
                output: `${(10 * (fromUnit.factor / toUnit.factor)).toFixed(4)} ${toUnit.symbol}`,
                steps: `Multiply 10 by the conversion ratio of ${fromUnit.factor / toUnit.factor}: 10 × ${fromUnit.factor / toUnit.factor} = ${(10 * (fromUnit.factor / toUnit.factor)).toFixed(4)} ${toUnit.pluralName}.`
              },
              {
                input: `150 ${fromUnit.symbol}`,
                output: `${(150 * (fromUnit.factor / toUnit.factor)).toFixed(4)} ${toUnit.symbol}`,
                steps: `Multiply 150 by the conversion ratio of ${fromUnit.factor / toUnit.factor}: 150 × ${fromUnit.factor / toUnit.factor} = ${(150 * (fromUnit.factor / toUnit.factor)).toFixed(4)} ${toUnit.pluralName}.`
              }
            ],
            faq: [
              {
                question: `How do I manually convert ${fromUnit.pluralName} to ${toUnit.pluralName}?`,
                answer: `To perform the conversion manually, multiply your input value of ${fromUnit.pluralName} by ${fromUnit.factor / toUnit.factor} to get the corresponding value in ${toUnit.pluralName}.`
              },
              {
                question: `What is the formula for ${fromUnit.name} to ${toUnit.name}?`,
                answer: `The official conversion formula is: ${toUnit.name} = ${fromUnit.name} × (${fromUnit.factor} / ${toUnit.factor}).`
              }
            ],
            tips: [
              "Always double check whether you are converting between dry or liquid variations for volume units.",
              "Utilize scientific notation filters for micro-level or galactic-level values."
            ],
            commonMistakes: [
              "Confusing US domestic measurements with UK imperial definitions for pints, cups, and gallons.",
              "Forgetting that temperature scales like Celsius and Fahrenheit involve offsets, not just linear factors."
            ]
          }
        });
      });
    });
  });

  return tools;
}

// 2. Custom Calculators, Developers, and Text tools Registry Items
export const CUSTOM_TOOLS: ToolRegistryItem[] = [
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    category: "calculators",
    categoryLabel: "Math Calculators",
    description: "An advanced, intuitive Percentage Calculator to find percentage values, calculate percentage increase/decrease, ratios, and fractions instantly.",
    keywords: ["percentage calculator", "calculate percentage", "percentage change", "percent increase", "fraction to percent"],
    schemaType: "MathSolver",
    formula: "Percentage = (Part / Whole) × 100",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Calculators", url: "/?type=calculators" },
      { label: "Percentage Calculator", url: "/percentage-calculator" }
    ],
    relatedToolIds: ["bmi-calculator", "loan-calculator"],
    reusableContent: {
      introduction: "Simplify all your percentage math with our free interactive solver. Quickly compute ratios, markups, discounts, investment growth, and common tip values in business or education.",
      explanation: "A percentage is a number or ratio expressed as a fraction of 100. It is denoted using the percent sign '%'. Standard equations allow solving for any of the three elements: the base, the rate, or the percentage amount.",
      workedExamples: [
        {
          input: "What is 15% of 200?",
          output: "30",
          steps: "Multiply 200 by 15 and divide by 100: (200 × 15) / 100 = 30."
        },
        {
          input: "Percentage increase from 50 to 75",
          output: "50%",
          steps: "Subtract old from new, divide by old, and multiply by 100: ((75 - 50) / 50) × 100 = 50% increase."
        }
      ],
      faq: [
        {
          question: "How do you calculate percentage increase?",
          answer: "Subtract the original value from the new value, divide the difference by the original value, and multiply the result by 100."
        },
        {
          question: "How do I turn a decimal into a percentage?",
          answer: "Simply multiply the decimal number by 100 and add the percentage symbol (e.g., 0.75 × 100 = 75%)."
        }
      ],
      tips: [
        "Use percentage change calculations to track stock portfolio values, price changes, or weight changes.",
        "A negative percentage change indicates a percentage decrease."
      ],
      commonMistakes: [
        "Dividing by the new value instead of the original/starting value when calculating percent change.",
        "Confusing percentage points with percentage change."
      ]
    }
  },
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    title: "Body Mass Index (BMI) Calculator",
    category: "health",
    categoryLabel: "Health & Fitness",
    description: "Calculate your Body Mass Index (BMI) instantly. Supports both Metric and Imperial units for weight and height with immediate WHO health categorization.",
    keywords: ["bmi calculator", "body mass index", "healthy weight calculator", "body fat estimator", "metric bmi"],
    schemaType: "MathSolver",
    formula: "BMI = kg / m² (Metric) or (lbs / inches²) × 703 (Imperial)",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Health", url: "/?type=health" },
      { label: "BMI Calculator", url: "/bmi-calculator" }
    ],
    relatedToolIds: ["percentage-calculator", "loan-calculator"],
    reusableContent: {
      introduction: "Check your body metrics instantly. Body Mass Index (BMI) is a widely used health screening indicator that classifies adults into underweight, normal weight, overweight, and obesity categories.",
      explanation: "Our algorithm calculates BMI by dividing body weight in kilograms by the square of height in meters. For US imperial inputs, weight is calculated in pounds and height in inches, scaled by a factor of 703.",
      workedExamples: [
        {
          input: "Weight: 70kg, Height: 1.75m",
          output: "22.86 (Normal Weight)",
          steps: "Divide weight by height squared: 70 / (1.75)² = 70 / 3.0625 = 22.86 BMI."
        },
        {
          input: "Weight: 150 lbs, Height: 5' 6\" (66 inches)",
          output: "24.21 (Normal Weight)",
          steps: "Multiply weight by 703, divide by height squared: (150 × 703) / (66)² = 105450 / 4356 = 24.21 BMI."
        }
      ],
      faq: [
        {
          question: "What is a healthy BMI range?",
          answer: "According to the World Health Organization (WHO), a normal, healthy BMI range for adults is between 18.5 and 24.9."
        },
        {
          question: "Is BMI an accurate measure of body fat?",
          answer: "BMI is a reliable general screening tool but does not directly measure body fat. It can overestimate body fat in muscular athletes or underestimate it in elderly individuals with low muscle mass."
        }
      ],
      tips: [
        "Combine your BMI score with waist circumference tracking for a more comprehensive fitness evaluation.",
        "Consult with certified healthcare providers before starting any dramatic diet or exercise plans."
      ],
      commonMistakes: [
        "Entering height in centimeters instead of meters when utilizing the raw metric formula.",
        "Assuming BMI thresholds apply identically to growing children and teens."
      ]
    }
  },
  {
    id: "loan-calculator",
    slug: "loan-calculator",
    title: "Loan Payment & Amortization Calculator",
    category: "finance",
    categoryLabel: "Finance Calculators",
    description: "Calculate your monthly home, car, or personal loan payments. Generates a clear payment breakdown, total interest cost, and full amortization estimations.",
    keywords: ["loan calculator", "monthly mortgage payment", "car loan calculator", "amortization scheduler", "interest calculator"],
    schemaType: "MathSolver",
    formula: "PMT = [P × r × (1+r)^n] / [(1+r)^n - 1]",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Finance", url: "/?type=finance" },
      { label: "Loan Calculator", url: "/loan-calculator" }
    ],
    relatedToolIds: ["percentage-calculator", "bmi-calculator"],
    reusableContent: {
      introduction: "Formulate your personal budget accurately. Plan car loans, student mortgages, or small business debt by understanding exact payment values, interest rates, and loan terms.",
      explanation: "Using the standard annuity amortization formula, we compute the constant monthly payment required to fully pay off a principal amount over a set period, accounting for periodic interest compounding.",
      workedExamples: [
        {
          input: "$10,000 at 5% interest for 3 years (36 months)",
          output: "$299.71 per month",
          steps: "Apply compound amortization annuity factor. Total Paid: $10,789.52. Total Interest Paid: $789.52."
        }
      ],
      faq: [
        {
          question: "What does loan amortization mean?",
          answer: "Amortization refers to the process of spreading out a loan into a series of equal periodic payments. Over time, more of your payment goes to principal and less to interest."
        },
        {
          question: "How does a higher interest rate affect my payment?",
          answer: "A higher rate increases the cost of borrowing, which increases both your monthly payment and the total interest paid over the life of the loan."
        }
      ],
      tips: [
        "Even small extra monthly payments applied straight to the principal can cut years off a long-term mortgage.",
        "Compare APR (Annual Percentage Rate) instead of just interest rate to capture all bank fees."
      ],
      commonMistakes: [
        "Forgetting to include local property taxes and home insurance into real-world monthly mortgage costs.",
        "Focusing purely on low monthly payments instead of the total cost of interest over a longer loan term."
      ]
    }
  },
  {
    id: "password-generator",
    slug: "password-generator",
    title: "Secure Password Generator",
    category: "developer-tools",
    categoryLabel: "Developer & Security",
    description: "Generate highly secure, randomized cryptographic passwords locally. Customize length, uppercase letters, lowercase, numbers, symbols, and test strength.",
    keywords: ["password generator", "secure password", "random key creator", "generate api secret", "offline pass generator"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Developer", url: "/?type=developer-tools" },
      { label: "Password Generator", url: "/password-generator" }
    ],
    relatedToolIds: ["json-formatter", "case-converter"],
    reusableContent: {
      introduction: "Protect your accounts and servers with high-entropy passwords. This generator runs entirely client-side using JavaScript, meaning no data is ever transmitted over the network.",
      explanation: "Passphrases and keys are assembled by picking random characters from user-selected pools (lowercase, uppercase, numerals, and special characters) via an offline secure pseudo-random generator.",
      faq: [
        {
          question: "Is this password generator safe to use?",
          answer: "Yes. The generation is performed entirely inside your browser's local sandbox memory. No credentials or settings are ever saved, stored, or sent to a server."
        },
        {
          question: "What makes a password strong?",
          answer: "A strong password has high entropy, meaning it is long (at least 12–16 characters) and contains a random mixture of uppercase letters, numbers, and symbols to resist brute-force hacks."
        }
      ]
    }
  },
  {
    id: "json-formatter",
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    category: "developer-tools",
    categoryLabel: "Developer Utilities",
    description: "Format, beautify, validate, and minify JSON code instantly offline. Features direct error tracking and nested collapsible code syntax.",
    keywords: ["json formatter", "beautify json", "json validator", "minify json", "fix json parser"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Developer", url: "/?type=developer-tools" },
      { label: "JSON Formatter", url: "/json-formatter" }
    ],
    relatedToolIds: ["password-generator", "case-converter"],
    reusableContent: {
      introduction: "Format raw, cluttered JSON data into beautifully indented, readable text. Instantly spot syntax errors, validate JSON structures, or compress JSON files for smaller server payloads.",
      explanation: "Utilizes Node/browser JSON stringification standards. The built-in parser catches structural syntax bugs (like trailing commas, missing quotes, or mismatched braces) and identifies their precise line numbers.",
      faq: [
        {
          question: "Why does my JSON validation fail?",
          answer: "JSON standards are very strict. The most common errors include unquoted keys, single quotes instead of double quotes, trailing commas at the end of lists, or unescaped control characters."
        },
        {
          question: "Is my proprietary JSON safe on this platform?",
          answer: "100% safe. This utility operates completely client-side in your browser. Your JSON data is processed locally and never leaves your machine."
        }
      ]
    }
  },
  {
    id: "case-converter",
    slug: "case-converter",
    title: "Text Case Converter Utility",
    category: "text-utilities",
    categoryLabel: "Text Utilities",
    description: "Convert text cases instantly. Switch between UPPERCASE, lowercase, Title Case, sentence case, camelCase, slug-case, with instant word and character counts.",
    keywords: ["case converter", "title case generator", "uppercase lowercase converter", "convert text format", "sentence case switcher"],
    schemaType: "WebApplication",
    sitemapInclusion: true,
    breadcrumbs: [
      { label: "Home", url: "/" },
      { label: "Text Utilities", url: "/?type=text-utilities" },
      { label: "Case Converter", url: "/case-converter" }
    ],
    relatedToolIds: ["password-generator", "json-formatter"],
    reusableContent: {
      introduction: "Save time when editing, writing, or programming. Effortlessly convert blocks of text into standard casing formats, view word counts, character counts, and copy results with one click.",
      explanation: "Using fast JavaScript regular expressions, we parse the boundaries of your sentences, titles, and variables to swap capitalization schemes smoothly without disrupting spacing or punctuation.",
      faq: [
        {
          question: "What is Title Case?",
          answer: "Title Case capitalizes the first letter of each major word in a phrase (excluding minor articles like 'a', 'an', 'the', or 'and' based on style guidelines)."
        },
        {
          question: "How do word counts update?",
          answer: "The text area updates statistics on-the-fly, counting spaces, characters, and word groupings dynamically on every keypress."
        }
      ]
    }
  }
];

// Combine all tools into a single source of truth registry
let cachedAllTools: ToolRegistryItem[] | null = null;

export function getAllTools(): ToolRegistryItem[] {
  if (!cachedAllTools) {
    const rawTools = [...CUSTOM_TOOLS, ...getUnitConverterTools()];
    cachedAllTools = rawTools.map(t => enrichToolRegistryItem(t));
  }
  return cachedAllTools;
}

// Fetch a tool by its slug
export function getToolBySlug(slug: string): ToolRegistryItem | undefined {
  return getAllTools().find(t => t.slug === slug || t.id === slug);
}
