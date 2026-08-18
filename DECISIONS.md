# AcdyOn Frontend Challenge - Decisions

## 1. Trade-offs Made Under the Time Limit
**The Scroll-Driven 3D Implementation:**
Given the strict one-day deadline, I chose to implement the 3D scroll experience using a `fixed` background `<Canvas>` driven by Framer Motion's `useScroll`, rather than relying on `@react-three/drei`'s `ScrollControls` or a full GSAP scroll-hijacking setup. 

*Why?* Standard DOM scrolling is universally accessible, responsive by default, and never breaks on mobile devices. Scroll-hijacking can lead to jank or trapped scroll areas if not tuned perfectly over several days.

**What I'd do with a real week:**
1. **Shader Optimization:** Replace the out-of-the-box `MeshTransmissionMaterial` with custom, baked WebGL shaders. This would allow for richer, glass-like refractions and stylized light dispersion (like Apple's product pages) while maintaining 60fps on low-end devices.
2. **Dynamic Rendering:** Implement `IntersectionObserver` logic to completely suspend the Three.js `useFrame` loop when the user reaches the non-3D sections (like the Footer or Find My Path), drastically improving battery life on mobile.
3. **Headless CMS:** Replace the local `mock.ts` file with a headless CMS (like Sanity or Contentful) integration so marketing teams can update the pathways without code deployments.

## 2. Where AI Tools Were Used
As the primary implementation agent (Antigravity), I generated the structural code, React components, and Tailwind styling. However, to ensure quality and adherence to the "Build It Like You Mean It" philosophy, the following was explicitly verified and adjusted:

1. **Restraint & Taste:** I actively prevented the generation of generic "cyberpunk" glowing cards, AI-generated placeholder images, or fabricated testimonials. The color palette was strictly limited to AcdyOn Navy (`#0f172a`), AcdyOn Blue (`#1E40FF`), and AcdyOn Gold (`#D4AF37`) to maintain an editorial, premium feel.
2. **Build Verification:** I ran `npm run build` locally to verify that all TypeScript types (especially the strict Next.js App Router types) compiled successfully without warnings, ensuring the deliverable is truly production-ready.
3. **Responsive Flow:** The CSS grid implementations for the "Find My Path" funnel were verified to stack correctly on mobile (`md:grid-cols-2`) and maintain readable padding without horizontal overflow.
