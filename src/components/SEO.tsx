import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  schema?: Record<string, any>;
}

export default function SEO({ title, description, keywords, schema }: SEOProps) {
  const fullTitle = `${title} | Precision Dental Services`;
  
  // Default LocalBusiness Schema if none provided
  // This is critical for AEO / GEO so AI bots know exactly who, where, and what the business is.
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "DentalLaboratory",
    "name": "Precision Dental Services",

    "description": description,
    "url": "https://precisiondental.ie",
    "telephone": "+353871887583",
    "email": "info@precisiondental.ie",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "37 Glaslough Street",
      "addressLocality": "Monaghan",
      "addressRegion": "Co. Monaghan",
      "postalCode": "H18 A096",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "54.2492", // Approximate lat/lng for Monaghan
      "longitude": "-6.9683"
    },
    "areaServed": "Ireland",
    "priceRange": "€€",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    }
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Social Media Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://precisiondental.ie" />
      <meta property="og:site_name" content="Precision Dental Services" />
      
      {/* JSON-LD for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
