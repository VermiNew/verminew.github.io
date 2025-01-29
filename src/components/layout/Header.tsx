import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';

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
  z-index: ${({ theme }) => theme['zIndices']['header']};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: ${({ $isScrolled }) => ($isScrolled ? 1 : 0)};
    background: ${({ $isDark }) => 
      $isDark
        ? 'linear-gradient(180deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.85) 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
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
    background: ${({ $isDark }) => 
      $isDark
        ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
        : 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)'
    };
    transform: scaleX(${({ $isScrolled }) => ($isScrolled ? 1 : 0)});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: ${({ theme }) => theme['breakpoints']['mobile']}) {
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

const LogoText = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme['colors']['text']};
  letter-spacing: 0.5px;
  transition: color ${({ theme }) => theme['transitions']['default']};
  
  &:hover {
    color: ${({ theme }) => theme['colors']['primary']};
  }
  
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

const NavLink = styled.a`
  color: ${({ theme }) => theme['colors']['text']};
  text-decoration: none;
  font-weight: 500;
  transition: all ${({ theme }) => theme['transitions']['default']};
  position: relative;
  padding: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme['colors']['primary']};
    transition: width ${({ theme }) => theme['transitions']['default']};
  }

  &:hover {
    color: ${({ theme }) => theme['colors']['primary']};
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
  top: 60px;
  left: 0;
  right: 0;
  background: ${({ $isDark }) => 
    $isDark
      ? 'rgba(18, 18, 18, 0.95)'
      : 'rgba(255, 255, 255, 0.95)'
  };
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-bottom: 1px solid ${({ $isDark }) => 
    $isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'
  };
  box-shadow: ${({ $isDark }) => 
    $isDark
      ? '0 4px 20px rgba(0, 0, 0, 0.7)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)'
  };

  @media (max-width: ${({ theme }) => theme['breakpoints']['tablet']}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const MobileNavLink = styled(motion.a)<{ $isDark: boolean }>`
  padding: 1rem;
  font-size: 1.1rem;
  text-align: center;
  border-radius: 12px;
  background: ${({ $isDark }) => $isDark 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.05)'
  };
  color: ${({ theme }) => theme['colors']['text']};
  text-decoration: none;
  transition: all ${({ theme }) => theme['transitions']['default']};
  
  &:hover {
    background: ${({ $isDark }) => $isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'
    };
    color: ${({ theme }) => theme['colors']['primary']};
    transform: translateX(5px);
  }

  &:active {
    background: ${({ $isDark }) => $isDark
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.15)'
    };
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
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
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
          <Logo src="./assets/images/Logo.png" alt="VermiNew Logo" />
          <LogoText>VermiNew</LogoText>
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