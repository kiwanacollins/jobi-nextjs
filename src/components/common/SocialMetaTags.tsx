import React from 'react';

// Optional helper to inject OG/Twitter tags manually when needed
// Prefer Next.js generateMetadata where possible. Use this when a component
// needs to push additional tags based on runtime data.
export interface SocialMetaProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

const SocialMetaTags = ({ title, description, url, image, imageAlt }: SocialMetaProps) => {
  return (
    <>
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content="article" />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:width" content="1200" /> : null}
      {image ? <meta property="og:image:height" content="630" /> : null}
      {imageAlt ? <meta property="og:image:alt" content={imageAlt} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
    </>
  );
};

export default SocialMetaTags;
