import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

interface CTAContent {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const CTASection = () => {
  const { content } = useContent();
  const ctaRaw = content && content.cta ? content.cta : null;
  const cta = ctaRaw as unknown as CTAContent | null;
  if (!cta) return null;

  const handlePrimary = () => {
    trackEvent('cta_primary_click', { section: 'global_cta' });
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const advisorySection = document.getElementById('advisory');
    if (advisorySection) advisorySection.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/research#advisory';
  };

  const handleSecondary = () => {
    trackEvent('cta_secondary_click', { section: 'global_cta' });
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const contactSection = document.getElementById('ContactSection');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/contact';
  };

  return (
    <section className="py-20 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto bg-primary rounded-[2rem] p-8 sm:p-12 md:p-20 relative overflow-hidden text-[#0d1b14] bg-solid-fallback">
        {/* solid fallback for older browsers */}
        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 size-64 bg-background-dark/5 rounded-full -ml-32 -mb-32 blur-3xl" aria-hidden="true"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8">{cta.title}</h3>
          <p className="text-base sm:text-lg font-medium opacity-80 mb-8 sm:mb-10">{cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handlePrimary} className="bg-[#0d1b14] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-800 transition-colors shadow-xl focus:outline-none focus:ring-2 focus:ring-white">
              {cta.primaryButtonText}
            </Button>
            <Button onClick={handleSecondary} className="bg-white/20 hover:bg-white/30 text-[#0d1b14] border border-[#0d1b14]/10 font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-xl transition-all text-base sm:text-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#0d1b14]">
              {cta.secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
/*import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

interface CTAContent {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const CTASection = () => {
  const { content } = useContent();
  const ctaRaw = content && content.cta ? content.cta : null;
  // Safe type assertion
  const cta = ctaRaw as unknown as CTAContent | null;

  if (!cta) return null;

  const handleClick = (eventName: string) => {
    trackEvent(eventName, { section: 'global_cta' });
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <section className="py-20 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto bg-primary rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-[#0d1b14]">
        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 size-64 bg-background-dark/5 rounded-full -ml-32 -mb-32 blur-3xl" aria-hidden="true"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-8">{cta.title}</h3>
          <p className="text-lg font-medium opacity-80 mb-10">{cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => handleClick('cta_primary_click')} className="bg-[#0d1b14] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl focus:outline-none focus:ring-2 focus:ring-white">{cta.primaryButtonText}</Button>
            <Button onClick={() => handleClick('cta_secondary_click')} className="bg-white/20 border border-[#0d1b14]/10 text-[#0d1b14] px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d1b14]">{cta.secondaryButtonText}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;*/
/*
import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

interface CTAContent {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const CTASection = () => {
  const { content } = useContent();
  const cta = content?.cta as CTAContent | undefined;

  if (!cta) return null;

  return (
    <section className="py-20 px-4 md:px-10 lg:px-40">
      <div className="max-w-[1280px] mx-auto bg-primary rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-[#0d1b14]">
        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 size-64 bg-background-dark/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-8">{cta.title}</h3>
          <p className="text-lg font-medium opacity-80 mb-10">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => trackEvent('cta_primary_click', { section: 'global_cta' })}
              className="bg-[#0d1b14] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl"
            >
              {cta.primaryButtonText}
            </Button>
            <Button 
              onClick={() => trackEvent('cta_secondary_click', { section: 'global_cta' })}
              className="bg-white/20 border border-[#0d1b14]/10 text-[#0d1b14] px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors"
            >
              {cta.secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
*/