// src/components/ContentManager.jsx
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, Check } from 'lucide-react';

const API_BASE = '/api/admin';

// ========== DEFAULT CONTENT (matches your backend seed) ==========
const DEFAULT_CONTENT = {
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
  },
  privacyPolicy: {
    title: "Privacy Policy",
    lastUpdated: "May 2026",
    sections: [
      { heading: "1. Information We Collect", content: "We may collect personal information that you voluntarily provide..." },
      { heading: "2. How We Use Your Information", content: "We use the information we collect to provide, operate, and maintain our services..." },
      { heading: "3. Cookies and Tracking Technologies", content: "We use cookies and similar tracking technologies to monitor activity..." },
      { heading: "4. Data Security", content: "We implement appropriate technical and organisational measures..." },
      { heading: "5. Third-Party Links", content: "Our website may contain links to third‑party websites..." },
      { heading: "6. Your Rights (GDPR & CCPA)", content: "Depending on your location, you may have the following rights: access, rectification, erasure..." },
      { heading: "7. Children’s Privacy", content: "Our services are not directed to individuals under the age of 16..." },
      { heading: "8. Changes to This Privacy Policy", content: "We may update this Privacy Policy from time to time..." },
      { heading: "9. Contact Us", content: "" }
    ],
    contactEmail: "privacy@lis.org",
    contactPhone: "+254 700 000 000",
    contactAddress: "Nairobi, Kenya"
  },
  termsOfUse: {
    title: "Terms of Use",
    effectiveDate: "May 2026",
    sections: [
      { heading: "1. Use of Content", content: "All content on this website is the property of LIS and is protected by copyright..." },
      { heading: "2. User Conduct", content: "You agree not to use the website for any unlawful purpose..." },
      { heading: "3. Research and Advisory Disclaimers", content: "The research reports and advisory content are for informational purposes only..." },
      { heading: "4. Third-Party Links", content: "Our website may contain links to external websites..." },
      { heading: "5. Limitation of Liability", content: "LIS shall not be liable for any indirect or consequential damages..." },
      { heading: "6. Indemnification", content: "You agree to indemnify LIS from any claims arising from your use..." },
      { heading: "7. Changes to Terms", content: "We reserve the right to modify these Terms at any time..." },
      { heading: "8. Governing Law", content: "These Terms shall be governed by the laws of Kenya." },
      { heading: "9. Contact Us", content: "If you have questions, contact us at legal@lis.org." }
    ],
    contactEmail: "legal@lis.org"
  },
  accessibility: {
    title: "Accessibility Statement",
    lastUpdated: "May 2026",
    sections: [
      { heading: "Our Commitment", content: "We are committed to ensuring digital accessibility for all users..." },
      { heading: "Conformance Status", content: "This website is partially conformant with WCAG 2.2 Level AA..." },
      { heading: "Accessibility Features You Can Use", content: "Theme toggle, neurodivergent mode, zoom up to 200%, responsive layout." },
      { heading: "Feedback and Contact", content: "" },
      { heading: "Third‑Party Content", content: "Some external content may not be fully accessible; we provide alternatives upon request." },
      { heading: "Assessment Methods", content: "We use automated tools, manual keyboard testing, and screen reader testing." },
      { heading: "Known Limitations", content: "Some older PDF reports may lack proper tagging; we are remediating them." }
    ],
    contactEmail: "accessibility@lis.org",
    contactPhone: "+254 700 000 000",
    contactAddress: "Nairobi, Kenya"
  },
  // inside DEFAULT_CONTENT, after accessibility:
theme: {
  light: {
    bg: '#f6f8f7',
    surface: '#FFFFFF',
    border: '#e7f3ed',
    text: '#0d1b14',
    muted: '#4a5a52',
    accent: '#11d473',
    primary: '#11d473',
    primaryForeground: '#0d1b14'
  },
  dark: {
    bg: '#102219',
    surface: '#1a2e22',
    border: '#2a3f32',
    text: '#FFFFFF',
    muted: '#9fb0a5',
    accent: '#11d473',
    primary: '#11d473',
    primaryForeground: '#0d1b14'
  },
  typography: {
    fontFamily: 'Public Sans, sans-serif',
    headingWeight: '700',
    bodyWeight: '400',
    textScale: 1,
    textAlign: 'left'
  },
  spacing: {
    spacingUnit: '0.5rem',
    radius: '0.75rem',
    shadowIntensity: '1'
  }
}
};

// ========== EDITOR COMPONENTS ==========
function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div className="mb-3">
      {label && <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>}
      {multiline ? (
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm resize-none bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter image URL"}
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {value && <img src={value} alt="Preview" className="mt-2 h-20 object-cover rounded" />}
    </div>
  );
}
function ColorField({ label, value, onChange }) {
  const [color, setColor] = React.useState(value || '#11d473');
  const [manual, setManual] = React.useState(value || '#11d473');

  React.useEffect(() => {
    setColor(value || '#11d473');
    setManual(value || '#11d473');
  }, [value]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    setManual(newColor);
    onChange(newColor);
  };

  const handleManualChange = (e) => {
    const newColor = e.target.value;
    setManual(newColor);
    // Validate hex format (6-digit hex with #)
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setColor(newColor);
      onChange(newColor);
    }
  };

  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-10 h-10 rounded border border-border cursor-pointer bg-surface"
          />
          <div className="absolute inset-0 pointer-events-none rounded border border-border" />
        </div>
        <input
          type="text"
          value={manual}
          onChange={handleManualChange}
          placeholder="#000000"
          className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent font-mono"
        />
      </div>
    </div>
  );
}

function HeroEditor({ hero, onChange }) {
  const safeHero = hero || {};
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safeHero.announcementBadge} onChange={(v) => onChange({ ...safeHero, announcementBadge: v })} />
      <Field label="Announcement Text" value={safeHero.announcementText} onChange={(v) => onChange({ ...safeHero, announcementText: v })} />
      <Field label="Headline Start" value={safeHero.headline} onChange={(v) => onChange({ ...safeHero, headline: v })} />
      <Field label="Highlighted Text" value={safeHero.highlightedText} onChange={(v) => onChange({ ...safeHero, highlightedText: v })} />
      <Field label="Subtext" value={safeHero.subtext} onChange={(v) => onChange({ ...safeHero, subtext: v })} multiline />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary Button" value={safeHero.primaryButtonText} onChange={(v) => onChange({ ...safeHero, primaryButtonText: v })} />
        <Field label="Secondary Button" value={safeHero.secondaryButtonText} onChange={(v) => onChange({ ...safeHero, secondaryButtonText: v })} />
      </div>
      <Field label="Features (comma separated)" value={safeHero.features?.join(', ')} onChange={(v) => onChange({ ...safeHero, features: v.split(',').map(s => s.trim()) })} />
      <ImageField label="Background Image URL" value={safeHero.backgroundImage} onChange={(v) => onChange({ ...safeHero, backgroundImage: v })} />
    </div>
  );
}

function AboutEditor({ about, onChange }) {
  const safeAbout = about || {};
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safeAbout.badge} onChange={(v) => onChange({ ...safeAbout, badge: v })} />
      <Field label="Title" value={safeAbout.title} onChange={(v) => onChange({ ...safeAbout, title: v })} />
      <Field label="Description 1" value={safeAbout.description1} onChange={(v) => onChange({ ...safeAbout, description1: v })} multiline />
      <Field label="Description 2" value={safeAbout.description2} onChange={(v) => onChange({ ...safeAbout, description2: v })} multiline />
      <ImageField label="Image URL" value={safeAbout.image} onChange={(v) => onChange({ ...safeAbout, image: v })} />
    </div>
  );
}

function AreasEditor({ areas, onChange }) {
  const safeAreas = Array.isArray(areas) ? areas : [];
  return (
    <div className="space-y-4">
      {safeAreas.map((area, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold">Area {idx+1}</h4>
            <button onClick={() => onChange(safeAreas.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Icon" value={area.icon} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, icon: v }; onChange(newAreas); }} />
          <Field label="Title" value={area.title} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, title: v }; onChange(newAreas); }} />
          <Field label="Description" value={area.description} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, description: v }; onChange(newAreas); }} multiline />
          <Field label="Link" value={area.link} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, link: v }; onChange(newAreas); }} />
        </div>
      ))}
      <button onClick={() => onChange([...safeAreas, { icon: '', title: '', description: '', link: '#' }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Area
      </button>
    </div>
  );
}

function PartnersEditor({ partners, onChange }) {
  const safe = partners || {};
  const updateLogos = (logos) => onChange({ ...safe, logos });
  const updateCategories = (cats) => onChange({ ...safe, categories: cats.split(',').map(s => s.trim()) });
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safe.badge} onChange={(v) => onChange({ ...safe, badge: v })} />
      <Field label="Title" value={safe.title} onChange={(v) => onChange({ ...safe, title: v })} />
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Categories (comma separated)" value={safe.categories?.join(', ') || ''} onChange={updateCategories} />
      <div className="border-t border-border my-4" />
      <h4 className="font-semibold">Logos</h4>
      {Array.isArray(safe.logos) && safe.logos.map((logo, idx) => (
        <div key={idx} className="border border-border p-3 rounded mb-2">
          <Field label="Icon name" value={logo.icon} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, icon: v }; updateLogos(newLogos); }} />
          <Field label="Name" value={logo.name} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, name: v }; updateLogos(newLogos); }} />
          <ImageField label="Logo URL" value={logo.logo} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, logo: v }; updateLogos(newLogos); }} />
          <button onClick={() => updateLogos(safe.logos.filter((_, i) => i !== idx))} className="text-red-500 text-sm mt-1">Remove</button>
        </div>
      ))}
      <button onClick={() => updateLogos([...safe.logos, { icon: '', name: '', logo: '' }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Logo
      </button>
    </div>
  );
}

function ResearchEditor({ research, onChange }) {
  const items = Array.isArray(research) ? research : [];
  const updateItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onChange(newItems);
  };
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-bold">Research {idx+1}</h4>
            <button onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-400"><Trash2 size={16} /></button>
          </div>
          <Field label="Category" value={item.category} onChange={(v) => updateItem(idx, 'category', v)} />
          <Field label="Date" value={item.date} onChange={(v) => updateItem(idx, 'date', v)} />
          <Field label="Title" value={item.title} onChange={(v) => updateItem(idx, 'title', v)} />
          <Field label="Description" value={item.description} onChange={(v) => updateItem(idx, 'description', v)} multiline />
          <ImageField label="Image URL" value={item.image} onChange={(v) => updateItem(idx, 'image', v)} />
          <Field label="Link slug" value={item.link} onChange={(v) => updateItem(idx, 'link', v)} />
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={item.isFeatured || false} onChange={(e) => updateItem(idx, 'isFeatured', e.target.checked)} />
              Featured
            </label>
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { category: '', date: '', title: '', description: '', image: '', link: '', isFeatured: false }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Research
      </button>
    </div>
  );
}

function CTAEditor({ cta, onChange }) {
  const safe = cta || {};
  return (
    <div className="space-y-4">
      <Field label="Title" value={safe.title} onChange={(v) => onChange({ ...safe, title: v })} />
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Primary Button Text" value={safe.primaryButtonText} onChange={(v) => onChange({ ...safe, primaryButtonText: v })} />
      <Field label="Secondary Button Text" value={safe.secondaryButtonText} onChange={(v) => onChange({ ...safe, secondaryButtonText: v })} />
    </div>
  );
}

function FooterEditor({ footer, onChange }) {
  const safe = footer || {};
  return (
    <div className="space-y-4">
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Copyright" value={safe.copyright} onChange={(v) => onChange({ ...safe, copyright: v })} />
      <div className="border-t border-border my-2" />
      <h4 className="font-semibold">Contact Info</h4>
      <Field label="Address" value={safe.contact?.address} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, address: v } })} />
      <Field label="Email" value={safe.contact?.email} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, email: v } })} />
      <Field label="Phone" value={safe.contact?.phone} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, phone: v } })} />
    </div>
  );
}

function LegalEditor({ data, onChange, title }) {
  const safeData = data || {};
  const sections = safeData.sections || [];

  const updateSection = (idx, field, value) => {
    const newSections = [...sections];
    newSections[idx] = { ...newSections[idx], [field]: value };
    onChange({ ...safeData, sections: newSections });
  };

  const addSection = () => {
    onChange({ ...safeData, sections: [...sections, { heading: '', content: '' }] });
  };

  const removeSection = (idx) => {
    onChange({ ...safeData, sections: sections.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <Field label="Title" value={safeData.title} onChange={(v) => onChange({ ...safeData, title: v })} />
      <Field label="Last Updated / Effective Date" value={safeData.lastUpdated || safeData.effectiveDate} onChange={(v) => onChange({ ...safeData, lastUpdated: v, effectiveDate: v })} />
      <div className="border-t border-border my-4" />
      <h3 className="font-semibold text-lg">Sections</h3>
      {sections.map((sec, idx) => (
        <div key={idx} className="border border-border rounded-lg p-4 relative mb-4">
          <button onClick={() => removeSection(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
          <Field label="Heading" value={sec.heading} onChange={(v) => updateSection(idx, 'heading', v)} />
          <Field label="Content" value={sec.content} onChange={(v) => updateSection(idx, 'content', v)} multiline />
        </div>
      ))}
      <button onClick={addSection} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Section
      </button>
      <div className="border-t border-border my-4" />
      <Field label="Contact Email" value={safeData.contactEmail} onChange={(v) => onChange({ ...safeData, contactEmail: v })} />
      <Field label="Contact Phone" value={safeData.contactPhone} onChange={(v) => onChange({ ...safeData, contactPhone: v })} />
      <Field label="Contact Address" value={safeData.contactAddress} onChange={(v) => onChange({ ...safeData, contactAddress: v })} />
    </div>
  );
}

// Updated ThemeEditor
function ThemeEditor({ theme, onChange }) {
  const safe = theme || { light: {}, dark: {}, typography: {}, spacing: {} };
  const updateLight = (key, val) => onChange({ ...safe, light: { ...safe.light, [key]: val } });
  const updateDark = (key, val) => onChange({ ...safe, dark: { ...safe.dark, [key]: val } });
  const updateTypo = (key, val) => onChange({ ...safe, typography: { ...safe.typography, [key]: val } });
  const updateSpacing = (key, val) => onChange({ ...safe, spacing: { ...safe.spacing, [key]: val } });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Light Mode Colors</h3>
        <ColorField label="Background" value={safe.light.bg} onChange={(v) => updateLight('bg', v)} />
        <ColorField label="Surface (cards)" value={safe.light.surface} onChange={(v) => updateLight('surface', v)} />
        <ColorField label="Border" value={safe.light.border} onChange={(v) => updateLight('border', v)} />
        <ColorField label="Text" value={safe.light.text} onChange={(v) => updateLight('text', v)} />
        <ColorField label="Muted Text" value={safe.light.muted} onChange={(v) => updateLight('muted', v)} />
        <ColorField label="Accent/Primary" value={safe.light.accent} onChange={(v) => updateLight('accent', v)} />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Dark Mode Colors</h3>
        <ColorField label="Background" value={safe.dark.bg} onChange={(v) => updateDark('bg', v)} />
        <ColorField label="Surface" value={safe.dark.surface} onChange={(v) => updateDark('surface', v)} />
        <ColorField label="Border" value={safe.dark.border} onChange={(v) => updateDark('border', v)} />
        <ColorField label="Text" value={safe.dark.text} onChange={(v) => updateDark('text', v)} />
        <ColorField label="Muted Text" value={safe.dark.muted} onChange={(v) => updateDark('muted', v)} />
        <ColorField label="Accent/Primary" value={safe.dark.accent} onChange={(v) => updateDark('accent', v)} />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Typography</h3>
        <Field label="Font Family" value={safe.typography.fontFamily} onChange={(v) => updateTypo('fontFamily', v)} />
        <Field label="Heading Weight" value={safe.typography.headingWeight} onChange={(v) => updateTypo('headingWeight', v)} />
        <Field label="Body Weight" value={safe.typography.bodyWeight} onChange={(v) => updateTypo('bodyWeight', v)} />
        <Field label="Text Scale" value={safe.typography.textScale} onChange={(v) => updateTypo('textScale', parseFloat(v) || 1)} />
        <Field label="Text Align" value={safe.typography.textAlign} onChange={(v) => updateTypo('textAlign', v)} />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Spacing & Radius</h3>
        <Field label="Spacing Unit" value={safe.spacing.spacingUnit} onChange={(v) => updateSpacing('spacingUnit', v)} />
        <Field label="Border Radius" value={safe.spacing.radius} onChange={(v) => updateSpacing('radius', v)} />
        <Field label="Shadow Intensity (0-2)" value={safe.spacing.shadowIntensity} onChange={(v) => updateSpacing('shadowIntensity', v)} />
      </div>
    </div>
  );
}

// ========== MAIN COMPONENT ==========
export default function ContentManager() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [error, setError] = useState(null);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();
      
      let homeContent = null;
      if (Array.isArray(data)) {
        homeContent = data.find(c => c.page === 'home');
      } else if (data && data.page === 'home') {
        homeContent = data;
      }
      
      if (homeContent && Object.keys(homeContent).length > 1) {
        setContent({ ...DEFAULT_CONTENT, ...homeContent });
      } else {
        setContent({ ...DEFAULT_CONTENT });
      }
    } catch (err) {
      console.error(err);
      setError('Could not load content from server, using defaults.');
      setContent({ ...DEFAULT_CONTENT });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      window.dispatchEvent(new Event("content-updated"));
      localStorage.setItem('content_last_updated', Date.now().toString());
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  // Helper text mapping
  const sectionHelperText = {
    hero: 'Edit the main hero section – badge, headline, buttons, and background image.',
    about: 'Edit the About section – badge, title, descriptions, and image.',
    areas: 'Add or edit core thematic areas – icons, titles, descriptions, and links.',
    partners: 'Manage partner logos, categories, and descriptions.',
    research: 'Create and edit research items – category, date, title, image, and link.',
    cta: 'Edit the Call‑to‑Action section – title, description, and button texts.',
    footer: 'Edit footer content – description, copyright, and contact information.',
    privacyPolicy: 'Edit the Privacy Policy – title, sections, and contact details.',
    termsOfUse: 'Edit the Terms of Use – title, sections, and contact email.',
    accessibility: 'Edit the Accessibility Statement – title, sections, and contact details.'
  };

  const getHelperText = () => {
    return sectionHelperText[activeSection] || 'Edit homepage content – changes reflect immediately on frontend.';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span className="text-muted">Loading content...</span>
      </div>
    );
  }

  if (!content) return <div className="text-center py-12">No content available</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-sm text-muted">{getHelperText()}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white transition-all ${
            saved ? 'bg-green-500' : 'bg-accent hover:bg-accent/80'
          } disabled:opacity-50`}
        >
          {saving ? <RefreshCw className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar buttons */}
        <div className="lg:col-span-3 space-y-1">
          {[
            'hero', 'about', 'areas', 'partners', 'research', 'cta','theme', 'footer',
            'privacyPolicy', 'termsOfUse', 'accessibility'
          ].map(sectionKey => {
            let displayName = sectionKey;
            if (sectionKey === 'privacyPolicy') displayName = 'Privacy Policy';
            if (sectionKey === 'termsOfUse') displayName = 'Terms of Use';
            if (sectionKey === 'accessibility') displayName = 'Accessibility';
            else displayName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            const isActive = activeSection === sectionKey;
            return (
              <button
                key={sectionKey}
                onClick={() => setActiveSection(sectionKey)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent border-l-4 border-accent shadow-sm'
                    : 'hover:bg-surface hover:shadow-sm text-text'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Editor area */}
        <div className="lg:col-span-9">
          {activeSection === 'hero' && <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />}
          {activeSection === 'about' && <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />}
          {activeSection === 'areas' && <AreasEditor areas={content.areas} onChange={(v) => updateSection('areas', v)} />}
          {activeSection === 'partners' && <PartnersEditor partners={content.partners} onChange={(v) => updateSection('partners', v)} />}
          {activeSection === 'research' && <ResearchEditor research={content.research} onChange={(v) => updateSection('research', v)} />}
          {activeSection === 'cta' && <CTAEditor cta={content.cta} onChange={(v) => updateSection('cta', v)} />}
          {activeSection === 'theme' && <ThemeEditor theme={content.theme} onChange={(v) => updateSection('theme', v)} />}
          {activeSection === 'footer' && <FooterEditor footer={content.footer} onChange={(v) => updateSection('footer', v)} />}
          {activeSection === 'privacyPolicy' && <LegalEditor data={content.privacyPolicy} onChange={(v) => updateSection('privacyPolicy', v)} />}
          {activeSection === 'termsOfUse' && <LegalEditor data={content.termsOfUse} onChange={(v) => updateSection('termsOfUse', v)} />}
          {activeSection === 'accessibility' && <LegalEditor data={content.accessibility} onChange={(v) => updateSection('accessibility', v)} />}
        </div>
      </div>
    </div>
  );
}
/*
// src/components/ContentManager.jsx
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, Check, Edit3 } from 'lucide-react';

const API_BASE = '/api/admin';

// ========== DEFAULT CONTENT (matches your backend seed) ==========
const DEFAULT_CONTENT = {
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
  },
   privacyPolicy: {
    title: "Privacy Policy",
    lastUpdated: "May 2026",
    sections: [
      { heading: "1. Information We Collect", content: "We may collect personal information that you voluntarily provide..." },
      { heading: "2. How We Use Your Information", content: "We use the information we collect to provide, operate, and maintain our services..." },
      { heading: "3. Cookies and Tracking Technologies", content: "We use cookies and similar tracking technologies to monitor activity..." },
      { heading: "4. Data Security", content: "We implement appropriate technical and organisational measures..." },
      { heading: "5. Third-Party Links", content: "Our website may contain links to third‑party websites..." },
      { heading: "6. Your Rights (GDPR & CCPA)", content: "Depending on your location, you may have the following rights: access, rectification, erasure..." },
      { heading: "7. Children’s Privacy", content: "Our services are not directed to individuals under the age of 16..." },
      { heading: "8. Changes to This Privacy Policy", content: "We may update this Privacy Policy from time to time..." },
      { heading: "9. Contact Us", content: "" }
    ],
    contactEmail: "privacy@lis.org",
    contactPhone: "+254 700 000 000",
    contactAddress: "Nairobi, Kenya"
  },
  termsOfUse: {
    title: "Terms of Use",
    effectiveDate: "May 2026",
    sections: [
      { heading: "1. Use of Content", content: "All content on this website is the property of LIS and is protected by copyright..." },
      { heading: "2. User Conduct", content: "You agree not to use the website for any unlawful purpose..." },
      { heading: "3. Research and Advisory Disclaimers", content: "The research reports and advisory content are for informational purposes only..." },
      { heading: "4. Third-Party Links", content: "Our website may contain links to external websites..." },
      { heading: "5. Limitation of Liability", content: "LIS shall not be liable for any indirect or consequential damages..." },
      { heading: "6. Indemnification", content: "You agree to indemnify LIS from any claims arising from your use..." },
      { heading: "7. Changes to Terms", content: "We reserve the right to modify these Terms at any time..." },
      { heading: "8. Governing Law", content: "These Terms shall be governed by the laws of Kenya." },
      { heading: "9. Contact Us", content: "If you have questions, contact us at legal@lis.org." }
    ],
    contactEmail: "legal@lis.org"
  },
  accessibility: {
    title: "Accessibility Statement",
    lastUpdated: "May 2026",
    sections: [
      { heading: "Our Commitment", content: "We are committed to ensuring digital accessibility for all users..." },
      { heading: "Conformance Status", content: "This website is partially conformant with WCAG 2.2 Level AA..." },
      { heading: "Accessibility Features You Can Use", content: "Theme toggle, neurodivergent mode, zoom up to 200%, responsive layout." },
      { heading: "Feedback and Contact", content: "" },
      { heading: "Third‑Party Content", content: "Some external content may not be fully accessible; we provide alternatives upon request." },
      { heading: "Assessment Methods", content: "We use automated tools, manual keyboard testing, and screen reader testing." },
      { heading: "Known Limitations", content: "Some older PDF reports may lack proper tagging; we are remediating them." }
    ],
    contactEmail: "accessibility@lis.org",
    contactPhone: "+254 700 000 000",
    contactAddress: "Nairobi, Kenya"
  }

};

// ========== EDITOR COMPONENTS ==========
function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div className="mb-3">
      {label && <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>}
      {multiline ? (
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm resize-none bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter image URL"}
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {value && <img src={value} alt="Preview" className="mt-2 h-20 object-cover rounded" />}
    </div>
  );
}

function HeroEditor({ hero, onChange }) {
  // Ensure hero is an object to prevent crashes
  const safeHero = hero || {};
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safeHero.announcementBadge} onChange={(v) => onChange({ ...safeHero, announcementBadge: v })} />
      <Field label="Announcement Text" value={safeHero.announcementText} onChange={(v) => onChange({ ...safeHero, announcementText: v })} />
      <Field label="Headline Start" value={safeHero.headline} onChange={(v) => onChange({ ...safeHero, headline: v })} />
      <Field label="Highlighted Text" value={safeHero.highlightedText} onChange={(v) => onChange({ ...safeHero, highlightedText: v })} />
      <Field label="Subtext" value={safeHero.subtext} onChange={(v) => onChange({ ...safeHero, subtext: v })} multiline />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary Button" value={safeHero.primaryButtonText} onChange={(v) => onChange({ ...safeHero, primaryButtonText: v })} />
        <Field label="Secondary Button" value={safeHero.secondaryButtonText} onChange={(v) => onChange({ ...safeHero, secondaryButtonText: v })} />
      </div>
      <Field label="Features (comma separated)" value={safeHero.features?.join(', ')} onChange={(v) => onChange({ ...safeHero, features: v.split(',').map(s => s.trim()) })} />
      <ImageField label="Background Image URL" value={safeHero.backgroundImage} onChange={(v) => onChange({ ...safeHero, backgroundImage: v })} />
    </div>
  );
}

function AboutEditor({ about, onChange }) {
  const safeAbout = about || {};
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safeAbout.badge} onChange={(v) => onChange({ ...safeAbout, badge: v })} />
      <Field label="Title" value={safeAbout.title} onChange={(v) => onChange({ ...safeAbout, title: v })} />
      <Field label="Description 1" value={safeAbout.description1} onChange={(v) => onChange({ ...safeAbout, description1: v })} multiline />
      <Field label="Description 2" value={safeAbout.description2} onChange={(v) => onChange({ ...safeAbout, description2: v })} multiline />
      <ImageField label="Image URL" value={safeAbout.image} onChange={(v) => onChange({ ...safeAbout, image: v })} />
    </div>
  );
}

function AreasEditor({ areas, onChange }) {
  const safeAreas = Array.isArray(areas) ? areas : [];
  return (
    <div className="space-y-4">
      {safeAreas.map((area, idx) => (
        <div key={idx} className="card p-4 border border-border">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold">Area {idx+1}</h4>
            <button onClick={() => onChange(safeAreas.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Icon" value={area.icon} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, icon: v }; onChange(newAreas); }} />
          <Field label="Title" value={area.title} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, title: v }; onChange(newAreas); }} />
          <Field label="Description" value={area.description} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, description: v }; onChange(newAreas); }} multiline />
          <Field label="Link" value={area.link} onChange={(v) => { const newAreas = [...safeAreas]; newAreas[idx] = { ...area, link: v }; onChange(newAreas); }} />
        </div>
      ))}
      <button onClick={() => onChange([...safeAreas, { icon: '', title: '', description: '', link: '#' }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Area
      </button>
    </div>
  );
}
function PartnersEditor({ partners, onChange }) {
  const safe = partners || {};
  const updateLogos = (logos) => onChange({ ...safe, logos });
  const updateCategories = (cats) => onChange({ ...safe, categories: cats.split(',').map(s => s.trim()) });
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safe.badge} onChange={(v) => onChange({ ...safe, badge: v })} />
      <Field label="Title" value={safe.title} onChange={(v) => onChange({ ...safe, title: v })} />
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Categories (comma separated)" value={safe.categories?.join(', ') || ''} onChange={updateCategories} />
      <div className="border-t border-border my-4" />
      <h4 className="font-semibold">Logos</h4>
      {Array.isArray(safe.logos) && safe.logos.map((logo, idx) => (
        <div key={idx} className="border p-3 rounded mb-2">
          <Field label="Icon name" value={logo.icon} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, icon: v }; updateLogos(newLogos); }} />
          <Field label="Name" value={logo.name} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, name: v }; updateLogos(newLogos); }} />
          <ImageField label="Logo URL" value={logo.logo} onChange={(v) => { const newLogos = [...safe.logos]; newLogos[idx] = { ...logo, logo: v }; updateLogos(newLogos); }} />
          <button onClick={() => updateLogos(safe.logos.filter((_, i) => i !== idx))} className="text-red-500 text-sm mt-1">Remove</button>
        </div>
      ))}
      <button onClick={() => updateLogos([...safe.logos, { icon: '', name: '', logo: '' }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Logo
      </button>
    </div>
  );
}

function ResearchEditor({ research, onChange }) {
  const items = Array.isArray(research) ? research : [];
  const updateItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onChange(newItems);
  };
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="border p-4 rounded">
          <div className="flex justify-between"><h4 className="font-bold">Research {idx+1}</h4><button onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-red-400"><Trash2 size={16} /></button></div>
          <Field label="Category" value={item.category} onChange={(v) => updateItem(idx, 'category', v)} />
          <Field label="Date" value={item.date} onChange={(v) => updateItem(idx, 'date', v)} />
          <Field label="Title" value={item.title} onChange={(v) => updateItem(idx, 'title', v)} />
          <Field label="Description" value={item.description} onChange={(v) => updateItem(idx, 'description', v)} multiline />
          <ImageField label="Image URL" value={item.image} onChange={(v) => updateItem(idx, 'image', v)} />
          <Field label="Link slug" value={item.link} onChange={(v) => updateItem(idx, 'link', v)} />
          <div className="flex gap-4"><label className="flex items-center"><input type="checkbox" checked={item.isFeatured || false} onChange={(e) => updateItem(idx, 'isFeatured', e.target.checked)} /> Featured</label></div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { category: '', date: '', title: '', description: '', image: '', link: '', isFeatured: false }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Research
      </button>
    </div>
  );
}

function CTAEditor({ cta, onChange }) {
  const safe = cta || {};
  return (
    <div className="space-y-4">
      <Field label="Title" value={safe.title} onChange={(v) => onChange({ ...safe, title: v })} />
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Primary Button Text" value={safe.primaryButtonText} onChange={(v) => onChange({ ...safe, primaryButtonText: v })} />
      <Field label="Secondary Button Text" value={safe.secondaryButtonText} onChange={(v) => onChange({ ...safe, secondaryButtonText: v })} />
    </div>
  );
}

function FooterEditor({ footer, onChange }) {
  const safe = footer || {};
  const updateQuickLinks = (links) => onChange({ ...safe, quickLinks: links });
  const updateLegalLinks = (links) => onChange({ ...safe, legalLinks: links });
  const updateSocialLinks = (links) => onChange({ ...safe, socialLinks: links });
  // For brevity, we only edit the main fields. You can extend similarly.
  return (
    <div className="space-y-4">
      <Field label="Description" value={safe.description} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      <Field label="Copyright" value={safe.copyright} onChange={(v) => onChange({ ...safe, copyright: v })} />
      <div className="border-t my-2" />
      <h4 className="font-semibold">Contact Info</h4>
      <Field label="Address" value={safe.contact?.address} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, address: v } })} />
      <Field label="Email" value={safe.contact?.email} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, email: v } })} />
      <Field label="Phone" value={safe.contact?.phone} onChange={(v) => onChange({ ...safe, contact: { ...safe.contact, phone: v } })} />
    </div>
  );
}

function LegalEditor({ data, onChange, title }) {
  const safeData = data || {};
  const sections = safeData.sections || [];

  const updateSection = (idx, field, value) => {
    const newSections = [...sections];
    newSections[idx] = { ...newSections[idx], [field]: value };
    onChange({ ...safeData, sections: newSections });
  };

  const addSection = () => {
    onChange({ ...safeData, sections: [...sections, { heading: '', content: '' }] });
  };

  const removeSection = (idx) => {
    onChange({ ...safeData, sections: sections.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <Field label="Title" value={safeData.title} onChange={(v) => onChange({ ...safeData, title: v })} />
      <Field label="Last Updated / Effective Date" value={safeData.lastUpdated || safeData.effectiveDate} onChange={(v) => onChange({ ...safeData, lastUpdated: v, effectiveDate: v })} />
      <div className="border-t border-border my-4"></div>
      <h3 className="font-semibold text-lg">Sections</h3>
      {sections.map((sec, idx) => (
        <div key={idx} className="border border-border rounded-lg p-4 relative">
          <button onClick={() => removeSection(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
          <Field label="Heading" value={sec.heading} onChange={(v) => updateSection(idx, 'heading', v)} />
          <Field label="Content" value={sec.content} onChange={(v) => updateSection(idx, 'content', v)} multiline />
        </div>
      ))}
      <button onClick={addSection} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Section
      </button>
      <div className="border-t border-border my-4"></div>
      <Field label="Contact Email" value={safeData.contactEmail} onChange={(v) => onChange({ ...safeData, contactEmail: v })} />
      <Field label="Contact Phone" value={safeData.contactPhone} onChange={(v) => onChange({ ...safeData, contactPhone: v })} />
      <Field label="Contact Address" value={safeData.contactAddress} onChange={(v) => onChange({ ...safeData, contactAddress: v })} />
    </div>
  );
}
// Main Component
export default function ContentManager() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [error, setError] = useState(null);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (!res.ok) throw new Error('Failed to load content');
      const data = await res.json();
      
      // data is an array of content documents (multiple pages)
      let homeContent = null;
      if (Array.isArray(data)) {
        homeContent = data.find(c => c.page === 'home');
      } else if (data && data.page === 'home') {
        homeContent = data;
      }
      
      if (homeContent && Object.keys(homeContent).length > 1) {
        // Merge with defaults to ensure all fields exist
        setContent({ ...DEFAULT_CONTENT, ...homeContent });
      } else {
        // No home content exists, use defaults
        setContent({ ...DEFAULT_CONTENT });
      }
    } catch (err) {
      console.error(err);
      setError('Could not load content from server, using defaults.');
      setContent({ ...DEFAULT_CONTENT });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      window.dispatchEvent(new Event("content-updated"));
      localStorage.setItem('content_last_updated', Date.now().toString());
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span className="text-muted">Loading content...</span>
      </div>
    );
  }

  if (!content) return <div className="text-center py-12">No content available</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-sm text-muted">Edit homepage content – changes reflect immediately on frontend</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white transition-all ${
            saved ? 'bg-green-500' : 'bg-accent hover:opacity-90'
          } disabled:opacity-50`}
        >
          {saving ? <RefreshCw className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-1">
          {/*{['hero', 'about', 'areas', 'partners', 'research', 'cta', 'footer','privacyPolicy', 'termsOfUse', 'accessibility'].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === section ? 'bg-accent/10 text-accent' : 'hover:bg-surface'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}/}
          {[
            'hero', 'about', 'areas', 'partners', 'research', 'cta', 'footer',
            'privacyPolicy', 'termsOfUse', 'accessibility'
          ].map(sectionKey => {
            let displayName = sectionKey;
            if (sectionKey === 'privacyPolicy') displayName = 'Privacy Policy';
            if (sectionKey === 'termsOfUse') displayName = 'Terms of Use';
            if (sectionKey === 'accessibility') displayName = 'Accessibility';
            else displayName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            return (
              <button
                key={sectionKey}
                onClick={() => setActiveSection(sectionKey)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeSection === sectionKey ? 'bg-accent/10 text-accent' : 'hover:bg-surface'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>
        <div className="lg:col-span-9">
          {/*{activeSection === 'hero' && <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />}
          {activeSection === 'about' && <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />}
          {activeSection === 'areas' && <AreasEditor areas={content.areas} onChange={(v) => updateSection('areas', v)} />}
          {/* Add other section editors similarly if needed /}
          {activeSection !== 'hero' && activeSection !== 'about' && activeSection !== 'areas' && (
            <div className="text-muted text-center py-12">
              Editor for {activeSection} coming soon – data is saved but not yet editable in this UI.
            </div>
          )}/}
          {activeSection === 'hero' && <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />}
          {activeSection === 'about' && <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />}
          {activeSection === 'areas' && <AreasEditor areas={content.areas} onChange={(v) => updateSection('areas', v)} />}
         {activeSection === 'partners' && <PartnersEditor partners={content.partners} onChange={(v) => updateSection('partners', v)} />}
          {activeSection === 'research' && <ResearchEditor research={content.research} onChange={(v) => updateSection('research', v)} />}
          {activeSection === 'cta' && <CTAEditor cta={content.cta} onChange={(v) => updateSection('cta', v)} />}
          {activeSection === 'footer' && <FooterEditor footer={content.footer} onChange={(v) => updateSection('footer', v)} />}
          {activeSection === 'privacyPolicy' && (
            <LegalEditor data={content.privacyPolicy} onChange={(v) => updateSection('privacyPolicy', v)} />
          )}
          {activeSection === 'termsOfUse' && (
            <LegalEditor data={content.termsOfUse} onChange={(v) => updateSection('termsOfUse', v)} />
          )}
          {activeSection === 'accessibility' && (
            <LegalEditor data={content.accessibility} onChange={(v) => updateSection('accessibility', v)} />
          )}
        </div>
      </div>
    </div>
  );
}*/