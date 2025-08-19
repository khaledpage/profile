import { contentConfig } from './config';

export interface LayoutConfig {
  metadata: {
    title: {
      default: string;
      template: string;
    };
    description: string;
    keywords: string[];
    authors: Array<{ name: string }>;
    creator: string;
    publisher: string;
    url: string;
    robots: {
      index: boolean;
      follow: boolean;
      googleBot: {
        index: boolean;
        follow: boolean;
        'max-video-preview': number;
        'max-image-preview': "large" | "standard" | "none";
        'max-snippet': number;
      };
    };
    openGraph: {
      type: string;
      locale: string;
      url: string;
      title: string;
      description: string;
      siteName: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      images: string[];
      creator: string;
    };
    verification: {
      google: string;
    };
  };
  structuredData: {
    person: any;
    professional: any;
  };
  fonts: {
    preconnect: string[];
    stylesheets: string[];
  };
  htmlLang: string;
}

export const getLayoutConfig = (): LayoutConfig => {
  const { site, personal, seo, fonts } = contentConfig;
  
  return {
    metadata: {
      title: {
        default: site.title,
        template: `%s | ${site.title}`
      },
      description: site.description,
      keywords: site.keywords,
      authors: [{ name: site.author }],
      creator: site.author,
      publisher: site.author,
      url: site.url,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: site.url,
        title: site.title,
        description: site.description,
        siteName: site.title,
        images: [
          {
            url: `${site.url}${personal.image}`,
            width: 1200,
            height: 630,
            alt: site.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: site.title,
        description: site.description,
        images: [`${site.url}${personal.image}`],
        creator: seo.social.twitter.handle,
      },
      verification: {
        google: seo.verification.google,
      },
    },
    structuredData: {
      person: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": seo.structuredData.person.name,
        "alternateName": seo.structuredData.person.alternateName,
        "description": seo.structuredData.person.description,
        "url": site.url,
        "image": `${site.url}${personal.image}`,
        "sameAs": [
          seo.social.github,
          seo.social.linkedin
        ],
        "jobTitle": seo.structuredData.person.jobTitle,
        "worksFor": {
          "@type": seo.structuredData.person.worksFor.type,
          "name": seo.structuredData.person.worksFor.name
        },
        "address": {
          "@type": seo.structuredData.person.address.type,
          "addressCountry": seo.structuredData.person.address.addressCountry
        },
        "email": personal.email,
        "knowsAbout": seo.structuredData.person.knowsAbout
      },
      professional: {
        "@context": "https://schema.org/",
        "@type": "Person",
        "name": seo.structuredData.professional.name,
        "jobTitle": seo.structuredData.professional.jobTitle,
        "description": seo.structuredData.professional.description,
        "url": site.url,
        "image": `${site.url}${personal.image}`,
        "sameAs": [
          seo.social.github,
          seo.social.linkedin,
          `https://twitter.com/${seo.social.twitter.handle.replace('@', '')}`
        ],
        "worksFor": {
          "@type": seo.structuredData.professional.worksFor.type,
          "name": seo.structuredData.professional.worksFor.name
        },
        "knowsAbout": seo.structuredData.professional.knowsAbout,
        "address": {
          "@type": seo.structuredData.person.address.type,
          "addressCountry": seo.structuredData.person.address.addressCountry
        }
      }
    },
    fonts: {
      preconnect: fonts.preconnect,
      stylesheets: fonts.stylesheets
    },
    htmlLang: 'en'
  };
};

export default getLayoutConfig;
