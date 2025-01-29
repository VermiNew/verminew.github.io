import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useGithubDiscussions, Post } from '@/hooks/useGithubDiscussions';
import { useAnimation } from '@/context/AnimationContext';

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Tag = styled(motion.button)<{ isActive: boolean }>`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${({ theme }) => theme['colors'].primary};
  background: ${({ theme, isActive }) => 
    isActive ? theme['colors'].primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? theme['colors'].background : theme['colors'].primary};
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme['colors'].primary};
    color: ${({ theme }) => theme['colors'].background};
  }
`;

const PostsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PostCard = styled(motion.article)`
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

const PostTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme['colors'].text};
  margin-bottom: 0.5rem;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme['colors'].textSecondary};
  margin-bottom: 1rem;
`;

const PostTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const PostTag = styled.span`
  padding: 0.15rem 0.5rem;
  background: ${({ theme }) => `${theme['colors'].primary}20`};
  color: ${({ theme }) => theme['colors'].primary};
  border-radius: 12px;
  font-size: 0.8rem;
`;

const PostExcerpt = styled.p`
  color: ${({ theme }) => theme['colors'].text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReadMore = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme['colors'].primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme['colors'].accent};
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

export const BlogSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTag, setActiveTag] = useState<string>('all');
  const { posts, tags, isLoading, error } = useGithubDiscussions();
  const { reducedMotion } = useAnimation();

  const filteredPosts = activeTag === 'all' 
    ? posts 
    : posts.filter((post: Post) => post.tags.includes(activeTag));

  return (
    <Section id="blog">
      <Content>
        <motion.div
          variants={!reducedMotion ? containerVariants : undefined}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={!reducedMotion ? itemVariants : undefined}>{t('blog.title')}</SectionTitle>

          <TagsContainer>
            <Tag
              isActive={activeTag === 'all'}
              onClick={() => setActiveTag('all')}
              variants={!reducedMotion ? itemVariants : undefined}
              whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
              whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            >
              {t('blog.tags.all')}
            </Tag>
            {tags.map((tag: string) => (
              <Tag
                key={tag}
                isActive={activeTag === tag}
                onClick={() => setActiveTag(tag)}
                variants={!reducedMotion ? itemVariants : undefined}
                whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
                whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              {t('blog.error')}
            </div>
          )}

          {!isLoading && !error && (
            <PostsList variants={!reducedMotion ? containerVariants : undefined}>
              {filteredPosts.map((post: Post) => (
                <PostCard
                  key={post.id}
                  variants={!reducedMotion ? itemVariants : undefined}
                >
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </PostMeta>
                  <PostTags>
                    {post.tags.map((tag: string) => (
                      <PostTag key={tag}>{tag}</PostTag>
                    ))}
                  </PostTags>
                  <PostExcerpt>{post.excerpt}</PostExcerpt>
                  <ReadMore
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={!reducedMotion ? { x: 5 } : undefined}
                  >
                    {t('blog.readMore')} →
                  </ReadMore>
                </PostCard>
              ))}
            </PostsList>
          )}
        </motion.div>
      </Content>
    </Section>
  );
}; 