// Auto-generated from backend API for tenant: landscapes_integrity_solutions
// Generated at: 2026-08-03T21:29:56.365Z
// DO NOT EDIT MANUALLY – regenerate with `npm run generate:content`

export interface SiteContent {
  navigation: Array<{
    name: string;
    href: string;
    icon: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  }>;
  hero: {
    announcementBadge: string;
    headline: string;
    subtext: string;
    backgroundImage: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    stats: Array<{
      number: string;
      label: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    features: Array<{
      icon: string;
      title: string;
      description: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    image: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  areas: Array<{
    icon: string;
    title: string;
    description: string;
    link: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
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
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  research: Array<{
    category: string;
    date: string;
    title: string;
    description: string;
    image: string;
    isFeatured: boolean;
    link: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  }>;
  advisory: Array<{
    icon: string;
    title: string;
    description: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  }>;
  pricing: any[];
  testimonials: Array<{
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  }>;
  contact: {
    sectionTitle: {
      text1: string;
      text2: string;
      text3: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    };
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitText: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    };
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  footer: {
    description: string;
    copyright: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      heading: string;
      content: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  termsOfUse: {
    title: string;
    effectiveDate: string;
    sections: Array<{
      heading: string;
      content: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    contactEmail: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  accessibility: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      heading: string;
      content: string;
      theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
    }>;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  metadata: {
    keywords: any[];
    theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
  };
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    typography?: {
      fontFamily?: string;
      headingWeight?: string;
      bodyWeight?: string;
      textScale?: number;
      textAlign?: string;
    };
    spacing?: {
      spacingUnit?: string;
      radius?: string;
      shadowIntensity?: string;
    };
  };
}
