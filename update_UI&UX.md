# UI/UX Redesign Implementation Plan

## Overview
This document tracks all UI/UX component changes and redesigns for the portfolio website.

## Task 1: Analyze Reference Design
- **Source**: `reference.mp4` (Provided by User)
- **Status**: Completed
- **Key Findings**:
  - **Color Theme**: Minimalist monochromatic (White/Off-white background, Dark Gray/Black for text). A specific section (like Experience) uses an inverted dark theme. Accent color is a subtle green (e.g., `#4CAF50` for the "Available" dot).
  - **Typography**: Large, bold, sans-serif fonts for headings. Clean, smaller sans-serif for body text.
  - **Hero Section**: 
    - Top Navigation: Small badge "Available for New Project" with a blinking green dot.
    - Centerpiece: Massive text with the person's name taking up the full width. A central portrait image/media that overlaps the text.
    - Left side (Hero): Short bio/role description ("AIML Engineer & Full Stack Developer") and a primary CTA ("Let's collaborate").
    - Right side (Hero): Vertically stacked social links (Dribbble, Instagram, LinkedIn, etc.).
  - **Animations**: Smooth fade-ins, slide-ups on scroll. Hover effects on links (arrows appearing or slight shifts).

## Proposed Components
1. **Global CSS**: Update `globals.css` with the new color palette (black and white minimalist) and typography tokens.
2. **Hero Section (`Hero.tsx`)**: Rebuild layout to match the massive text + central media + side content structure.
3. **Buttons & Badges**: Update to use minimal pill shapes with solid black or outlined styles.
