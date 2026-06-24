import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTranslation } from 'react-i18next';
import { useRepos } from '@/hooks/useRepos';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Repo } from '@/types/repo';

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $isActive }) => 
    $isActive ? '#fff' : theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  font-weight: 500;

  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : `${theme.colors.primary}20`};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
  min-height: 100px;
  align-items: stretch;
  width: 100%;

  & > * {
    height: 100%;
    display: flex;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const ProjectsCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => `${theme.colors.primary}25`};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ShowMoreButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}15`};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.15 }
  }
};

const ACTIVE_REPO_LIMIT = 10;

const ALLOWED_FILTER_TECHNOLOGIES = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'go', 'rust', 'ruby',
  'html', 'css', 'react', 'vue', 'angular', 'nextjs', 'next.js', 'svelte',
  'node.js', 'express', 'django', 'flask', 'fastapi', 'laravel',
  'mysql', 'postgresql', 'mongodb', 'sqlite',
  'docker', 'kubernetes', 'bash', 'shell', 'powershell',
];

const filterValidTechnology = (tech: string) =>
  ALLOWED_FILTER_TECHNOLOGIES.includes(tech.toLowerCase());

interface OrganizedProjects {
  featured: Repo[];
  active: Repo[];
  planned: Repo[];
}

export const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [showAllActive, setShowAllActive] = useState(false);
  const { data, isLoading, error } = useRepos();

  const availableTechnologies = useMemo(() => {
    if (!data?.repos) return [];
    const technologies = new Set<string>();

    data.repos.forEach(project => {
      if (project.language && filterValidTechnology(project.language)) {
        technologies.add(project.language);
      }
      project.technologies.forEach((tech: string) => {
        if (filterValidTechnology(tech)) {
          technologies.add(tech);
        }
      });
    });

    return Array.from(technologies).sort();
  }, [data?.repos]);

  const filters = useMemo(() => [
    { id: 'all', label: t('projects.filters.all') },
    ...availableTechnologies.map(tech => ({
      id: tech.toLowerCase(),
      label: tech
    }))
  ], [availableTechnologies, t]);

  const handleFilterClick = useCallback((filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes('all') 
        ? [filterId]
        : activeFilters.includes(filterId)
          ? activeFilters.filter(f => f !== filterId)
          : [...activeFilters, filterId];
      
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
    setShowAllActive(false);
  }, [activeFilters]);

  const filteredProjects = useMemo(() => {
    if (!data?.repos) return [];
    if (activeFilters.includes('all')) return data.repos;
    return data.repos.filter(project => {
      const projectTechnologies = [
        ...(project.language ? [project.language] : []),
        ...project.technologies
      ].map(tech => tech.toLowerCase());
      return activeFilters.some(filter =>
        projectTechnologies.includes(filter.toLowerCase())
      );
    });
  }, [data?.repos, activeFilters]);

  const organizedProjects = useMemo(() => {
    const all = filteredProjects.reduce<OrganizedProjects>((acc, project) => {
      if (project.featured) {
        acc.featured.push(project);
      } else if (project.status === 'planned') {
        acc.planned.push(project);
      } else {
        acc.active.push(project);
      }
      return acc;
    }, { featured: [], active: [], planned: [] });

    all.featured = all.featured.slice(0, 3);
    return all;
  }, [filteredProjects]);

  const { visibleActive, hiddenActiveCount } = useMemo(() => ({
    visibleActive: showAllActive
      ? organizedProjects.active
      : organizedProjects.active.slice(0, ACTIVE_REPO_LIMIT),
    hiddenActiveCount: Math.max(0, organizedProjects.active.length - ACTIVE_REPO_LIMIT),
  }), [organizedProjects.active, showAllActive]);

  return (
    <Section id="projects">
      <Content>
        <SectionTitle>{t('projects.title')}</SectionTitle>

        <FilterContainer
          role="group"
          aria-label={t('projects.filters.label')}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              type="button"
              $isActive={activeFilters.includes(filter.id)}
              onClick={() => handleFilterClick(filter.id)}
              aria-pressed={activeFilters.includes(filter.id)}
              aria-label={`${t('projects.filters.label')}: ${filter.label}`}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterContainer>

        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          style={{ display: 'none' }}
        >
          {t('projects.resultsCount', { count: filteredProjects.length })}
        </div>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : (
          <ProjectsContainer>
            {organizedProjects.featured.length > 0 && (
              <ProjectsCategory>
                <CategoryTitle>{t('projects.featuredTitle')}</CategoryTitle>
                <ProjectsGrid
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {organizedProjects.featured.map((project) => (
                      <motion.div key={project.id} variants={cardVariants} layout>
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ProjectsGrid>
              </ProjectsCategory>
            )}

            {organizedProjects.active.length > 0 && (
              <ProjectsCategory>
                <CategoryTitle>{t('projects.otherTitle')}</CategoryTitle>
                <ProjectsGrid
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleActive.map((project) => (
                      <motion.div key={project.id} variants={cardVariants} layout>
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ProjectsGrid>
                {!showAllActive && hiddenActiveCount > 0 && (
                  <ShowMoreButton
                    type="button"
                    onClick={() => setShowAllActive(true)}
                  >
                    {t('projects.showMore', { count: hiddenActiveCount })}
                  </ShowMoreButton>
                )}
                {showAllActive && hiddenActiveCount > 0 && (
                  <ShowMoreButton
                    type="button"
                    onClick={() => setShowAllActive(false)}
                  >
                    {t('projects.showLess')}
                  </ShowMoreButton>
                )}
              </ProjectsCategory>
            )}

            {organizedProjects.planned.length > 0 && (
              <ProjectsCategory>
                <CategoryTitle>{t('projects.plannedTitle')}</CategoryTitle>
                <ProjectsGrid
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {organizedProjects.planned.map((project) => (
                      <motion.div key={project.id} variants={cardVariants} layout>
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ProjectsGrid>
              </ProjectsCategory>
            )}
          </ProjectsContainer>
        )}
      </Content>
    </Section>
  );
}; 