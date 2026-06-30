import { UNIT_CATEGORIES } from "./unitsData";
import type { ToolRegistryItem, ToolCategory } from "./toolRegistry";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    image: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  breadcrumbs: { label: string; url: string }[];
  relatedTools: { id: string; title: string; slug: string; category: string }[];
  jsonLd: any[];
}

// ===============================
// CATEGORY TEMPLATES (UNCHANGED)
// ===============================
const CATEGORY_TEMPLATES: Record<
  ToolCategory,
  {
    titleTemplate: (title: string) => string;
    descTemplate: (title: string) => string;
    keywordsTemplate: (title: string) => string[];
    defaultIntroduction: (title: string) => string;
    defaultExplanation: (title: string) => string;
    defaultFaqs: (title: string) => { question: string; answer: string }[];
    defaultTips: string[];
    defaultMistakes: string[];
  }
> = {
  "unit-converters": {
    titleTemplate: (title) => `${title} | Accurate Online Unit Converter`,
    descTemplate: (title) =>
      `Convert units instantly using our high-precision online ${title}.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "unit converter",
      "conversion tool"
    ],
    defaultIntroduction: (title) =>
      `Welcome to the ${title}.`,
    defaultExplanation: (title) =>
      `This tool performs accurate conversions.`,
    defaultFaqs: (title) => [
      {
        question: `How do I use this ${title}?`,
        answer: `Enter values and get instant results.`
      }
    ],
    defaultTips: ["Use swap button for faster conversion."],
    defaultMistakes: ["Mixing metric and imperial units."]
  },

  calculators: {
    titleTemplate: (title) => `${title} | Free Calculator`,
    descTemplate: (title) => `Solve ${title} instantly online.`,
    keywordsTemplate: (title) => [title.toLowerCase(), "calculator"],
    defaultIntroduction: (title) => `${title} helps you solve problems.`,
    defaultExplanation: (title) => `Uses standard math formulas.`,
    defaultFaqs: (title) => [
      {
        question: `How does this work?`,
        answer: `It calculates instantly in browser.`
      }
    ],
    defaultTips: ["Check inputs carefully."],
    defaultMistakes: ["Wrong order of operations."]
  },

  finance: {
    titleTemplate: (title) => `${title} | Finance Calculator`,
    descTemplate: (title) => `Estimate finance values with ${title}.`,
    keywordsTemplate: (title) => [title.toLowerCase(), "finance"],
    defaultIntroduction: (title) => `${title} helps financial planning.`,
    defaultExplanation: (title) => `Uses standard financial formulas.`,
    defaultFaqs: (title) => [
      {
        question: `Is this official?`,
        answer: `No, it's an estimator.`
      }
    ],
    defaultTips: ["Compare rates carefully."],
    defaultMistakes: ["Ignoring total interest."]
  },

  health: {
    titleTemplate: (title) => `${title} | Health Calculator`,
    descTemplate: (title) => `Check health values using ${title}.`,
    keywordsTemplate: (title) => [title.toLowerCase(), "health"],
    defaultIntroduction: (title) => `${title} calculates health metrics.`,
    defaultExplanation: (title) => `Uses WHO-based formulas.`,
    defaultFaqs: (title) => [
      {
        question: `Is this medical advice?`,
        answer: `No, only for estimation.`
      }
    ],
    defaultTips: ["Consult a doctor for accuracy."],
    defaultMistakes: ["Using for children or athletes."]
  },

  "developer-tools": {
    titleTemplate: (title) => `${title} | Dev Tool`,
    descTemplate: (title) => `Developer utility: ${title}.`,
    keywordsTemplate: (title) => [title.toLowerCase(), "dev tool"],
    defaultIntroduction: (title) => `${title} for developers.`,
    defaultExplanation: (title) => `Runs locally in browser.`,
    defaultFaqs: (title) => [
      {
        question: `Is data safe?`,
        answer: `Yes, everything is local.`
      }
    ],
    defaultTips: ["Use copy button."],
    defaultMistakes: ["Pasting binary data."]
  },

  "text-utilities": {
    titleTemplate: (title) => `${title} | Text Tool`,
    descTemplate: (title) => `Transform text using ${title}.`,
    keywordsTemplate: (title) => [title.toLowerCase(), "text tool"],
    defaultIntroduction: (title) => `${title} edits text easily.`,
    defaultExplanation: (title) => `Uses regex transformations.`,
    defaultFaqs: (title) => [
      {
        question: `Does it support Unicode?`,
        answer: `Yes.`
      }
    ],
    defaultTips: ["Paste text to begin."],
    defaultMistakes: ["Wrong case selection."]
  }
};

// ===============================
// FIX: SAFE SCHEMA MAPPING
// ===============================
const schemaTypeMap: Record<string, string> = {
  WebApplication: "WebApplication",
  MathSolver: "WebApplication", // FIXED
  QuantitativeValue: "WebApplication" // FIXED
};

// ===============================
// MAIN SEO FUNCTION
// ===============================
export function generateSEOData(
  tool: Partial<ToolRegistryItem> & { id: string; title: string; category: ToolCategory },
  allTools?: any[],
  inputValue?: number
): SEOMetadata {
  const hostUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://universal-tools-platform.pages.dev";

  const slug = tool.slug || tool.id;
  const canonicalUrl = `${hostUrl}/${slug}`;

  const template = CATEGORY_TEMPLATES[tool.category] || CATEGORY_TEMPLATES.calculators;

  const title = template.titleTemplate(tool.title);
  const description = tool.description || template.descTemplate(tool.title);
  const keywords = tool.keywords?.length
    ? tool.keywords
    : template.keywordsTemplate(tool.title);

  const breadcrumbs =
    tool.breadcrumbs?.length
      ? tool.breadcrumbs
      : [
          { label: "Home", url: "/" },
          { label: tool.category, url: `/?type=${tool.category}` },
          { label: tool.title, url: `/${slug}` }
        ];

  const schemaType =
    schemaTypeMap[tool.schemaType || "WebApplication"] || "WebApplication";

  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: tool.title,
      description,
      url: canonicalUrl,

      // ✅ FIXED REQUIRED FIELDS
      inLanguage: "en-PH",
      mainEntityOfPage: canonicalUrl,
      usageInfo:
        "This tool runs entirely in your browser. No data is sent to servers.",

      applicationCategory: "Utility",
      operatingSystem: "All",
      browserRequirements: "Requires HTML5/JavaScript",
      keywords: keywords.join(", ")
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: b.url.startsWith("http")
          ? b.url
          : `${hostUrl}${b.url}`
      }))
    }
  ];

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      image: `${hostUrl}/assets/banner.png`,
      siteName: "Universal Tools Platform"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: `${hostUrl}/assets/banner.png`
    },
    breadcrumbs,
    relatedTools: [],
    jsonLd
  };
}
