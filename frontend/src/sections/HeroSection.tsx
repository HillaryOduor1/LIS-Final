import * as React from 'react';
import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';
import { useNavigate } from 'react-router-dom';

type HeroSectionContent = {
  badge: string;
  headline: string;
  highlightedText: string;
  headlineEnd: string;
  description: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImage: string;
};

const HeroSection = () => {
  const { content } = useContent();
  const hero = (content && content.hero) ? (content.hero as HeroSectionContent) : undefined;
  const navigate = useNavigate();

  if (!hero) return null;

  const handlePrimary = () => {
    trackEvent('cta_click_primary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    // Scroll to Features section
    const featuresSection = document.getElementById('areas');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/research');
    }
  };

  const handleSecondary = () => {
    trackEvent('cta_click_secondary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    // Scroll to Contact section
    const contactSection = document.getElementById('ContactSection');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-10 lg:px-40 py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
        <img alt="Lush green forest canopy" className="w-full h-full object-cover" src={hero.backgroundImage} />
      </div>
      <div className="relative z-20 max-w-[800px] animate-fade-in">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">{hero.badge}</span>
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] mb-6">{hero.headline} <span className="text-primary">{hero.highlightedText}</span> {hero.headlineEnd}</h1>
        <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">{hero.description}</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg" onClick={handlePrimary} className="bg-primary hover:scale-105 transition-transform text-[#0d1b14] px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
            {hero.primaryButtonText}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Button>
          <Button variant="outline" size="lg" onClick={handleSecondary} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white">
            {hero.secondaryButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
/*import * as React from 'react';
import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type HeroSectionContent = {
  badge: string;
  headline: string;
  highlightedText: string;
  headlineEnd: string;
  description: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImage: string;
};

const HeroSection = () => {
  const { content } = useContent();
  const hero = (content && content.hero) ? (content.hero as HeroSectionContent) : undefined;
  if (!hero) return null;

  const handlePrimaryClick = () => {
    trackEvent('cta_click_primary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };
  const handleSecondaryClick = () => {
    trackEvent('cta_click_secondary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-10 lg:px-40 py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
        <img alt="Lush green forest canopy" className="w-full h-full object-cover" src={hero.backgroundImage} />
      </div>
      <div className="relative z-20 max-w-[800px] animate-fade-in">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">{hero.badge}</span>
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] mb-6">{hero.headline} <span className="text-primary">{hero.highlightedText}</span> {hero.headlineEnd}</h1>
        <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">{hero.description}</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg" onClick={handlePrimaryClick} className="bg-primary hover:scale-105 transition-transform text-[#0d1b14] px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">{hero.primaryButtonText}<span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></Button>
          <Button variant="outline" size="lg" onClick={handleSecondaryClick} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white">{hero.secondaryButtonText}</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;*/
/*
import * as React from 'react';
import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type HeroSectionContent = {
  badge: string;
  headline: string;
  highlightedText: string;
  headlineEnd: string;
  description: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImage: string;
};

const HeroSection = () => {
  const { content } = useContent();
  const hero = content?.hero as HeroSectionContent | undefined;

  if (!hero) return null;

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-10 lg:px-40 py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
        <img 
          alt="Lush green forest canopy" 
          className="w-full h-full object-cover" 
          src={hero.backgroundImage}
        />
      </div>
      <div className="relative z-20 max-w-[800px] animate-fade-in">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
          {hero.badge}
        </span>
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] mb-6">
          {hero.headline} <span className="text-primary">{hero.highlightedText}</span> {hero.headlineEnd}
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">
          {hero.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => trackEvent('cta_click_primary')}
            className="bg-primary hover:scale-105 transition-transform text-[#0d1b14] px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 group"
          >
            {hero.primaryButtonText}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => trackEvent('cta_click_secondary')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
          >
            {hero.secondaryButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
*/