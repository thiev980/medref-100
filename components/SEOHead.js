import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medref-ch.vercel.app';

export default function SEOHead({ title, description, path = '/', type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} – MedRef CH` : 'MedRef CH – Medizinische Referenz Schweiz & Europa';
  const fullUrl = `${SITE_URL}${path}`;
  const desc = description || 'Interaktive medizinische Referenz: Die 100 häufigsten Beschwerden in der Schweiz mit Medikamenten, Wirkstoffen, Dosierungen und Behandlungsmethoden.';

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="MedRef CH" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
