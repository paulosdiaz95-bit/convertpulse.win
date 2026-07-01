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

/* =========================
   CATEGORY TEMPLATES
========================= */

const CATEGORY_TEMPLATES: Record<ToolCategory, any> = {
  "unit-converters": {
    titleTemplate: (t: string) => `${t} | Accurate Online Unit Converter`,
    descTemplate: (t: string) =>
      `Convert units instantly using our high-precision ${t}.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "unit converter"],
    defaultIntroduction: (t: string) => `Welcome to ${t}.`,
    defaultExplanation: (t: string) => `Standard unit conversion logic.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  },

  calculators: {
    titleTemplate: (t: string) => `${t} | Free Calculator`,
    descTemplate: (t: string) => `Solve ${t} instantly online.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "calculator"],
    defaultIntroduction: (t: string) => `${t} calculator tool.`,
    defaultExplanation: (t: string) => `Mathematical computation engine.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  },

  finance: {
    titleTemplate: (t: string) => `${t} | Finance Tool`,
    descTemplate: (t: string) => `Calculate ${t} easily.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "finance"],
    defaultIntroduction: (t: string) => `${t} finance tool.`,
    defaultExplanation: (t: string) => `Financial formulas applied.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  },

  health: {
    titleTemplate: (t: string) => `${t} | Health Calculator`,
    descTemplate: (t: string) => `Check ${t} instantly.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "health"],
    defaultIntroduction: (t: string) => `${t} health tool.`,
    defaultExplanation: (t: string) => `Health metrics calculation.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  },

  "developer-tools": {
    titleTemplate: (t: string) => `${t} | Dev Tool`,
    descTemplate: (t: string) => `${t} for developers.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "dev tools"],
    defaultIntroduction: (t: string) => `${t} developer tool.`,
    defaultExplanation: (t: string) => `Code processing utility.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  },

  "text-utilities": {
    titleTemplate: (t: string) => `${t} | Text Tool`,
    descTemplate: (t: string) => `${t} text utility.`,
    keywordsTemplate: (t: string) => [t.toLowerCase(), "text"],
    defaultIntroduction: (t: string) => `${t} text tool.`,
    defaultExplanation: (t: string) => `Text transformation.`,
    defaultFaqs: () => [],
    defaultTips: [],
    defaultMistakes: []
  }
};

/* =========================
   SEO GENERATOR
========================= */

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

  const template = CATEGORY_TEMPLATES[tool.category];

  const title = template.titleTemplate(tool.title);
  const description = tool.description || template.descTemplate(tool.title);

  const keywords =
    tool.keywords?.length ? tool.keywords : template.keywordsTemplate(tool.title);

  const schemaType =
    tool.schemaType === "MathSolver"
      ? "SoftwareApplication"
      : tool.schemaType || "WebApplication";

  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: tool.title,
      description,
      url: canonicalUrl,
      inLanguage: "en",
      applicationCategory: "Utility",
      operatingSystem: "All",
      browserRequirements: "Requires HTML5/JavaScript",
      keywords: keywords.join(", "),
      usageInfo:
        "This tool runs locally in your browser and does not store user data."
    }
  ];

  if (tool.formula) {
    jsonLd[0].assesses = tool.formula;
  }

  // FIXED: Properly structured BreadcrumbList with nested item objects and safety check for empty arrays
  const breadcrumbs = tool.breadcrumbs || [];
  if (breadcrumbs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: {
          "@id": `${hostUrl}${b.url}`,
          name: b.label
        }
      }))
    });
  }

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
    breadcrumbs: tool.breadcrumbs || [],
    relatedTools: [],
    jsonLd
  };
}

/* =========================
   FIXED EXPORT (THIS WAS YOUR BUILD ERROR)
========================= */

export function enrichToolRegistryItem(
  tool: Partial<ToolRegistryItem> & { id: string; title: string; category: ToolCategory }
): ToolRegistryItem {
  const template = CATEGORY_TEMPLATES[tool.category];
  const slug = tool.slug || tool.id;

  return {
    id: tool.id,
    slug,
    title: tool.title,
    category: tool.category,
    categoryLabel: tool.categoryLabel || tool.category,
    description: tool.description || template.descTemplate(tool.title),
    keywords: tool.keywords || template.keywordsTemplate(tool.title),
    schemaType: tool.schemaType || "WebApplication",
    formula: tool.formula,
    sitemapInclusion: tool.sitemapInclusion ?? true,
    breadcrumbs:
      tool.breadcrumbs || [
        { label: "Home", url: "/" },
        { label: tool.title, url: `/${slug}` }
      ],
    relatedToolIds: tool.relatedToolIds || [],
    reusableContent: tool.reusableContent || {
      introduction: template.defaultIntroduction(tool.title),
      explanation: template.defaultExplanation(tool.title),
      faq: template.defaultFaqs(tool.title),
      tips: template.defaultTips,
      commonMistakes: template.defaultMistakes
    }
  };
}
