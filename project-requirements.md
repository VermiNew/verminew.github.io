# Portfolio Website Requirements

## Project Overview

- Purpose: Personal portfolio website showcasing skills and projects
- Target Audience: Potential employers, fellow developers, tech community
- Key Features: Bilingual (PL/EN), responsive, modern design, 16 theme variants
- Core Values: Professionalism, creativity, continuous learning

## Technical Stack

- React 18 with TypeScript
- Styled-components
- Framer Motion for animations
- React-i18next for translations
- Vite as build tool
- GitHub Pages hosting
- GitHub Actions CI/CD

## Current Sections

1. **Hero Section**
   - Animated logo
   - Interactive particle background
   - CTA buttons

2. **About Section**
   - Personal introduction
   - Education info (technical school, INF.03/INF.04)
   - Name origin explanation
   - Availability & collaboration terms

3. **Skills Section**
   - Grouped by categories (Frontend Core, Frameworks, Backend, Programming, DevTools, System)
   - Skill levels (Beginner → Expert)
   - Planned skills section

4. **Projects Section**
   - Featured/Active/Planned categories
   - Technology filtering
   - GitHub integration (repos fetched from GitHub)
   - Project cards with tech icons

5. **Contact Section**
   - Social links (GitHub, LinkedIn, Discord, Email)
   - Location info
   - FAQ section
   - Availability hours

## Theme System

16 available themes:
- Basic: Light, Dark
- Professional: Corporate Modern, Tech Minimal, Professional Dark, Modern Neutral
- Special: E-Ink Light/Dark, Nord, Solarized Light/Dark
- Seasonal: Winter, Spring, Summer, Autumn, Pastel

## Design Style

Modern minimalistic with technological accents

### Typography
- Primary Font: Poppins (headers)
- Secondary Font: Space Grotesk (body)
- Code Font: Fira Code

### Colors (Light Theme)
- Background: #ffffff
- Primary: #2563eb
- Text: #2c3e50
- Accent: #8b5cf6

### Colors (Dark Theme)
- Background: #0a1929
- Primary: #60a5fa
- Text: #e2e8f0
- Accent: #8b5cf6

## Personal Information

### About Me
- Name: Michał Oślizło (VermiNew)
- Born: October 2006
- Location: Podkarpacie, Poland
- Education: Technical school (IT technician-programmer)
- Qualifications: INF.03 completed, preparing for INF.04

### Name Origin
Ver (Version) + Mi (Michael) + New (continuous learning)

### Approach to Programming
- **Vibecoder** - uses AI chatbots to accelerate learning and build projects
- Focus on practical results and seeing code work
- Self-taught, project-based learning

### Communication Channels
- GitHub: github.com/VermiNew
- LinkedIn: Michał Oślizło
- Discord: verminew
- Email: verminewfey@gmail.com

### Availability
- Flexible hours (adapted to school schedule)
- Remote work only
- Project-based work preferred
- Freelance: 50% upfront, 50% on completion

## Skills Overview

### Current Skills
- **Frontend**: HTML5, CSS3, JavaScript, TypeScript (learning)
- **Frameworks**: Angular (basic), Bootstrap
- **Backend**: PHP, MySQL
- **Languages**: C++, C#, Python, Java
- **Tools**: Git, Markdown, Batch

### Planned Skills
- React, Next.js, Vue.js
- Tailwind CSS
- FastAPI, Docker
- TensorFlow, PyTorch (integration, not development)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari, Chrome for Android

## Performance Targets

### Lighthouse Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Features Implemented ✅

- [x] Bilingual support (PL/EN)
- [x] 16 theme variants with persistence
- [x] System theme detection
- [x] Responsive design
- [x] Smooth animations with reduced-motion support
- [x] Sticky header with active section indicator
- [x] Mobile menu
- [x] GitHub repos integration
- [x] Error boundaries
- [x] GitHub Actions deployment
- [x] Lighthouse CI

## Planned Features

- [ ] Visit counter
- [ ] Footer with copyright
- [ ] Skip link (accessibility)
- [ ] Code splitting for performance
- [ ] Professional experience section (timeline)
- [ ] Snake game (Easter egg)

## Content Management

- GitHub-based content management
- Markdown familiar
- Easy content updates via translation files
- Projects fetched automatically from GitHub

## Mobile Optimization

- Sections stacked vertically
- Full-width project cards
- Optimized animations
- Touch-friendly interactions
