import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TechnologyIcon } from '@/components/ui/TechnologyIcon';
import { useTranslation } from 'react-i18next';
import { useAnimation } from '@/context/hooks/useAnimation';
import {
  // Frontend Core
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  // Frontend Frameworks & Libraries
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiBootstrap,
  SiTailwindcss,
  // Backend & Databases
  SiPhp,
  SiMysql,
  // Programming Languages
  SiCplusplus,
  SiSharp,
  SiPython,
  // Development Tools
  SiGit,
  SiMarkdown,
  // System & DevOps
  SiGnubash,
  SiAndroidstudio
} from 'react-icons/si';
import { IoTerminal } from "react-icons/io5";
import { FaJava } from "react-icons/fa";

type CategoryFilter = 'all' | 'frontend' | 'backend' | 'languages' | 'tools' | 'planned';

const CATEGORY_FILTER_MAP: Record<CategoryFilter, string[]> = {
  all: [],
  frontend: ['frontendCore', 'frontendFrameworks'],
  backend: ['backendDb'],
  languages: ['programming'],
  tools: ['devTools', 'systemDevops'],
  planned: ['plannedSkills'],
};

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FilterChip = styled.button<{ $isActive: boolean }>`
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  border: 1px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : `${theme.colors.primary}30`};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.onPrimary : theme.colors.text};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : `${theme.colors.primary}15`};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Container = styled(motion.div)`
  display: grid;
  gap: 3rem;
`;

const CategorySection = styled(motion.div)<{ $isPlanned?: boolean }>`
  background: ${({ theme, $isPlanned }) => $isPlanned
    ? `${theme.colors.surface}20`
    : `${theme.colors.surface}40`
  };
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${({ theme, $isPlanned }) => $isPlanned
    ? `${theme.colors.textSecondary}15`
    : `${theme.colors.primary}10`
  };
  transition: border-color ${({ theme }) => theme.transitions.default};
  opacity: ${({ $isPlanned }) => $isPlanned ? 0.8 : 1};
  will-change: auto;

  &:hover {
    border-color: ${({ theme, $isPlanned }) => $isPlanned
      ? `${theme.colors.textSecondary}30`
      : `${theme.colors.primary}30`
    };
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Grid = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const gridVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const technologies = {
  frontendCore: [
    { id: 'html5', icon: <SiHtml5 />, level: 'advanced' as const },
    { id: 'css3', icon: <SiCss3 />, level: 'advanced' as const },
    { id: 'javascript', icon: <SiJavascript />, level: 'intermediate' as const },
    { id: 'typescript', icon: <SiTypescript />, level: 'intermediate' as const }
  ],
  frontendFrameworks: [
    { id: 'react', icon: <SiReact />, level: 'learning' as const },
    { id: 'nextjs', icon: <SiNextdotjs />, level: 'learning' as const },
    { id: 'tailwindcss', icon: <SiTailwindcss />, level: 'learning' as const },
    { id: 'angular', icon: <SiAngular />, level: 'learning' as const },
    { id: 'bootstrap', icon: <SiBootstrap />, level: 'beginner' as const }
  ],
  backendDb: [
    { id: 'php', icon: <SiPhp />, level: 'beginner' as const },
    { id: 'mysql', icon: <SiMysql />, level: 'beginner' as const }
  ],
  programming: [
    { id: 'cpp', icon: <SiCplusplus />, level: 'intermediate' as const },
    { id: 'csharp', icon: <SiSharp />, level: 'intermediate' as const },
    { id: 'python', icon: <SiPython />, level: 'beginner' as const },
    { id: 'java', icon: <FaJava />, level: 'beginner' as const }
  ],
  devTools: [
    { id: 'git', icon: <SiGit />, level: 'intermediate' as const },
    { id: 'markdown', icon: <SiMarkdown />, level: 'advanced' as const }
  ],
  systemDevops: [
    { id: 'androidStudio', icon: <SiAndroidstudio />, level: 'beginner' as const },
    { id: 'batch', icon: <IoTerminal />, level: 'intermediate' as const }
  ],
  plannedSkills: [
    { id: 'bash', icon: <SiGnubash />, level: 'planned' as const }
  ]
};

const CATEGORY_FILTERS: CategoryFilter[] = ['all', 'frontend', 'backend', 'languages', 'tools', 'planned'];

export const TechnologyGrid: React.FC = () => {
  const { t } = useTranslation();
  const { reducedMotion } = useAnimation();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const handleFilterClick = useCallback((f: CategoryFilter) => {
    setActiveFilter(f);
  }, []);

  const visibleCategories = useMemo(
    () => (Object.entries(technologies) as Array<[keyof typeof technologies, typeof technologies[keyof typeof technologies]]>)
      .filter(([category]) => activeFilter === 'all' || CATEGORY_FILTER_MAP[activeFilter].includes(category)),
    [activeFilter]
  );

  return (
    <>
      <FilterRow role="group" aria-label={t('about.skills.title')}>
        {CATEGORY_FILTERS.map((f) => (
          <FilterChip
            key={f}
            type="button"
            $isActive={activeFilter === f}
            onClick={() => handleFilterClick(f)}
            aria-pressed={activeFilter === f}
          >
            {t(`about.skills.filter${f.charAt(0).toUpperCase()}${f.slice(1)}`)}
          </FilterChip>
        ))}
      </FilterRow>
      <Container
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {visibleCategories.map(([category, techs]) => (
          <CategorySection
            key={category}
            variants={!reducedMotion ? categoryVariants : undefined}
            $isPlanned={category === 'plannedSkills'}
          >
            <CategoryTitle>
              {t(`about.skills.categories.${category}.title`)}
            </CategoryTitle>
            <CategoryDescription>
              {t(`about.skills.categories.${category}.description`)}
            </CategoryDescription>
            <Grid variants={!reducedMotion ? gridVariants : undefined}>
              {techs.map((tech) => (
                <TechnologyIcon
                  key={tech.id}
                  name={t(`about.skills.categories.${category}.skills.${tech.id}.name`)}
                  description={t(`about.skills.categories.${category}.skills.${tech.id}.description`)}
                  icon={tech.icon}
                  level={tech.level}
                />
              ))}
            </Grid>
          </CategorySection>
        ))}
      </Container>
    </>
  );
}; 