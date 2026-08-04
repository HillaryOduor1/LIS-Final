import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';
import { useNavigate } from 'react-router-dom';

type HeroSectionContent = {
  announcementBadge?: string;
  announcementText?: string;
  headline?: string;
  highlightedText?: string;
  subtext?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  features?: string[];
  backgroundImage?: string;
};

const HeroSection = function() {
  var { content } = useContent();
  var hero = (content && content.hero) ? (content.hero as HeroSectionContent) : null;
  var navigate = useNavigate();

  if (!hero) {
    return null;
  }

  function handlePrimary() {
    trackEvent('cta_click_primary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    var featuresSection = document.getElementById('areas');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/research');
    }
  }

  function handleSecondary() {
    trackEvent('cta_click_secondary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    var contactSection = document.getElementById('ContactSection');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  }

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-10 lg:px-40 py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
        <img 
          alt="Lush green forest canopy" 
          className="w-full h-full object-cover" 
          src={hero.backgroundImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format'} 
        />
      </div>
      <div className="relative z-20 max-w-[800px] animate-fade-in">
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] mb-6">
          {hero.headline || 'Advancing Policy for'} 
          {hero.highlightedText && (
            <span className="text-primary"> {hero.highlightedText}</span>
          )}
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">
          {hero.subtext || 'We bridge the gap between global environmental policy and local conservation practice through rigorous research, strategic advisory, and actionable intelligence.'}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handlePrimary} 
            className="bg-primary hover:bg-primary/90 text-[#0d1b14] px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all hover:scale-105"
          >
            {hero.primaryButtonText || 'Explore Our Work'}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          
          <button 
            onClick={handleSecondary} 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white hover:scale-105"
          >
            {hero.secondaryButtonText || 'Contact Us'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
/*import { Button } from '../components/Button';
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';
import { useNavigate } from 'react-router-dom';

// Updated to match your database structure
type HeroSectionContent = {
  announcementBadge?: string;
  announcementText?: string;
  headline?: string;
  highlightedText?: string;
  subtext?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  features?: string[];
  backgroundImage?: string;
};

const HeroSection = () => {
  const { content } = useContent();
  const hero = (content && content.hero) ? (content.hero as HeroSectionContent) : null;
  const navigate = useNavigate();

  if (!hero) {
    console.log('No hero content found');
    return null;
  }

  //console.log('Hero content:', hero);

  const handlePrimary = () => {
    trackEvent('cta_click_primary');
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    // Scroll to Features/Areas section
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
        <img 
          alt="Lush green forest canopy" 
          className="w-full h-full object-cover" 
          src={hero.backgroundImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format'} 
        />
      </div>
      <div className="relative z-20 max-w-[800px] animate-fade-in">
        {/* Badge/Announcement /}
        {(hero.announcementBadge || hero.announcementText) && (
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            {hero.announcementBadge} {hero.announcementText && `• ${hero.announcementText}`}
          </span>
        )}/}
        
        {/* Headline /}
        <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] mb-6">
          {hero.headline || 'Advancing Policy for'} 
          {hero.highlightedText && (
            <span className="text-primary"> {hero.highlightedText}</span>
          )}
        </h1>
        
        {/* Description/Subtext /}
        <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10 max-w-2xl">
          {hero.subtext || 'We bridge the gap between global environmental policy and local conservation practice through rigorous research, strategic advisory, and actionable intelligence.'}
        </p>
        
        {/* Buttons *}
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handlePrimary} 
            className="bg-primary hover:scale-105 transition-transform text-[#0d1b14] px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            {hero.primaryButtonText || 'Explore Our Work'}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleSecondary} 
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white"
          >
            {hero.secondaryButtonText || 'Contact Us'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;*/
