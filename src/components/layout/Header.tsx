import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import { useActiveSection } from '@/hooks/useActiveSection';
import { isDarkTheme } from '@/utils/themeUtils';

const HeaderContainer = styled(motion.header)<{ $isScrolled: boolean; $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  padding: 0 max(2rem, calc((100% - 1200px) / 2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: ${({ theme }) => theme.zIndices.header};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: ${({ $isScrolled }) => ($isScrolled ? 1 : 0)};
    background: ${({ theme, $isDark }) => 
      $isDark
        ? `${theme.colors.background}f0`
        : `${theme.colors.background}f0`
    };
    backdrop-filter: blur(10px);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    opacity: 0.5;
    transform: scaleX(${({ $isScrolled }) => ($isScrolled ? 1 : 0)});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1rem;
    height: 60px;
  }
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  transition: all ${({ theme }) => theme['transitions']['default']};

  @media (max-width: ${({ theme }) => theme['breakpoints']['mobile']}) {
    height: 32px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoText = styled(motion.span)`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme['colors']['text']};
  letter-spacing: 0.5px;
  transition: color ${({ theme }) => theme['transitions']['default']};
  
  @media (max-width: ${({ theme }) => theme['breakpoints']['mobile']}) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme['breakpoints']['mobile']}) {
    gap: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme['breakpoints']['tablet']}) {
    display: none;
  }
`;

const NavLink = styled.a<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
  transition: all ${({ theme }) => theme.transitions.default};
  position: relative;
  padding: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ $isActive }) => $isActive ? '100%' : '0'};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.default};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    &::after {
      width: 100%;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme['colors']['text']};
  cursor: pointer;
  padding: 0.5rem;
  transition: all ${({ theme }) => theme['transitions']['default']};
  border-radius: 8px;
  
  &:hover {
    color: ${({ theme }) => theme['colors']['primary']};
    background: ${({ theme }) => `${theme['colors']['primary']}10`};
  }

  &:active {
    background: ${({ theme }) => `${theme['colors']['primary']}20`};
  }

  @media (max-width: ${({ theme }) => theme['breakpoints']['tablet']}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)<{ $isDark: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme, $isDark }) => {
    const bg = theme.colors.background;
    switch (bg) {
      // E-ink themes
      case '#121212': return 'rgba(0, 0, 0, 0.95)';
      // Nord theme
      case '#2E3440': return 'rgba(46, 52, 64, 0.95)';
      // Solarized themes
      case '#002B36': return 'rgba(0, 43, 54, 0.95)';
      case '#FDF6E3': return 'rgba(253, 246, 227, 0.95)';
      // Winter theme
      case '#f0f8ff': return 'rgba(240, 248, 255, 0.95)';
      // Spring theme
      case '#f8fff8': return 'rgba(248, 255, 248, 0.95)';
      // Summer theme
      case '#fffaf0': return 'rgba(255, 250, 240, 0.95)';
      // Autumn theme
      case '#fdf5e6': return 'rgba(253, 245, 230, 0.95)';
      // Pastel theme
      case '#fef6ff': return 'rgba(254, 246, 255, 0.95)';
      // Default
      default: return $isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
  }};
  backdrop-filter: blur(20px);
  padding: 5rem 1.5rem 1.5rem;
  z-index: ${({ theme }) => theme.zIndices.header - 1};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const MobileNavLink = styled(motion.a)<{ $isDark: boolean; $isActive?: boolean }>`
  padding: 1rem;
  font-size: 1.1rem;
  text-align: center;
  border-radius: 12px;
  background: ${({ theme, $isDark, $isActive }) => {
    const baseColor = $isActive ? theme.colors.primary : ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)');
    return $isActive ? `${baseColor}20` : baseColor;
  }};
  color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.default};
  border: 1px solid ${({ theme, $isActive }) => $isActive ? theme.colors.primary : `${theme.colors.primary}20`};
  font-weight: ${({ $isActive }) => $isActive ? '600' : 'normal'};
  
  &:hover {
    background: ${({ theme, $isDark, $isActive }) => {
      const baseColor = $isActive ? theme.colors.primary : ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');
      return $isActive ? `${baseColor}30` : baseColor;
    }};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(5px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    background: ${({ theme, $isDark, $isActive }) => {
      const baseColor = $isActive ? theme.colors.primary : ($isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)');
      return $isActive ? `${baseColor}40` : baseColor;
    }};
  }
`;

const menuVariants = {
  hidden: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const Header: React.FC = () => {
  const { themeMode, theme } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const activeSection = useActiveSection();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest: number) => {
      setIsScrolled(latest > 50);
    });
    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { href: '#home', label: t('navigation.start') },
    { href: '#about', label: t('navigation.about') },
    { href: '#projects', label: t('navigation.projects') },
    { href: '#contact', label: t('navigation.contact') }
  ];

  return (
    <>
      <HeaderContainer $isScrolled={isScrolled} $isDark={isDark}>
        <LogoContainer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => scrollToSection('#home')}
        >
          <Logo src="/assets/images/Logo.webp" alt="VermiNew Logo" />
          <LogoText
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
            whileHover={{
              scale: 1.05,
              color: theme.colors.primary,
              transition: {
                duration: 0.2,
                ease: "easeInOut"
              }
            }}
          >
            VermiNew
          </LogoText>
        </LogoContainer>

        <Nav>
          <NavLinks>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                $isActive={activeSection === item.href.substring(1)}
              >
                {item.label}
              </NavLink>
            ))}
          </NavLinks>

          <ThemeToggle />

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <IconWrapper>
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </IconWrapper>
          </MobileMenuButton>
        </Nav>
      </HeaderContainer>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            $isDark={isDark}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navItems.map((item, index) => (
              <MobileNavLink
                $isDark={isDark}
                $isActive={activeSection === item.href.substring(1)}
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.label}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
}; 