import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';
import { LinkedInIcon, MailIcon, TwitterIcon } from './icons';

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

  return (
    <footer className="bg-[#0d1b14] text-white py-16 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10">
              <img 
                src="/assets/footer-logo-light.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain block dark:hidden"
              />
              <img 
                src="/assets/footer-logo-dark.png" 
                alt="LIS Logo"
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
            <span className="text-xl font-black tracking-tight">LIS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
          
          <div className="flex gap-4 flex-wrap sm:gap-2">
            {socialLinks.map((link, idx) => {
              let IconComponent;
              switch (link.icon) {
                case 'twitter':
                  IconComponent = TwitterIcon;
                  break;
                case 'linkedin':
                  IconComponent = LinkedInIcon;
                  break;
                case 'mail':
                  IconComponent = MailIcon;
                  break;
                default:
                  IconComponent = () => <span className="text-lg">{link.icon}</span>;
              }
              return (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#0d1b14] transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Follow on ${link.icon}`}
                >
                  <IconComponent className="w-5 h-5 text-current" />
                </a>
              );
            })}
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
              <a href={`tel:${contact.phone || '+254700000000'}`} className="hover:text-primary">{contact.phone || '+254 706 261 624'}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{copyrightText}</p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 flex-wrap justify-center sm:gap-2">
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
