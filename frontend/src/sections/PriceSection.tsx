import { useEffect, useRef } from "react";
import SectionTitle from "../components/SectionTitle";
import { CheckIcon } from "../components/icons";
import { useContent } from "../content/useContext";
import { trackEvent } from '../analytics';

type Plan = {
  name: string;
  price: number;
  period: string;
  features: string[];
  mostPopular?: boolean;
};

export default function PricingSection() {
  const { content } = useContent();
  const pricing = (content?.pricing as Plan[]) || [];

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("animate-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && el) {
            el.classList.add("animate-in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 reveal"
    >
      <SectionTitle
        text1="Pricing"
        text2="Our Pricing Plans"
        text3="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up."
      />

      <div className="mt-12 flex flex-wrap justify-center -m-4">
        {pricing.map((plan, index) => {
          return (
            <div
              key={index}
              className={`surface m-4 w-full max-w-sm flex flex-col gap-6 relative ${plan.mostPopular ? "border-[var(--accent)] border-2" : ""
                }`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
                  {plan.name}
                </p>
                <h1 className="text-4xl font-bold text-[var(--text)]">
                  ${plan.price}
                  <span className="text-lg font-normal text-[var(--muted)] ml-1">
                    /{plan.period}
                  </span>
                </h1>
              </div>

              <ul className="space-y-4 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[var(--text)]">
                    <CheckIcon
                      size={18}
                      className="text-[var(--accent)] flex-shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => trackEvent('pricing_get_started', { plan: plan.name })}
                className={`btn-primary w-full py-4 text-base ${!plan.mostPopular ? "opacity-90 hover:opacity-100" : ""
                  }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
