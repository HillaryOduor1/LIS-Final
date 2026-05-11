import { useContent } from '../content/useContext';

const PartnersSection = () => {
  const { content } = useContent();
  const partners = content && content.partners ? content.partners : null;
  if (!partners) return null;

  const categories = Array.isArray(partners.categories) ? partners.categories : [];
  const logos = Array.isArray(partners.logos) ? partners.logos : [];

  return (
    <section className="py-24 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark" id="partners">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">{String(partners.badge)}</h2>
            <h3 className="text-4xl font-extrabold mb-6">{String(partners.title)}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{String(partners.description)}</p>
            <div className="mt-8 space-y-4">
              {categories.map(function(item, index) {
                return ( <div key={index} className="flex items-center gap-3 font-semibold text-sm"><span className="material-symbols-outlined text-primary" aria-hidden="true">check_circle</span>{item}</div> );
              })}
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
            {logos.map(function(partner, index) {
              return ( <div key={index} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-6 border border-slate-100 dark:border-slate-700"><span className="material-symbols-outlined text-4xl text-slate-400" aria-hidden="true">{partner.icon}</span></div> );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
/*import { useContent } from '../content/useContext';

const PartnersSection = () => {
  const { content } = useContent();
  const partners = content?.partners;

  if (!partners) return null;

  return (
    <section className="py-24 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark" id="partners">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">{String(partners.badge)}</h2>
            <h3 className="text-4xl font-extrabold mb-6">{String(partners.title)}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {String(partners.description)}
            </p>
            <div className="mt-8 space-y-4">
              {Array.isArray(partners.categories) && partners.categories.map((item, index) => (
                <div key={index} className="flex items-center gap-3 font-semibold text-sm">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
            {Array.isArray(partners.logos) && partners.logos.map((partner, index) => (
              <div key={index} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center p-6 border border-slate-100 dark:border-slate-700">
                <span className="material-symbols-outlined text-4xl text-slate-400">{partner.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;*/