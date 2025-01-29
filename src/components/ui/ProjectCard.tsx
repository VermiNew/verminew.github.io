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

const Card = styled(motion.article)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all ${({ theme }) => theme.transitions.default};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}10`};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    border-color: ${({ theme }) => `${theme.colors.primary}30`};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
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

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Content>
        <Title>{project.title}</Title>
        <Description>{project.description}</Description>
        
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
      </Content>
    </Card>
  );
}; 