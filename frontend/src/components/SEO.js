import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '../utils/seo';

const SEO = ({ data = {}, schema }) => {
  const metaTags = generateMetaTags(data);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      {metaTags.keywords && (
        <meta name="keywords" content={metaTags.keywords.join(', ')} />
      )}
      <meta name="author" content={metaTags.author} />
      <link rel="canonical" href={metaTags.url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={metaTags.type} />
      <meta property="og:title" content={metaTags.title} />
      <meta property="og:description" content={metaTags.description} />
      <meta property="og:image" content={metaTags.image} />
      <meta property="og:url" content={metaTags.url} />
      <meta property="og:site_name" content={process.env.REACT_APP_SITE_NAME || 'IA Blog'} />

      {metaTags.publishedTime && (
        <meta property="article:published_time" content={metaTags.publishedTime} />
      )}
      {metaTags.modifiedTime && (
        <meta property="article:modified_time" content={metaTags.modifiedTime} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTags.title} />
      <meta name="twitter:description" content={metaTags.description} />
      <meta name="twitter:image" content={metaTags.image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">{schema}</script>
      )}
    </Helmet>
  );
};

export default SEO;
