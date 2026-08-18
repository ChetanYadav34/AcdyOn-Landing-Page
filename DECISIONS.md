# Decisions

*(Track Selected: Part 2 — The Premium Home Page)*

**1. Why this ingestion strategy over the obvious alternative you rejected?**
*(Note: As I selected Track 2, my primary "ingestion" and architecture challenge was loading and streaming heavy 3D assets on the frontend).* 
Rather than forcing a monolithic payload (pre-loading a massive 20MB .glb scene), I opted for a procedural/primitive React Three Fiber architecture combined with native Suspense and @react-three/drei's useProgress. This progressive loading strategy allows the DOM to render instantly, showing a premium synchronized skeleton loader, while the GPU asynchronously compiles materials and fetches textures. I rejected standard DOM-based scroll-jacking because it inherently breaks native accessibility and momentum scrolling on mobile devices.

**2. One trade-off you made under the time limit, and what you’d do with a real week.**
Under the time limit, I built the 3D campus using raw mathematical primitives (<boxGeometry>, <planeGeometry>, etc.) and programmatic layout directly in React. 
**With a real week**, I would move this entire scene into Blender. I would bake the lighting and shadows directly into texture atlases (Lightmaps), dramatically reducing GPU draw calls and eliminating the need for real-time directional shadow mapping. I would compress the final model using Draco/KTX2. This would free up the performance budget to add much richer micro-interactions, such as volumetric fog or floating dust particles.

**3. Where did you use AI tools, and what did you personally verify or change afterward?**
I used an AI agent as a pair-programmer to scaffold the Next.js App Router boilerplate, draft the Tailwind layouts, and generate the initial math for the Catmull-Rom camera spline.
I **personally verified and heavily modified** the 3D camera logic. The AI's initial spline implementation caused a jarring "cut-scene" snap on the very first frame because the <Canvas> spawned the camera at origin before lerping. I manually debugged this and wrote a custom isInitialized ref to force-snap the coordinates on frame zero. I also personally debugged the Next.js 15 hydration engine errors caused by next-themes injecting <script> tags, overriding the AI's initial workaround by intentionally tracking down the beta package patch.
