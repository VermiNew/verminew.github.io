# Portfolio Website Requirements

## Project Overview

- Purpose: Personal portfolio website showcasing skills and projects
- Target Audience: Potential employers, fellow developers, tech community
- Key Features: Bilingual, responsive, modern design, interactive elements
- Core Values: Professionalism, creativity, continuous learning

## Technical Architecture

### Frontend Architecture

- Component Structure:
  - Atomic design principles
  - Reusable components
  - Lazy-loaded modules
  - Error boundaries

### State Management

- Theme context
- Language context
- Navigation state
- Project filters state
- Blog state

### Performance Optimization

- Code splitting strategies
- Image optimization pipeline
- Caching strategies
- Performance metrics tracking
- Lighthouse score targets:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 95+
  - SEO: 95+

## User Experience Design

### Interaction Patterns

- Hover states:
  - Scale: 1.02-1.05
  - Transition timing: 0.2-0.3s
  - Easing functions: cubic-bezier
  
- Click feedback:
  - Visual feedback
  - Haptic feedback (mobile)
  - Audio feedback (optional)

### Animation Specifications

- Page Transitions:
  - Duration: 0.3-0.5s
  - Easing: ease-in-out
  - Direction: based on navigation flow

- Content Animations:
  - Entrance: fade-up + scale
  - Exit: fade-out
  - Stagger delay: 0.1s
  - Intersection observer thresholds

### Accessibility Features

- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management
- Skip links
- Color contrast compliance

## Content Strategy

### Multilingual Content

- Translation structure
- Language detection logic
- Fallback handling
- RTL support (future)

### SEO Optimization

- Meta tags strategy
- Open Graph protocol
- Twitter Cards
- Structured data
- Sitemap generation
- Robots.txt configuration

### Content Updates

- Content management workflow
- Version control for content
- Content backup strategy
- Update frequency guidelines

## Security Measures

### Data Protection

- No sensitive data storage
- Secure form handling
- API key protection
- Rate limiting

### Code Security

- Dependency scanning
- Security headers
- CSP configuration
- XSS prevention

## Deployment Strategy

### CI/CD Pipeline

- GitHub Actions workflow
- Automated testing
- Build optimization
- Deployment checks

### Monitoring

- Error tracking
- Performance monitoring
- Usage analytics
- Uptime monitoring

## Browser Support

### Desktop Browsers

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### Mobile Browsers

- iOS Safari
- Chrome for Android
- Samsung Internet
- Opera Mobile

## Development Workflow

### Version Control

- Branch strategy
- Commit conventions
- PR templates
- Code review guidelines

### Code Quality

- ESLint configuration
- Prettier setup
- TypeScript strict mode
- Unit testing setup
- E2E testing plan

### Documentation

- Component documentation
- API documentation
- Setup guides
- Contribution guidelines
- Maintenance procedures

## General Information

- Two language versions: Polish and English
- Dark/light mode with system preference detection
- Responsive design (desktop, tablet, mobile)
- Hosted on GitHub Pages
- Visit counter implementation needed

## Technologies

- React with TypeScript
- Styled-components
- Framer Motion for animations
- React-i18next for translations
- Giscus for comments system

## Design Style

Selected: Variant A (Modern minimalistic with technological accents)

### Colors

- Light theme:
  - White background
  - Navy accents (#1a237e)
  - Light blue elements (#42a5f5)
- Dark theme:
  - Navy background (#0a1929)
  - Light blue accents (#90caf9)

## Sections Structure

1. Home/Hero Section
   - Animated intro
   - Typewriter effect in headings
   - Interactive background

2. About Me Section
   - Currently in technical school
   - Focus on AI-assisted programming
   - Professional approach

3. Projects Section
   - Grid layout with cards
   - Hover effects
   - Filtering by:
     - Technology
     - Type (desktop, web, AI/ML)
   - Each card includes:
     - Project name
     - Short description
     - Technology icons
     - GitHub link
   - Option to pin/highlight important projects

4. Skills & Technologies
Grouped by categories:

- Web Development
  - HTML, CSS, JS, TS
  - Angular, Bootstrap
- Programming Languages
  - C++, C#, Java
  - Python
- AI/ML
  - Learning Torch and Tensorflow
- Other
  - Android Studio
  - MySQL basics
  - Server management basics

5. Currently Learning Section

- Easy to update
- No progress bars
- Current focus: React, Web Development, AI

6. Learning Journal (Blog)

- Simple blog structure
- Tags system
- Giscus comments
- No post dates needed

7. Contact Section

- GitHub: github.com/VermiNew
- Discord: _verminew
- Email: <verminewfey@gmail.com>

## Interactive Elements

- Smooth section transitions
- Animated elements on page load
- Section entrance animations
- Parallax effects (optimized for mobile)
- Typewriter effects in headings
- Interactive technology icons

## Navigation

- Desktop: Transparent header, becomes solid on scroll
- Mobile: Hamburger menu with animation
- Language and theme toggles always visible
- Smooth scroll to sections

## GitHub Integration

- Activity graph
- Used languages
- Repository count
- Stars/forks count

## Implementation Phases

1. Basic structure + navigation + theme switcher
2. Home page + About me
3. Projects + filtering
4. Learning Journal + comments
5. Learning goals + GitHub stats

## Future Additions

- Professional experience section (planned)
- Snake game (planned for later)
- Blog/technical articles expansion

## Assets to Keep

- Logo.png (needs 100% brightness in dark mode)
- ava.jpg (profile picture)

## Mobile Optimization

- Sections stacked vertically
- Full-width project cards
- Optimized animations
- Simplified parallax effects

## Personal Preferences & Details

### Project Approach

- Implementation in phases preferred over all-at-once
- Preference for elegant and professional animations
- Need for detailed explanations during implementation
- Open to suggestions and professional recommendations

### Current Focus

- Main project: Luna (chatbot API integration)
- Learning TypeScript to rewrite Luna from Bootstrap/JS
- Interest in AI and machine learning, especially:
  - Text chatbots
  - TTS (Text-to-Speech)
  - Text/Object/Image recognition

### Education & Background

- Currently in technical school
- Self-taught programmer
- Learning multiple technologies simultaneously
- No formal certifications yet

### Project Presentation Preferences

- No project previews/screenshots for now
- Focus on technology stacks used
- Emphasis on learning journey
- Project status not needed

### Content Management

- Easy content updates preferred
- Familiar with Markdown
- No experience with CMS systems
- GitHub-based content management

### Design Preferences

- Clean, professional look
- Not too minimalistic, not too complex
- Interactive elements should be elegant
- Smooth animations and transitions
- System theme detection important

### Communication Channels

- Primary: GitHub (github.com/VermiNew)
- Discord: _verminew
- Email: <verminewfey@gmail.com>
- No LinkedIn presence yet

### Future Plans

- Adding professional experience section
- Expanding blog/technical articles
- Implementing Snake game
- Potential TypeScript projects
- Focus on AI/ML development

## Implementation Notes

### Priority Features

- System theme detection
- Bilingual support (PL/EN)
- Smooth animations
- GitHub integration
- Visit counter

### Non-Priority Features

- Project preview images
- Progress bars
- Status indicators
- Post dates in blog
- Complex animations on mobile

### Asset Management

- Logo.png requires 100% brightness in dark mode
- ava.jpg is the profile picture
- Minimal asset usage for performance
- Future assets should follow optimization guidelines

## Detailed Personal Information

### About Me

- Currently a technical school student
- Self-taught programmer with passion for AI and automation
- Focus on practical learning and hands-on experience
- Interest in combining different technologies
- Open to learning new technologies and approaches

### Programming Experience

#### Current Skills Level

- Web Development:
  - HTML/CSS: Intermediate
  - JavaScript: Intermediate
  - TypeScript: Learning
  - Angular: Basic knowledge
  - Bootstrap: Intermediate
  - React: Learning

- Programming Languages:
  - Python: Intermediate (with focus on AI)
  - Java: Intermediate
  - C++: Intermediate
  - C#: Intermediate

- AI/ML Focus:
  - Currently learning PyTorch and TensorFlow
  - Experience with chatbot development
  - Interest in TTS and voice cloning
  - Text and image recognition exploration

- Other Technologies:
  - Android Studio: Basic knowledge
  - MySQL: Basic understanding
  - Server Management: Learning
  - Git/GitHub: Regular user

### Current Projects

#### Luna Project

- Chatbot API integration project
- Currently in active development
- Planning to rewrite from Bootstrap/JS to TypeScript
- Focus on user-friendly interface
- Integration with various AI APIs

### Color & Design Preferences

#### Light Theme Details

- Background: Clean white (#ffffff)
- Primary Text: Deep navy (#1a237e)
- Secondary Text: Lighter navy (#303f9f)
- Accent Elements: Light blue (#42a5f5)
- Hover States: Slightly darker blue (#1976d2)
- Links: Bright blue (#2196f3)

#### Dark Theme Details

- Background: Deep navy (#0a1929)
- Primary Text: Light blue (#90caf9)
- Secondary Text: Lighter blue (#bbdefb)
- Accent Elements: Bright blue (#42a5f5)
- Hover States: Lighter blue (#64b5f6)
- Links: Bright blue (#2196f3)

#### Typography Preferences

- Primary Font: Poppins
  - Headers: 600 weight
  - Body: 400 weight
  - Accents: 500 weight
- Font Sizes:
  - Main Headers: 2.5rem
  - Section Headers: 2rem
  - Subheaders: 1.5rem
  - Body Text: 1rem
  - Small Text: 0.875rem

#### Animation Preferences

- Subtle and professional
- No excessive movements
- Smooth transitions between states
- Elegant hover effects
- Typewriter effect for important text
- Parallax scrolling (when appropriate)

### Learning Style & Goals

#### Current Learning Approach

- Self-paced learning
- Project-based learning
- Focus on practical applications
- Learning through documentation and examples
- AI-assisted development practices

#### Short-term Goals

- Master React and TypeScript
- Improve web development skills
- Enhance AI/ML knowledge
- Complete Luna project
- Create more sophisticated web applications

#### Long-term Goals

- Become a professional developer
- Specialize in AI/ML development
- Build advanced AI applications
- Contribute to open-source projects
- Develop unique AI-powered solutions

### Website Content Preferences

#### Language Style

- Professional but approachable
- Technical when necessary
- Bilingual (Polish/English)
- Clear and concise
- Focus on learning journey

#### Content Organization

- Logical section grouping
- Easy navigation
- Clear hierarchy
- Emphasis on current projects
- Showcase of learning progress

#### Update Frequency

- Regular content updates
- Project updates as needed
- Blog posts when learning new things
- Technology stack updates as learned
- No strict schedule requirements
