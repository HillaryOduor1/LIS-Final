// Auto-generated from backend API for tenant: landscapes_integrity_solutions
// Generated at: 2026-06-02T06:43:05.911Z
// DO NOT EDIT MANUALLY – regenerate with `npm run generate:content`

export interface SiteContent {
  navigation: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
  hero: {
    announcementBadge: string;
    headline: string;
    subtext: string;
    backgroundImage: string;
  };
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    stats: Array<{
      number: string;
      label: string;
    }>;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    image: string;
  };
  areas: Array<{
    icon: string;
    title: string;
    description: string;
    link: string;
  }>;
  partners: {
    badge: string;
    title: string;
    description: string;
    categories: Array<string>;
    logos: Array<{
      icon: string;
      name: string;
      logo: string;
    }>;
  };
  research: Array<{
    category: string;
    date: string;
    title: string;
    description: string;
    image: string;
    isFeatured: boolean;
    link: string;
  }>;
  advisory: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  pricing: any[];
  testimonials: Array<{
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
  }>;
  contact: {
    sectionTitle: {
      text1: string;
      text2: string;
      text3: string;
    };
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitText: string;
    };
  };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
  };
  termsOfUse: {
    title: string;
    effectiveDate: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    contactEmail: string;
  };
  accessibility: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
  };
  metadata: {
    keywords: any[];
  };
}
