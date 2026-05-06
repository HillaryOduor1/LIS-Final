import * as React from "react";
import type { INavLink } from "../types";

/* ================= ICONS (SVG, ES5 SAFE) ================= */

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
    React.createElement("path", { d: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" }),
    React.createElement("path", { d: "M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" })
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

/* ================= NAV LINKS ================= */

export var navlinks = [
  {
    name: "Home",
    href: "/#HeroSection",
    icon: React.createElement(HomeIcon, null),
  },
  {
    name: "Features",
    href: "/#features",
    icon: React.createElement(SparklesIcon, null),
  },
  {
    name: "Testimonials",
    href: "/#testimonials",
    icon: React.createElement(StarIcon, null),
  },
  {
    name: "Pricing",
    href: "/#pricing",
    icon: React.createElement(CreditCardIcon, null),
  },
  {
    name: "Contact",
    href: "/#ContactSection",
    icon: React.createElement(MailIcon, null),
  },
] as INavLink[];


/*import { Home, Sparkles, Star, CreditCard, Mail } from "lucide-react";
import type { INavLink } from "../types";

export const navlinks: INavLink[] = [
  { name: "Home", href: "/#HeroSection", icon: <Home size={16} /> },
  { name: "Features", href: "/#features", icon: <Sparkles size={16} /> },
  { name: "Testimonials", href: "/#testimonials", icon: <Star size={16} /> },
  { name: "Pricing", href: "/#pricing", icon: <CreditCard size={16} /> },
  { name: "Contact", href: "/#ContactSection", icon: <Mail size={16} /> },
]; */
/*
export const navlinks: INavLink[] = [
    { name: "Home", href: "/#HeroSection" },
    { name: "Features", href: "/#features" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Contact", href: "/#ContactSection" }
];*/