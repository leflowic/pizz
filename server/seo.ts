/**
 * Server-side SEO meta tags and structured data generator
 * Injects route-specific meta tags into HTML for better bot crawling
 */

interface RouteMetaTags {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  structuredData: object;
}

const restaurantStructuredData = {
  "@type": "Restaurant",
  "name": "La Tavernetta",
  "image": "https://latavernetta.rs/logo.png",
  "@id": "https://latavernetta.rs/#restaurant",
  "url": "https://latavernetta.rs",
  "telephone": "+381112405320",
  "priceRange": "$$",
  "servesCuisine": ["Italian", "Pizza"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dimitrija Tucovića 119",
    "addressLocality": "Beograd",
    "addressRegion": "Zvezdara",
    "postalCode": "11050",
    "addressCountry": "RS"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 44.80163611164573,
    "longitude": 20.493545890830816
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "00:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday", "Saturday"],
      "opens": "09:00",
      "closes": "01:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "12:00",
      "closes": "00:00"
    }
  ],
  "description": "Autentična italijanska pizzeria u srcu Beograda. Najbolje tradicionalne pizze i pasta napravljene sa strašću."
};

const websiteStructuredData = {
  "@type": "WebSite",
  "name": "La Tavernetta",
  "url": "https://latavernetta.rs",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://latavernetta.rs/jelovnik?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const videoStructuredData = {
  "@type": "VideoObject",
  "name": "La Tavernetta - Naša Kuhinja u Akciji",
  "description": "Pogledajte kako naši majstori kreiraju autentične italijanske specijalitete sa strašću i preciznom tehnikom",
  "thumbnailUrl": "https://img.youtube.com/vi/WYLNX6DImTo/maxresdefault.jpg",
  "uploadDate": "2024-01-01T00:00:00Z",
  "contentUrl": "https://www.youtube.com/watch?v=WYLNX6DImTo",
  "embedUrl": "https://www.youtube.com/embed/WYLNX6DImTo",
  "publisher": {
    "@type": "Restaurant",
    "@id": "https://latavernetta.rs/#restaurant"
  }
};

const localBusinessStructuredData = {
  "@type": "LocalBusiness",
  "@id": "https://latavernetta.rs/#localbusiness",
  "name": "La Tavernetta",
  "image": "https://latavernetta.rs/logo.png",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dimitrija Tucovića 119",
    "addressLocality": "Beograd",
    "addressRegion": "Zvezdara",
    "postalCode": "11000",
    "addressCountry": "RS"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "44.80163611164573",
    "longitude": "20.493545890830816"
  },
  "url": "https://latavernetta.rs",
  "telephone": "+381112405320",
  "servesCuisine": "Italian",
  "acceptsReservations": "True",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "23:00"
    }
  ]
};

const menuStructuredData = {
  "@type": "Menu",
  "@id": "https://latavernetta.rs/jelovnik#menu",
  "name": "La Tavernetta Meni",
  "description": "Kompletan meni sa pizzama, pastama, desertima i pićima",
  "inLanguage": "sr-RS",
  "hasMenuSection": [
    {
      "@type": "MenuSection",
      "name": "Pizza",
      "description": "Autentične italijanske pizze na tankom i hrskavom testu",
      "hasMenuItem": [
        {
          "@type": "MenuItem",
          "name": "Margherita",
          "description": "Klasična pizza sa paradajz sosom, mocarelom i bosiljkom",
          "offers": {
            "@type": "Offer",
            "price": "750",
            "priceCurrency": "RSD"
          }
        },
        {
          "@type": "MenuItem",
          "name": "Capricciosa",
          "description": "Pizza sa šunkom, pečurkama i artičokama",
          "offers": {
            "@type": "Offer",
            "price": "890",
            "priceCurrency": "RSD"
          }
        },
        {
          "@type": "MenuItem",
          "name": "Quattro Formaggi",
          "description": "Pizza sa četiri vrste sira",
          "offers": {
            "@type": "Offer",
            "price": "920",
            "priceCurrency": "RSD"
          }
        }
      ]
    },
    {
      "@type": "MenuSection",
      "name": "Pasta",
      "description": "Sveže paste po autentičnim italijanskim receptima",
      "hasMenuItem": [
        {
          "@type": "MenuItem",
          "name": "Carbonara",
          "description": "Klasična pasta carbonara sa guančaleom i pečorino sirom",
          "offers": {
            "@type": "Offer",
            "price": "650",
            "priceCurrency": "RSD"
          }
        },
        {
          "@type": "MenuItem",
          "name": "Bolognese",
          "description": "Pasta sa mesniragu sosom",
          "offers": {
            "@type": "Offer",
            "price": "620",
            "priceCurrency": "RSD"
          }
        }
      ]
    }
  ]
};

// Route-specific meta tags configuration
const routeMetaConfig: Record<string, RouteMetaTags> = {
  "/": {
    title: "La Tavernetta - Autentična Italijanska Kuhinja | Pizza & Pasta Beograd",
    description: "Najbolja pizza i pasta u Beogradu! Autentična italijanska kuhinja, sveži sastojci, hrskavo testo. Dostava na kućnu adresu. Dimitrija Tucovića 119, Zvezdara. ☎ 011 240 5320",
    keywords: "latavernetta, picerija beograd, pizza beograd, italijanski restoran beograd, pasta beograd, dostava hrane, pizza zvezdara, italijanska kuhinja, la tavernetta, autentična pizza, hrskavo testo",
    canonical: "https://latavernetta.rs/",
    ogTitle: "La Tavernetta | Autentična Italijanska Pizzeria Beograd",
    ogDescription: "Najbolja autentična italijanska pizzeria u Beogradu. Doživite prave italijanske pizze, paste i deserti. Dostava i rezervacije.",
    ogImage: "https://latavernetta.rs/logo.png",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        restaurantStructuredData,
        websiteStructuredData,
        videoStructuredData,
        localBusinessStructuredData
      ]
    }
  },
  "/jelovnik": {
    title: "Jelovnik - Pizza, Pasta, Salate | La Tavernetta Beograd",
    description: "Kompletan jelovnik La Tavernetta restorana: autentične italijanske pizze (32cm, 42cm, 50cm), paste, salate, deserti, pića. Pregledajte cene i naručite online. Dimitrija Tucovića 119.",
    keywords: "latavernetta, picerija beograd, jelovnik beograd, pizza cene, pasta cene, italijanski restoran meni, la tavernetta jelovnik, dostava pizza, online naručivanje",
    canonical: "https://latavernetta.rs/jelovnik",
    ogTitle: "Jelovnik - Pizza, Pasta, Salate | La Tavernetta Beograd",
    ogDescription: "Kompletan jelovnik La Tavernetta restorana: autentične italijanske pizze, paste, salate, deserti. Pogledajte sve naše specijalitete i cene.",
    ogImage: "https://latavernetta.rs/pizzas/margherita.png",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        restaurantStructuredData,
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Početna",
              "item": "https://latavernetta.rs"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Jelovnik",
              "item": "https://latavernetta.rs/jelovnik"
            }
          ]
        },
        menuStructuredData
      ]
    }
  }
};

/**
 * Get meta tags for a specific route
 */
export function getMetaTagsForRoute(path: string): RouteMetaTags {
  // Normalize path (remove trailing slash except for root)
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  
  // Return route-specific meta tags or default to homepage
  return routeMetaConfig[normalizedPath] || routeMetaConfig["/"];
}

/**
 * Inject meta tags into HTML template
 */
export function injectMetaTags(html: string, path: string): string {
  const meta = getMetaTagsForRoute(path);
  
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`
  );
  
  // Replace or add meta description
  html = html.replace(
    /<meta name="description" content=".*?".*?>/,
    `<meta name="description" content="${meta.description}" />`
  );
  
  // Replace or add meta keywords
  html = html.replace(
    /<meta name="keywords" content=".*?".*?>/,
    `<meta name="keywords" content="${meta.keywords}" />`
  );
  
  // Replace canonical URL
  html = html.replace(
    /<link rel="canonical" href=".*?".*?>/,
    `<link rel="canonical" href="${meta.canonical}" />`
  );
  
  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:title" content=".*?".*?>/,
    `<meta property="og:title" content="${meta.ogTitle}" />`
  );
  
  html = html.replace(
    /<meta property="og:description" content=".*?".*?>/,
    `<meta property="og:description" content="${meta.ogDescription}" />`
  );
  
  html = html.replace(
    /<meta property="og:url" content=".*?".*?>/,
    `<meta property="og:url" content="${meta.canonical}" />`
  );
  
  html = html.replace(
    /<meta property="og:image" content=".*?".*?>/,
    `<meta property="og:image" content="${meta.ogImage}" />`
  );
  
  // Replace Twitter card tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?".*?>/,
    `<meta name="twitter:title" content="${meta.ogTitle}" />`
  );
  
  html = html.replace(
    /<meta name="twitter:description" content=".*?".*?>/,
    `<meta name="twitter:description" content="${meta.ogDescription}" />`
  );
  
  html = html.replace(
    /<meta name="twitter:image" content=".*?".*?>/,
    `<meta name="twitter:image" content="${meta.ogImage}" />`
  );
  
  // Replace structured data (find and replace the first JSON-LD script)
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n    ${JSON.stringify(meta.structuredData, null, 2).replace(/\n/g, '\n    ')}\n    </script>`
  );
  
  return html;
}
