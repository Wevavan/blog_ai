export const generateMetaTags = (data = {}) => {
  const {
    title = 'IA Blog - Intelligence Artificielle et Machine Learning',
    description = 'Blog dédié à l\'intelligence artificielle, au machine learning et aux dernières innovations en IA',
    image = `${process.env.REACT_APP_SITE_URL}/default-og-image.jpg`,
    url = process.env.REACT_APP_SITE_URL,
    type = 'website',
    author = 'IA Blog Team',
    keywords = ['intelligence artificielle', 'machine learning', 'deep learning', 'IA', 'technologie'],
    publishedTime,
    modifiedTime,
  } = data;

  return {
    title,
    description,
    image,
    url,
    type,
    author,
    keywords,
    publishedTime,
    modifiedTime,
  };
};

export const generateArticleSchema = (article) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage || `${process.env.REACT_APP_SITE_URL}/default-og-image.jpg`,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.REACT_APP_SITE_NAME || 'IA Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.REACT_APP_SITE_URL}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.REACT_APP_SITE_URL}/article/${article.slug}`,
    },
  };

  return JSON.stringify(schema);
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return JSON.stringify(schema);
};

export const generateWebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.REACT_APP_SITE_NAME || 'IA Blog',
    description: process.env.REACT_APP_SITE_DESCRIPTION,
    url: process.env.REACT_APP_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.REACT_APP_SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(schema);
};
