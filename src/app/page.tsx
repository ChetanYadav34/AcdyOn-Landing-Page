"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ScrollWorld } from "@/components/3d/ScrollWorld";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import Link from "next/link";

// ---- FIND MY PATH FUNNEL COMPONENT ----
function FindMyPath() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ q1: "", q2: "", q3: "" });

  const handleSelect = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    if (step < 4) setStep(step + 1);
  };

  if (step === 4) {
    return (
      <div className="bg-bg-primary/90 dark:bg-bg-primary/80 backdrop-blur-xl p-10 rounded-2xl border border-border-subtle shadow-2xl transition-opacity duration-500 w-full max-w-2xl mx-auto text-center pointer-events-auto">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-text-secondary mb-4">Your Pathway</h2>
        <h3 className="font-serif text-4xl text-text-primary mb-4">Executive AI Leadership</h3>
        <p className="text-lg text-text-secondary mb-10 max-w-lg mx-auto">
          Based on your experience as a {selections.q1.toLowerCase() || 'professional'} focused on {selections.q2.toLowerCase() || 'leadership'}, an executive AI pathway is the strongest direction.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pathways/executive-ai" className="px-8 py-4 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors font-medium">
            Explore This Path
          </Link>
          <Link href="/consultation/book" className="px-8 py-4 border border-border-subtle hover:border-gold transition-colors text-text-primary rounded-lg font-medium">
            Book Consultation &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary/90 dark:bg-bg-primary/80 backdrop-blur-xl p-10 rounded-2xl border border-border-subtle shadow-2xl w-full max-w-2xl mx-auto pointer-events-auto">
      <div className="flex justify-between items-center mb-10">
        <span className="text-sm font-bold tracking-widest text-gold uppercase">Step 0{step} / 03</span>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-10 rounded-full transition-colors duration-500 ${step >= i ? 'bg-gold' : 'bg-border-subtle'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="transition-opacity duration-500">
          <h3 className="font-serif text-3xl text-text-primary mb-8">Where are you in your professional journey?</h3>
          <div className="grid grid-cols-1 gap-4">
            {["Mid-level Professional", "Senior Executive", "Academic", "Corporate Leader"].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('q1', opt)}
                className="w-full text-left px-6 py-5 rounded-xl border border-border-subtle hover:border-blue hover:shadow-md transition-all text-text-secondary hover:text-text-primary font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="transition-opacity duration-500">
          <h3 className="font-serif text-3xl text-text-primary mb-8">What is your primary objective?</h3>
          <div className="grid grid-cols-1 gap-4">
            {["Leadership Expansion", "AI Transformation", "Academic Recognition", "Career Transition"].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('q2', opt)}
                className="w-full text-left px-6 py-5 rounded-xl border border-border-subtle hover:border-blue hover:shadow-md transition-all text-text-secondary hover:text-text-primary font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="transition-opacity duration-500">
          <h3 className="font-serif text-3xl text-text-primary mb-8">What level of commitment are you considering?</h3>
          <div className="grid grid-cols-1 gap-4">
            {["Short-course Mastery", "Executive Programme", "Doctoral Journey"].map(opt => (
              <button 
                key={opt}
                onClick={() => handleSelect('q3', opt)}
                className="w-full text-left px-6 py-5 rounded-xl border border-border-subtle hover:border-gold hover:shadow-md transition-all text-text-secondary hover:text-text-primary font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- EDITORIAL SCENE COMPONENT ----
function EditorialText({ 
  align, eyebrow, title, body, cta, ctaLink 
}: { 
  align: 'left' | 'right', eyebrow: string, title: string, body: string, cta?: string, ctaLink?: string 
}) {
  const alignClass = align === 'left' ? 'md:justify-start' : 'md:justify-end';

  return (
    <section className="h-[150vh] w-full flex items-end pb-[15vh] md:pb-0 md:items-center px-6 md:px-16 lg:px-24 pointer-events-none">
      <div className={`w-full max-w-7xl mx-auto flex justify-center ${alignClass}`}>
        <div className="max-w-xl pointer-events-auto px-6 py-8 md:px-0 md:py-8 text-center md:text-left transition-all">
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-text-secondary drop-shadow-md block mb-3 md:mb-4">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-primary mb-4 md:mb-6 leading-tight drop-shadow-xl">
            {title}
          </h2>
          <p className="text-base md:text-xl text-text-primary/90 font-medium max-w-md mx-auto md:mx-0 drop-shadow-md mb-6 md:mb-8">
            {body}
          </p>
          {cta && ctaLink && (
            <Link href={ctaLink} className="inline-flex items-center justify-center gap-2 text-sm md:text-base text-gold font-bold tracking-widest uppercase hover:opacity-80 transition-opacity">
              {cta} &rarr;
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative w-full bg-bg-primary text-text-primary">
      <Loader />
      <Navbar />
      
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-auto">
        <ScrollWorld />
      </div>

      {/* Foreground DOM Content */}
      <div className="relative z-10 w-full pointer-events-none">
        
        {/* INTERVAL 0: HERO (0 - 150vh) */}
        <section className="h-[150vh] w-full flex items-start pt-[25vh] px-6 md:px-16 lg:px-24">
          <div className="w-full max-w-7xl mx-auto flex justify-start">
            <div className="max-w-2xl pointer-events-auto">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-text-secondary drop-shadow-md">
                AcdyOn
              </span>
              <div className="h-px w-12 bg-gold mt-4 mb-4 shadow-sm" />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-text-primary mt-6 mb-6 leading-tight drop-shadow-2xl">
                Your experience has taken you this far. <br />
                <span className="italic text-text-secondary">What&apos;s next?</span>
              </h1>
              <p className="text-lg text-text-primary/90 font-medium max-w-md drop-shadow-md mb-8">
                Scroll to explore the premium institution designed exclusively for your professional trajectory.
              </p>
            </div>
          </div>
        </section>

        {/* INTERVAL 1: APPROACH GATE (150vh) */}
        <section className="h-[150vh] w-full" />

        {/* INTERVAL 2: PLAZA (Subject Right, Text Left) */}
        <EditorialText 
          align="left"
          eyebrow="Central Campus"
          title="The core."
          body="An intersection of disciplines, thought leadership, and the academic foundation."
        />

        {/* INTERVAL 3: EXECUTIVE (Subject Left, Text Right) */}
        <EditorialText 
          align="right"
          eyebrow="Executive Education"
          title="Lead with clarity."
          body="Build strategic capability for what comes next. Master global institutional leadership."
          cta="Explore Executive Pathway"
          ctaLink="/programs"
        />

        {/* INTERVAL 4: AI (Subject Right, Text Left) */}
        <EditorialText 
          align="left"
          eyebrow="AI & Technology"
          title="Integrate intelligence."
          body="Command advanced machine intelligence and guide your enterprise architecture into the future."
          cta="Explore AI Institute"
          ctaLink="/programs/ai-for-business-leaders"
        />

        {/* INTERVAL 5: DOCTORAL (Subject Left, Text Right) */}
        <EditorialText 
          align="right"
          eyebrow="Doctoral Research"
          title="Push the boundaries."
          body="Formalize your life's work. Deep research in computational policy, ethics, and global dynamics."
          cta="Explore Doctoral Journey"
          ctaLink="/doctoral"
        />

        {/* INTERVAL 6: RECOGNITION (Subject Right, Text Left) */}
        <EditorialText 
          align="left"
          eyebrow="Academic Recognition"
          title="Validate your legacy."
          body="Achieve formal distinction at the highest academic tier for your professional accomplishments."
          cta="Explore Recognition Hall"
          ctaLink="/universities/academic-recognition"
        />

        {/* INTERVAL 7: GLOBAL ATRIUM (Subject Right, Text Left) */}
        <EditorialText 
          align="left"
          eyebrow="Global Reach"
          title="Connect the world."
          body="Explore pathways connected to an international academic ecosystem spanning borders."
          cta="Explore Universities"
          ctaLink="/universities/global-network"
        />

        {/* INTERVAL 8 & 9: PATHWAY CENTER FUNNEL (300vh total, stays on screen) */}
        <section className="h-[300vh] w-full flex items-start pt-32 px-6 md:px-16 lg:px-24">
          <div className="w-full max-w-7xl mx-auto sticky top-32 pointer-events-auto">
            <FindMyPath />
          </div>
        </section>

        {/* INTERVAL 10: CONSULTATION SPACE (150vh) */}
        <section className="h-[150vh] w-full flex items-center justify-center px-6 md:px-16 lg:px-24">
          <div className="bg-bg-primary/90 dark:bg-bg-primary/80 backdrop-blur-xl p-12 rounded-2xl border border-border-subtle shadow-2xl text-center max-w-3xl pointer-events-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-text-primary mb-6">Ready to take the next step?</h2>
            <p className="text-xl text-text-secondary mb-10">
              Speak with an AcdyOn advisor about the pathway that fits your professional goals and timeline.
            </p>
            <button className="px-10 py-5 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors text-lg font-medium shadow-lg">
              Book Consultation &rarr;
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
