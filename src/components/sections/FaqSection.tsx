import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useAnimation } from '@/context/hooks/useAnimation';
import { useTheme } from '@/context/hooks/useTheme';
import { isDarkTheme } from '@/utils/themeUtils';
import { isRecord } from '@/utils/translationValues';

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FaqItem = styled(motion.div)<{ $isDark: boolean; $isOpen: boolean }>`
  background: ${({ theme, $isDark }) => $isDark
    ? `${theme.colors.surface}80`
    : `${theme.colors.background}80`
  };
  border-radius: 12px;
  border: 1px solid ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.primary : `${theme.colors.primary}15`};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: ${({ theme }) => `${theme.colors.primary}50`};
  }
`;

const QuestionButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.primary : theme.colors.text};
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
    border-radius: 12px;
  }
`;

const ChevronIcon = styled(motion.span)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const AnswerWrapper = styled(motion.div)`
  overflow: hidden;
`;

const AnswerContent = styled.div`
  padding: 0 1.5rem 1.25rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

export const FaqSection: React.FC = () => {
  const { t } = useTranslation();
  const { reducedMotion } = useAnimation();
  const { themeMode } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rawQuestions = t('faq.questions', { returnObjects: true }) as unknown;
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions.filter((item): item is { question: string; answer: string } =>
        isRecord(item) && typeof item.question === 'string' && typeof item.answer === 'string')
    : [];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq">
      <SectionTitle>{t('faq.title')}</SectionTitle>
      <motion.div
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <FaqList>
          {questions.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FaqItem
                key={index}
                $isDark={isDark}
                $isOpen={isOpen}
                variants={!reducedMotion ? itemVariants : undefined}
              >
                <QuestionButton
                  $isOpen={isOpen}
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  {faq.question}
                  <ChevronIcon
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown aria-hidden="true" />
                  </ChevronIcon>
                </QuestionButton>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <AnswerWrapper
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <AnswerContent>{faq.answer}</AnswerContent>
                    </AnswerWrapper>
                  )}
                </AnimatePresence>
              </FaqItem>
            );
          })}
        </FaqList>
      </motion.div>
    </Section>
  );
};
