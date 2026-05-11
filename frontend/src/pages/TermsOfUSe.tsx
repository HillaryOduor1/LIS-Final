import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/useContext';

interface TermsContent {
  title?: string;
  effectiveDate?: string;
  sections?: Array<{ heading: string; content: string }>;
  contactEmail?: string;
}

const defaultTerms: TermsContent = {
  title: 'Terms of Use',
  effectiveDate: 'May 2026',
  sections: [
    { heading: '1. Use of Content', content: 'All content on this website is the property of LIS and is protected by copyright...' },
    { heading: '2. User Conduct', content: 'You agree not to use the website for any unlawful purpose...' },
    { heading: '3. Research and Advisory Disclaimers', content: 'The research reports and advisory content are for informational purposes only...' },
    { heading: '4. Third-Party Links', content: 'Our website may contain links to external websites...' },
    { heading: '5. Limitation of Liability', content: 'LIS shall not be liable for any indirect or consequential damages...' },
    { heading: '6. Indemnification', content: 'You agree to indemnify LIS from any claims arising from your use...' },
    { heading: '7. Changes to Terms', content: 'We reserve the right to modify these Terms at any time...' },
    { heading: '8. Governing Law', content: 'These Terms shall be governed by the laws of Kenya.' },
    { heading: '9. Contact Us', content: 'If you have questions, contact us at legal@lis.org.' }
  ],
  contactEmail: 'legal@lis.org'
};

const TermsOfUse = () => {
  const { content } = useContent();
  const terms = (content && (content.termsOfUse as TermsContent)) || defaultTerms;

  React.useEffect(() => {
    document.title = `${terms.title || 'Terms of Use'} | Landscapes Integrity Solutions`;
  }, [terms.title]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0d1b14] dark:text-white">{terms.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Effective date: {terms.effectiveDate}</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        {terms.sections?.map((section, idx) => (
          <div key={idx}>
            {section.heading && <h2 className="text-xl font-semibold mt-8 mb-3">{section.heading}</h2>}
            {section.content && <p>{section.content}</p>}
          </div>
        ))}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm">
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;