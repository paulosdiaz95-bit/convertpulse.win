import { useEffect, useRef } from "react";
import { generateSEOData } from "./seoEngine";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { UNIT_CATEGORIES } from "./unitsData";

interface UseSEOOptions {
  category?: string;
  fromUnitId?: string;
  toUnitId?: string;
  customToolId?: string | null;
  inputValue?: number;
}

export function useSEO({
  category,
  fromUnitId,
  toUnitId,
  customToolId,
  inputValue = 1,
}: UseSEOOptions) {
  // Keep track of the last injected JSON-LD to avoid duplicates
  const jsonLdRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Determine which tool object to use
    let toolObj: any = null;

    if (customToolId) {
      toolObj = getToolBySlug(customToolId);
    } else if (category && fromUnitId && toUnitId) {
      const slug = `${category}/${fromUnitId}-to-${toUnitId}`;
      toolObj = getToolBySlug(slug);

      if (!toolObj) {
        // Fallback for category when no exact pairwise tool exists
        const catObj = UNIT_CATEGORIES.find(c => c.id === category);
        toolObj = {
          id: category,
          slug: `?cat=${category}`,
          title: `${catObj?.name || "Unit"} Conversion Calculator`,
          category: "unit-converters",
          categoryLabel: `${catObj?.name || "Unit"} Converters`,
          description: `Convert ${catObj?.name || "unit"} units seamlessly. Includes formulas, live step-by-step math explanations, and interactive reference tables.`,
          sitemapInclusion: false,
          breadcrumbs: [
            { label: "Home", url: "/" },
            { label: catObj?.name || "Unit", url: `/?cat=${category}` }
          ]
        };
      }
    } else {
      // Default fallback
      toolObj = {
        id: "home",
        slug: "/",
        title: "Universal Converter - Free Online Unit & Tool Platform",
        category: "unit-converters",
        categoryLabel: "Converters",
        description: "Convert units instantly with high precision. Includes length, weight, temperature, speed, and more. Also features calculators, finance tools, and developer utilities.",
        sitemapInclusion: true,
        breadcrumbs: [{ label: "Home", url: "/" }]
      };
    }

    if (!toolObj) return;

    // Generate comprehensive SEO data
    const allTools = getAllTools();
    const seo = generateSEOData(toolObj, allTools, inputValue);

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Helper to set or create meta tags
    const setMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLElement | null;
      if (!element) {
        const matches = selector.match(/meta\[(name|property)="([^"]+)"/);
        if (matches) {
          element = document.createElement("meta");
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

    // 3. Helper to set canonical link
    const setCanonicalLink = (url: string) => {
      let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", url);
    };

    // 4. Update all meta tags
    setMetaTag('meta[name="description"]', "content", seo.description);

    // Open Graph
    setMetaTag('meta[property="og:title"]', "content", seo.openGraph.title);
    setMetaTag('meta[property="og:description"]', "content", seo.openGraph.description);
    setMetaTag('meta[property="og:url"]', "content", seo.openGraph.url);
    setMetaTag('meta[property="og:type"]', "content", seo.openGraph.type);
    setMetaTag('meta[property="og:image"]', "content", seo.openGraph.image);
    setMetaTag('meta[property="og:site_name"]', "content", seo.openGraph.siteName);

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', "content", seo.twitter.card);
    setMetaTag('meta[name="twitter:title"]', "content", seo.twitter.title);
    setMetaTag('meta[name="twitter:description"]', "content", seo.twitter.description);
    setMetaTag('meta[name="twitter:image"]', "content", seo.twitter.image);

    // 5. Update canonical URL
    setCanonicalLink(seo.canonicalUrl);

    // 6. Update JSON-LD Schema (replace or create)
    if (seo.jsonLd && seo.jsonLd.length > 0) {
      // Remove existing JSON-LD script if it exists
      if (jsonLdRef.current && jsonLdRef.current.parentNode) {
        jsonLdRef.current.parentNode.removeChild(jsonLdRef.current);
      }

      // Create new script element for JSON-LD
      const ldScript = document.createElement("script");
      ldScript.id = "jsonld-schema";
      ldScript.type = "application/ld+json";
      ldScript.text = JSON.stringify(seo.jsonLd, null, 2);
      document.head.appendChild(ldScript);
      
      // Store reference for cleanup
      jsonLdRef.current = ldScript;
    }

    // 7. Optional: Add keywords meta tag (though less important for SEO now)
    if (seo.keywords && seo.keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', "content", seo.keywords.join(", "));
    }

    // Cleanup function to remove JSON-LD on unmount
    return () => {
      if (jsonLdRef.current && jsonLdRef.current.parentNode) {
        jsonLdRef.current.parentNode.removeChild(jsonLdRef.current);
        jsonLdRef.current = null;
      }
    };
  }, [category, fromUnitId, toUnitId, customToolId, inputValue]);

  // Return nothing - the hook is purely for side effects
}
