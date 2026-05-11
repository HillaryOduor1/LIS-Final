import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

interface PolicyContent {
  title?: string;
  lastUpdated?: string;
  sections?: Array<{ heading: string; content: string }>;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

const defaultPolicy: PolicyContent = {
  title: 'Privacy Policy',
  lastUpdated: 'May 2026',
  sections: [
    { heading: '1. Information We Collect', content: 'We may collect personal information that you voluntarily provide...' },
    { heading: '2. How We Use Your Information', content: 'We use the information we collect to provide, operate, and maintain our services...' },
    { heading: '3. Cookies and Tracking Technologies', content: 'We use cookies and similar tracking technologies to monitor activity on our website...' },
    { heading: '4. Data Security', content: 'We implement appropriate technical and organisational measures...' },
    { heading: '5. Third-Party Links', content: 'Our website may contain links to third‑party websites...' },
    { heading: '6. Your Rights (GDPR & CCPA)', content: 'Depending on your location, you may have the following rights: access, rectification, erasure, restriction, portability, and objection.' },
    { heading: '7. Children’s Privacy', content: 'Our services are not directed to individuals under the age of 16...' },
    { heading: '8. Changes to This Privacy Policy', content: 'We may update this Privacy Policy from time to time...' },
    { heading: '9. Contact Us', content: '' }
  ],
  contactEmail: 'privacy@lis.org',
  contactPhone: '+254 700 000 000',
  contactAddress: 'Nairobi, Kenya'
};

const PrivacyPolicy = () => {
  const { content } = useContent();
  const policy = (content && (content.privacyPolicy as PolicyContent)) || defaultPolicy;

  React.useEffect(() => {
    document.title = `${policy.title || 'Privacy Policy'} | Landscapes Integrity Solutions`;
  }, [policy.title]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0d1b14] dark:text-white">{policy.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {policy.lastUpdated}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        {policy.sections?.map((section, idx) => (
          <div key={idx}>
            {section.heading && <h2 className="text-xl font-semibold mt-8 mb-3">{section.heading}</h2>}
            {section.content && <p>{section.content}</p>}
            {section.heading === '9. Contact Us' && (
              <ul className="list-none pl-0 space-y-1 mt-2">
                <li>Email: <a href={`mailto:${policy.contactEmail}`} className="text-primary hover:underline">{policy.contactEmail}</a></li>
                <li>Phone: {policy.contactPhone}</li>
                <li>Address: {policy.contactAddress}</li>
              </ul>
            )}
          </div>
        ))}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm">
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;