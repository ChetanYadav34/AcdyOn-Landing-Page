"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { 
    name: "Programs", 
    href: "#programs",
    dropdown: {
      title: "Programs",
      description: "Executive education, AI mastery, and professional development programmes.",
      items: [
        { title: "Agentic AI & Automation Mastery", desc: "Build AI agents, automate workflows, and deploy real projects.", href: "#" },
        { title: "Cybersecurity & AI Mastery", desc: "Industry-focused cybersecurity training with career acceleration.", href: "#" },
        { title: "AI for Business Leaders", desc: "Strategic AI decision-making for executives and founders.", href: "#" },
        { title: "Corporate Training", desc: "Custom AI and leadership learning for organisations.", href: "#" },
      ]
    }
  },
  { 
    name: "Doctoral", 
    href: "#doctoral",
    dropdown: {
      title: "Doctoral",
      description: "Doctoral pathways and honorary recognition from globally accredited institutions.",
      items: [
        { title: "Kennedy University DBA", desc: "US-based prestigious DBA programme.", href: "#" },
        { title: "Dunster Business School DBA", desc: "Swiss QS 4-Star DBA with international reach.", href: "#" },
        { title: "LSMT DBA", desc: "London-based research-driven DBA programme.", href: "#" },
        { title: "EIMT DBA", desc: "Swiss innovation-focused DBA for executives.", href: "#" },
        { title: "Birchwood DBA", desc: "Accelerated 2-year US executive DBA.", href: "#" },
      ]
    }
  },
  { 
    name: "Universities", 
    href: "#universities",
    dropdown: {
      title: "Universities",
      description: "International pathways, verification, and academic clarity.",
      items: [
        { title: "Partner Universities", desc: "Explore the global academic network.", href: "#" },
        { title: "Academic Recognition", desc: "Understanding international positioning and fit.", href: "#" },
        { title: "Global Network", desc: "Geographic reach and regional pathways.", href: "#" },
      ]
    }
  },
  { 
    name: "Resources", 
    href: "#resources",
    dropdown: {
      title: "Resources",
      description: "Insights, guides, and tools for navigating your learning journey.",
      items: [
        { title: "Blogs", desc: "Insights on AI, education, and academic advancement.", href: "#" },
        { title: "Brochures", desc: "Detailed program brochures and guides.", href: "#" },
        { title: "Events", desc: "Webinars, open days, and information sessions.", href: "#" },
        { title: "Scholarship Calculator", desc: "Estimate your indicative scholarship and net fee.", href: "#" },
      ]
    }
  },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-500",
        scrolled ? "bg-bg-primary/95 backdrop-blur-xl border-b border-border-subtle shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group"
        >
          <img 
            src="/acdyon-logo.webp" 
            alt="AcdyOn Logo" 
            className="h-9 w-9 object-contain drop-shadow-md invert mix-blend-multiply dark:invert-0 dark:mix-blend-normal transition-all" 
          />
          <span className="text-xl font-serif font-semibold tracking-tight text-text-primary group-hover:text-blue transition-colors">
            AcdyOn
          </span>
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="relative group/nav">
              <Link
                href={link.href}
                className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-blue transition-colors py-2"
              >
                {link.name}
                {link.dropdown && <ChevronDown size={14} className="transition-transform group-hover/nav:-rotate-180" />}
              </Link>
              
              {link.dropdown && (
                <div className="absolute left-1/2 top-full w-[400px] -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300 z-50">
                  <div className="rounded-xl border border-border-subtle bg-bg-primary/95 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                    <div className="bg-[#0A0D14] dark:bg-black rounded-lg p-5 mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                        <Sparkles size={14} />
                        {link.dropdown.title}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {link.dropdown.description}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      {link.dropdown.items.map((item, idx) => (
                        <Link key={idx} href={item.href} className="block p-3 rounded-lg hover:bg-bg-secondary transition-colors">
                          <span className="block text-sm font-semibold text-text-primary mb-1">{item.title}</span>
                          <span className="block text-xs text-text-secondary leading-tight">{item.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <Link
            href="#consultation"
            className="hidden md:inline-flex items-center justify-center h-10 px-6 rounded-full bg-blue text-white text-sm font-semibold hover:bg-blue/90 transition-transform hover:-translate-y-0.5"
          >
            Book Consultation
          </Link>
          <button className="lg:hidden p-2 text-text-primary">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
