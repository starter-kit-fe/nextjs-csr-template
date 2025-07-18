import pkg from '../../package.json';

export const seoConfig = {
  title: pkg.seo.title,
  description: pkg.seo.description,
  keywords: pkg.seo.keywords,
  author: pkg.seo.author,
  image: pkg.seo.image,
  url: pkg.seo.url,
  siteName: pkg.name,
  twitterHandle: '@nextjs-csr-template',
};

export const generateMetadata = (
  title?: string,
  description?: string,
  image?: string,
  url?: string
) => {
  const metaTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.title;
  const metaDescription = description || seoConfig.description;
  const metaImage = image || seoConfig.image;
  const metaUrl = url || seoConfig.url;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: metaImage,
          width: 512,
          height: 512,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: seoConfig.twitterHandle,
    },
  };
};

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    description: seoConfig.description,
    url: seoConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${seoConfig.url}${seoConfig.image}`,
      width: 512,
      height: 512,
    },
    sameAs: [
      // 您可以在这里添加社交媒体链接
      // 'https://twitter.com/yoeu_healthy',
      // 'https://facebook.com/yoeu_healthy',
      // 'https://linkedin.com/company/yoeu-healthy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1000',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
