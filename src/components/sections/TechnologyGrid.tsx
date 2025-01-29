import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TechnologyIcon } from '@/components/ui/TechnologyIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { useAnimation } from '@/context/AnimationContext';
import {
  // Web Development
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiAngular,
  SiBootstrap,
  // Programming Languages
  SiCplusplus,
  SiSharp,
  SiFastapi as SiJava,
  SiPython,
  // AI/ML
  SiTensorflow,
  SiPytorch,
  // Other
  SiAndroidstudio,
  SiMysql,
  SiDocker
} from 'react-icons/si';

const Container = styled(motion.div)`
  margin-top: 2rem;
`;

const CategorySection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 600;
  opacity: ${({ $isDark }) => $isDark ? 0.9 : 1};
`;

const CategoryDescription = styled.p`
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
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

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const technologies = {
  webDev: [
    { id: 'html5', icon: <SiHtml5 />, level: 'advanced' as const },
    { id: 'css3', icon: <SiCss3 />, level: 'advanced' as const },
    { id: 'javascript', icon: <SiJavascript />, level: 'intermediate' as const },
    { id: 'typescript', icon: <SiTypescript />, level: 'learning' as const },
    { id: 'react', icon: <SiReact />, level: 'learning' as const },
    { id: 'angular', icon: <SiAngular />, level: 'intermediate' as const },
    { id: 'bootstrap', icon: <SiBootstrap />, level: 'intermediate' as const }
  ],
  programming: [
    { id: 'cpp', icon: <SiCplusplus />, level: 'advanced' as const },
    { id: 'csharp', icon: <SiSharp />, level: 'intermediate' as const },
    { id: 'java', icon: <SiJava />, level: 'intermediate' as const },
    { id: 'python', icon: <SiPython />, level: 'intermediate' as const }
  ],
  aiMl: [
    { id: 'tensorflow', icon: <SiTensorflow />, level: 'learning' as const },
    { id: 'pytorch', icon: <SiPytorch />, level: 'learning' as const }
  ],
  other: [
    { id: 'androidStudio', icon: <SiAndroidstudio />, level: 'intermediate' as const },
    { id: 'mysql', icon: <SiMysql />, level: 'intermediate' as const },
    { id: 'docker', icon: <SiDocker />, level: 'learning' as const }
  ]
};

export const TechnologyGrid: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const { reducedMotion } = useAnimation();

  return (
    <Container
      variants={!reducedMotion ? containerVariants : undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {Object.entries(technologies).map(([category, techs]) => (
        <CategorySection
          key={category}
          variants={!reducedMotion ? categoryVariants : undefined}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <CategoryTitle $isDark={themeMode === 'dark'}>
            {t(`about.skills.categories.${category}.title`)}
          </CategoryTitle>
          <CategoryDescription>
            {t(`about.skills.categories.${category}.description`)}
          </CategoryDescription>
          <Grid>
            {techs.map((tech, index) => (
              <TechnologyIcon
                key={tech.id}
                name={t(`about.skills.categories.${category}.skills.${tech.id}.name`)}
                icon={tech.icon}
                level={tech.level}
                variants={!reducedMotion ? itemVariants : undefined}
                custom={index}
              />
            ))}
          </Grid>
        </CategorySection>
      ))}
    </Container>
  );
}; 