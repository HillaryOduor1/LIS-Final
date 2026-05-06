import { useContent } from '../content/useContext';

type AboutStat = {
  number: string;
  label: string;
};

type AboutFeature = {
  icon: string;
  title: string;
  description: string;
};

type AboutSectionData = {
  badge: string;
  title: string;
  description1: string;
  description2: string;
  image: string;
  stats?: AboutStat[];
  features?: AboutFeature[];
};

const AboutSection = () => {
  const { content } = useContent();
  const about = content?.about as AboutSectionData | undefined;

  if (!about) return null;

  return (
    <section className="py-24 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark" id="about">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 size-24 bg-primary/10 rounded-xl -z-10"></div>
          <img 
            alt="Team collaborating in a modern office" 
            className="rounded-2xl shadow-2xl border border-primary/10 w-full object-cover aspect-[4/3]" 
            src={about.image}
          />
          {about.stats?.map((stat, index) => (
            <div key={index} className="absolute -bottom-8 -right-8 bg-primary p-6 rounded-xl shadow-lg hidden md:block">
              <p className="text-[#0d1b14] font-black text-3xl">{stat.number}</p>
              <p className="text-[#0d1b14]/70 font-bold text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">{about.badge}</h2>
          <h3 className="text-4xl font-extrabold mb-6 leading-tight">{about.title}</h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {about.description1}
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {about.description2}
          </p>
          <div className="grid grid-cols-2 gap-6">
            {about.features?.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">{feature.icon}</span>
                <div>
                  <h4 className="font-bold">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;