import * as React from 'react';
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

export default Footer;
/*import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

const Footer = () => {
  const { content } = useContent();
  const footer = content?.footer;

  if (!footer) return null;

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
            {footer.description}
          </p>
          <div className="flex gap-4">
            {footer.socialLinks?.map((link, index) => (
              <a key={index} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#0d1b14] transition-all" href={link.href}>
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            {footer.quickLinks?.filter(link => link?.href && link?.name).map((link, index) => (
  <li key={index}>
    {link.href.startsWith('/') ? (
      <Link to={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
    ) : (
      <a href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
    )}
  </li>
))}
            {/*{footer.quickLinks?.map((link, index) => (
              <li key={index}>
                {link.href.startsWith('/') ? (
                  <Link to={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
                ) : (
                  <a href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
                )}
              </li>
            ))}/}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Contact Info</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-sm mt-1">location_on</span>
              <span>{footer.contact?.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">mail</span>
              <span>{footer.contact?.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">call</span>
              <span>{footer.contact?.phone}</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-4">Stay updated with our latest research and insights.</p>
          <div className="flex gap-2">
            <input 
              className="bg-white/5 border-none rounded-lg flex-1 text-sm focus:ring-primary" 
              placeholder="Your email" 
              type="email"
            />
            <button className="bg-primary text-[#0d1b14] p-2 rounded-lg hover:bg-primary/90">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>{footer.copyright || `© ${new Date().getFullYear()} Landscapes Integrity Solutions (LIS). All Rights Reserved.`}</p>
        <div className="flex gap-6">
          {footer.legalLinks?.map((link, index) => (
            <a key={index} className="hover:text-white" href={link.href}>{link.name}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;*/