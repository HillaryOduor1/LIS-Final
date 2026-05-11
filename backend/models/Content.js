/*const mongoose = require('mongoose');

// Schema for navigation links
const navLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

// Schema for hero section
const heroSchema = new mongoose.Schema({
  announcementBadge: String,
  announcementText: String,
  headline: String,
  highlightedText: String,
  subtext: String,
  primaryButtonText: String,
  secondaryButtonText: String,
  features: [String],
  backgroundImage: String
}, { _id: false });

// Schema for contact section
const contactSchema = new mongoose.Schema({
  sectionTitle: {
    text1: String,
    text2: String,
    text3: String
  },
  form: {
    nameLabel: String,
    namePlaceholder: String,
    emailLabel: String,
    emailPlaceholder: String,
    messageLabel: String,
    messagePlaceholder: String,
    submitText: String
  }
}, { _id: false });

// Schema for about section
const aboutSchema = new mongoose.Schema({
  badge: String,
  title: String,
  description1: String,
  description2: String,
  stats: [{
    number: String,
    label: String
  }],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  image: String
}, { _id: false });

// Schema for areas/features
const areaSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  link: String
}, { _id: true });

// Schema for partners
const partnerSchema = new mongoose.Schema({
  icon: String,
  name: String,
  logo: String
}, { _id: true });

// Schema for research items
const researchSchema = new mongoose.Schema({
  category: String,
  date: String,
  title: String,
  description: String,
  image: String,
  isNew: Boolean,
  link: String
}, { _id: true });

// Schema for advisory services
const advisorySchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String
}, { _id: true });

// Schema for pricing plans
const pricingSchema = new mongoose.Schema({
  name: String,
  price: Number,
  period: String,
  features: [String],
  mostPopular: Boolean
}, { _id: true });

// Schema for testimonials
const testimonialSchema = new mongoose.Schema({
  image: String,
  name: String,
  handle: String,
  date: String,
  quote: String
}, { _id: true });

// Schema for footer
const footerLinkSchema = new mongoose.Schema({
  name: String,
  href: String
}, { _id: false });

const footerColumnSchema = new mongoose.Schema({
  title: String,
  links: [footerLinkSchema]
}, { _id: true });

const footerSchema = new mongoose.Schema({
  description: String,
  quickLinks: [footerColumnSchema],
  contact: {
    address: String,
    email: String,
    phone: String
  },
  socialLinks: [{
    icon: String,
    href: String
  }],
  copyright: String,
  legalLinks: [{
    name: String,
    href: String
  }]
}, { _id: false });

// Main site content schema
const siteContentSchema = new mongoose.Schema({
  page: {
    type: String,
    enum: ['home', 'about', 'research', 'contact'],
    required: true
  },
  navigation: [navLinkSchema],
  hero: heroSchema,
  about: aboutSchema,
  areas: [areaSchema],
  features: [areaSchema], // Alias for areas
  partners: {
    badge: String,
    title: String,
    description: String,
    categories: [String],
    logos: [partnerSchema]
  },
  research: [researchSchema],
  advisory: [advisorySchema],
  pricing: [pricingSchema],
  testimonials: [testimonialSchema],
  contact: contactSchema,
  cta: {
    title: String,
    description: String,
    buttonText: String,
    primaryButtonText: String,
    secondaryButtonText: String
  },
  footer: footerSchema,
  metadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  published: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
});

// Update timestamps on save
siteContentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SiteContent', siteContentSchema);*/
const mongoose = require('mongoose');

// Navigation
const navLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: String
}, { _id: false });

// Hero
const heroSchema = new mongoose.Schema({
  announcementBadge: String,
  announcementText: String,
  headline: String,
  highlightedText: String,
  subtext: String,
  primaryButtonText: String,
  secondaryButtonText: String,
  features: [String],
  backgroundImage: String
}, { _id: false });

// Contact
const contactSchema = new mongoose.Schema({
  sectionTitle: {
    text1: String,
    text2: String,
    text3: String
  },
  form: {
    nameLabel: String,
    namePlaceholder: String,
    emailLabel: String,
    emailPlaceholder: String,
    messageLabel: String,
    messagePlaceholder: String,
    submitText: String
  }
}, { _id: false });

// About
const aboutSchema = new mongoose.Schema({
  badge: String,
  title: String,
  description1: String,
  description2: String,
  stats: [{
    number: String,
    label: String
  }],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  image: String
}, { _id: false });

// Areas
const areaSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  link: String
}, { _id: true });

// Partners
const partnerSchema = new mongoose.Schema({
  icon: String,
  name: String,
  logo: String
}, { _id: true });

// ✅ FIXED (renamed isNew)
const researchSchema = new mongoose.Schema({
  category: String,
  date: String,
  title: String,
  description: String,
  image: String,
  isFeatured: Boolean, // ✅ renamed
  link: String
}, { _id: true });

// Advisory
const advisorySchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String
}, { _id: true });

// Pricing
const pricingSchema = new mongoose.Schema({
  name: String,
  price: Number,
  period: String,
  features: [String],
  mostPopular: Boolean
}, { _id: true });

// Testimonials
const testimonialSchema = new mongoose.Schema({
  image: String,
  name: String,
  handle: String,
  date: String,
  quote: String
}, { _id: true });


// Footer
const footerLinkSchema = new mongoose.Schema({
  name: String,
  href: String
}, { _id: false });

const footerColumnSchema = new mongoose.Schema({
  title: String,
  links: [footerLinkSchema]
}, { _id: true });

const footerSchema = new mongoose.Schema({
  description: String,
  quickLinks: [footerColumnSchema],
  contact: {
    address: String,
    email: String,
    phone: String
  },
  socialLinks: [{
    icon: String,
    href: String
  }],
  copyright: String,
  legalLinks: [{
    name: String,
    href: String
  }]
}, { _id: false });

// Main schema
const siteContentSchema = new mongoose.Schema({
  page: {
    type: String,
    enum: ['home', 'about', 'research', 'contact'],
    required: true
  },
  navigation: [navLinkSchema],
  hero: heroSchema,
  about: aboutSchema,
  areas: [areaSchema],
  features: [areaSchema],
  partners: {
    badge: String,
    title: String,
    description: String,
    categories: [String],
    logos: [partnerSchema]
  },
  research: [researchSchema],
  advisory: [advisorySchema],
  pricing: [pricingSchema],
  testimonials: [testimonialSchema],
  contact: contactSchema,
  cta: {
    title: String,
    description: String,
    buttonText: String,
    primaryButtonText: String,
    secondaryButtonText: String
  },
  // Add after 'cta' or before 'footer'
privacyPolicy: {
  title: String,
  lastUpdated: String,
  sections: [{
    heading: String,
    content: String
  }],
  contactEmail: String,
  contactPhone: String,
  contactAddress: String
},
termsOfUse: {
  title: String,
  effectiveDate: String,
  sections: [{
    heading: String,
    content: String
  }],
  contactEmail: String
},
accessibility: {
  title: String,
  lastUpdated: String,
  sections: [{
    heading: String,
    content: String
  }],
  contactEmail: String,
  contactPhone: String,
  contactAddress: String
},
  footer: footerSchema,
  metadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  published: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true // ✅ handles createdAt & updatedAt
});

// ✅ FIXED middleware (no next)
siteContentSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

//module.exports = mongoose.model('SiteContent', siteContentSchema);
module.exports = siteContentSchema;