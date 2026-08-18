# AcdyOn - Premium Home Page

## Overview
AcdyOn is a premium, immersive 3D landing page built for the Acdyon Technologies Frontend Challenge (Part 2: Premium Home Page). It features a fully responsive React Three Fiber powered scroll journey, dynamically exploring the AcdyOn University campus.

## Tech Stack
- **Next.js 15 (React 19)**: Framework & Routing.
- **Tailwind CSS**: Styling & responsive glassmorphism.
- **React Three Fiber (Three.js)**: Immersive 3D background & scroll-driven camera rig.
- **Framer Motion**: Smooth DOM animations.

## Key Features
- **3D Scroll Journey**: A seamless `CatmullRomCurve3` camera rig that perfectly frames different sections of the campus based on scroll position.
- **Responsive FOV**: Dynamic camera Field of View that gracefully adapts to portrait (mobile) screens without breaking the composition.
- **Global Catch-All Router**: Gracefully handles missing pages with a dynamic "Coming Soon" interceptor.
- **Next.js 15 Native**: Fully compliant with the ultra-strict Next.js 15 hydration engine.

## Easter Egg
Try entering the Konami Code on your keyboard (`Up Up Down Down Left Right Left Right B A`) while exploring the landing page!

## Deployment
This project is built and optimized for a zero-config deployment to Vercel.
