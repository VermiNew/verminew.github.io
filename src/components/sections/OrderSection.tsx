import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { useTheme } from '@/context/hooks/useTheme';
import { isDarkTheme } from '@/utils/themeUtils';
import { useTranslation } from 'react-i18next';
import { MdClose, MdDeleteOutline } from 'react-icons/md';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useAnimation } from '@/context/hooks/useAnimation';
import { socialConfig } from '@/config/social';
import { PrivacyPolicyModal } from '@/components/legal/PrivacyPolicyModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useToast } from '@/context/hooks/useToast';
import { asStringArray } from '@/utils/translationValues';
import { ORDER_OPTION_IDS, type OrderOptionField } from '@/features/order/options';
import { buildOrderArchive } from '@/features/order/archive';
import { createOrderId } from '@/features/order/payload';
import { clearOrderDraft, loadOrderDraft, saveOrderDraft } from '@/features/order/storage';
import {
  hasRequiredValues,
  isEmailValid,
  validateFiles,
  type FileValidationError,
} from '@/features/order/validation';
import { emptyOrderForm, type OrderFormData, type OrderStep } from '@/features/order/types';
import { OrderPreview } from '@/features/order/OrderPreview';
import { OrderSummary } from '@/features/order/OrderSummary';
import { OrderConfirmDialog } from '@/features/order/OrderConfirmDialog';
import { OrderBasicsStep } from '@/features/order/steps/OrderBasicsStep';
import { OrderContactStep } from '@/features/order/steps/OrderContactStep';
import { OrderProjectStep } from '@/features/order/steps/OrderProjectStep';
import { OrderDetailsStep } from '@/features/order/steps/OrderDetailsStep';
import { OrderExtrasStep } from '@/features/order/steps/OrderExtrasStep';
import {
  Wrapper,
  Description,
  ModalBackdrop,
  ModalContainer,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ClearButton,
  ValidationSummary,
} from '@/features/order/styles';

// ── Form configuration ────────────────────────────────────────────────────────
type Step = OrderStep;
type FormData = OrderFormData;
const emptyForm = emptyOrderForm;
// ───────────────────────────────────────────────────────────────────────────────



interface OrderPayload extends FormData {
  id: string;
  createdAt: string;
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  clientType: '',
  contactMethod: '',
  source: '',
  type: '',
  deadline: '',
  existingProject: '',
  budget: '',
  description: '',
  contentReady: '',
  hasDomain: '',
  references: '',
};

const loadSavedForm = (): FormData => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return { ...emptyForm, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return emptyForm;
};
// ───────────────────────────────────────────────────────────────────────────────

// ── Preview styled components ──────────────────────────────────────────────────
const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 2rem 0;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem 0;
  }
`;

const Description = styled(motion.p)`
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 640px;
  margin: 0 auto;
`;

const PreviewCard = styled(motion.button) <{ $isDark: boolean }>`
  appearance: none;
  width: 100%;
  padding: 1.75rem;
  font: inherit;
  color: inherit;
  text-align: inherit;
  border-radius: 20px;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.surface}80` : `${theme.colors.background}80`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  backdrop-filter: blur(5px);
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover > div[data-overlay] {
    opacity: 1;
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.12);
  }

  &:hover {
    border-color: ${({ theme }) => `${theme.colors.primary}50`};
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }

  transition: border-color 0.25s, box-shadow 0.25s;

  @media (max-width: 768px) {
    padding: 1.4rem;
  }
`;

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0.75;
  transition: opacity 0.25s, backdrop-filter 0.25s;
  border-radius: 20px;
`;

const PreviewCta = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const PreviewHint = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Skeleton field for the preview
const PreviewField = styled.div`
  margin-bottom: 0.85rem;
`;

const PreviewLabel = styled.div<{ $w?: string }>`
  height: 0.75rem;
  width: ${({ $w }) => $w ?? '35%'};
  border-radius: 4px;
  background: ${({ theme }) => `${theme.colors.primary}25`};
  margin-bottom: 0.5rem;
`;

const PreviewInput = styled.div`
  height: 2.35rem;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.colors.textSecondary}10`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}15`};
`;

const PreviewTextarea = styled(PreviewInput)`
  height: 4.5rem;
`;

const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Modal styled components ────────────────────────────────────────────────────
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalContainer = styled(motion.div) <{ $isDark: boolean }>`
  width: 100%;
  max-width: 740px;
  margin: auto;
  padding: 2.5rem;
  border-radius: 20px;
  background: ${({ theme, $isDark }) =>
    $isDark ? theme.colors.surface : theme.colors.background};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  flex-shrink: 0;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}30`};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-right: 2.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #ef4444;
    background: #ef444415;
  }
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Form styled components ─────────────────────────────────────────────────────
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label<{ $required?: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.3px;

  ${({ $required }) => $required && `
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

const FieldHint = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.75;
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

const FileInputWrapper = styled.div<{ $isDark: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1.5px ${({ $hasError, theme }) =>
    $hasError ? '#ef4444' : `${theme.colors.primary}30`} dashed;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}cc` : `${theme.colors.surface}cc`};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  input {
    display: none;
  }
`;

const FileCount = styled.span<{ $hasError: boolean }>`
  font-size: 0.9rem;
  color: ${({ $hasError, theme }) =>
    $hasError ? '#ef4444' : theme.colors.textSecondary};
`;

const DeadlineWarning = styled(motion.div)`
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #f59e0b;
  background: #f59e0b14;
  color: #f59e0b;
  font-size: 0.85rem;
  line-height: 1.5;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const FormNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
`;

const ProgressBarTrack = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $progress }) => $progress}%;
  transition: width 0.4s ease;
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const FieldError = styled(motion.span)`
  font-size: 0.78rem;
  color: #ef4444;
  margin-top: -0.15rem;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  border-radius: 5px;
  border: 2px solid ${({ theme }) => `${theme.colors.primary}40`};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 0.1rem;
  cursor: pointer;

  &:checked {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &::after {
    content: '';
    width: 0.4rem;
    height: 0.65rem;
    border: solid transparent;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg) translateY(-1px);
  }

  &:checked::after {
    border-color: ${({ theme }) => theme.colors.background};
  }
`;

const CheckboxText = styled(FieldHint)`
  opacity: 1;

  label {
    cursor: pointer;
  }
`;
// ───────────────────────────────────────────────────────────────────────────────

const InlineLinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

// ── Confirm dialog styled components ───────────────────────────────────────────
const ConfirmBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ConfirmBox = styled(motion.div)<{ $isDark: boolean }>`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 16px;
  background: ${({ theme, $isDark }) =>
    $isDark ? theme.colors.surface : theme.colors.background};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  text-align: center;
`;

const ConfirmIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #ef444418;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ConfirmMessage = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem;
  white-space: pre-line;
`;

const ConfirmHint = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.info};
  margin: 0 0 1.5rem;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Summary styled components ──────────────────────────────────────────────────
const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const SummarySubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 2rem 0;
`;

const IdBox = styled.button<{ $isDark: boolean; $copied: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid ${({ theme, $copied }) =>
    $copied ? theme.colors.primary : `${theme.colors.primary}40`};
  background: ${({ theme }) => `${theme.colors.primary}10`};
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s;
  margin-bottom: 2rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const IdLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  text-align: left;
`;

const IdValue = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-all;
  text-align: left;
`;

const IdCopyHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  margin-left: 0.5rem;
  flex-shrink: 0;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const DownloadRow = styled.div`
  margin-bottom: 1.5rem;
`;

const ManualSection = styled(motion.div) <{ $isDark: boolean }>`
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}99` : `${theme.colors.surface}99`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const ManualTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
`;

const ManualRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ManualRowLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ManualRowValue = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Courier New', monospace;
  word-break: break-all;
`;

const BackRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Stable IDs for aria relationships ─────────────────────────────────────────
const MODAL_TITLE_ID = 'order-modal-title';

// ── Required field lists per step ─────────────────────────────────────────────
const REQUIRED_BASICS: (keyof FormData)[] = ['name', 'email'];
const REQUIRED_CONTACT: (keyof FormData)[] = ['clientType', 'contactMethod'];
const REQUIRED_PROJECT: (keyof FormData)[] = ['type', 'existingProject', 'budget'];
const REQUIRED_DETAILS: (keyof FormData)[] = ['deadline', 'description', 'contentReady'];
const REQUIRED_EXTRAS: (keyof FormData)[] = ['hasDomain'];
// ───────────────────────────────────────────────────────────────────────────────

// ── Animation variants ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.2 } },
};

const slideVariants = {
  initial: (direction: number) => ({ opacity: 0, x: direction * 40, y: 8 }),
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40, y: -8, transition: { duration: 0.25 } }),
};

// ───────────────────────────────────────────────────────────────────────────────

export const OrderSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const { reducedMotion } = useAnimation();
  const { showToast } = useToast();
  const language = i18n.language.split('-')[0] === 'pl' ? 'pl' : 'en';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const confirmBoxRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLDivElement>(null);
  const summaryHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoredDraftNotified = useRef(false);

  // ── Modal and form state ─────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<Step>('basics');
  const [slideDir, setSlideDir] = useState(1);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormData>(loadOrderDraft);
  const [rodoConsent, setRodoConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<FileValidationError | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  // ── Summary state ────────────────────────────────────────────────────────────
  const [orderId, setOrderId] = useState('');
  const [orderCreatedAt, setOrderCreatedAt] = useState('');
  const [archiveFilename, setArchiveFilename] = useState('');
  const [isGeneratingArchive, setIsGeneratingArchive] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);
  const [hasDownloadedArchive, setHasDownloadedArchive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // ── Dialog state ─────────────────────────────────────────────────────────────
  const [confirmAction, setConfirmAction] = useState<'close' | 'clear' | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useBodyScrollLock(modalOpen || privacyOpen);

  useEffect(() => {
    saveOrderDraft(form);
  }, [form]);

  useEffect(() => {
    if (!modalOpen) return;
    requestAnimationFrame(() => {
      if (step === 'summary') summaryHeadingRef.current?.focus();
      else stepHeadingRef.current?.focus();
    });
  }, [modalOpen, step]);

  const isFormDirty = useMemo(
    () => (Object.values(form) as string[]).some((value) => value.trim() !== '') || files.length > 0 || rodoConsent,
    [files.length, form, rodoConsent],
  );

  const hasRestoredDraft = useRef(
    (Object.values(form) as string[]).some((value) => value.trim() !== ''),
  ).current;

  const confirmClose = useCallback(() => {
    if (isFormDirty && step !== 'summary') {
      setConfirmAction('close');
      return;
    }
    setModalOpen(false);
  }, [isFormDirty, step]);

  const handleConfirmNo = useCallback(() => setConfirmAction(null), []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !modalOpen || privacyOpen) return;
      if (confirmAction) handleConfirmNo();
      else confirmClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [confirmAction, confirmClose, handleConfirmNo, modalOpen, privacyOpen]);

  const openModal = useCallback(() => {
    setModalOpen(true);
    if (hasRestoredDraft && !restoredDraftNotified.current) {
      restoredDraftNotified.current = true;
      showToast(t('order.form.draftRestored'), 'info');
    }
  }, [hasRestoredDraft, showToast, t]);

  const handleClearRequest = useCallback(() => setConfirmAction('clear'), []);

  const handleClearForm = useCallback(() => {
    setForm({ ...emptyForm });
    setRodoConsent(false);
    setFiles([]);
    setFileError(null);
    setValidationMessage('');
    setTouched(new Set());
    setStep('basics');
    setOrderId('');
    setOrderCreatedAt('');
    setArchiveFilename('');
    setArchiveProgress(0);
    setHasDownloadedArchive(false);
    clearOrderDraft();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleConfirmYes = useCallback(() => {
    if (confirmAction === 'close') setModalOpen(false);
    if (confirmAction === 'clear') handleClearForm();
    setConfirmAction(null);
  }, [confirmAction, handleClearForm]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setForm((previous) => ({ ...previous, [name]: value }));
      setTouched((previous) => new Set(previous).add(name));
      setValidationMessage('');
      setHasDownloadedArchive(false);
    },
    [],
  );

  const isFieldMissing = useCallback(
    (field: keyof FormData) => touched.has(field) && form[field].trim() === '',
    [form, touched],
  );

  const isEmailError = touched.has('email')
    && form.email.trim() !== ''
    && !isEmailValid(form.email);
  const isNameMissing = isFieldMissing('name');
  const isEmailMissing = isFieldMissing('email');
  const isClientTypeMissing = isFieldMissing('clientType');
  const isContactMethodMissing = isFieldMissing('contactMethod');
  const isProjectTypeMissing = isFieldMissing('type');
  const isExistingProjectMissing = isFieldMissing('existingProject');
  const isBudgetMissing = isFieldMissing('budget');
  const isDeadlineMissing = isFieldMissing('deadline');
  const isDescriptionMissing = isFieldMissing('description');
  const isContentReadyMissing = isFieldMissing('contentReady');

  const isBasicsValid = hasRequiredValues(form, REQUIRED_BASICS) && isEmailValid(form.email);
  const isContactValid = hasRequiredValues(form, REQUIRED_CONTACT);
  const isProjectValid = hasRequiredValues(form, REQUIRED_PROJECT);
  const isDetailsValid = hasRequiredValues(form, REQUIRED_DETAILS);
  const isExtrasValid = hasRequiredValues(form, REQUIRED_EXTRAS) && rodoConsent;

  const markTouched = useCallback((fields: readonly string[]) => {
    setTouched((previous) => {
      const next = new Set(previous);
      fields.forEach((field) => next.add(field));
      return next;
    });
  }, []);

  const focusFirstInvalid = useCallback((fields: readonly string[], includeConsent = false) => {
    requestAnimationFrame(() => {
      for (const field of fields) {
        const element = document.querySelector<HTMLElement>(`[name="${field}"]`);
        if (element && 'value' in element && String((element as HTMLInputElement).value).trim() === '') {
          element.focus();
          return;
        }
        if (field === 'email' && !isEmailValid(form.email)) {
          element?.focus();
          return;
        }
      }
      if (includeConsent && !rodoConsent) {
        document.getElementById('order-rodo-consent')?.focus();
      }
    });
  }, [form.email, rodoConsent]);

  const goNext = useCallback((nextStep: Step) => {
    setSlideDir(1);
    setStep(nextStep);
    setValidationMessage('');
  }, []);

  const goBack = useCallback((previousStep: Step) => {
    setSlideDir(-1);
    setStep(previousStep);
    setValidationMessage('');
  }, []);

  const validateAndAdvance = useCallback((
    fields: readonly (keyof FormData)[],
    valid: boolean,
    nextStep: Step,
  ) => {
    markTouched(fields);
    if (!valid) {
      setValidationMessage(t('order.form.fixErrors'));
      focusFirstInvalid(fields);
      return;
    }
    goNext(nextStep);
  }, [focusFirstInvalid, goNext, markTouched, t]);

  const handleNextToContact = useCallback(
    () => validateAndAdvance(REQUIRED_BASICS, isBasicsValid, 'contact'),
    [isBasicsValid, validateAndAdvance],
  );
  const handleNextToProject = useCallback(
    () => validateAndAdvance(REQUIRED_CONTACT, isContactValid, 'project'),
    [isContactValid, validateAndAdvance],
  );
  const handleNextToDetails = useCallback(
    () => validateAndAdvance(REQUIRED_PROJECT, isProjectValid, 'details'),
    [isProjectValid, validateAndAdvance],
  );
  const handleNextToExtras = useCallback(
    () => validateAndAdvance(REQUIRED_DETAILS, isDetailsValid, 'extras'),
    [isDetailsValid, validateAndAdvance],
  );

  const handleConsentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRodoConsent(event.target.checked);
    setTouched((previous) => new Set(previous).add('rodoConsent'));
    setValidationMessage('');
    setHasDownloadedArchive(false);
  }, []);

  const handleFiles = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const result = validateFiles([...files, ...selectedFiles]);
    setFileError(result.error);
    setValidationMessage('');
    setHasDownloadedArchive(false);
    if (!result.error) setFiles(result.files);
    event.target.value = '';
  }, [files]);

  const handleGenerate = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    markTouched([...REQUIRED_EXTRAS, 'rodoConsent']);
    if (!isExtrasValid) {
      setValidationMessage(t('order.form.fixErrors'));
      focusFirstInvalid(REQUIRED_EXTRAS, true);
      return;
    }

    setOrderId((current) => current || createOrderId());
    setOrderCreatedAt((current) => current || new Date().toISOString());
    setHasDownloadedArchive(false);
    goNext('summary');
  }, [focusFirstInvalid, goNext, isExtrasValid, markTouched, t]);

  const handleBack = useCallback(() => {
    goBack('extras');
    setCopied(false);
    setManualOpen(false);
  }, [goBack]);

  const copyText = useCallback(async (value: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copiedSuccessfully = document.execCommand('copy');
    textarea.remove();
    if (!copiedSuccessfully) throw new Error('Clipboard is unavailable');
  }, []);

  const handleCopyId = useCallback(async () => {
    try {
      await copyText(orderId);
      setCopied(true);
      showToast(t('order.summary.copySuccess'), 'success');
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      showToast(t('order.summary.copyError'), 'error');
    }
  }, [copyText, orderId, showToast, t]);

  const handleDownloadZip = useCallback(async () => {
    if (!orderId || !orderCreatedAt || isGeneratingArchive) return;
    setIsGeneratingArchive(true);
    setArchiveProgress(0);

    try {
      const { blob, filename } = await buildOrderArchive({
        id: orderId,
        createdAt: orderCreatedAt,
        language,
        form,
        files,
        onProgress: setArchiveProgress,
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      setArchiveProgress(100);
      setArchiveFilename(filename);
      setHasDownloadedArchive(true);
      showToast(t('order.summary.downloadSuccess'), 'success');
    } catch {
      showToast(t('order.summary.downloadError'), 'error');
    } finally {
      setIsGeneratingArchive(false);
    }
  }, [files, form, isGeneratingArchive, language, orderCreatedAt, orderId, showToast, t]);

  const handleOpenMailClient = useCallback(() => {
    const filename = archiveFilename || `verminew-order-${orderId}.zip`;
    if (!hasDownloadedArchive) {
      showToast(t('order.summary.downloadFirst'), 'info');
      return;
    }
    const subject = encodeURIComponent(t('order.summary.mailSubject', { id: orderId }));
    const body = encodeURIComponent(
      t('order.summary.mailBody', {
        id: orderId,
        date: new Date(orderCreatedAt).toLocaleString(language),
        filename,
      }),
    );
    window.location.href = `mailto:${socialConfig.email.address}?subject=${subject}&body=${body}`;
  }, [archiveFilename, hasDownloadedArchive, language, orderCreatedAt, orderId, showToast, t]);

  const renderOptions = useCallback((field: OrderOptionField, translationKey: string) => {
    const labels = asStringArray(t(translationKey, { returnObjects: true }) as unknown);
    return ORDER_OPTION_IDS[field].map((value, index) => (
      <option key={value} value={value}>{labels[index] ?? value}</option>
    ));
  }, [t]);

  // ── Render ───────────────────────────────────────────────────────────────────
  const isStrictDeadline = form.deadline !== '' && form.deadline !== 'flexible';
  const fileErrorMessage = fileError
    ? t(`order.form.attachmentErrors.${fileError}`)
    : '';

  return (
    <Section id="order">
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

        <OrderPreview
          ref={previewButtonRef}
          isDark={isDark}
          reducedMotion={reducedMotion}
          itemVariants={itemVariants}
          onOpen={openModal}
        />
      </Wrapper>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <ModalBackdrop
            key="backdrop"
            variants={!reducedMotion ? backdropVariants : undefined}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={confirmClose}
          >
            <FocusTrap
              paused={Boolean(confirmAction || privacyOpen)}
              focusTrapOptions={{
                allowOutsideClick: true,
                returnFocusOnDeactivate: true,
                setReturnFocus: () => previewButtonRef.current ?? false,
              }}
            >
              <ModalContainer
                $isDark={isDark}
                variants={!reducedMotion ? modalVariants : undefined}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={MODAL_TITLE_ID}
              >
                <ModalCloseButton
                  onClick={confirmClose}
                  aria-label={t('order.modal.close')}
                  type="button"
                >
                  <MdClose aria-hidden="true" />
                </ModalCloseButton>

                <ModalHeader>
                  <ModalTitle id={MODAL_TITLE_ID}>{t('order.title')}</ModalTitle>
                {step !== 'summary' && isFormDirty && (
                  <ClearButton type="button" onClick={handleClearRequest}>
                    <MdDeleteOutline size={16} />
                    {t('order.form.clear')}
                  </ClearButton>
                )}
              </ModalHeader>

              {validationMessage && (
                <ValidationSummary role="alert">{validationMessage}</ValidationSummary>
              )}

              <AnimatePresence mode="wait" custom={slideDir}>
                {step === 'basics' && (
                  <OrderBasicsStep
                    key="basics"
                    form={form}
                    isDark={isDark}
                    reducedMotion={reducedMotion}
                    direction={slideDir}
                    headingRef={stepHeadingRef}
                    onChange={handleChange}
                    nameMissing={isNameMissing}
                    emailMissing={isEmailMissing}
                    emailInvalid={isEmailError}
                    onNext={handleNextToContact}
                  />
                )}

                {step === 'contact' && (
                  <OrderContactStep
                    key="contact"
                    form={form}
                    isDark={isDark}
                    reducedMotion={reducedMotion}
                    direction={slideDir}
                    headingRef={stepHeadingRef}
                    onChange={handleChange}
                    clientTypeMissing={isClientTypeMissing}
                    contactMethodMissing={isContactMethodMissing}
                    renderOptions={renderOptions}
                    onBack={() => goBack('basics')}
                    onNext={handleNextToProject}
                  />
                )}

                {step === 'project' && (
                  <OrderProjectStep
                    key="project"
                    form={form}
                    isDark={isDark}
                    reducedMotion={reducedMotion}
                    direction={slideDir}
                    headingRef={stepHeadingRef}
                    onChange={handleChange}
                    typeMissing={isProjectTypeMissing}
                    existingProjectMissing={isExistingProjectMissing}
                    budgetMissing={isBudgetMissing}
                    renderOptions={renderOptions}
                    onBack={() => goBack('contact')}
                    onNext={handleNextToDetails}
                  />
                )}

                {step === 'details' && (
                  <OrderDetailsStep
                    key="details"
                    form={form}
                    isDark={isDark}
                    reducedMotion={reducedMotion}
                    direction={slideDir}
                    headingRef={stepHeadingRef}
                    onChange={handleChange}
                    deadlineMissing={isDeadlineMissing}
                    descriptionMissing={isDescriptionMissing}
                    contentReadyMissing={isContentReadyMissing}
                    strictDeadline={isStrictDeadline}
                    renderOptions={renderOptions}
                    onBack={() => goBack('project')}
                    onNext={handleNextToExtras}
                  />
                )}

                {step === 'extras' && (
                  <OrderExtrasStep
                    key="extras"
                    form={form}
                    isDark={isDark}
                    reducedMotion={reducedMotion}
                    direction={slideDir}
                    headingRef={stepHeadingRef}
                    onChange={handleChange}
                    domainMissing={isFieldMissing('hasDomain')}
                    fileInputRef={fileInputRef}
                    fileCount={files.length}
                    fileError={fileError}
                    fileErrorMessage={fileErrorMessage}
                    consent={rodoConsent}
                    consentTouched={touched.has('rodoConsent')}
                    renderOptions={renderOptions}
                    onFilesChange={handleFiles}
                    onConsentChange={handleConsentChange}
                    onOpenPrivacy={() => setPrivacyOpen(true)}
                    onBack={() => goBack('details')}
                    onSubmit={handleGenerate}
                  />
                )}

                {step === 'summary' && (
                  <motion.div
                    key="summary"
                    variants={!reducedMotion ? slideVariants : undefined}
                    custom={slideDir}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <OrderSummary
                      isDark={isDark}
                      reducedMotion={reducedMotion}
                      copied={copied}
                      orderId={orderId}
                      archiveFilename={archiveFilename}
                      archiveProgress={archiveProgress}
                      hasDownloadedArchive={hasDownloadedArchive}
                      isGeneratingArchive={isGeneratingArchive}
                      manualOpen={manualOpen}
                      headingRef={summaryHeadingRef}
                      onCopyId={handleCopyId}
                      onDownloadZip={handleDownloadZip}
                      onOpenMailClient={handleOpenMailClient}
                      onToggleManual={() => setManualOpen((value) => !value)}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              </ModalContainer>
            </FocusTrap>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      <OrderConfirmDialog
        action={confirmAction}
        isDark={isDark}
        reducedMotion={reducedMotion}
        boxRef={confirmBoxRef}
        onCancel={handleConfirmNo}
        onConfirm={handleConfirmYes}
      />

      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </Section>
  );
};
