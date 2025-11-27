import { useEffect, useRef } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  keywords?: string;
  structuredData?: object;
}

function generateHash(obj: object): string {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export default function SEO({
  title,
  description,
  canonical = "https://latavernetta.rs",
  ogType = "website",
  ogImage = "/logo.png",
  twitterCard = "summary_large_image",
  keywords,
  structuredData,
}: SEOProps) {
  const scriptIdRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = title;

    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        if (attribute === "name") {
          element.setAttribute("name", selector.replace('meta[name="', "").replace('"]', ""));
        } else if (attribute === "property") {
          element.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMetaTag('meta[name="description"]', "name", description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', "name", keywords);
    }

    updateMetaTag('meta[property="og:title"]', "property", title);
    updateMetaTag('meta[property="og:description"]', "property", description);
    updateMetaTag('meta[property="og:type"]', "property", ogType);
    updateMetaTag('meta[property="og:url"]', "property", canonical);
    updateMetaTag('meta[property="og:image"]', "property", ogImage);
    updateMetaTag('meta[property="og:site_name"]', "property", "La Tavernetta");
    updateMetaTag('meta[property="og:locale"]', "property", "sr_RS");

    updateMetaTag('meta[name="twitter:card"]', "name", twitterCard);
    updateMetaTag('meta[name="twitter:title"]', "name", title);
    updateMetaTag('meta[name="twitter:description"]', "name", description);
    updateMetaTag('meta[name="twitter:image"]', "name", ogImage);

    let canonical_link = document.querySelector('link[rel="canonical"]');
    if (!canonical_link) {
      canonical_link = document.createElement("link");
      canonical_link.setAttribute("rel", "canonical");
      document.head.appendChild(canonical_link);
    }
    canonical_link.setAttribute("href", canonical);

    if (structuredData) {
      const uniqueId = `structured-data-${generateHash(structuredData)}`;
      scriptIdRef.current = uniqueId;

      let script = document.querySelector(`script[id="${uniqueId}"]`);
      
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("id", uniqueId);
        script.setAttribute("data-dynamic", "true");
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      } else {
        script.textContent = JSON.stringify(structuredData);
      }
    }

    return () => {
      if (scriptIdRef.current) {
        const script = document.querySelector(`script[id="${scriptIdRef.current}"]`);
        if (script) {
          script.remove();
        }
      }
    };
  }, [title, description, canonical, ogType, ogImage, twitterCard, keywords, structuredData]);

  return null;
}
