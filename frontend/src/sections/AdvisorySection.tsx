import { useContent } from '../content/useContext';

type AdvisoryService = {
  icon: string;
  title: string;
  description: string;
};

const AdvisorySection = () => {
  const { content } = useContent();
  const services = (content && content.advisory) ? (content.advisory as AdvisoryService[]) : [];

  return (
    <section className="py-24 bg-[#edf5f1] dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Strategic Advisory Services</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We provide tailored intelligence and implementation support for governments, NGOs, and the private sector to achieve verifiable sustainability outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {services.map(function(service, index) {
            return (
              <div key={index} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/10 hover:border-primary transition-colors group focus-within:ring-2 focus-within:ring-primary">
                <div className="size-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">{service.icon}</span>
                </div>
                <h4 className="text-lg font-bold mb-3">{service.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvisorySection;
/*import { useContent } from '../content/useContext';

type AdvisoryService = {
  icon: string;
  title: string;
  description: string;
};

const AdvisorySection = () => {
  const { content } = useContent();
  const services = (content?.advisory as AdvisoryService[] | undefined) ?? [];

  return (
    <section className="py-24 bg-[#edf5f1] dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Strategic Advisory Services</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We provide tailored intelligence and implementation support for governments, NGOs, and the private sector to achieve verifiable sustainability outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/10 hover:border-primary transition-colors group">
              <div className="size-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-colors">
                <span className="material-symbols-outlined text-3xl">{service.icon}</span>
              </div>
              <h4 className="text-lg font-bold mb-3">{service.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvisorySection;*/