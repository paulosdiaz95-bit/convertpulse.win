import { useEffect, useState } from "react";
import { generateSEOData, SEOMetadata } from "./seoEngine";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { UNIT_CATEGORIES } from "./unitsData";

/**
 * Custom hook to manage dynamic SEO metadata, meta tags, and JSON-LD structured data.
 */
export function useSEO(
  category: string,
  fromUnitId: string,
  toUnitId: string,
  activeCustomTool: string | null,
  inputValue: number
): SEOMetadata | null {
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);

  useEffect(() => {
    let toolObj: any = null;
    
    // 1. Determine the active tool object
    if (activeCustomTool) {
      toolObj = getToolBySlug(activeCustomTool);
    } else {
      const slug = `${category}/${fromUnitId}-to-${toUnitId}`;
      toolObj = getToolBySlug(slug);
      
      // Fallback for category-level routing
      if (!toolObj) {
        const catObj = UNIT_CATEGORIES.find(c => c.id === category);
        toolObj = {
          id: category,
          slug: `?cat=${category}`,
          title: `${catObj?.name || "Unit"} Conversion Calculator`,
          category: "unit-converters",
          categoryLabel: `${catObj?.name || "Unit"} Converters`,
          description: `Convert ${catObj?.name || "unit"} units seamlessly. Includes formulas, live step-by-step math explanations, and interactive reference tables.`,
          sitemapInclusion: false
        };
      }
    }

    if (!toolObj) return;

    // 2. Generate comprehensive SEO dataset
    const seo = generateSEOData(toolObj, getAllTools(), inputValue);

    // 3. Update Document Title
    document.title = seo.title;

    // 4. Helper to set/update meta tags
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        const matches = selector.match(/meta\[(name|property)="([^"]+)"/);
        if (matches) {
          element = document.createElement("meta") as HTMLMetaElement;
          if (matches[1] === "name") {
            element.setAttribute("name", matches[2]);
          } else {
            element.setAttribute("property", matches[2]);
          }
          document.head.appendChild(element);
        }
      }
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    // 5. Helper to set/update canonical link
    const setCanonicalLink = (url: string) => {
      let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", url);
    };

    // Apply standard meta tags
    setMetaTag('meta[name="description"]', 'content', seo.description);
    setCanonicalLink(seo.canonicalUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'content', seo.openGraph.title);
    setMetaTag('meta[property="og:description"]', 'content', seo.openGraph.description);
    setMetaTag('meta[property="og:url"]', 'content', seo.openGraph.url);
    setMetaTag('meta[property="og:type"]', 'content', seo.openGraph.type);
    setMetaTag('meta[property="og:image"]', 'content', seo.openGraph.image);

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'content', seo.twitter.card);
    setMetaTag('meta[name="twitter:title"]', 'content', seo.twitter.title);
    setMetaTag('meta[name="twitter:description"]', 'content', seo.twitter.description);
    setMetaTag('meta[name="twitter:image"]', 'content', seo.twitter.image);

    // 6. Inject/Update JSON-LD Script tag for Structured Data
    let ldScript = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "jsonld-schema";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.text = JSON.stringify(seo.jsonLd, null, 2);

    // 7. Expose SEO data to the component for UI rendering (Breadcrumbs, Related Tools)
    setSeoData(seo);

  }, [category, fromUnitId, toUnitId, activeCustomTool, inputValue]);

  return seoData;
}
