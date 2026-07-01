import { useEffect } from "react";
import { UNIT_CATEGORIES } from "./unitsData";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { generateSEOData } from "./seoEngine";

export function useSEO(
  activeCategory: string,
  fromUnitId: string,
  toUnitId: string,
  activeCustomTool: string | null,
  inputValue: number
) {
  useEffect(() => {
    let toolObj: any = null;
    
    if (activeCustomTool) {
      toolObj = getToolBySlug(activeCustomTool);
    } else {
      const slug = `${activeCategory}/${fromUnitId}-to-${toUnitId}`;
      toolObj = getToolBySlug(slug);
      
      if (!toolObj) {
        const catObj = UNIT_CATEGORIES.find(c => c.id === activeCategory);
        toolObj = {
          id: activeCategory,
          slug: `?cat=${activeCategory}`,
          title: `${catObj?.name || "Unit"} Conversion Calculator`,
          category: "unit-converters",
          categoryLabel: `${catObj?.name || "Unit"} Converters`,
          description: `Convert ${catObj?.name || "unit"} units seamlessly. Includes formulas, live step-by-step math explanations, and interactive reference tables.`,
          sitemapInclusion: false
        };
      }
    }

    if (!toolObj) return;

    const seo = generateSEOData(toolObj, getAllTools(), inputValue);
    
    // 1. Update Title
    document.title = seo.title;

    // 2. Helper to set meta tags
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        const matches = selector.match(/meta\[(name|property)="([^"]+)"/);
        if (matches) {
          element = document.createElement("meta");
          element.setAttribute(matches[1], matches[2]);
          document.head.appendChild(element);
        }
      }
      if (element) {
        element.setAttribute(attribute, value);
      }
    };

    // 3. Helper to set canonical link
    const setCanonicalLink = (url: string) => {
      let element = document.head.querySelector("link[rel='canonical']");
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", url);
    };

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

    // 4. Update JSON-LD Script tag
    let ldScript = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "jsonld-schema";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.text = JSON.stringify(seo.jsonLd, null, 2);
    
  }, [activeCategory, fromUnitId, toUnitId, activeCustomTool, inputValue]);
}
