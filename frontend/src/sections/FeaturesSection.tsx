import { useContent } from '../content/useContext';
import { trackEvent } from '../analytics';

type Area = {
  title: string;
  description: string;
  icon: string;
  link: string;
};

const FeaturesSection = () => {
  const { content } = useContent();
  const areas = (content?.areas ?? []) as Area[];

  return (
    <section className="py-24 px-4 md:px-10 lg:px-40 bg-background-light dark:bg-[#0a1510]" id="areas">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">Our Expertise</h2>
          <h3 className="text-4xl font-extrabold mb-6">Core Thematic Areas</h3>
          <p className="text-slate-600 dark:text-slate-400">We specialize in four critical pillars of environmental governance, providing specialized knowledge and implementation frameworks for each.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area, index) => (
            <div key={index} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/5 hover:border-primary/30 transition-all hover:-translate-y-2 group shadow-sm">
              <div className="size-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl">{area.icon}</span>
              </div>
              <h4 className="text-xl font-bold mb-4">{area.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {area.description}
              </p>
              <a 
                className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all" 
                href={area.link}
                onClick={() => trackEvent('feature_learn_more', { area: area.title })}
              >
                Learn more <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
/*import * as React from 'react';
import { useContent } from '../content/useContext';

const FeaturesSection = () => {
  const { content } = useContent();
  const areas = content?.areas || [];

  return (
    <section className="py-24 px-4 md:px-10 lg:px-40 bg-background-light dark:bg-[#0a1510]" id="areas">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">Our Expertise</h2>
          <h3 className="text-4xl font-extrabold mb-6">Core Thematic Areas</h3>
          <p className="text-slate-600 dark:text-slate-400">We specialize in four critical pillars of environmental governance, providing specialized knowledge and implementation frameworks for each.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area, index) => (
            <div key={index} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/5 hover:border-primary/30 transition-all hover:-translate-y-2 group shadow-sm">
              <div className="size-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl">{area.icon}</span>
              </div>
              <h4 className="text-xl font-bold mb-4">{area.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {area.description}
              </p>
              <a className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all" href={area.link}>
                Learn more <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;*/
