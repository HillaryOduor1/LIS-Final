import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

interface ContactInfo {
  address?: string;
  email?: string;
  phone?: string;
}

interface FooterData {
  description?: string;
  socialLinks?: Array<{ href: string; icon: string }>;
  quickLinks?: Array<{ href: string; name: string }>;
  contact?: ContactInfo;
  legalLinks?: Array<{ href: string; name: string }>;
  copyright?: string;
}

const Footer = () => {
  const { content } = useContent();
  const footer = (content && content.footer) ? (content.footer as FooterData) : null;
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = React.useState(false);

  const description = footer?.description || 'Integrity-driven intelligence for landscape governance.';
  const socialLinks = Array.isArray(footer?.socialLinks) ? footer.socialLinks.filter(link => link && link.href) : [];
  // Filter quickLinks: ensure href exists and is a string
  const quickLinks = Array.isArray(footer?.quickLinks) 
    ? footer.quickLinks.filter(link => link && typeof link.href === 'string' && link.name)
    : [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Research', href: '/research' },
        { name: 'Contact', href: '/contact' },
      ];
  const contact = footer?.contact || {};
  const legalLinks = Array.isArray(footer?.legalLinks) ? footer.legalLinks.filter(link => link && link.href) : [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Accessibility', href: '/accessibility' },
  ];
  const copyrightText = typeof footer?.copyright === 'string' ? footer.copyright : `© ${new Date().getFullYear()} Landscapes Integrity Solutions (LIS). All Rights Reserved.`;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setLoading(true);
    setNewsletterStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      setNewsletterStatus({ type: 'success', message: 'Thank you for subscribing!' });
      trackEvent('newsletter_subscribe', { email: newsletterEmail });
      setNewsletterEmail('');
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'twitter': return '🕊️';
      case 'linkedin': return '🔗';
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      default: return iconName;
    }
  };

  return (
    <footer className="bg-[#0d1b14] text-white py-16 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">LIS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
          <div className="flex gap-4">
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#0d1b14] transition-all focus:outline-none focus:ring-2 focus:ring-primary" aria-label={`Follow on ${link.icon}`}>
                <span className="text-lg">{getSocialIcon(link.icon)}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                {link.href.startsWith('/') ? (
                  <Link to={link.href} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                    {link.name}
                  </Link>
                ) : (
                  <a href={link.href} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm mt-1" aria-hidden="true">location_on</span>
              <span>{contact.address || 'Nairobi, Kenya'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">mail</span>
              <a href={`mailto:${contact.email || 'info@lis.org'}`} className="hover:text-primary">{contact.email || 'info@lis.org'}</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">call</span>
              <a href={`tel:${contact.phone || '+254700000000'}`} className="hover:text-primary">{contact.phone || '+254 700 000 000'}</a>
            </li>
          </ul>
        </div>
        
        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Stay updated with our latest research and insights.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder:text-slate-400"
              placeholder="Your email"
              required
              aria-label="Email address for newsletter"
            />
            <button type="submit" disabled={loading} className="bg-primary text-[#0d1b14] font-bold py-3 rounded-lg hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {newsletterStatus.message && (
              <p className={`text-xs ${newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{newsletterStatus.message}</p>
            )}
          </form>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{copyrightText}</p>
        <div className="flex gap-6 flex-wrap justify-center">
          {legalLinks.map((link, idx) => (
            <Link key={idx} to={link.href} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
/*import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

// Define contact info type
interface ContactInfo {
  address?: string;
  email?: string;
  phone?: string;
}

// Define footer data type
interface FooterData {
  description?: string;
  socialLinks?: Array<{ href: string; icon: string }>;
  quickLinks?: Array<{ href: string; name: string }>;
  contact?: ContactInfo;
  legalLinks?: Array<{ href: string; name: string }>;
  copyright?: string;
}

const Footer = () => {
  const { content } = useContent();
  const footer = (content && content.footer) ? (content.footer as FooterData) : null;
  if (!footer) return null;

  const handleSocialClick = (platform: string) => {
    trackEvent('footer_social_click', { platform });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput ? emailInput.value : '';
    trackEvent('newsletter_subscribe', { email });
  };

  const description = footer.description || '';
  const socialLinks = Array.isArray(footer.socialLinks) ? footer.socialLinks : [];
  const quickLinks = Array.isArray(footer.quickLinks) ? footer.quickLinks.filter(function(link) { return link && link.href && link.name; }) : [];
  const contact = footer.contact || {};
  const legalLinks = Array.isArray(footer.legalLinks) ? footer.legalLinks : [];
  const copyrightText = typeof footer.copyright === 'string' ? footer.copyright : `© ${new Date().getFullYear()} Landscapes Integrity Solutions (LIS). All Rights Reserved.`;

  return (
    <footer className="bg-[#0d1b14] text-white py-16 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo & Description /}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">LIS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
          <div className="flex gap-4">
            {socialLinks.map(function(link, index) {
              return (
                <a 
                  key={index} 
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#0d1b14] transition-all focus:outline-none focus:ring-2 focus:ring-primary" 
                  href={link.href}
                  onClick={() => handleSocialClick(link.icon)}
                  aria-label={`Follow us on ${link.icon}`}
                >
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">{link.icon}</span>
                </a>
              );
            })}
          </div>
        </div>
        
        {/* Quick Links /}
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            {quickLinks.map(function(link, index) {
              const isInternal = link.href && link.href.indexOf('/') === 0;
              return (
                <li key={index}>
                  {isInternal ? (
                    <Link to={link.href} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={() => trackEvent('footer_quicklink_click', { link: link.name })}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={() => trackEvent('footer_quicklink_click', { link: link.name })}>
                      {link.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Contact Info /}
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm mt-1" aria-hidden="true">location_on</span>
              <span>{contact.address || 'Nairobi, Kenya'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">mail</span>
              <span>{contact.email || 'info@lis.org'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">call</span>
              <span>{contact.phone || '+254 700 000 000'}</span>
            </li>
          </ul>
        </div>
        
        {/* Newsletter /}
        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Stay updated with our latest research and insights.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input 
              className="bg-white/5 border-none rounded-lg flex-1 text-sm focus:ring-primary focus:outline-none" 
              placeholder="Your email" 
              type="email"
              required
              aria-label="Email address for newsletter"
            />
            <button type="submit" className="bg-primary text-[#0d1b14] p-2 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Subscribe">
              <span className="material-symbols-outlined" aria-hidden="true">send</span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{copyrightText}</p>
        <div className="flex gap-6">
          {legalLinks.map(function(link, index) {
            return (
              <a key={index} className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded" href={link.href} onClick={() => trackEvent('footer_legal_click', { link: link.name })}>
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;*/

/*import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const Footer = () => {
  const { content } = useContent();
  const footer = content?.footer;

  if (!footer) return null;

  const handleSocialClick = (platform: string) => {
    trackEvent('footer_social_click', { platform });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    trackEvent('newsletter_subscribe', { email });
    // actual subscription logic would go here
  };

  return (
    <footer className="bg-[#0d1b14] text-white py-16 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">LIS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {footer.description as React.ReactNode}
          </p>
          <div className="flex gap-4">
            {Array.isArray(footer.socialLinks) && footer.socialLinks.map((link, index) => (
              <a 
                key={index} 
                className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#0d1b14] transition-all" 
                href={link.href}
                onClick={() => handleSocialClick(link.icon)}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            {Array.isArray(footer.quickLinks) && footer.quickLinks.filter(link => link?.href && link?.name).map((link, index) => (
              <li key={index}>
                {link.href.startsWith('/') ? (
                  <Link to={link.href} className="hover:text-primary transition-colors" onClick={() => trackEvent('footer_quicklink_click', { link: link.name })}>
                    {link.name}
                  </Link>
                ) : (
                  <a href={link.href} className="hover:text-primary transition-colors" onClick={() => trackEvent('footer_quicklink_click', { link: link.name })}>
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm mt-1">location_on</span>
              <span>{(footer.contact as any)?.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">mail</span>
              <span>{(footer.contact as any)?.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">call</span>
              <span>{(footer.contact as any)?.phone}</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Stay updated with our latest research and insights.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input 
              className="bg-white/5 border-none rounded-lg flex-1 text-sm focus:ring-primary" 
              placeholder="Your email" 
              type="email"
              required
            />
            <button type="submit" className="bg-primary text-[#0d1b14] p-2 rounded-lg hover:bg-primary/90">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{footer.copyright && typeof footer.copyright === 'string' ? footer.copyright : `© ${new Date().getFullYear()} Landscapes Integrity Solutions (LIS). All Rights Reserved.`}</p>
        <div className="flex gap-6">
          {Array.isArray(footer.legalLinks) && footer.legalLinks.map((link, index) => (
            <a key={index} className="hover:text-white" href={link.href} onClick={() => trackEvent('footer_legal_click', { link: link.name })}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;*/
