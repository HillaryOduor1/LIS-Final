import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

interface AccessibilityContent {
  title?: string;
  lastUpdated?: string;
  sections?: Array<{ heading: string; content: string }>;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

const defaultAccessibility: AccessibilityContent = {
  title: 'Accessibility Statement',
  lastUpdated: 'May 2026',
  sections: [
    { heading: 'Our Commitment', content: 'We are committed to ensuring digital accessibility for all users, including people with disabilities. We strive to meet WCAG 2.2 Level AA.' },
    { heading: 'Conformance Status', content: 'This website is partially conformant with WCAG 2.2 Level AA. We continuously work to improve.' },
    { heading: 'Accessibility Features You Can Use', content: 'Theme toggle, neurodivergent mode, zoom up to 200%, responsive layout.' },
    { heading: 'Feedback and Contact', content: '' },
    { heading: 'Third‑Party Content', content: 'Some external content may not be fully accessible; we provide alternatives upon request.' },
    { heading: 'Assessment Methods', content: 'We use automated tools, manual keyboard testing, and screen reader testing.' },
    { heading: 'Known Limitations', content: 'Some older PDF reports may lack proper tagging; we are remediating them.' }
  ],
  contactEmail: 'accessibility@lis.org',
  contactPhone: '+254 700 000 000',
  contactAddress: 'Nairobi, Kenya'
};

const Accessibility = () => {
  const { content } = useContent();
  const a11y = (content && (content.accessibility as AccessibilityContent)) || defaultAccessibility;

  React.useEffect(() => {
    document.title = `${a11y.title || 'Accessibility Statement'} | Landscapes Integrity Solutions`;
  }, [a11y.title]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0d1b14] dark:text-white">{a11y.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {a11y.lastUpdated}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        {a11y.sections?.map((section, idx) => (
          <div key={idx}>
            {section.heading && <h2 className="text-xl font-semibold mt-8 mb-3">{section.heading}</h2>}
            {section.content && <p>{section.content}</p>}
            {section.heading === 'Feedback and Contact' && (
              <ul className="list-none pl-0 space-y-1 mt-2">
                <li>Email: <a href={`mailto:${a11y.contactEmail}`} className="text-primary hover:underline">{a11y.contactEmail}</a></li>
                <li>Phone: {a11y.contactPhone}</li>
                <li>Address: {a11y.contactAddress}</li>
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

export default Accessibility;