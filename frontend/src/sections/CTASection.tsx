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

/*import * as React from 'react';
import { Button } from '../components/Button';
import { useContent } from '../content/useContext';

const CTASection = () => {
  const { content } = useContent();
  const cta = content?.cta;

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
            <Button className="bg-[#0d1b14] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl">
              {cta.primaryButtonText}
            </Button>
            <Button className="bg-white/20 border border-[#0d1b14]/10 text-[#0d1b14] px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors">
              {cta.secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;*/