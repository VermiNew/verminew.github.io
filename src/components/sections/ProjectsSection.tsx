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

  &:focus {
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

const CategoryTitle = styled(motion.h3)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
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

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: -30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.6,
      delay: 0.3
    }
  }
};

export const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const { data, isLoading, error } = useRepos();
  const { reducedMotion } = useAnimation();

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
        
        <FilterContainer
          variants={!reducedMotion ? itemVariants : undefined}
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
                <CategoryTitle
                  variants={!reducedMotion ? titleVariants : undefined}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {t('projects.featuredTitle')}
                </CategoryTitle>
                <ProjectsGrid
                   variants={!reducedMotion ? gridVariants : undefined}
                   initial="hidden"
                   animate="visible"
                   layout
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
                <CategoryTitle
                  variants={!reducedMotion ? titleVariants : undefined}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {t('projects.otherTitle')}
                </CategoryTitle>
                <ProjectsGrid
                   variants={!reducedMotion ? gridVariants : undefined}
                   initial="hidden"
                   animate="visible"
                   layout
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