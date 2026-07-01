import { useEffect, useState } from "react";
import { generateSEOData, SEOMetadata } from "./seoEngine";
import { getToolBySlug, getAllTools } from "./toolRegistry";
import { UNIT_CATEGORIES } from "./unitsData";

/**
 * Dynamic SEO hook
 * - Updates title
 * - Updates meta tags
 * - Updates canonical URL
 * - Updates Open Graph
 * - Updates Twitter Card
 * - Injects JSON-LD structured data
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

    // Determine active tool
    if (activeCustomTool) {
      toolObj = getToolBySlug(activeCustomTool);
    } else {
      const slug = `${category}/${fromUnitId}-to-${toUnitId}`;
      toolObj = getToolBySlug(slug);

      // Fallback for category landing pages
      if (!toolObj) {
        const catObj = UNIT_CATEGORIES.find((c) => c.id === category);

        toolObj = {
          id: category,

          // ✅ FIXED
          // Old:
          // slug: `?cat=${category}`,
          //
          // New:
          slug: category,

          title: `${catObj?.name || "Unit"} Conversion Calculator`,
          category: "unit-converters",
          categoryLabel: `${catObj?.name || "Unit"} Converters",
          description:
            `Convert ${catObj?.name || "unit"} units instantly with high precision. Includes formulas, live calculations, step-by-step explanations, and reference tables.`,
          sitemapInclusion: false
        };
      }
    }

    if (!toolObj) return;

    // Generate SEO metadata
    const seo = generateSEOData(toolObj, getAllTools(), inputValue);

    // Update page title
    document.title = seo.title;

    /**
     * Helper: Create or update meta tags
     */
    const setMetaTag = (
      selector: string,
      attribute: string,
      value: string
    ) => {
      let element = document.head.querySelector(
        selector
      ) as HTMLMetaElement | null;

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

    /**
     * Helper: Create or update canonical tag
     */
    const setCanonicalLink = (url: string) => {
      let element = document.head.querySelector(
        "link[rel='canonical']"
      ) as HTMLLinkElement | null;

      if (!element) {
        element = document.createElement("link");
        element.rel = "canonical";
        document.head.appendChild(element);
      }

      element.href = url;
    };

    // Primary SEO
    setMetaTag("meta[name='description']", "content", seo.description);
    setCanonicalLink(seo.canonicalUrl);

    // Open Graph
    setMetaTag("meta[property='og:title']", "content", seo.openGraph.title);
    setMetaTag(
      "meta[property='og:description']",
      "content",
      seo.openGraph.description
    );
    setMetaTag("meta[property='og:url']", "content", seo.openGraph.url);
    setMetaTag("meta[property='og:type']", "content", seo.openGraph.type);
    setMetaTag("meta[property='og:image']", "content", seo.openGraph.image);

    // Twitter
    setMetaTag("meta[name='twitter:card']", "content", seo.twitter.card);
    setMetaTag("meta[name='twitter:title']", "content", seo.twitter.title);
    setMetaTag(
      "meta[name='twitter:description']",
      "content",
      seo.twitter.description
    );
    setMetaTag(
      "meta[name='twitter:image']",
      "content",
      seo.twitter.image
    );

    // JSON-LD
    let ldScript = document.getElementById(
      "jsonld-schema"
    ) as HTMLScriptElement | null;

    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "jsonld-schema";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }

    ldScript.textContent = JSON.stringify(seo.jsonLd, null, 2);

    // Expose SEO data
    setSeoData(seo);
  }, [category, fromUnitId, toUnitId, activeCustomTool, inputValue]);

  return seoData;
}
