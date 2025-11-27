// Structured Data (JSON-LD) for SEO

export const restaurantStructuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://latavernetta.rs/#restaurant",
  "name": "La Tavernetta",
  "description": "Autentična italijanska kuhinja u srcu Beograda. Doživite najbrže i najsvežije ukuse tradicionalne pizze.",
  "image": "https://latavernetta.rs/logo.png",
  "url": "https://latavernetta.rs",
  "telephone": "+381112405320",
  "email": "info@latavernetta.rs",
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
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "23:00"
    }
  ],
  "servesCuisine": ["Italian", "Pizza", "Pasta"],
  "priceRange": "$$",
  "acceptsReservations": "True",
  "menu": "https://latavernetta.rs/jelovnik",
  "sameAs": [
    "https://www.facebook.com/latavernetta",
    "https://www.instagram.com/latavernetta"
  ]
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://latavernetta.rs/#website",
  "url": "https://latavernetta.rs",
  "name": "La Tavernetta - Autentična Italijanska Kuhinja",
  "description": "La Tavernetta - najbolja pizza i pasta u Beogradu. Autentični italijanski recepti, sveži sastojci, dostava na kućnu adresu.",
  "publisher": {
    "@type": "Restaurant",
    "@id": "https://latavernetta.rs/#restaurant"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://latavernetta.rs/jelovnik?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbStructuredData = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const menuStructuredData = (menuItems: any[]) => ({
  "@context": "https://schema.org",
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
      "hasMenuItem": menuItems
        .filter(item => item.category === "Pica")
        .slice(0, 10)
        .map(item => ({
          "@type": "MenuItem",
          "name": item.name,
          "description": item.description || `${item.name} - La Tavernetta specijal`,
          "image": item.imageUrl,
          "offers": {
            "@type": "Offer",
            "price": item.price || (item.sizes?.[0]?.price),
            "priceCurrency": "RSD",
            "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }))
    }
  ]
});

export const reviewStructuredData = (reviews: any[]) => {
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://latavernetta.rs/#restaurant",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.slice(0, 5).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.customerName
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.comment,
      "datePublished": review.createdAt
    }))
  };
};

export const videoStructuredData = {
  "@context": "https://schema.org",
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

export const localBusinessStructuredData = {
  "@context": "https://schema.org",
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
