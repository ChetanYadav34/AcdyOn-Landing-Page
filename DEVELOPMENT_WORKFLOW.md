# AcdyOn Frontend Development Workflow

This document outlines the engineering workflow for the AcdyOn Frontend Challenge, synthesized from the requested repository audits (Spec Kit, MemPalace, scroll-world, and mattpocock/skills).

## 1. Specification & Planning (Inspired by Spec Kit & Matt Pocock Skills)
- **Align First, Code Second**: No significant feature is implemented without first clarifying ambiguity. (Inspired by `mattpocock/skills` `/grill-me` philosophy).
- **Executable Specifications**: We define a clear implementation plan before writing components. Complex components (like the Find My Path funnel) will have their architecture mapped out before React code is written (Inspired by `spec-kit`).
- **Constraint-Driven**: We strictly adhere to the technical constraints: No databases, no auth, no complex backend. Mock data only.

## 2. Memory & Context (Inspired by MemPalace)
- **Verbatim Persistence**: Key project decisions, design tokens, and visual direction rules ("Quiet Confidence", Light-first, Editorial) are hardcoded into the configuration and project documentation so they survive context window truncation.
- **Artifact-Based Memory**: We rely on living Markdown documents to maintain context without over-engineering a vector database.

## 3. 3D & Interactive UX (Inspired by scroll-world)
- **Continuous Scroll Flight**: The 3D scene (`ArchitecturalScene.tsx`) is designed to feel cohesive. As the user scrolls through the homepage, the camera or object rotations will respond to scroll position, creating an uninterrupted flow between sections rather than disjointed UI blocks.
- **Real-time WebGL**: Instead of pre-rendered AI video (as in the original scroll-world tooling), we implement the cinematic flight using React Three Fiber, `ScrollControls`, and framer-motion to maintain interactive performance.

## 4. Visual Direction
- **Theme**: "Quiet Confidence"
- **Palette**: Ivory (`#FDFBF7`) / Graphite (`#12141A`)
- **Typography**: Playfair Display (Serif) & Inter (Sans-serif)
- **Vibe**: Academic, premium, architectural, restrained 3D glass elements. NO cyberpunk, NO generic AI glow.
