import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTranslation } from 'react-i18next';
import { useRepos } from '@/hooks/useRepos';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAnimation } from '@/context/AnimationContext';
import { Repo } from '@/types/repo';

const Content = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const FilterContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : `${theme.colors.primary}20`};
    transform: translateY(-2px);
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
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const EXCLUDED_TECHNOLOGIES = ['unknown', 'config', 'github-config'];

const filterValidTechnology = (tech: string) => 
  !EXCLUDED_TECHNOLOGIES.includes(tech.toLowerCase());

interface OrganizedProjects {
  featured: Repo[];
  other: Repo[];
}

export const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const { data, isLoading, error } = useRepos();
  const { reducedMotion } = useAnimation();
  const [animateKey, setAnimateKey] = useState(0);

  const getAvailableTechnologies = () => {
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
  };

  const filters = [
    { id: 'all', label: t('projects.filters.all') },
    ...getAvailableTechnologies().map(tech => ({
      id: tech.toLowerCase(),
      label: tech
    }))
  ];

  const handleFilterClick = (filterId: string) => {
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
    setAnimateKey(prev => prev + 1);
  };

  const filteredProjects = data?.repos
    ? data.repos.filter(project => {
        if (activeFilters.includes('all')) return true;
        
        const projectTechnologies = [
          ...(project.language ? [project.language] : []),
          ...project.technologies
        ].map(tech => tech.toLowerCase());
        
        return activeFilters.some(filter => 
          projectTechnologies.includes(filter.toLowerCase())
        );
      })
    : [];

  const organizedProjects = filteredProjects.reduce<OrganizedProjects>((acc, project) => {
    if (project.featured) {
      acc.featured.push(project);
    } else {
      acc.other.push(project);
    }
    return acc;
  }, { featured: [], other: [] });

  return (
    <Section id="projects">
      <Content
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SectionTitle variants={!reducedMotion ? itemVariants : undefined}>
          {t('projects.title')}
        </SectionTitle>
        
        <FilterContainer variants={!reducedMotion ? itemVariants : undefined}>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              $isActive={activeFilters.includes(filter.id)}
              onClick={() => handleFilterClick(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterContainer>

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
                  key={`featured-${animateKey}`}
                  variants={!reducedMotion ? gridVariants : undefined}
                  initial="hidden"
                  animate="visible"
                >
                  {organizedProjects.featured.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={!reducedMotion ? itemVariants : undefined}
                      layout
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </ProjectsGrid>
              </ProjectsCategory>
            )}

            {organizedProjects.other.length > 0 && (
              <ProjectsCategory>
                <CategoryTitle>{t('projects.otherTitle')}</CategoryTitle>
                <ProjectsGrid
                  key={`other-${animateKey}`}
                  variants={!reducedMotion ? gridVariants : undefined}
                  initial="hidden"
                  animate="visible"
                >
                  {organizedProjects.other.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={!reducedMotion ? itemVariants : undefined}
                      layout
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </ProjectsGrid>
              </ProjectsCategory>
            )}
          </ProjectsContainer>
        )}
      </Content>
    </Section>
  );
}; 