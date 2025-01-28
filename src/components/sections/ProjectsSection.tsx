import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { useTranslation } from 'react-i18next';
import { SiGithub } from 'react-icons/si';
import { HiExternalLink } from 'react-icons/hi';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import { ProjectType } from '@/types/project';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled(motion.button)<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme['colors'].primary};
  background: ${({ theme, isActive }) => 
    isActive ? theme['colors'].primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? theme['colors'].background : theme['colors'].primary};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme['colors'].primary};
    color: ${({ theme }) => theme['colors'].background};
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme['breakpoints'].tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const ProjectCard = styled(motion.article)`
  background: ${({ theme }) => theme['colors'].surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme['shadows'].medium};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme['shadows'].large};
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme['colors'].text};
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme['colors'].textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const TechStack = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const TechTag = styled.span<{ $variant?: 'archived' | 'visibility', $isActive?: boolean }>`
  padding: 0.25rem 0.5rem;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'archived':
        return `${theme.colors.error}20`;
      case 'visibility':
        return `${theme.colors.success}20`;
      default:
        return `${theme.colors.primary}20`;
    }
  }};
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'archived':
        return theme.colors.error;
      case 'visibility':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  }};
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: ${({ $isActive }) => $isActive ? 'pointer' : 'default'};

  &:hover {
    background: ${({ theme }) => theme['colors'].primary};
    color: ${({ theme }) => theme['colors'].background};
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme['colors'].primary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme['colors'].accent};
  }
`;

const CategoryTags = styled(motion.div)`
  margin: 1rem 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const CategoryTag = styled(motion.span)<{ $isActive: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  background: ${({ theme, $isActive }) => 
    $isActive ? `${theme.colors.primary}20` : `${theme.colors.textSecondary}10`
  };
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.textSecondary
  };
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}20`};
    color: ${({ theme }) => theme.colors.primary};
  }
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
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ProjectType>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { projects, categories, isLoading, error } = useGithubRepos();

  const filteredProjects = projects.filter(project => {
    const matchesType = activeFilter === 'all' ? true : project.type === activeFilter;
    const matchesTag = !activeTag ? true : project.technologies.includes(activeTag);
    return matchesType && matchesTag;
  });

  const currentCategoryTags = activeFilter === 'all' 
    ? [] 
    : categories[activeFilter] || [];

  return (
    <Section id="projects">
      <Content>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle>{t('projects.title')}</SectionTitle>
          
          <FiltersContainer>
            {(['all', 'web', 'ai', 'desktop'] as ProjectType[]).map((type) => (
              <FilterButton
                key={type}
                isActive={activeFilter === type}
                onClick={() => {
                  setActiveFilter(type);
                  setActiveTag(null);
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(`projects.filters.${type}`)}
              </FilterButton>
            ))}
          </FiltersContainer>

          {activeFilter !== 'all' && (
            <CategoryTags>
              {currentCategoryTags.map((tag) => (
                <CategoryTag
                  key={tag}
                  $isActive={activeTag === tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </CategoryTag>
              ))}
            </CategoryTags>
          )}

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <ProjectsGrid variants={containerVariants}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <TechStack>
                      {project.archived && (
                        <TechTag $variant="archived">
                          {t('projects.tags.archived')}
                        </TechTag>
                      )}
                      {project.technologies.map((tech) => (
                        <TechTag 
                          key={tech}
                          $isActive={tech === activeTag}
                          onClick={() => setActiveTag(tech === activeTag ? null : tech)}
                        >
                          {tech}
                        </TechTag>
                      ))}
                    </TechStack>
                    <ProjectLinks>
                      <ProjectLink 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiGithub />
                        {t('projects.viewGithub')}
                      </ProjectLink>
                      {project.liveUrl && (
                        <ProjectLink
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <HiExternalLink />
                          {t('projects.visitLive')}
                        </ProjectLink>
                      )}
                    </ProjectLinks>
                  </ProjectContent>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </motion.div>
      </Content>
    </Section>
  );
}; 