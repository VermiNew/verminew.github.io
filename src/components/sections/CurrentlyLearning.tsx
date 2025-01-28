import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TechnologyIcon } from '../ui/TechnologyIcon';
import { useTranslation } from 'react-i18next';
import { 
  SiReact, 
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiTypescript,
  SiDocker,
  SiGooglecolab,
  SiKaggle
} from 'react-icons/si';

const Container = styled(motion.div)`
  position: relative;
  margin-top: 4rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ theme }) => `${theme['colors']['surface']}40`};
  backdrop-filter: blur(5px);
  border: 1px solid ${({ theme }) => `${theme['colors']['primary']}20`};

  &::before {
    content: '';
    position: absolute;
    top: -2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: ${({ theme }) => `${theme['colors']['primary']}20`};
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme['colors']['primary']};
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  
  @media (max-width: ${({ theme }) => theme['breakpoints']['mobile']}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

export const CurrentlyLearning: React.FC = () => {
  const { t } = useTranslation();

  const technologies = [
    { id: 'react', icon: <SiReact />, level: 'learning' as const },
    { id: 'typescript', icon: <SiTypescript />, level: 'learning' as const },
    { id: 'python', icon: <SiPython />, level: 'intermediate' as const },
    { id: 'tensorflow', icon: <SiTensorflow />, level: 'learning' as const },
    { id: 'pytorch', icon: <SiPytorch />, level: 'learning' as const },
    { id: 'docker', icon: <SiDocker />, level: 'learning' as const },
    { id: 'googleColab', icon: <SiGooglecolab />, level: 'intermediate' as const },
    { id: 'kaggle', icon: <SiKaggle />, level: 'learning' as const },
  ];

  return (
    <Container
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Title>{t('about.currentLearning.title')}</Title>
      <Grid>
        {technologies.map((tech, index) => (
          <TechnologyIcon
            key={tech.id}
            name={t(`about.currentLearning.technologies.${tech.id}`)}
            icon={tech.icon}
            level={tech.level}
            custom={index}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: (i: number) => ({
                opacity: 1,
                scale: 1,
                transition: {
                  delay: i * 0.1,
                  duration: 0.3,
                  ease: 'easeOut'
                }
              })
            }}
          />
        ))}
      </Grid>
    </Container>
  );
}; 