import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TechnologyIcon } from '@/components/ui/TechnologyIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { useAnimation } from '@/context/AnimationContext';
import {
  // Frontend Core
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  // Frontend Frameworks & Libraries
  SiReact,
  SiVuedotjs,
  SiNextdotjs,
  SiAngular,
  SiBootstrap,
  SiTailwindcss,
  // Backend & Databases
  SiPhp,
  SiMysql,
  SiFastapi,
  // Programming Languages
  SiCplusplus,
  SiSharp,
  SiPython,
  // AI/ML
  SiTensorflow,
  SiPytorch,
  // Development Tools
  SiGit,
  SiDocker,
  SiJest,
  SiMarkdown,
  // System & DevOps
  SiGnubash,
  SiAndroidstudio,
  // Future Plans
  SiRedis,
  SiFirebase,
  SiAuth0,
  SiJsonwebtokens,
  SiRust,
  SiGo
} from 'react-icons/si';
import { IoTerminal } from "react-icons/io5";
import { FaJava } from "react-icons/fa";

const Container = styled(motion.div)`
  display: grid;
  gap: 3rem;
`;

const CategorySection = styled(motion.div)<{ $isPlanned?: boolean }>`
  background: ${({ theme, $isPlanned }) => $isPlanned 
    ? `${theme.colors.surface}20`
    : `${theme.colors.surface}40`
  };
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme, $isPlanned }) => $isPlanned
    ? `${theme.colors.textSecondary}15`
    : `${theme.colors.primary}10`
  };
  transition: all ${({ theme }) => theme.transitions.default};
  opacity: ${({ $isPlanned }) => $isPlanned ? 0.8 : 1};

  &:hover {
    border-color: ${({ theme, $isPlanned }) => $isPlanned
      ? `${theme.colors.textSecondary}30`
      : `${theme.colors.primary}30`
    };
    transform: translateY(-2px);
  }
`;

const CategoryTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
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
      ease: 'easeOut'
    }
  }
};

const technologies = {
  frontendCore: [
    // HTML + CSS as fundamental pair
    { id: 'html5', icon: <SiHtml5 />, level: 'intermediate' as const },
    { id: 'css3', icon: <SiCss3 />, level: 'intermediate' as const },
    // JavaScript + TypeScript as a pair
    { id: 'javascript', icon: <SiJavascript />, level: 'beginner' as const },
    { id: 'typescript', icon: <SiTypescript />, level: 'learning' as const }
  ],
  frontendFrameworks: [
    // Angular
    { id: 'angular', icon: <SiAngular />, level: 'learning' as const },
    // Styling frameworks together
    { id: 'bootstrap', icon: <SiBootstrap />, level: 'beginner' as const }
  ],
  backendDb: [
    // PHP + MySQL as classic stack
    { id: 'php', icon: <SiPhp />, level: 'beginner' as const },
    { id: 'mysql', icon: <SiMysql />, level: 'beginner' as const }
  ],
  programming: [
    // C-family languages together
    { id: 'cpp', icon: <SiCplusplus />, level: 'intermediate' as const },
    { id: 'csharp', icon: <SiSharp />, level: 'intermediate' as const },
    // Interpreted languages
    { id: 'python', icon: <SiPython />, level: 'beginner' as const },
    { id: 'java', icon: <FaJava />, level: 'beginner' as const }
  ],
  devTools: [
    // Version control
    { id: 'git', icon: <SiGit />, level: 'intermediate' as const },
    // Documentation
    { id: 'markdown', icon: <SiMarkdown />, level: 'advanced' as const }
  ],
  systemDevops: [
    // Development environments
    { id: 'androidStudio', icon: <SiAndroidstudio />, level: 'beginner' as const },
    // Shell scripting
    { id: 'batch', icon: <IoTerminal />, level: 'beginner' as const }
  ],
  plannedSkills: [
    // Frontend frameworks
    { id: 'react', icon: <SiReact />, level: 'planned' as const },
    { id: 'nextjs', icon: <SiNextdotjs />, level: 'planned' as const },
    { id: 'vuejs', icon: <SiVuedotjs />, level: 'planned' as const },
    { id: 'tailwindcss', icon: <SiTailwindcss />, level: 'planned' as const },
    // Backend services
    { id: 'fastapi', icon: <SiFastapi />, level: 'planned' as const },
    { id: 'redis', icon: <SiRedis />, level: 'planned' as const },
    { id: 'firebase', icon: <SiFirebase />, level: 'planned' as const },
    // DevOps tools
    { id: 'docker', icon: <SiDocker />, level: 'planned' as const },
    { id: 'bash', icon: <SiGnubash />, level: 'planned' as const },
    // Testing
    { id: 'jest', icon: <SiJest />, level: 'planned' as const },
    // AI/ML frameworks
    { id: 'tensorflow', icon: <SiTensorflow />, level: 'planned' as const },
    { id: 'pytorch', icon: <SiPytorch />, level: 'planned' as const },
    // Authentication & Security
    { id: 'oauth', icon: <SiAuth0 />, level: 'planned' as const },
    { id: 'jwt', icon: <SiJsonwebtokens />, level: 'planned' as const },
    // Modern systems programming
    { id: 'rust', icon: <SiRust />, level: 'planned' as const },
    { id: 'go', icon: <SiGo />, level: 'planned' as const }
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
          $isPlanned={category === 'plannedSkills'}
        >
          <CategoryTitle $isDark={themeMode === 'dark'}>
            {t(`about.skills.categories.${category}.title`)}
          </CategoryTitle>
          <CategoryDescription>
            {t(`about.skills.categories.${category}.description`)}
          </CategoryDescription>
          <Grid>
            {techs.map((tech) => (
              <TechnologyIcon
                key={tech.id}
                name={t(`about.skills.categories.${category}.skills.${tech.id}.name`)}
                description={t(`about.skills.categories.${category}.skills.${tech.id}.description`)}
                icon={tech.icon}
                level={tech.level}
              />
            ))}
          </Grid>
        </CategorySection>
      ))}
    </Container>
  );
}; 