# Revamped Components Documentation

This document outlines the changes and technical specifications for the revamped post-carousel components in the Linguistics Association of Ghana (LAG) website.

## Overview

The following components have been revamped to ensure:
- **Modern Design:** Cohesive visual style with the carousel and brand colors (Yellow/Blue).
- **Responsiveness:** Mobile-first approach with optimized layouts for all devices.
- **Accessibility:** WCAG compliance with ARIA labels and keyboard navigation.
- **Performance:** Optimized GSAP animations using `ScrollTrigger` and `context` API for cleanup.

## Components

### 1. StatsAndTimeline (`src/components/home/StatsAndTimeline.tsx`)

A dual-section component displaying key organization statistics and a historical timeline.

**Features:**
- **Animated Counter:** Stats numbers count up when scrolled into view.
- **Timeline Animation:** Vertical line draws downwards; events slide in from sides.
- **Interactive Cards:** Hover effects with shadow and translation.

**Props:** None (Self-contained data for now, can be refactored to accept data props).

**Accessibility:**
- ARIA labels on stat cards describing the full statistic.
- Semantic HTML structure.

---

### 2. AboutSection (`src/components/home/AboutSection.tsx`)

A welcoming introduction section with a call-to-action.

**Features:**
- **Staggered Fade-In:** Elements fade in upwards sequentially.
- **Responsive Typography:** Large headings that scale with viewport.
- **Interactive Button:** Hover scale and color transition.

**Props:** None.

---

### 3. QuickLinks (`src/components/QuickLinks.tsx`)

A navigation grid providing fast access to key areas (Publications, Membership, Events, Resources).

**Features:**
- **Color Coding:** Each link has a distinct color theme (Blue, Green, Purple, Orange).
- **Decorative Elements:** Abstract shapes that animate on hover.
- **Scroll Trigger:** Cards stagger in from the bottom.

**Props:** None.

---

### 4. NewsSection (`src/components/home/NewsSection.tsx`)

Displays the latest news and updates using `NewsCard` components.

**Features:**
- **Grid Layout:** Responsive grid (1 column mobile, 2 tablet, 3 desktop).
- **Hover Effects:** Cards lift up on hover.
- **Animations:** Cards stagger in when the section comes into view.

**Sub-component: NewsCard (`src/components/home/NewsCard.tsx`)**
- **Props:**
  - `title` (string): Headline of the news item.
  - `description` (string): Brief summary.
  - `date` (string, optional): Date of publication.
  - `category` (string, optional): Category tag (e.g., "Conference").

---

## Technical Implementation Details

### Animations (GSAP)
All animations use `gsap.context()` for proper cleanup in React `useEffect`.
```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Animation logic
  });
  return () => ctx.revert();
}, []);
```

### Styling (Tailwind CSS)
- **Colors:** Uses `yellow-500` (Brand) and `blue-600` (Primary).
- **Spacing:** Consistent `py-20` for section padding.
- **Shadows:** `shadow-lg` on hover for depth.
- **Border Radius:** `rounded-2xl` for modern card aesthetics.

## Future Improvements
- Refactor `StatsAndTimeline` to accept data via props for CMS integration.
- Add skeleton loading states for `NewsSection` if data becomes dynamic.
