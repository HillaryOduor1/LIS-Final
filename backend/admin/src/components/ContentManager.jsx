// src/components/ContentManager.jsx
/*import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, Check, Edit3, X } from 'lucide-react';

const API_BASE = '/api/admin';

// Updated DEFAULT_CONTENT to match LIS site structure
const DEFAULT_CONTENT = {
    navigation: [
        { name: 'Home', href: '/' },
        { name: 'Research', href: '/research' },
        { name: 'Areas', href: '/#areas' },
        { name: 'About', href: '/#about' },
        { name: 'Partners', href: '/#partners' },
    ],
    hero: {
        badge: 'Leading the Path to Sustainability',
        headline: 'Advancing Policy for',
        highlightedText: 'Sustainable',
        headlineEnd: 'Landscapes',
        description: 'Landscapes Integrity Solutions (LIS) is a premier think tank providing research and advisories in environmental, natural resources, land, and climate change policy governance.',
        primaryButtonText: 'Explore Our Research',
        secondaryButtonText: 'Partner With Us',
        backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOCEXQMSbAWWgK9aO_Hnbhz5bK_qu2nLHvjUx0UInr63kpps2cjzOIKWaIhbhWSXF8AEl4JrjkrevcMVJ79bv4tLHHudGxWxhjf3QGYEkfz_77VMFfaw9QReFR6u_AIctGARh9sU3oB-TORsRqtXEjel_2V-h4P0GXOwNE2W48lY_w-Jszg0FB5JnUpgPODN7AdVEK7-KcOFFUl1pftj66zWaHMCT__VeR6UgcGZqWHcK3t83FxeKimG-zzmIc8ap1v4AYdGsv0tA'
    },
    about: {
        badge: 'Who We Are',
        title: 'Bridging the Gap Between Research and Governance',
        description1: 'Landscapes Integrity Solutions (LIS) is a dedicated think tank focused on addressing complex policy implementation challenges. We act as a catalyst for environmental change by providing data-driven insights to those who shape our world.',
        description2: 'We bridge the gap between high-level academic research and practical, on-the-ground governance to ensure environmental integrity across all sectors—from local communities to international bodies.',
        stats: [
            { number: '150+', label: 'Policy Research Papers' }
        ],
        features: [
            { icon: 'verified_user', title: 'Integrity First', description: 'Unbiased, evidence-based advisory.' },
            { icon: 'public', title: 'Global Impact', description: 'Scalable solutions for planet-wide issues.' }
        ],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Op6-C_MLwO4CkaO1JDhRrwJ3ktU3yZ4sHTMIWPrCxQtHtiRQbo12xGzz7SALA3Pg-NZmrOZMxlaiQhcucHM1UMPN6jxTzJ1wJ7BMiyGTsEUrdKJy0B-_8OiBxQ2kgjAETrPMu91s9z5mD_mwVbIUgC8y6tUF6K1UGJ1wN-AFr63BhsKnPCynzKgLGDiz2NlRm_JHMi2MsarMRmTA8Wd58ux9J6fk1M7GwcDvzPAoAIx82pYs-dR4wHWPsa7507wTC5L97pKmVE'
    },
    areas: [
        { 
            icon: 'eco',
            title: 'Environment',
            description: 'Focusing on biodiversity protection, ecosystem restoration, and sustainable management of natural heritage.',
            link: '#'
        },
        { 
            icon: 'forest',
            title: 'Natural Resources',
            description: 'Developing frameworks for sustainable resource extraction, water management, and conservation strategies.',
            link: '#'
        },
        { 
            icon: 'landscape',
            title: 'Land Governance',
            description: 'Addressing land rights, tenure security, and equitable land-use planning for resilient communities.',
            link: '#'
        },
        { 
            icon: 'thunderstorm',
            title: 'Climate Policy',
            description: 'Shaping national and international adaptation strategies and mitigation frameworks to meet net-zero goals.',
            link: '#'
        }
    ],
    partners: {
        badge: 'Collaboration',
        title: 'Our Global Network',
        description: 'We believe that environmental integrity is a collective responsibility. LIS partners with a diverse range of stakeholders to turn policy into practice.',
        categories: [
            'National Governments',
            'International NGOs',
            'Multilateral Organizations',
            'Corporate Entities'
        ],
        logos: [
            { icon: 'account_balance' },
            { icon: 'group_work' },
            { icon: 'public' },
            { icon: 'domain' },
            { icon: 'corporate_fare' },
            { icon: 'foundation' },
            { icon: 'policy' },
            { icon: 'diversity_3' }
        ]
    },
    cta: {
        title: "Let's build sustainable partnerships together.",
        description: 'Whether you are a government agency looking for policy advisory or a corporate entity seeking sustainability strategies, we are here to help.',
        primaryButtonText: 'Get in Touch',
        secondaryButtonText: 'Download Brochure'
    },
    footer: {
        description: 'The premier think tank for landscape integrity and environmental policy governance. Bridging research and action for a sustainable future.',
        quickLinks: [
            { name: 'Our Research', href: '/research' },
            { name: 'Thematic Areas', href: '#areas' },
            { name: 'About LIS', href: '#about' },
            { name: 'Partnerships', href: '#partners' },
            { name: 'Careers', href: '#' }
        ],
        contact: {
            address: '123 Policy Square, Environment District, Nairobi, Kenya',
            email: 'info@lis-thinktank.org',
            phone: '+254 (0) 20 123 4567'
        },
        socialLinks: [
            { icon: 'public', href: '#' },
            { icon: 'mail', href: '#' },
            { icon: 'forum', href: '#' }
        ]
    }
};

// ... keep all the Field, HeroEditor components but update them for LIS structure

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
                    className="input-base w-full px-3 py-2 text-sm resize-none"
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="input-base w-full px-3 py-2 text-sm"
                />
            )}
        </div>
    );
}

// Hero Editor for LIS
function HeroEditor({ hero, onChange }) {
    return (
        <div className="space-y-4">
            <Field 
                label="Badge Text" 
                value={hero.badge} 
                onChange={(v) => onChange({ ...hero, badge: v })} 
                placeholder="Leading the Path to Sustainability"
            />
            <Field 
                label="Headline Start" 
                value={hero.headline} 
                onChange={(v) => onChange({ ...hero, headline: v })} 
                placeholder="Advancing Policy for"
            />
            <Field 
                label="Highlighted Text" 
                value={hero.highlightedText} 
                onChange={(v) => onChange({ ...hero, highlightedText: v })} 
                placeholder="Sustainable"
            />
            <Field 
                label="Headline End" 
                value={hero.headlineEnd} 
                onChange={(v) => onChange({ ...hero, headlineEnd: v })} 
                placeholder="Landscapes"
            />
            <Field 
                label="Description" 
                value={hero.description} 
                onChange={(v) => onChange({ ...hero, description: v })} 
                multiline 
                placeholder="Description..."
            />
            <div className="grid grid-cols-2 gap-3">
                <Field 
                    label="Primary Button" 
                    value={hero.primaryButtonText} 
                    onChange={(v) => onChange({ ...hero, primaryButtonText: v })} 
                    placeholder="Explore Our Research"
                />
                <Field 
                    label="Secondary Button" 
                    value={hero.secondaryButtonText} 
                    onChange={(v) => onChange({ ...hero, secondaryButtonText: v })} 
                    placeholder="Partner With Us"
                />
            </div>
            <Field 
                label="Background Image URL" 
                value={hero.backgroundImage} 
                onChange={(v) => onChange({ ...hero, backgroundImage: v })} 
                placeholder="https://..."
            />
        </div>
    );
}

// About Editor
function AboutEditor({ about, onChange }) {
    return (
        <div className="space-y-4">
            <Field 
                label="Badge" 
                value={about.badge} 
                onChange={(v) => onChange({ ...about, badge: v })} 
                placeholder="Who We Are"
            />
            <Field 
                label="Title" 
                value={about.title} 
                onChange={(v) => onChange({ ...about, title: v })} 
                placeholder="Bridging the Gap..."
            />
            <Field 
                label="Description 1" 
                value={about.description1} 
                onChange={(v) => onChange({ ...about, description1: v })} 
                multiline 
            />
            <Field 
                label="Description 2" 
                value={about.description2} 
                onChange={(v) => onChange({ ...about, description2: v })} 
                multiline 
            />
            <Field 
                label="Image URL" 
                value={about.image} 
                onChange={(v) => onChange({ ...about, image: v })} 
                placeholder="https://..."
            />
        </div>
    );
}

// Areas Editor
function AreasEditor({ areas, onChange }) {
    return (
        <div className="space-y-4">
            {areas.map((area, index) => (
                <div key={index} className="card p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">Area {index + 1}</h4>
                        <button
                            onClick={() => onChange(areas.filter((_, i) => i !== index))}
                            className="text-red-400 hover:text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <Field 
                        label="Icon" 
                        value={area.icon} 
                        onChange={(v) => {
                            const newAreas = [...areas];
                            newAreas[index] = { ...area, icon: v };
                            onChange(newAreas);
                        }}
                        placeholder="material icon name"
                    />
                    <Field 
                        label="Title" 
                        value={area.title} 
                        onChange={(v) => {
                            const newAreas = [...areas];
                            newAreas[index] = { ...area, title: v };
                            onChange(newAreas);
                        }}
                    />
                    <Field 
                        label="Description" 
                        value={area.description} 
                        onChange={(v) => {
                            const newAreas = [...areas];
                            newAreas[index] = { ...area, description: v };
                            onChange(newAreas);
                        }}
                        multiline
                    />
                    <Field 
                        label="Link" 
                        value={area.link} 
                        onChange={(v) => {
                            const newAreas = [...areas];
                            newAreas[index] = { ...area, link: v };
                            onChange(newAreas);
                        }}
                    />
                </div>
            ))}
            <button
                onClick={() => onChange([...areas, { icon: '', title: '', description: '', link: '#' }])}
                className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent transition-all"
            >
                <Plus size={16} className="inline mr-1" /> Add Area
            </button>
        </div>
    );
}

// Main ContentManager component
export default function ContentManager() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [secOpen, setSecOpen] = useState(false);

    const contentSections = [
        { id: 'hero', label: 'Hero Section', icon: '🏠' },
        { id: 'about', label: 'About Section', icon: '📝' },
        { id: 'areas', label: 'Thematic Areas', icon: '🌿' },
        { id: 'partners', label: 'Partners', icon: '🤝' },
        { id: 'cta', label: 'Call to Action', icon: '🎯' },
        { id: 'footer', label: 'Footer', icon: '🔻' },
    ];

    useEffect(() => {
        fetch(API_BASE + '/content')
            .then(r => r.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setContent({ ...DEFAULT_CONTENT, ...data });
                } else {
                    setContent(DEFAULT_CONTENT);
                }
                setLoading(false);
            })
            .catch(() => {
                setContent(DEFAULT_CONTENT);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch(API_BASE + '/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        })
            .then(() => {
                setSaved(true);
                setSaving(false);
                setTimeout(() => setSaved(false), 2500);
            })
            .catch(() => setSaving(false));
    };

    const updateSection = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 text-muted">
                <RefreshCw className="animate-spin mr-2" size={20} />
                Loading content...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Content Manager</h2>
                    <p className="text-sm text-muted mt-0.5">Edit all page sections — changes reflect globally on the frontend</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: saved ? '#10b981' : 'var(--accent)' }}
                >
                    {saving ? <RefreshCw className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save to Backend'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Section navigation /}
                <div className="lg:col-span-3">
                    <button
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-sm font-medium lg:hidden mb-2"
                        onClick={() => setSecOpen(!secOpen)}
                    >
                        <span>{contentSections.find(s => s.id === activeSection)?.label}</span>
                        <Edit3 size={16} className="text-muted" />
                    </button>
                    <nav className={`space-y-1 ${secOpen ? '' : 'hidden lg:block'}`}>
                        {contentSections.map((sec) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => { setActiveSection(sec.id); setSecOpen(false); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                                        isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-foreground'
                                    }`}
                                >
                                    <span>{sec.icon}</span>
                                    <span>{sec.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Editor /}
                <div className="lg:col-span-9">
                    {content && (
                        <>
                            {activeSection === 'hero' && (
                                <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />
                            )}
                            {activeSection === 'about' && (
                                <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />
                            )}
                            {activeSection === 'areas' && (
                                <AreasEditor areas={content.areas} onChange={(v) => updateSection('areas', v)} />
                            )}
                            {/* Add other section editors as needed /}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}*/
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
          className="input-base w-full px-3 py-2 text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-base w-full px-3 py-2 text-sm"
        />
      )}
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
      <Field label="Background Image URL" value={safeHero.backgroundImage} onChange={(v) => onChange({ ...safeHero, backgroundImage: v })} />
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
      <Field label="Image URL" value={safeAbout.image} onChange={(v) => onChange({ ...safeAbout, image: v })} />
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
          ))}*/}
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
          )}*/}
          {activeSection === 'hero' && <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />}
          {activeSection === 'about' && <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />}
          {activeSection === 'areas' && <AreasEditor areas={content.areas} onChange={(v) => updateSection('areas', v)} />}
          {activeSection === 'partners' && (
            <div className="text-muted text-center py-12">Partner editor coming soon</div>
          )}
          {activeSection === 'research' && (
            <div className="text-muted text-center py-12">Research editor coming soon</div>
          )}
          {activeSection === 'cta' && (
            <div className="text-muted text-center py-12">CTA editor coming soon</div>
          )}
          {activeSection === 'footer' && (
            <div className="text-muted text-center py-12">Footer editor coming soon</div>
          )}
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
}