import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, canonicalUrl }) => {
  return (
    <Helmet>
      <meta name="application-name" content="בהלכה ובאגדה" />
      <meta name="author" content="בהלכה ובאגדה" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="robots" content="index, follow" />

    </Helmet>
  );
};

export default SEO;