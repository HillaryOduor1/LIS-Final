import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';
import { useNavigate } from 'react-router-dom';

const ResearchHero = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const hero = content && content.hero ? content.hero : null;
  const bgImage = (hero && typeof hero.backgroundImage === 'string') ? hero.backgroundImage : "";

  const handleExplore = () => {
    trackEvent('research_hero_explore');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const filtersSection = document.getElementById('research-filters');
    if (filtersSection) filtersSection.scrollIntoView({ behavior: 'smooth' });
    else navigate('/research#filters');
  };

  const handleCaseStudies = () => {
    trackEvent('research_hero_case_studies');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    const featuredSection = document.getElementById('featured-research');
    if (featuredSection) featuredSection.scrollIntoView({ behavior: 'smooth' });
    else navigate('/research#featured');
  };

  return (
    <section className="relative bg-background-dark py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
        <img alt="Environmental Landscape" className="w-full h-full object-cover opacity-50" src={bgImage} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase rounded mb-6">Think Tank & Intelligence</span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">Research & <br/><span className="text-primary">Strategic Advisories</span></h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10">Translating complex environmental data into actionable policy and governance frameworks. We bridge the critical gap between global environmental policy and local conservation practice.</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="xl" onClick={handleExplore} className="bg-primary text-background-dark font-bold focus:outline-none focus:ring-2 focus:ring-white">Explore Our Research</Button>
            <Button variant="outline" size="xl" onClick={handleCaseStudies} className="border border-white/20 text-white font-bold backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white">View Case Studies</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchHero;
/*
import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const ResearchHero = () => {
  const { content } = useContent();
  const hero = content && content.hero ? content.hero : null;
  const bgImage = (hero && typeof hero.backgroundImage === 'string') 
    ? hero.backgroundImage 
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuDv1VR6-q7xioqxuVCEGJIVDlt6TwgppSKX0DKN6myRGFJNp6LMI2YTt1Xh7jI-J7K6Qybzb2EWiW5JfvjCHsHUvdES16mWTrPECvtzdDhPtEU-WhoezUBrFFXWdynK-QLTbHKrRKwxSBXDWaHfyfCeJPWGc1WXxh1mrC1cDlDnNi3KRi8V71h_CCjnyNuE9lZfFkEWvrg-T1_JfHKi68uz8br8TZKODTL32EHxAKpUNzKQ1A9R87wgyAXasZUj-EbrQg5orzHU17Y";

  const handleExplore = () => {
    trackEvent('research_hero_explore');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };
  const handleCaseStudies = () => {
    trackEvent('research_hero_case_studies');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
  };

  return (
    <section className="relative bg-background-dark py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
        <img alt="Environmental Landscape" className="w-full h-full object-cover opacity-50" src={bgImage} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase rounded mb-6">Think Tank & Intelligence</span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">Research & <br/><span className="text-primary">Strategic Advisories</span></h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10">Translating complex environmental data into actionable policy and governance frameworks. We bridge the critical gap between global environmental policy and local conservation practice.</p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="xl" onClick={handleExplore} className="bg-primary text-background-dark font-bold focus:outline-none focus:ring-2 focus:ring-white">Explore Our Research</Button>
            <Button variant="outline" size="xl" onClick={handleCaseStudies} className="border border-white/20 text-white font-bold backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white">View Case Studies</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchHero;*/

/*import { Button } from "../components/Button";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

const ResearchHero = () => {
  const { content } = useContent();
  const hero = content?.hero;

  return (
    <section className="relative bg-background-dark py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
        <img 
          alt="Environmental Landscape" 
          className="w-full h-full object-cover opacity-50" 
          src={(hero?.backgroundImage as string) || "https://lh3.googleusercontent.com/aida-public/AB6AXuDv1VR6-q7xioqxuVCEGJIVDlt6TwgppSKX0DKN6myRGFJNp6LMI2YTt1Xh7jI-J7K6Qybzb2EWiW5JfvjCHsHUvdES16mWTrPECvtzdDhPtEU-WhoezUBrFFXWdynK-QLTbHKrRKwxSBXDWaHfyfCeJPWGc1WXxh1mrC1cDlDnNi3KRi8V71h_CCjnyNuE9lZfFkEWvrg-T1_JfHKi68uz8br8TZKODTL32EHxAKpUNzKQ1A9R87wgyAXasZUj-EbrQg5orzHU17Y"}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase rounded mb-6">
            Think Tank & Intelligence
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Research & <br/><span className="text-primary">Strategic Advisories</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10">
            Translating complex environmental data into actionable policy and governance frameworks. We bridge the critical gap between global environmental policy and local conservation practice.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              size="xl" 
              onClick={() => trackEvent('research_hero_explore')}
              className="bg-primary text-background-dark font-bold"
            >
              Explore Our Research
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              onClick={() => trackEvent('research_hero_case_studies')}
              className="border border-white/20 text-white font-bold backdrop-blur-sm"
            >
              View Case Studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchHero;
*/