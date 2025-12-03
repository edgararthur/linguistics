# Style Guide Specifications

This style guide defines the visual language and coding standards for the Linguistics Association of Ghana (LAG) website.

## 1. Colors

### Brand Colors
- **Primary Yellow:** `bg-yellow-500` (#EAB308) - Used for accents, buttons, and highlights.
- **Primary Blue:** `text-blue-600` (#2563EB) - Used for links, primary text, and secondary buttons.

### Neutrals
- **Background:** `bg-white` (#FFFFFF) / `bg-gray-50` (#F9FAFB)
- **Text Main:** `text-gray-900` (#111827)
- **Text Secondary:** `text-gray-600` (#4B5563)
- **Borders:** `border-gray-100` (#F3F4F6)

### Semantic Colors
- **Success:** `text-green-600`
- **Error:** `text-red-600`
- **Info:** `text-blue-600`

## 2. Typography

### Font Family
- Default sans-serif stack (Inter/System UI).

### Scale
- **H1:** `text-4xl` to `text-5xl` (font-bold)
- **H2:** `text-3xl` (font-bold)
- **H3:** `text-xl` (font-bold)
- **Body:** `text-base` (leading-relaxed)
- **Small:** `text-sm` or `text-xs` (uppercase tracking-wider)

## 3. Layout & Spacing

### Sections
- **Padding:** `py-20` (80px) for standard sections.
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Cards
- **Padding:** `p-6` or `p-8`
- **Border Radius:** `rounded-2xl` (16px)
- **Gap:** `gap-8` for grids.

## 4. Components

### Buttons
- **Primary:** `bg-yellow-500 text-black hover:bg-yellow-400 rounded-full`
- **Secondary:** `bg-blue-600 text-white hover:bg-blue-700 rounded-md`
- **Outline:** `border-2 border-current`

### Interactive Elements
- **Hover:** `hover:-translate-y-2` (Lift effect)
- **Shadow:** `shadow-md` -> `hover:shadow-xl`
- **Transition:** `transition-all duration-300`

## 5. Animations (GSAP)

- **Fade In Up:** `y: 50` -> `y: 0`, `opacity: 0` -> `1`
- **Duration:** `0.8s` standard.
- **Stagger:** `0.1s` or `0.2s` for lists/grids.
- **Easing:** `power2.out` or `power3.out`.
- **ScrollTrigger:** Start at `top 80%` or `top 75%`.

## 6. Accessibility (A11y)

- **Focus Rings:** Ensure visible focus states for keyboard navigation.
- **ARIA Labels:** Use `aria-label` for icon-only buttons or complex cards.
- **Contrast:** Maintain high contrast ratio (4.5:1) for text.
- **Semantic HTML:** Use `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`.
