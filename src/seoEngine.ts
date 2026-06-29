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

// Reusable Templates for each Category
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
    descTemplate: (title) => `Convert units instantly using our high-precision online ${title}. Featuring live math calculations, step-by-step formula breakdowns, and complete lookup reference tables.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "unit converter",
      "metric converter",
      "imperial converter",
      "measurement conversion",
      "high precision conversion"
    ],
    defaultIntroduction: (title) => `Welcome to the ${title}. This high-precision utility is designed to handle instant conversions with scientific accuracy, catering to engineers, scientists, students, and everyday users alike.`,
    defaultExplanation: (title) => `This calculation is governed by standard physical and architectural units of measurements. Our algorithmic core multiplies input parameters by standard conversion ratios, avoiding floating-point rounding issues in real-time.`,
    defaultFaqs: (title) => [
      {
        question: `How do I use this ${title}?`,
        answer: `Simply enter your numerical value in the input field, select your 'From' and 'To' units, and the system will perform the conversion dynamically on every keypress.`
      },
      {
        question: `Is the calculation performed locally or on a server?`,
        answer: `All math operations are executed locally within your web browser. This ensures maximum privacy, fast responses, and complete offline capability.`
      }
    ],
    defaultTips: [
      "You can swap the 'From' and 'To' units instantly using the swap button.",
      "Add this tool to your bookmarks or favorites panel for one-click access later."
    ],
    defaultMistakes: [
      "Assuming metric and imperial volume units like pints or gallons are exactly identical.",
      "Forgetting that offset values apply to temperature conversions, making them non-linear."
    ]
  },
  calculators: {
    titleTemplate: (title) => `${title} | High-Precision Free Solver`,
    descTemplate: (title) => `Calculate exact mathematical values with our free online ${title}. Includes step-by-step explanations, custom formula options, and automated audits.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "math calculator",
      "online calculator",
      "math solver",
      "equation solver",
      "step by step math"
    ],
    defaultIntroduction: (title) => `This interactive ${title} helps solve complex equations with clear, visual workflows. Perfect for schoolwork, business checks, or scientific tasks.`,
    defaultExplanation: (title) => `By dividing complex equations into sequential processes, our calculator renders both the final output and a complete audit trail of step-by-step arithmetic.`,
    defaultFaqs: (title) => [
      {
        question: `What formulas does this ${title} use?`,
        answer: `It uses standard mathematical definitions and mathematical axioms to solve equations. You can inspect the visual formula box on the result card.`
      }
    ],
    defaultTips: ["You can enter decimals and negative numbers safely.", "View the step-by-step logs below the main result to verify the math."],
    defaultMistakes: ["Applying operations in the wrong order manually (e.g. violating PEMDAS rules)."]
  },
  finance: {
    titleTemplate: (title) => `${title} | Interactive Amortization & Estimator`,
    descTemplate: (title) => `Estimate costs, budgets, and loans using our free ${title}. Get complete amortization schedules, interest breakdowns, and payment charts.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "finance calculator",
      "loan estimator",
      "budget planner",
      "savings calculator",
      "interest rates calculator"
    ],
    defaultIntroduction: (title) => `Plan your financial future with confidence using the ${title}. Calculate monthly bills, compounding interest schedules, or payment terms.`,
    defaultExplanation: (title) => `Our finance models apply compound interest formulas and standard banking amortization equations to accurately split principal and interest.`,
    defaultFaqs: (title) => [
      {
        question: `Is this financial tool officially certified?`,
        answer: `No, this is a planning estimator. Always consult with certified financial advisors before signing legally binding mortgages or loans.`
      }
    ],
    defaultTips: ["Try adjusting the interest rate slightly to see how much you could save over the life of a loan.", "Pay extra principal monthly to reduce total interest cost."],
    defaultMistakes: ["Focusing only on lower monthly payments instead of the total cost of interest over a longer period."]
  },
  health: {
    titleTemplate: (title) => `${title} | Health & Wellness Calculator`,
    descTemplate: (title) => `Check your health indexes using our free online ${title}. Supports metric & imperial units with immediate WHO guideline classifications.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "health calculator",
      "fitness estimator",
      "body mass calculator",
      "body fat calculator",
      "wellness tools"
    ],
    defaultIntroduction: (title) => `Track your vital body metrics instantly. Our ${title} uses officially recognized physiological equations to estimate health categories.`,
    defaultExplanation: (title) => `We evaluate standard demographic ranges against clinical metrics to provide general classifications based on World Health Organization standards.`,
    defaultFaqs: (title) => [
      {
        question: `Are my medical metrics private?`,
        answer: `Yes, completely. No data is sent to a database or tracked. Your weight, height, and age calculations stay entirely private within your browser.`
      }
    ],
    defaultTips: ["Combine calculations with waist measurements for a better fitness assessment.", "Drink water regularly and maintain a balanced diet."],
    defaultMistakes: ["Using standard adult health calculators to measure values for growing children or professional athletes."]
  },
  "developer-tools": {
    titleTemplate: (title) => `${title} | Fast Offline Dev Utility`,
    descTemplate: (title) => `Format, parse, or generate code securely using our offline-first ${title}. No data transmitted over the network, 100% private.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "developer tools",
      "programming utility",
      "offline generator",
      "coder helper",
      "local string formatter"
    ],
    defaultIntroduction: (title) => `The offline ${title} is designed for developers, system administrators, and security professionals who need high-speed local data transformation.`,
    defaultExplanation: (title) => `This tool operates in a client-side sandbox. It leverages browser JavaScript rendering libraries to parse, serialize, or transform strings without network hops.`,
    defaultFaqs: (title) => [
      {
        question: `Is it safe to paste sensitive data here?`,
        answer: `Yes, it is entirely safe. Our application runs 100% locally. No API endpoints or telemetry logs receive your inputs or outputs.`
      }
    ],
    defaultTips: ["Use the copy-to-clipboard button for quick integration into your code editor.", "No logins, subscription limits, or cookie tracking exist on this tool."],
    defaultMistakes: ["Uploading binary files into raw text areas designed exclusively for UTF-8 syntax formatting."]
  },
  "text-utilities": {
    titleTemplate: (title) => `${title} | Instant Word & Case Tool`,
    descTemplate: (title) => `Transform strings, clean text formats, or swap capitalization styles instantly with the ${title}. Live word and character counting.`,
    keywordsTemplate: (title) => [
      title.toLowerCase(),
      "text converter",
      "case switcher",
      "string utility",
      "word counter",
      "copy writing tool"
    ],
    defaultIntroduction: (title) => `Save editing time with our robust ${title}. Easily reformat copy, clean sentences, and verify characters.`,
    defaultExplanation: (title) => `Using ultra-fast regular expressions, we strip unwanted whitespace, toggle capitalization flags, and map clean strings with instant responsiveness.`,
    defaultFaqs: (title) => [
      {
        question: `Does this support special accents and characters?`,
        answer: `Yes. It supports Unicode characters, accented letters, and multi-language standard strings seamlessly.`
      }
    ],
    defaultTips: ["You can view live word and character count stats on the container layout.", "Paste your draft directly and copy the formatted text in one click."],
    defaultMistakes: ["Failing to double check acronym formatting when toggling to strict sentence or title casing."]
  }
};

// Main Configuration-Driven SEO Engine function
export function generateSEOData(
  tool: Partial<ToolRegistryItem> & { id: string; title: string; category: ToolCategory },
  allTools?: any[],
  inputValue?: number
): SEOMetadata {
  const hostUrl = typeof window !== "undefined" ? window.location.origin : "https://universal-tools.com";
  const slug = tool.slug || tool.id;
  const canonicalUrl = `${hostUrl}/${slug}`;

  // Get Category Template
  const template = CATEGORY_TEMPLATES[tool.category] || CATEGORY_TEMPLATES["calculators"];

  // 1. Title Generation
  const rawTitle = tool.title;
  const title = template.titleTemplate(rawTitle);

  // 2. Description Generation
  const description = tool.description || template.descTemplate(rawTitle);

  // 3. Keywords Generation
  const keywords = tool.keywords && tool.keywords.length > 0
    ? tool.keywords
    : template.keywordsTemplate(rawTitle);

  // 4. Breadcrumbs Generation (Automatic Navigation Path)
  const breadcrumbs = tool.breadcrumbs && tool.breadcrumbs.length > 0
    ? tool.breadcrumbs
    : [
        { label: "Home", url: "/" },
        { label: tool.categoryLabel || tool.category.replace("-", " "), url: `/?type=${tool.category}` },
        { label: rawTitle, url: `/${slug}` }
      ];

  // 5. Automatic Internal Links (Related Tools)
  // Find other tools with the same category, excluding the current tool itself
  const allToolsList = allTools || [];

  const relatedTools = allToolsList
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .slice(0, 3)
    .map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      category: t.category
    }));

  // Fallback to other categories if not enough related tools
  if (relatedTools.length < 3 && allToolsList.length > 0) {
    const filler = allToolsList
      .filter((t) => t.id !== tool.id && t.category !== tool.category)
      .slice(0, 3 - relatedTools.length)
      .map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        category: t.category
      }));
    relatedTools.push(...filler);
  }

  // 6. JSON-LD Structured Data
  const jsonLd: any[] = [];

  // Core Entity Schema
  const schemaType = tool.schemaType || "WebApplication";
  if (schemaType === "QuantitativeValue") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "QuantitativeValue",
      "name": rawTitle,
      "description": description,
      "value": inputValue !== undefined ? inputValue : 1
    });
  } else {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": rawTitle,
      "description": description,
      "applicationCategory": "Utility",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5/JavaScript",
      "keywords": keywords.join(", "),
      ...(tool.formula ? { "educationalLevel": "Intermediate", "assesses": tool.formula } : {})
    });
  }

  // Breadcrumb List Schema
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.label,
      "item": b.url.startsWith("http") ? b.url : `${hostUrl}${b.url}`
    }))
  });

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
    relatedTools,
    jsonLd
  };
}

// Post-processor function to dynamically enrich registered tools
export function enrichToolRegistryItem(tool: Partial<ToolRegistryItem> & { id: string; title: string; category: ToolCategory }): ToolRegistryItem {
  const template = CATEGORY_TEMPLATES[tool.category] || CATEGORY_TEMPLATES["calculators"];
  const slug = tool.slug || tool.id;

  const title = tool.title;
  const description = tool.description || template.descTemplate(title);
  const keywords = tool.keywords && tool.keywords.length > 0 ? tool.keywords : template.keywordsTemplate(title);
  const breadcrumbs = tool.breadcrumbs && tool.breadcrumbs.length > 0
    ? tool.breadcrumbs
    : [
        { label: "Home", url: "/" },
        { label: tool.categoryLabel || tool.category.replace("-", " "), url: `/?type=${tool.category}` },
        { label: title, url: `/${slug}` }
      ];

  const reusableContent = {
    introduction: tool.reusableContent?.introduction || template.defaultIntroduction(title),
    explanation: tool.reusableContent?.explanation || template.defaultExplanation(title),
    workedExamples: tool.reusableContent?.workedExamples || [],
    faq: tool.reusableContent?.faq && tool.reusableContent.faq.length > 0 
      ? tool.reusableContent.faq 
      : template.defaultFaqs(title),
    tips: tool.reusableContent?.tips || template.defaultTips,
    commonMistakes: tool.reusableContent?.commonMistakes || template.defaultMistakes,
    references: tool.reusableContent?.references || []
  };

  return {
    id: tool.id,
    slug,
    title,
    category: tool.category,
    categoryLabel: tool.categoryLabel || tool.category.replace("-", " "),
    description,
    keywords,
    schemaType: tool.schemaType || "WebApplication",
    formula: tool.formula,
    sitemapInclusion: tool.sitemapInclusion !== undefined ? tool.sitemapInclusion : true,
    breadcrumbs,
    relatedToolIds: tool.relatedToolIds || [],
    reusableContent
  };
}
