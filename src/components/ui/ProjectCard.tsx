import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SiGithub } from 'react-icons/si';
import { HiExternalLink } from 'react-icons/hi';
import { Repo } from '@/types/repo';

interface ProjectCardProps {
  project: Repo;
}

const Card = styled(motion.article)<{ $featured?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.transitions.default};
  border: 2px solid ${({ theme, $featured }) => 
    $featured ? theme.colors.primary : `${theme.colors.primary}10`};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ $featured }) => $featured && `
    order: -1;
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme, $featured }) => 
      $featured ? theme.colors.accent : `${theme.colors.primary}30`};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
`;

const PriorityIndicator = styled.div<{ $priority: 1 | 2 | 3 }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $priority }) => {
    switch ($priority) {
      case 1:
        return theme.colors.accent;
      case 2:
        return theme.colors.success;
      case 3:
      default:
        return theme.colors.warning;
    }
  }};
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
`;

const FeaturedReason = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const Content = styled.div<{ $hasBadges?: boolean }>`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  padding-top: ${({ $hasBadges }) => $hasBadges ? '3rem' : '1.5rem'};
`;

const TopContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
  flex: 1;
`;

const BottomContent = styled.div`
  margin-top: auto;
`;

const TechStack = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Tag = styled.span<{ $variant?: 'archived' | 'visibility' }>`
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
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Links = styled.div`
  display: flex;
  gap: 1rem;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();
  const hasBadges = Boolean(project.featured || project.category);

  return (
    <Card
      $featured={project.featured}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {project.featured && (
        <>
          <FeaturedBadge>
            <PriorityIndicator $priority={project.priority as 1 | 2 | 3} />
            {t('projects.featured')}
          </FeaturedBadge>
          {project.category && (
            <CategoryBadge>
              {t(`projects.categories.${project.category}`)}
            </CategoryBadge>
          )}
        </>
      )}
      <Content $hasBadges={hasBadges}>
        <TopContent>
          <Title>{project.title}</Title>
          <Description>{project.description}</Description>
          {project.featured && project.featuredReason && (
            <FeaturedReason>{project.featuredReason}</FeaturedReason>
          )}
        </TopContent>
        <BottomContent>
          <TechStack>
            {project.archived && (
              <Tag $variant="archived">
                {t('projects.tags.archived')}
              </Tag>
            )}
            <Tag $variant="visibility">
              {t(`projects.tags.visibility.${project.visibility}`)}
            </Tag>
            {project.technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </TechStack>

          <Stats>
            <span>⭐ {project.stars}</span>
            <span>🍴 {project.forks}</span>
          </Stats>

          <Links>
            <Link 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub />
              {t('projects.viewGithub')}
            </Link>
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiExternalLink />
                {t('projects.visitLive')}
              </Link>
            )}
          </Links>
        </BottomContent>
      </Content>
    </Card>
  );
}; 