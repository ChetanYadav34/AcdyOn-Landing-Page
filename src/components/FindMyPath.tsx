"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Briefcase, GraduationCap, Globe, Lightbulb } from "lucide-react";

type StepInfo = {
  id: string;
  question: string;
  options: { id: string; label: string; icon?: React.ReactNode; desc?: string }[];
};

const STEPS: StepInfo[] = [
  {
    id: "stage",
    question: "Where are you in your professional journey?",
    options: [
      { id: "mid", label: "Mid-Level Professional", desc: "5-10 years of experience", icon: <Briefcase size={20} /> },
      { id: "senior", label: "Senior / Executive", desc: "10+ years of leadership", icon: <Globe size={20} /> },
      { id: "academic", label: "Academic / Researcher", desc: "Pursuing deep knowledge", icon: <GraduationCap size={20} /> },
      { id: "founder", label: "Founder / Entrepreneur", desc: "Building from the ground up", icon: <Lightbulb size={20} /> },
    ],
  },
  {
    id: "focus",
    question: "What is your primary focus?",
    options: [
      { id: "ai", label: "AI & Innovation" },
      { id: "leadership", label: "Executive Leadership" },
      { id: "policy", label: "Global Policy & Ethics" },
      { id: "research", label: "Doctoral Research" },
    ],
  },
  {
    id: "format",
    question: "Preferred learning format?",
    options: [
      { id: "online", label: "Fully Online (Flexible)" },
      { id: "hybrid", label: "Hybrid (Online + Campus)" },
      { id: "campus", label: "On-Campus Intensive" },
    ],
  },
];

export function FindMyPath() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [STEPS[currentStep].id]: optionId }));
    
    // Auto-advance after a brief delay for UX
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        submitFunnel();
      }
    }, 400);
  };

  const submitFunnel = () => {
    setIsSubmitting(true);
    // Mock network request
    setTimeout(() => {
      setIsSubmitting(false);
      // Mock result based on selections
      setResult({
        program: "Executive Master in AI & Leadership",
        description: "A 12-month intensive program designed for senior professionals looking to integrate AI strategies into global organizations.",
        tags: ["Hybrid", "12 Months", "Next Cohort: Oct 2026"]
      });
    }, 1200);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-bg-primary border border-border-subtle rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
      {/* Decorative architectural line */}
      <div className="absolute top-0 left-12 w-px h-16 bg-gold/50" />
      
      {!result ? (
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-semibold tracking-widest text-text-secondary uppercase">
              Pathway Architect
            </h3>
            <span className="text-sm font-serif italic text-text-tertiary">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center"
                >
                  <div className="w-12 h-12 border-2 border-blue border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-xl font-serif text-text-primary">Curating your academic pathway...</p>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl md:text-4xl font-serif mb-8 text-text-primary">
                    {STEPS[currentStep].question}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STEPS[currentStep].options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                          answers[STEPS[currentStep].id] === opt.id
                            ? "border-blue bg-blue/5 text-blue"
                            : "border-border-subtle hover:border-text-secondary hover:bg-bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {opt.icon && <span className="text-text-secondary">{opt.icon}</span>}
                          <span className="font-semibold text-lg">{opt.label}</span>
                        </div>
                        {opt.desc && <p className="text-sm text-text-tertiary">{opt.desc}</p>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentStep > 0 && !isSubmitting && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="mt-8 flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors text-sm font-medium uppercase tracking-wider"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-3xl font-serif text-text-primary mb-4">Recommended Pathway</h2>
          <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 mb-8 text-left">
            <h3 className="text-2xl font-serif text-blue mb-3">{result.program}</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">{result.description}</p>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-semibold tracking-wider uppercase bg-bg-primary border border-border-subtle px-3 py-1 rounded-full text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/programs/executive-master" className="w-full sm:w-auto px-8 py-4 bg-blue text-white rounded-full font-semibold hover:bg-blue/90 transition-colors inline-block text-center">
              View Program Details
            </Link>
            <button onClick={reset} className="w-full sm:w-auto px-8 py-4 text-text-secondary hover:text-text-primary font-semibold transition-colors">
              Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
