import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/SectionTitle";
import { useContent } from "../content/useContext";
import { trackEvent } from '../analytics';

/* ---------- Inline SVG Icons (unchanged) ---------- */
function UserIcon() { return ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" fill="currentColor"/></svg> ); }
function MailIcon() { return ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5" stroke="currentColor" strokeWidth="2" fill="none"/></svg> ); }
function ArrowRightIcon() { return ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l6 7-6 7" stroke="currentColor" strokeWidth="2" fill="none"/></svg> ); }

gsap.registerPlugin(ScrollTrigger);

const defaultContact = {
  sectionTitle: { text1: "Get in", text2: "touch", text3: "" },
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "hello@example.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we help?",
    submitText: "Send Message"
  }
};

type ContactContent = typeof defaultContact;

export default function ContactSection() {
  const { content } = useContent();
  const contact = (content && content.contact) ? (content.contact as ContactContent) : defaultContact;

  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;
    const runAnimation = () => {
      const items = formRef.current?.querySelectorAll("[data-animate]");
      if (!items?.length) return;
      gsap.fromTo(
        items,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: formRef.current, start: "top 85%", once: true } }
      );
    };
    if (document.readyState === "complete") runAnimation();
    else { window.addEventListener("load", runAnimation); return () => window.removeEventListener("load", runAnimation); }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formState) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.msg || data.error || "Submission failed");
      setStatus({ type: "success", message: "Message sent successfully!" });
      trackEvent('form_submitted_contact');
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
      setFormState({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
    } finally { setLoading(false); }
  };

  return (
    <section id="ContactSection" className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
      <SectionTitle text1={contact.sectionTitle.text1} text2={contact.sectionTitle.text2} text3={contact.sectionTitle.text3} />
      <form ref={formRef} onSubmit={handleSubmit} className="mt-12 md:mt-16 max-w-xl md:max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text)]">
        <div data-animate className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-semibold text-[var(--muted)] ml-1">{contact.form.nameLabel}</label>
          <div className="flex items-center gap-3 px-4 rounded-xl border border-border bg-[var(--surface)] focus-within:border-[var(--accent)] transition-all">
            <UserIcon />
            <input id="contact-name" name="name" type="text" value={formState.name} onChange={handleChange} required placeholder={contact.form.namePlaceholder} className="w-full py-3.5 text-sm bg-transparent outline-none placeholder:text-[var(--muted)]" aria-required="true" />
          </div>
        </div>
        <div data-animate className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-semibold text-[var(--muted)] ml-1">{contact.form.emailLabel}</label>
          <div className="flex items-center gap-3 px-4 rounded-xl border border-border bg-[var(--surface)] focus-within:border-[var(--accent)] transition-all">
            <MailIcon />
            <input id="contact-email" name="email" type="email" value={formState.email} onChange={handleChange} required placeholder={contact.form.emailPlaceholder} className="w-full py-3.5 text-sm bg-transparent outline-none placeholder:text-[var(--muted)]" aria-required="true" />
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-2" data-animate>
          <label htmlFor="contact-message" className="text-sm font-semibold text-[var(--muted)] ml-1">{contact.form.messageLabel}</label>
          <textarea id="contact-message" name="message" rows={5} value={formState.message} onChange={handleChange} required placeholder={contact.form.messagePlaceholder} className="w-full p-4 text-sm bg-[var(--surface)] border border-border rounded-xl focus:border-[var(--accent)] transition-all outline-none resize-none placeholder:text-[var(--muted)]" aria-required="true" />
        </div>
        <div className="md:col-span-2 flex justify-start pt-4" data-animate>
          <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-12 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">{loading ? "Sending..." : contact.form.submitText}<ArrowRightIcon /></button>
        </div>
        {status.message && ( <div className={`md:col-span-2 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`} role={status.type === "success" ? "status" : "alert"}>{status.message}</div> )}
      </form>
    </section>
  );
}
/*import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/SectionTitle";
import { useContent } from "../content/useContext";
import { trackEvent } from '../analytics';

/* ---------- Inline SVG Icons ---------- /
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l6 7-6 7"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

// Default content in case CMS data is missing
const defaultContact = {
  sectionTitle: { text1: "Get in", text2: "touch", text3: "" },
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "hello@example.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we help?",
    submitText: "Send Message"
  }
};

type ContactContent = typeof defaultContact;

export default function ContactSection() {
  const { content } = useContent();
  // Safely extract contact data with fallback
  const contact: ContactContent = (content?.contact as ContactContent) || defaultContact;

  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // GSAP animation (runs once on load)
  useEffect(() => {
    if (!formRef.current) return;

    const runAnimation = () => {
      const items = formRef.current?.querySelectorAll("[data-animate]");
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    };

    if (document.readyState === "complete") {
      runAnimation();
    } else {
      window.addEventListener("load", runAnimation);
      return () => window.removeEventListener("load", runAnimation);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.msg || data.error || "Submission failed");
      }
      setStatus({ type: "success", message: "Message sent successfully!" });
      trackEvent('form_submitted_contact');
      setFormState({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="ContactSection"
      className="
        px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28
        py-16 md:py-24
      "
    >
      <SectionTitle
        text1={contact.sectionTitle.text1}
        text2={contact.sectionTitle.text2}
        text3={contact.sectionTitle.text3}
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="
          mt-12 md:mt-16
          max-w-xl md:max-w-2xl
          mx-auto w-full
          grid grid-cols-1 md:grid-cols-2
          gap-6
          text-[var(--text)]
        "
      >
        {/* Name /}
        <div data-animate className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--muted)] ml-1">
            {contact.form.nameLabel}
          </label>
          <div className="flex items-center gap-3 px-4 rounded-xl border border-border bg-[var(--surface)] focus-within:border-[var(--accent)] transition-all">
            <UserIcon />
            <input
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              required
              placeholder={contact.form.namePlaceholder}
              className="w-full py-3.5 text-sm bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </div>

        {/* Email /}
        <div data-animate className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--muted)] ml-1">
            {contact.form.emailLabel}
          </label>
          <div className="flex items-center gap-3 px-4 rounded-xl border border-border bg-[var(--surface)] focus-within:border-[var(--accent)] transition-all">
            <MailIcon />
            <input
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
              placeholder={contact.form.emailPlaceholder}
              className="w-full py-3.5 text-sm bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </div>

        {/* Message /}
        <div className="md:col-span-2 flex flex-col gap-2" data-animate>
          <label className="text-sm font-semibold text-[var(--muted)] ml-1">
            {contact.form.messageLabel}
          </label>
          <textarea
            name="message"
            rows={5}
            value={formState.message}
            onChange={handleChange}
            required
            placeholder={contact.form.messagePlaceholder}
            className="
              w-full p-4 text-sm bg-[var(--surface)] border border-border rounded-xl focus:border-[var(--accent)] transition-all outline-none resize-none placeholder:text-[var(--muted)]
            "
          />
        </div>

        {/* Submit /}
        <div className="md:col-span-2 flex justify-start pt-4" data-animate>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto px-12 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : contact.form.submitText}
            <ArrowRightIcon />
          </button>
        </div>

        {/* Status message /}
        {status.message && (
          <div className={`md:col-span-2 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {status.message}
          </div>
        )}
      </form>
    </section>
  );
}
*/