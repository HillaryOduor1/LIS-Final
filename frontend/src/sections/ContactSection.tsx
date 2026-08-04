import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTitle from "../components/SectionTitle";
import { useContent } from "../content/useContext";
import { trackEvent } from '../analytics';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

/* Inline SVG Icons */
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" fill="currentColor"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4 8 5 8-5" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

const defaultContact = {
  sectionTitle: { text1: "Get in", text2: "touch", text3: "" },
  form: {
    nameLabel: "Your Name",
    namePlaceholder: "Enter Your Name",
    emailLabel: "Email Address",
    emailPlaceholder: "name@example.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we help?",
    submitText: "Send Message"
  }
};

type ContactContent = typeof defaultContact;

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

// Inner component that uses the reCAPTCHA hook
const ContactForm = () => {
  const { content } = useContent();
  const contact = (content && content.contact) ? (content.contact as ContactContent) : defaultContact;

  const formRef = useRef<HTMLFormElement>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formState, setFormState] = useState({ name: "", email: "", message: "", hp: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // GSAP animation (unchanged)
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
    else {
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

    // reCAPTCHA v3: execute and get token
    if (!executeRecaptcha) {
      setStatus({ type: "error", message: "reCAPTCHA not loaded. Please refresh." });
      setLoading(false);
      return;
    }

    let recaptchaToken = '';
    try {
      recaptchaToken = await executeRecaptcha('contact_submit');
    } catch (err) {
      setStatus({ type: "error", message: "reCAPTCHA verification failed. Please try again." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.msg || data.error || "Submission failed");
      setStatus({ type: "success", message: "Message sent successfully!" });
      trackEvent('form_submitted_contact');
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
      setFormState({ name: "", email: "", message: "", hp: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-12 md:mt-16 max-w-xl md:max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text)]">
      {/* Honeypot field – hidden */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="hp">Leave this empty</label>
        <input id="hp" name="hp" type="text" value={formState.hp} onChange={handleChange} tabIndex={-1} />
      </div>

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
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full md:w-auto px-12 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-neutral-tertiary animate-spin fill-brand"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            contact.form.submitText
          )}
        </button>
      </div>

      {status.message && (
        <div className={`md:col-span-2 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`} role={status.type === "success" ? "status" : "alert"}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default function ContactSection() {
  const { content } = useContent();
  const contact = (content && content.contact) ? (content.contact as ContactContent) : defaultContact;

  if (!RECAPTCHA_SITE_KEY) {
    console.warn('reCAPTCHA site key missing – CAPTCHA disabled');
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} language="en">
      <section id="ContactSection" className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">
        <SectionTitle text1={contact.sectionTitle.text1} text2={contact.sectionTitle.text2} text3={contact.sectionTitle.text3} />
        <ContactForm />
      </section>
    </GoogleReCaptchaProvider>
  );
}
