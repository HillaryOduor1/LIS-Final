import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const ResearchCTA = () => {
  const { content } = useContent();
  const cta = content && content.cta ? content.cta : null;
  const title = (cta && typeof cta.title === 'string') ? cta.title : "Ready to collaborate on your next project?";
  const description = (cta && typeof cta.description === 'string') ? cta.description : "Join dozens of global organizations leveraging LIS intelligence to drive measurable landscape impact.";
  const primaryText = (cta && typeof cta.primaryButtonText === 'string') ? cta.primaryButtonText : "Request an Advisory";
  const secondaryText = (cta && typeof cta.secondaryButtonText === 'string') ? cta.secondaryButtonText : "Contact Our Team";

  const handlePrimary = () => {
    trackEvent('research_cta_primary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const advisorySection = document.getElementById('advisory');
    if (advisorySection) advisorySection.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/research#advisory';
  };

  const handleSecondary = () => {
    trackEvent('research_cta_secondary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const contactSection = document.getElementById('ContactSection');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/contact';
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-48 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute -bottom-12 -left-12 size-48 bg-background-dark/5 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-background-dark mb-6">{title}</h2>
            <p className="text-background-dark/80 text-lg mb-10 font-medium">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" onClick={handlePrimary} className="bg-background-dark text-white font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform text-lg shadow-xl shadow-background-dark/20 focus:outline-none focus:ring-2 focus:ring-background-dark">
                {primaryText}
              </Button>
              <Button variant="secondary" onClick={handleSecondary} className="bg-white/20 hover:bg-white/30 text-background-dark border border-background-dark/10 font-bold px-10 py-4 rounded-xl transition-all text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-background-dark">
                {secondaryText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCTA;
/*import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const ResearchCTA = () => {
  const { content } = useContent();
  const cta = content && content.cta ? content.cta : null;
  const title = (cta && typeof cta.title === 'string') ? cta.title : "Ready to collaborate on your next project?";
  const description = (cta && typeof cta.description === 'string') ? cta.description : "Join dozens of global organizations leveraging LIS intelligence to drive measurable landscape impact.";
  const primaryText = (cta && typeof cta.primaryButtonText === 'string') ? cta.primaryButtonText : "Request an Advisory";
  const secondaryText = (cta && typeof cta.secondaryButtonText === 'string') ? cta.secondaryButtonText : "Contact Our Team";

  const handleClick = (eventName: string) => {
    trackEvent(eventName);
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-48 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute -bottom-12 -left-12 size-48 bg-background-dark/5 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-background-dark mb-6">{title}</h2>
            <p className="text-background-dark/80 text-lg mb-10 font-medium">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" onClick={() => handleClick('research_cta_primary')} className="bg-background-dark text-white font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform text-lg shadow-xl shadow-background-dark/20 focus:outline-none focus:ring-2 focus:ring-background-dark">{primaryText}</Button>
              <Button variant="secondary" onClick={() => handleClick('research_cta_secondary')} className="bg-white/20 hover:bg-white/30 text-background-dark border border-background-dark/10 font-bold px-10 py-4 rounded-xl transition-all text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-background-dark">{secondaryText}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCTA;*/

/*import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const ResearchCTA = () => {
  const { content } = useContent();
  const cta = content?.cta;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 size-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 size-48 bg-background-dark/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-background-dark mb-6">
              {typeof cta?.title === 'string' ? cta.title : "Ready to collaborate on your next project?"}
            </h2>
            <p className="text-background-dark/80 text-lg mb-10 font-medium">
              {typeof cta?.description === 'string'
                ? cta.description
                : "Join dozens of global organizations leveraging LIS intelligence to drive measurable landscape impact."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                onClick={() => trackEvent('research_cta_primary')}
                className="bg-background-dark text-white font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform text-lg shadow-xl shadow-background-dark/20"
              >
                {typeof cta?.primaryButtonText === 'string' ? cta.primaryButtonText : "Request an Advisory"}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => trackEvent('research_cta_secondary')}
                className="bg-white/20 hover:bg-white/30 text-background-dark border border-background-dark/10 font-bold px-10 py-4 rounded-xl transition-all text-lg backdrop-blur-sm"
              >
                {typeof cta?.secondaryButtonText === 'string' ? cta.secondaryButtonText : "Contact Our Team"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCTA;
*/