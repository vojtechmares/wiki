export function articleJsonLd({
  title,
  description,
  pubDate,
  updatedDate,
  url,
}: {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  url: string;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate || pubDate).toISOString(),
    url,
  });
}

export function websiteJsonLd({ url, name }: { url: string; name: string }) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  });
}
