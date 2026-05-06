import * as React from "react";
import type {
  INavLink,
  IFeature,
  IPricing,
  ITestimonial,
  IFooter,
} from "../types";

/* =========================================================
   ICONS
   ========================================================= */

/* ---------- NAV ICONS ---------- */

function HomeIcon() {
  return React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("path", { d: "M3 9l9-7 9 7" }),
    React.createElement("path", { d: "M9 22V12h6v10" })
  );
}

function SparklesIcon() {
  return React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("path", {
      d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
    }),
    React.createElement("path", {
      d: "M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z",
    })
  );
}

function StarIcon() {
  return React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("polygon", {
      points:
        "12 2 15 8.5 22 9.3 17 14.1 18.5 21 12 17.5 5.5 21 7 14.1 2 9.3 9 8.5 12 2",
    })
  );
}

function CreditCardIcon() {
  return React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("rect", { x: 2, y: 5, width: 20, height: 14, rx: 2 }),
    React.createElement("line", { x1: 2, y1: 10, x2: 22, y2: 10 })
  );
}

function MailIcon() {
  return React.createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    React.createElement("rect", { x: 2, y: 4, width: 20, height: 16, rx: 2 }),
    React.createElement("path", { d: "M22 6l-10 7L2 6" })
  );
}

/* ---------- FEATURE ICONS ---------- */

function FeatureIcon1() {
  return React.createElement(
    "svg",
    {
      width: 31,
      height: 34,
      viewBox: "0 0 31 34",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    React.createElement("path", {
      d: "M2.616 20.2a1.62 1.62 0 0 1-1.458-.91 1.59 1.59 0 0 1 .202-1.698L17.304 1.276a.806.806 0 0 1 1.385.736l-3.092 9.63a1.59 1.59 0 0 0 .765 1.978c.231.12.488.182.749.18h11.273a1.62 1.62 0 0 1 1.458.91 1.59 1.59 0 0 1-.202 1.698L13.696 32.724a.807.807 0 0 1-1.385-.736l3.092-9.63a1.59 1.59 0 0 0-.765-1.978 1.6 1.6 0 0 0-.748-.18z",
      stroke: "url(#a)",
      strokeWidth: 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

/* =========================================================
   DATA OBJECT
   ========================================================= */

export const data = {
  /* ---------------- NAVIGATION ---------------- */
  navigation: [
    { name: "Home", href: "/#HeroSection", icon: React.createElement(HomeIcon) },
    { name: "Features", href: "/#features", icon: React.createElement(SparklesIcon) },
    { name: "Testimonials", href: "/#testimonials", icon: React.createElement(StarIcon) },
    { name: "Pricing", href: "/#pricing", icon: React.createElement(CreditCardIcon) },
    { name: "Contact", href: "/#ContactSection", icon: React.createElement(MailIcon) },
  ] as INavLink[],

  /* ---------------- FEATURES ---------------- */
  features: [
    {
      icon: React.createElement(FeatureIcon1),
      title: "Lightning-fast setup",
      description:
        "Launch production-ready pages in minutes with prebuilt components.",
    },
    {
      icon: React.createElement(FeatureIcon1),
      title: "Pixel perfect",
      description:
        "Modern Figma-driven UI that translates to exact code.",
    },
    {
      icon: React.createElement(FeatureIcon1),
      title: "Highly customizable",
      description:
        "Tailwind utility-first classes make customization trivial.",
    },
  ] as IFeature[],

  /* ---------------- PRICING ---------------- */
  pricing: [
    {
      name: "Basic",
      price: 29,
      period: "month",
      features: [
        "Access to all basic courses",
        "Community support",
        "10 practice projects",
        "Course completion certificate",
        "Basic code review",
      ],
      mostPopular: false,
    },
    {
      name: "Pro",
      price: 79,
      period: "month",
      features: [
        "Access to all Pro courses",
        "Priority community support",
        "30 practice projects",
        "Course completion certificate",
        "Advance code review",
        "1-on-1 mentoring sessions",
        "Job assistance",
      ],
      mostPopular: true,
    },
    {
      name: "Enterprise",
      price: 199,
      period: "month",
      features: [
        "Access to all courses",
        "Dedicated support",
        "Unlimited projects",
        "Course completion certificate",
        "Premium code review",
      ],
      mostPopular: false,
    },
  ] as IPricing[],

  /* ---------------- TESTIMONIALS ---------------- */
  testimonials: [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Sophia Carter",
      handle: "@sophiacodes",
      date: "February 14, 2025",
      quote:
        "This SaaS app has completely streamlined our onboarding process.",
    },
  ] as ITestimonial[],

  /* ---------------- FOOTER ---------------- */
  footer: [
    {
      title: "Product",
      links: [
        { name: "Home", href: "/" },
        { name: "Support", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Affiliate", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Company", href: "#" },
        { name: "Blogs", href: "#" },
        { name: "Community", href: "#" },
        { name: "Careers", href: "#" },
        { name: "About", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
      ],
    },
  ] as IFooter[],
};
