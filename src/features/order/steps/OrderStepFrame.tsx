import type { RefObject, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ProgressBarFill,
  ProgressBarTrack,
  StepIndicator,
  StepLabel,
} from '@/features/order/styles';

const TOTAL_STEPS = 5;

const slideVariants = {
  initial: (direction: number) => ({ opacity: 0, x: direction * 40, y: 8 }),
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -40,
    y: -8,
    transition: { duration: 0.25 },
  }),
};

interface OrderStepFrameProps {
  current: number;
  titleKey: string;
  direction: number;
  reducedMotion: boolean;
  headingRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

export const OrderStepFrame = ({
  current,
  titleKey,
  direction,
  reducedMotion,
  headingRef,
  children,
}: OrderStepFrameProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={reducedMotion ? undefined : slideVariants}
      custom={direction}
      initial={reducedMotion ? false : 'initial'}
      animate="animate"
      exit={reducedMotion ? undefined : 'exit'}
    >
      <StepIndicator ref={headingRef} tabIndex={-1}>
        <ProgressBarTrack>
          <ProgressBarFill $progress={Math.round((current / TOTAL_STEPS) * 100)} />
        </ProgressBarTrack>
        <StepLabel>
          {t('order.form.stepLabel', { current, total: TOTAL_STEPS })} — {t(titleKey)}
        </StepLabel>
      </StepIndicator>
      {children}
    </motion.div>
  );
};
