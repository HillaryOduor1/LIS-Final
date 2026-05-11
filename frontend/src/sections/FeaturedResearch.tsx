import { Link } from "react-router-dom";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type ResearchItem = {
  title: string;
  image: string;
  isNew?: boolean;
  category: string;
  date: string;
  description: string;
  link?: string;
};

interface FeaturedResearchProps {
  activeFilter: string;
}

const FeaturedResearch = ({ activeFilter }: FeaturedResearchProps) => {
  const { content } = useContent();
  const allResearch = (content && content.research) ? (content.research as ResearchItem[]) : [];
  
  const filteredResearch = activeFilter === "All Areas" 
    ? allResearch 
    : allResearch.filter(item => item.category === activeFilter);

  if (!filteredResearch.length) return null;

  return (
    <section id="featured-research" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-4">Featured Research</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">Our latest intelligence reports, policy briefs, and peer-reviewed studies on global landscape integrity.</p>
          </div>
          <Link to="#" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">View All Publications <span className="material-symbols-outlined">arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredResearch.map((item, index) => (
            <div key={index} className="group bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-[#e7f3ed] dark:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all focus-within:ring-2 focus-within:ring-primary">
              <div className="aspect-video relative overflow-hidden">
                <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
                {item.isNew && ( <div className="absolute top-4 left-4"><span className="bg-primary text-background-dark text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">New</span></div> )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                  <span>{item.category}</span>
                  <span className="size-1 bg-primary/30 rounded-full" aria-hidden="true"></span>
                  <span className="text-gray-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{item.description}</p>
                <Link to={item.link || '#'} className="inline-flex items-center gap-2 text-primary text-sm font-bold group/link focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={() => trackEvent('research_read_more', { title: item.title })}>Read Policy Brief <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_right_alt</span></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;
/*
// sections/FeaturedResearch.tsx (or FeaturedSection.tsx)
import { Link } from "react-router-dom";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type ResearchItem = {
  title: string;
  image: string;
  isNew?: boolean;
  category: string;
  date: string;
  description: string;
  link?: string;
};

const FeaturedResearch = () => {
  const { content } = useContent();
  const researchItems = (content && content.research) ? (content.research as ResearchItem[]) : [];

  if (!researchItems.length) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-4">Featured Research</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">Our latest intelligence reports, policy briefs, and peer-reviewed studies on global landscape integrity.</p>
          </div>
          <Link to="#" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={() => trackEvent('research_view_all')}>View All Publications <span className="material-symbols-outlined">arrow_forward</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchItems.map(function(item, index) {
            return (
              <div key={index} className="group bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-[#e7f3ed] dark:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all focus-within:ring-2 focus-within:ring-primary">
                <div className="aspect-video relative overflow-hidden">
                  <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
                  {item.isNew && ( <div className="absolute top-4 left-4"><span className="bg-primary text-background-dark text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">New</span></div> )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                    <span>{item.category}</span>
                    <span className="size-1 bg-primary/30 rounded-full" aria-hidden="true"></span>
                    <span className="text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{item.description}</p>
                  <Link to={item.link || '#'} className="inline-flex items-center gap-2 text-primary text-sm font-bold group/link focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={() => trackEvent('research_read_more', { title: item.title })}>Read Policy Brief <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_right_alt</span></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;*/

/*import { Link } from "react-router-dom";
import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type ResearchItem = {
  title: string;
  image: string;
  isNew?: boolean;
  category: string;
  date: string;
  description: string;
  link?: string;
};

const FeaturedResearch = () => {
  const { content } = useContent();
  const researchItems = (content?.research as ResearchItem[]) || [];

  if (!researchItems.length) return null;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-4">Featured Research</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Our latest intelligence reports, policy briefs, and peer-reviewed studies on global landscape integrity.
            </p>
          </div>
          <Link 
            to="#" 
            className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline"
            onClick={() => trackEvent('research_view_all')}
          >
            View All Publications <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchItems.map((item, index) => (
            <div key={index} className="group bg-white dark:bg-white/5 rounded-xl overflow-hidden border border-[#e7f3ed] dark:border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={item.image}
                />
                {item.isNew && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-background-dark text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">New</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                  <span>{item.category}</span>
                  <span className="size-1 bg-primary/30 rounded-full"></span>
                  <span className="text-gray-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{item.description}</p>
                <Link 
                  to={item.link || '#'} 
                  className="inline-flex items-center gap-2 text-primary text-sm font-bold group/link"
                  onClick={() => trackEvent('research_read_more', { title: item.title })}
                >
                  Read Policy Brief 
                  <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_right_alt</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;*/
