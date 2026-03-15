import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { isDarkTheme } from '@/utils/themeUtils';
import { useTranslation } from 'react-i18next';
import { MdCheckCircle, MdError, MdSend } from 'react-icons/md';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { useAnimation } from '@/context/AnimationContext';

// ── Replace with your real Formspree endpoint ──────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
// ───────────────────────────────────────────────────────────────────────────

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Description = styled(motion.p)`
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 640px;
  margin: 0 auto;
`;

const Card = styled(motion.div)<{ $isDark: boolean }>`
  width: 100%;
  padding: 2.5rem;
  border-radius: 20px;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.surface}80` : `${theme.colors.background}80`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  backdrop-filter: blur(5px);
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.3px;
`;

const inputStyles = `
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
`;

const Input = styled.input<{ $isDark: boolean }>`
  ${inputStyles}
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}cc` : `${theme.colors.surface}cc`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}30`};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const Select = styled.select<{ $isDark: boolean }>`
  ${inputStyles}
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}cc` : `${theme.colors.surface}cc`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}30`};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

const Textarea = styled.textarea<{ $isDark: boolean }>`
  ${inputStyles}
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}cc` : `${theme.colors.surface}cc`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}30`};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 140px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const StatusBanner = styled(motion.div)<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  background: ${({ $type, theme }) =>
    $type === 'success'
      ? `${theme.colors.primary}15`
      : '#ef444415'};
  border: 1px solid ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.primary : '#ef4444'};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.primary : '#ef4444'};

  svg {
    font-size: 1.4rem;
    flex-shrink: 0;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export const OrderSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const { reducedMotion } = useAnimation();

  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '',
    budget: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', type: '', budget: '', description: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <SectionContainer id="order">
      <SectionTitle>{t('order.title')}</SectionTitle>
      <Wrapper
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <Description variants={!reducedMotion ? itemVariants : undefined}>
          {t('order.description')}
        </Description>

        <Card
          $isDark={isDark}
          variants={!reducedMotion ? itemVariants : undefined}
        >
          <AnimatePresence>
            {status === 'success' && (
              <StatusBanner
                $type="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginBottom: '1.5rem' }}
              >
                <MdCheckCircle />
                {t('order.form.success')}
              </StatusBanner>
            )}
            {status === 'error' && (
              <StatusBanner
                $type="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginBottom: '1.5rem' }}
              >
                <MdError />
                {t('order.form.error')}
              </StatusBanner>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="order-name">{t('order.form.name')}</Label>
              <Input
                $isDark={isDark}
                id="order-name"
                name="name"
                type="text"
                required
                placeholder={t('order.form.namePlaceholder')}
                value={form.name}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="order-email">{t('order.form.email')}</Label>
              <Input
                $isDark={isDark}
                id="order-email"
                name="email"
                type="email"
                required
                placeholder={t('order.form.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="order-type">{t('order.form.type')}</Label>
              <Select
                $isDark={isDark}
                id="order-type"
                name="type"
                required
                value={form.type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t('order.form.typePlaceholder')}
                </option>
                {(
                  t('order.form.typeOptions', { returnObjects: true }) as string[]
                ).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="order-budget">{t('order.form.budget')}</Label>
              <Select
                $isDark={isDark}
                id="order-budget"
                name="budget"
                required
                value={form.budget}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t('order.form.budgetPlaceholder')}
                </option>
                {(
                  t('order.form.budgetOptions', { returnObjects: true }) as string[]
                ).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="order-description">{t('order.form.description')}</Label>
              <Textarea
                $isDark={isDark}
                id="order-description"
                name="description"
                required
                placeholder={t('order.form.descriptionPlaceholder')}
                value={form.description}
                onChange={handleChange}
              />
            </Field>

            <SubmitRow>
              <Button
                type="submit"
                size="large"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? t('order.form.sending')
                  : <>
                      <MdSend style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      {t('order.form.submit')}
                    </>
                }
              </Button>
            </SubmitRow>
          </form>
        </Card>
      </Wrapper>
    </SectionContainer>
  );
};
