module.exports = {
  page: "home",
  published: true,
  version: 1,
  updatedBy: "system",
  navigation: [
    { name: "Home", href: "/", icon: "home" },
    { name: "About", href: "/about", icon: "info" },
    { name: "Research", href: "/research", icon: "science" },
    { name: "Contact", href: "/contact", icon: "mail" }
  ],
  hero: {
    announcementBadge: "New Report",
    announcementText: "Read our latest insights on carbon markets",
    headline: "Advancing Policy for",
    highlightedText: "Sustainable Landscapes",
    subtext: "We bridge the gap between global environmental policy and local conservation practice through rigorous research, strategic advisory, and actionable intelligence.",
    primaryButtonText: "Explore Our Work",
    secondaryButtonText: "Contact Us",
    features: ["Research", "Advisory", "Implementation"],
    backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format"
  },
  about: {
    badge: "About LIS",
    title: "Think Tank for a Sustainable Future",
    description1: "Landscapes Integrity Solutions (LIS) is an independent think tank dedicated to advancing policy and governance for sustainable landscapes. We combine cutting-edge research with practical implementation strategies to address complex environmental challenges.",
    description2: "Our multidisciplinary team of scientists, policy experts, and development practitioners works across sectors to deliver evidence-based solutions that balance ecological integrity with human well-being.",
    stats: [
      { number: "12+", label: "Countries" },
      { number: "35", label: "Publications" },
      { number: "50+", label: "Partners" }
    ],
    features: [
      { icon: "verified", title: "Evidence-based", description: "Rigorous research underpins all our work." },
      { icon: "groups", title: "Collaborative", description: "We partner with governments, NGOs, and private sector." },
      { icon: "public", title: "Global Reach", description: "Projects across Africa, Asia, and Latin America." },
      { icon: "eco", title: "Sustainability Focus", description: "Long-term solutions for people and nature." }
    ],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format"
  },
  areas: [
    {
      icon: "forest",
      title: "Forest Governance",
      description: "Strengthening policies and institutions for sustainable forest management and deforestation-free supply chains.",
      link: "/research"
    },
    {
      icon: "water",
      title: "Water Security",
      description: "Integrated water resource management, watershed restoration, and climate-resilient water governance.",
      link: "/research"
    },
    {
      icon: "agriculture",
      title: "Sustainable Agriculture",
      description: "Promoting regenerative practices, agroecology, and market-based incentives for smallholders.",
      link: "/research"
    },
    {
      icon: "carbon",
      title: "Carbon & Climate",
      description: "Advising on carbon markets, NDC implementation, and nature-based climate solutions.",
      link: "/research"
    }
  ],
  partners: {
    badge: "Our Network",
    title: "Trusted by Leading Organizations",
    description: "We collaborate with a diverse range of partners to scale impact and drive systemic change.",
    categories: [
      "International NGOs",
      "Government Agencies",
      "Private Sector",
      "Research Institutions"
    ],
    logos: [
      { icon: "public", name: "UNDP", logo: "" },
      { icon: "eco", name: "WWF", logo: "" },
      { icon: "forest", name: "Rainforest Alliance", logo: "" },
      { icon: "science", name: "CIFOR", logo: "" },
      { icon: "corporate", name: "Unilever", logo: "" },
      { icon: "agriculture", name: "IFAD", logo: "" }
    ]
  },
  research: [
    {
      category: "Policy Brief",
      date: "Jan 2025",
      title: "Carbon Market Integrity: Lessons from Jurisdictional REDD+",
      description: "This analysis examines the challenges and opportunities for ensuring high-integrity carbon credits from forest landscapes.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format",
      isFeatured: true,
      isNew: true,
      link: "/research/carbon-market-integrity"
    },
    {
      category: "Working Paper",
      date: "Nov 2024",
      title: "Gender-Responsive Land Governance",
      description: "Exploring how inclusive land rights policies can enhance tenure security and climate resilience for women.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format",
      isFeatured: false,
      isNew: false,
      link: "/research/gender-land-governance"
    },
    {
      category: "Case Study",
      date: "Aug 2024",
      title: "Restoring Peatlands in Indonesia: A Multi-Stakeholder Approach",
      description: "A deep dive into successful peatland restoration initiatives that combine community engagement with policy innovation.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format",
      isFeatured: false,
      isNew: false,
      link: "/research/peatland-restoration"
    }
  ],
  advisory: [
    {
      icon: "analytics",
      title: "Strategic Intelligence",
      description: "Tailored analysis of policy landscapes, market trends, and regulatory shifts."
    },
    {
      icon: "handshake",
      title: "Multi-Stakeholder Engagement",
      description: "Facilitation of dialogues and partnerships across government, business, and civil society."
    },
    {
      icon: "assessment",
      title: "Impact Evaluation",
      description: "Rigorous assessment of programs and policies using quantitative and qualitative methods."
    },
    {
      icon: "school",
      title: "Capacity Building",
      description: "Customized training and technical assistance for institutions and practitioners."
    }
  ],
  testimonials: [
    {
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Dr. Jane Mwangi",
      handle: "Director, Ministry of Environment, Kenya",
      date: "March 2025",
      quote: "LIS provided critical insights that shaped our national climate action plan. Their team's expertise and dedication are unparalleled."
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Carlos Rodriguez",
      handle: "Sustainability Lead, Global Forestry Corp",
      date: "December 2024",
      quote: "The advisory services from LIS helped us navigate complex regulatory environments and achieve our deforestation-free commitments."
    },
    {
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "Dr. Amara Singh",
      handle: "Research Fellow, World Resources Institute",
      date: "October 2024",
      quote: "LIS's research on jurisdictional approaches is a game-changer. Their rigorous methodology and policy relevance are exceptional."
    }
  ],
  contact: {
    sectionTitle: {
      text1: "Get in Touch",
      text2: "Let's Collaborate",
      text3: "We are always eager to connect with partners, researchers, and change-makers."
    },
    form: {
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Tell us about your inquiry or project...",
      submitText: "Send Message"
    }
  },
  cta: {
    title: "Ready to drive sustainable change?",
    description: "Join dozens of organizations leveraging LIS intelligence to achieve measurable landscape impact.",
    primaryButtonText: "Request an Advisory",
    secondaryButtonText: "Contact Our Team"
  },
  footer: {
    description: "Landscapes Integrity Solutions (LIS) is an independent think tank advancing policy for sustainable landscapes. We translate complex environmental data into actionable governance frameworks.",
    socialLinks: [
      { icon: "linkedin", href: "https://linkedin.com/company/lis" },
      { icon: "twitter", href: "https://twitter.com/lis_thinktank" },
      { icon: "mail", href: "mailto:info@lis.org" }
    ],
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Research", href: "/research" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" }
    ],
    contact: {
      address: "123 Earth Avenue, Nairobi, Kenya",
      email: "info@lis.org",
      phone: "+254 20 123 4567"
    },
    copyright: "© 2026 Landscapes Integrity Solutions (LIS). All Rights Reserved.",
    legalLinks: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Accessibility", href: "/accessibility" }
    ]
  }
};