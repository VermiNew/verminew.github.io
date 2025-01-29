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

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
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
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
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

export const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { data, isLoading, error } = useRepos();
  const { reducedMotion } = useAnimation();

  const getAvailableLanguages = () => {
    if (!data?.repos) return [];
    const languages = new Set<string>();
    data.repos.forEach(project => {
      if (project.language) {
        languages.add(project.language);
      }
    });
    return Array.from(languages).sort();
  };

  const filters = [
    { id: 'all', label: t('projects.filters.all') },
    ...getAvailableLanguages().map(lang => ({
      id: lang.toLowerCase(),
      label: lang
    }))
  ];

  const filteredProjects = data?.repos.filter(project => 
    activeFilter === 'all' || 
    (project.language && project.language.toLowerCase() === activeFilter)
  );

  return (
    <Section id="projects">
      <Content
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SectionTitle variants={!reducedMotion ? itemVariants : undefined}>{t('projects.title')}</SectionTitle>
        
        <FilterContainer variants={!reducedMotion ? itemVariants : undefined}>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              $isActive={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
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
          <motion.div variants={!reducedMotion ? itemVariants : undefined}>
            <ProjectsGrid>
              {filteredProjects?.map((project) => (
                <motion.div key={project.id} variants={!reducedMotion ? itemVariants : undefined}>
                  <ProjectCard
                    project={project}
                  />
                </motion.div>
              ))}
            </ProjectsGrid>
          </motion.div>
        )}
      </Content>
    </Section>
  );
}; 