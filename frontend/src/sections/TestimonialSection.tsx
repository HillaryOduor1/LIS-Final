import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import { useContent } from "../content/useContext";
import type { ITestimonial } from "../types"; // Import the correct type

export default function TestimonialSection() {
  const { content } = useContent();
  const testimonialsRaw = (content && content.testimonials) ? content.testimonials : [];
  // Ensure the data matches the expected ITestimonial shape
  const testimonials = Array.isArray(testimonialsRaw) ? (testimonialsRaw as ITestimonial[]) : [];

  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);
  
  const repeatedTestimonials = testimonials.length > 0 
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials] 
    : [];

  useEffect(() => {
    if (!row1Ref.current || !row2Ref.current || testimonials.length === 0) return;
    const runAnimation = () => {
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      if (!row1 || !row2) return;
      const cards1 = Array.from(row1.children) as HTMLElement[];
      if (!cards1.length) return;
      const spacing = 32;
      const cardWidth = cards1[0].offsetWidth || 300;
      const totalWidth = (cardWidth + spacing) * testimonials.length;
      gsap.to(row1, { 
        x: -totalWidth, 
        duration: 30, 
        ease: "linear", 
        repeat: -1, 
        onRepeat: function() { gsap.set(row1, { x: 0 }); } 
      });
      gsap.set(row2, { x: -totalWidth });
      gsap.to(row2, { 
        x: 0, 
        duration: 35, 
        ease: "linear", 
        repeat: -1, 
        onRepeat: function() { gsap.set(row2, { x: -totalWidth }); } 
      });
    };
    if (document.readyState === "complete") runAnimation();
    else { 
      window.addEventListener("load", runAnimation); 
      return () => window.removeEventListener("load", runAnimation); 
    }
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden py-12">
      <SectionTitle 
        text1="Testimonials" 
        text2="Don't just take our words" 
        text3="Hear what our users say about us. We're always looking for ways to improve." 
      />
      {/* Row 1 */}
      <div className="relative overflow-hidden mt-12">
        <div className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap" ref={row1Ref}>
          {repeatedTestimonials.map((testimonial, index) => (
            <div key={`top-${index}`} className="inline-block w-72 sm:w-80 md:w-72 flex-shrink-0">
              <TestimonialCard 
                index={index} 
                testimonial={testimonial} 
              />
            </div>
          ))}
        </div>
      </div>
      {/* Row 2 */}
      <div className="relative overflow-hidden mt-6">
        <div className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap" ref={row2Ref}>
          {repeatedTestimonials.map((testimonial, index) => (
            <div key={`bottom-${index}`} className="inline-block w-72 sm:w-80 md:w-72 flex-shrink-0">
              <TestimonialCard 
                index={index} 
                testimonial={testimonial} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/*import { useEffect, useRef, type ComponentProps } from "react";
import { gsap } from "gsap";
import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import { useContent } from "../content/useContext";

export default function TestimonialSection() {
  const { content } = useContent();
  const testimonials = (content?.testimonials ?? []) as ComponentProps<typeof TestimonialCard>["testimonial"][];

  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);

  const repeatedTestimonials: typeof testimonials = testimonials.length > 0
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [];

  useEffect(() => {
    if (!row1Ref.current || !row2Ref.current || testimonials.length === 0) return;

    const runAnimation = () => {
      const row1 = row1Ref.current!;
      const row2 = row2Ref.current!;
      const cards1 = Array.from(row1.children) as HTMLElement[];
      if (!cards1.length) return;

      const spacing = 32;
      const cardWidth = cards1[0].offsetWidth || 300;
      const totalWidth = (cardWidth + spacing) * testimonials.length;

      // Row 1: scroll left
      gsap.to(row1, {
        x: -totalWidth,
        duration: 30,
        ease: "linear",
        repeat: -1,
        onRepeat: () => { gsap.set(row1, { x: 0 }); }  // ✅ block returns void
      });

      // Row 2: scroll right (starting shifted)
      gsap.set(row2, { x: -totalWidth });
      gsap.to(row2, {
        x: 0,
        duration: 35,
        ease: "linear",
        repeat: -1,
        onRepeat: () => { gsap.set(row2, { x: -totalWidth }); } // ✅ block returns void
      });
    };

    if (document.readyState === "complete") {
      runAnimation();
    } else {
      window.addEventListener("load", runAnimation);
      return () => window.removeEventListener("load", runAnimation);
    }
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden py-12"
    >
      <SectionTitle
        text1="Testimonials"
        text2="Don't just take our words"
        text3="Hear what our users say about us. We're always looking for ways to improve."
      />

      {/* Row 1 /}
      <div className="relative overflow-hidden mt-12">
        <div
          className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap"
          ref={row1Ref}
        >
          {repeatedTestimonials.map((testimonial, index) => (
            <div
              key={`top-${index}`}
              className="inline-block w-72 sm:w-80 md:w-72 flex-shrink-0"
            >
              <TestimonialCard index={index} testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 /}
      <div className="relative overflow-hidden mt-6">
        <div
          className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap"
          ref={row2Ref}
        >
          {repeatedTestimonials.map((testimonial, index) => (
            <div
              key={`bottom-${index}`}
              className="inline-block w-72 sm:w-80 md:w-72 flex-shrink-0"
            >
              <TestimonialCard index={index} testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}*/
