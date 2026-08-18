import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ComingSoonPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];
  
  const pathName = slug
    .map(segment => segment.replace(/-/g, " "))
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-blue/5 blur-[120px] dark:bg-blue/10" />
      </div>

      <div className="z-10 text-center px-6 max-w-2xl mt-16">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-gold drop-shadow-md block mb-4">
          Under Construction
        </span>
        <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
          {pathName}
        </h1>
        <p className="text-lg text-text-secondary mb-10">
          This page is currently being designed for the new AcdyOn global learning ecosystem. Check back soon for updates.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-blue text-white text-sm font-semibold hover:bg-blue/90 transition-transform hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(30,64,255,0.3)]"
        >
          <ArrowLeft size={16} />
          Return to Campus
        </Link>
      </div>
    </div>
  );
}
