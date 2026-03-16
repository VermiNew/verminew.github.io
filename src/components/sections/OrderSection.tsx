import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { isDarkTheme } from '@/utils/themeUtils';
import { useTranslation } from 'react-i18next';
import {
  MdDownload,
  MdEmail,
  MdContentCopy,
  MdCheck,
  MdArrowBack,
  MdAttachFile,
  MdChevronRight,
  MdClose,
  MdEdit,
  MdWarningAmber,
} from 'react-icons/md';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { useAnimation } from '@/context/AnimationContext';
import { socialConfig } from '@/config/social';
import JSZip from 'jszip';

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_TOTAL_SIZE_BYTES = 20 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/*,.pdf,.zip,.txt,.doc,.docx';
// ───────────────────────────────────────────────────────────────────────────────

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = 'basics' | 'project' | 'details' | 'summary';

interface FormData {
  name: string;
  email: string;
  phone: string;
  clientType: string;
  contactMethod: string;
  source: string;
  type: string;
  deadline: string;
  existingProject: string;
  budget: string;
  description: string;
  contentReady: string;
  hasDomain: string;
  references: string;
}

interface OrderPayload extends FormData {
  id: string;
  createdAt: string;
}
// ───────────────────────────────────────────────────────────────────────────────

// ── Preview styled components ──────────────────────────────────────────────────
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

const PreviewCard = styled(motion.div) <{ $isDark: boolean }>`
  width: 100%;
  padding: 2.5rem;
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

  transition: border-color 0.25s, box-shadow 0.25s;
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
  margin-bottom: 1.25rem;
`;

const PreviewLabel = styled.div<{ $w?: string }>`
  height: 0.75rem;
  width: ${({ $w }) => $w ?? '35%'};
  border-radius: 4px;
  background: ${({ theme }) => `${theme.colors.primary}25`};
  margin-bottom: 0.5rem;
`;

const PreviewInput = styled.div`
  height: 2.75rem;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.colors.textSecondary}10`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}15`};
`;

const PreviewTextarea = styled(PreviewInput)`
  height: 7rem;
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

const ModalTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 2rem 0;
  padding-right: 2.5rem;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Form styled components ─────────────────────────────────────────────────────
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

const StepDot = styled.div<{ $active: boolean }>`
  width: 2rem;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : `${theme.colors.primary}30`};
  transition: background 0.25s;
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: auto;
`;

const FieldError = styled(motion.span)`
  font-size: 0.78rem;
  color: #ef4444;
  margin-top: -0.15rem;
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
  initial: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.25 } }),
};
// ───────────────────────────────────────────────────────────────────────────────

export const OrderSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const { reducedMotion } = useAnimation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('basics');
  const [slideDir, setSlideDir] = useState(1);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormData>({
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
  });
  const [rodoConsent, setRodoConsent] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileSizeError, setFileSizeError] = useState(false);

  // ── Summary state ────────────────────────────────────────────────────────────
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  // ── Lock body scroll when modal is open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  // ── Close on Escape ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => new Set(prev).add(name));
    },
    []
  );

  // ── Validation ──────────────────────────────────────────────────────────────
  const requiredBasics: (keyof FormData)[] = ['name', 'email', 'clientType', 'contactMethod'];
  const requiredProject: (keyof FormData)[] = ['type', 'deadline', 'budget', 'existingProject'];
  const requiredDetails: (keyof FormData)[] = ['description', 'contentReady', 'hasDomain'];

  const isFieldMissing = useCallback(
    (field: keyof FormData) => touched.has(field) && form[field].trim() === '',
    [form, touched]
  );

  const isBasicsValid = useMemo(
    () => requiredBasics.every((f) => form[f].trim() !== ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.name, form.email, form.clientType, form.contactMethod]
  );

  const isProjectValid = useMemo(
    () => requiredProject.every((f) => form[f].trim() !== ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.type, form.deadline, form.budget, form.existingProject]
  );

  const isDetailsValid = useMemo(
    () => requiredDetails.every((f) => form[f].trim() !== '') && !fileSizeError && rodoConsent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.description, form.contentReady, form.hasDomain, fileSizeError, rodoConsent]
  );

  const markTouched = useCallback((fields: (keyof FormData)[]) => {
    setTouched((prev) => {
      const next = new Set(prev);
      fields.forEach((f) => next.add(f));
      return next;
    });
  }, []);

  const handleNextToProject = useCallback(() => {
    markTouched(requiredBasics);
    if (!isBasicsValid) return;
    setSlideDir(1);
    setStep('project');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBasicsValid, markTouched]);

  const handleNextToDetails = useCallback(() => {
    markTouched(requiredProject);
    if (!isProjectValid) return;
    setSlideDir(1);
    setStep('details');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProjectValid, markTouched]);

  const handleBackToBasics = useCallback(() => {
    setSlideDir(-1);
    setStep('basics');
  }, []);

  const handleBackToProject = useCallback(() => {
    setSlideDir(-1);
    setStep('project');
  }, []);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const total = selected.reduce((acc, f) => acc + f.size, 0);
    if (total > MAX_TOTAL_SIZE_BYTES) {
      setFileSizeError(true);
      setFiles([]);
    } else {
      setFileSizeError(false);
      setFiles(selected);
    }
  }, []);

  const handleGenerate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      markTouched(requiredDetails);
      if (!isDetailsValid) return;
      const id = crypto.randomUUID();
      setOrderId(id);
      setSlideDir(1);
      setStep('summary');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDetailsValid, markTouched]
  );

  const handleBack = useCallback(() => {
    setSlideDir(-1);
    setStep('details');
    setCopied(false);
    setManualOpen(false);
  }, []);

  const handleCopyId = useCallback(async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [orderId]);

  const handleDownloadZip = useCallback(async () => {
    const zip = new JSZip();
    const payload: OrderPayload = {
      id: orderId,
      createdAt: new Date().toISOString(),
      ...form,
    };
    zip.file(`zamowienie-${orderId}.json`, JSON.stringify(payload, null, 2));
    files.forEach((file) => { zip.file(file.name, file); });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'files_for_order.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [orderId, form, files]);

  const handleOpenMailClient = useCallback(() => {
    const subject = encodeURIComponent(t('order.summary.mailSubject', { id: orderId }));
    const body = encodeURIComponent(
      t('order.summary.mailBody', { id: orderId, date: new Date().toLocaleString() })
    );
    window.location.href = `mailto:${socialConfig.email.address}?subject=${subject}&body=${body}`;
  }, [orderId, t]);

  // ── Render ───────────────────────────────────────────────────────────────────
  const deadlineOptions = t('order.form.deadlineOptions', { returnObjects: true }) as string[];
  const isStrictDeadline = form.deadline !== '' && form.deadline !== deadlineOptions[deadlineOptions.length - 1];

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

        {/* ── Preview card (always visible, triggers modal) ── */}
        <PreviewCard
          $isDark={isDark}
          variants={!reducedMotion ? itemVariants : undefined}
          onClick={openModal}
          role="button"
          tabIndex={0}
          aria-label={t('order.preview.cta')}
          onKeyDown={(e) => e.key === 'Enter' && openModal()}
        >
          {/* Skeleton fields */}
          <PreviewField>
            <PreviewLabel $w="30%" />
            <PreviewInput />
          </PreviewField>
          <PreviewRow>
            <PreviewField>
              <PreviewLabel $w="40%" />
              <PreviewInput />
            </PreviewField>
            <PreviewField>
              <PreviewLabel $w="35%" />
              <PreviewInput />
            </PreviewField>
          </PreviewRow>
          <PreviewField>
            <PreviewLabel $w="45%" />
            <PreviewInput />
          </PreviewField>
          <PreviewField>
            <PreviewLabel $w="50%" />
            <PreviewTextarea />
          </PreviewField>

          {/* CTA overlay */}
          <PreviewOverlay data-overlay>
            <MdEdit size={32} color="currentColor" style={{ opacity: 0.7 }} />
            <PreviewCta>{t('order.preview.cta')}</PreviewCta>
            <PreviewHint>{t('order.preview.hint')}</PreviewHint>
          </PreviewOverlay>
        </PreviewCard>
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
            onClick={closeModal}
          >
            <ModalContainer
              $isDark={isDark}
              variants={!reducedMotion ? modalVariants : undefined}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalCloseButton
                onClick={closeModal}
                aria-label={t('order.modal.close')}
                type="button"
              >
                <MdClose />
              </ModalCloseButton>

              <ModalTitle>{t('order.title')}</ModalTitle>

              <AnimatePresence mode="wait" custom={slideDir}>
                {/* ── Step 1: Basic info ── */}
                {step === 'basics' && (
                  <motion.div
                    key="basics"
                    variants={!reducedMotion ? slideVariants : undefined}
                    custom={slideDir}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <StepIndicator>
                      <StepDot $active />
                      <StepDot $active={false} />
                      <StepDot $active={false} />
                      <StepLabel>{t('order.form.stepLabel', { current: 1, total: 3 })} — {t('order.form.stepBasic')}</StepLabel>
                    </StepIndicator>

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
                      {isFieldMissing('name') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
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
                      {isFieldMissing('email') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="order-phone">{t('order.form.phone')}</Label>
                      <Input
                        $isDark={isDark}
                        id="order-phone"
                        name="phone"
                        type="tel"
                        placeholder={t('order.form.phonePlaceholder')}
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="order-clientType">{t('order.form.clientType')}</Label>
                      <Select
                        $isDark={isDark}
                        id="order-clientType"
                        name="clientType"
                        required
                        value={form.clientType}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          {t('order.form.clientTypePlaceholder')}
                        </option>
                        {(t('order.form.clientTypeOptions', { returnObjects: true }) as string[]).map(
                          (opt) => <option key={opt} value={opt}>{opt}</option>
                        )}
                      </Select>
                      {isFieldMissing('clientType') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="order-contactMethod">{t('order.form.contactMethod')}</Label>
                      <Select
                        $isDark={isDark}
                        id="order-contactMethod"
                        name="contactMethod"
                        required
                        value={form.contactMethod}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          {t('order.form.contactMethodPlaceholder')}
                        </option>
                        {(t('order.form.contactMethodOptions', { returnObjects: true }) as string[]).map(
                          (opt) => <option key={opt} value={opt}>{opt}</option>
                        )}
                      </Select>
                      {isFieldMissing('contactMethod') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="order-source">{t('order.form.source')}</Label>
                      <Select
                        $isDark={isDark}
                        id="order-source"
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          {t('order.form.sourcePlaceholder')}
                        </option>
                        {(t('order.form.sourceOptions', { returnObjects: true }) as string[]).map(
                          (opt) => <option key={opt} value={opt}>{opt}</option>
                        )}
                      </Select>
                    </Field>

                    <FormNav>
                      <div />
                      <Button type="button" size="large" onClick={handleNextToProject}>
                        {t('order.form.next')}
                        <MdChevronRight style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
                      </Button>
                    </FormNav>
                  </motion.div>
                )}

                {/* ── Step 2: About the project ── */}
                {step === 'project' && (
                  <motion.div
                    key="project"
                    variants={!reducedMotion ? slideVariants : undefined}
                    custom={slideDir}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <StepIndicator>
                      <StepDot $active />
                      <StepDot $active />
                      <StepDot $active={false} />
                      <StepLabel>{t('order.form.stepLabel', { current: 2, total: 3 })} — {t('order.form.stepProject')}</StepLabel>
                    </StepIndicator>

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
                        {(t('order.form.typeOptions', { returnObjects: true }) as string[]).map(
                          (opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          )
                        )}
                      </Select>
                      {isFieldMissing('type') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="order-existingProject">{t('order.form.existingProject')}</Label>
                      <Select
                        $isDark={isDark}
                        id="order-existingProject"
                        name="existingProject"
                        required
                        value={form.existingProject}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          {t('order.form.existingProjectPlaceholder')}
                        </option>
                        {(t('order.form.existingProjectOptions', { returnObjects: true }) as string[]).map(
                          (opt) => <option key={opt} value={opt}>{opt}</option>
                        )}
                      </Select>
                      {isFieldMissing('existingProject') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="order-deadline">{t('order.form.deadline')}</Label>
                      <Select
                        $isDark={isDark}
                        id="order-deadline"
                        name="deadline"
                        required
                        value={form.deadline}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          {t('order.form.deadlinePlaceholder')}
                        </option>
                        {deadlineOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                      {isFieldMissing('deadline') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                      <AnimatePresence>
                        {isStrictDeadline && (
                          <DeadlineWarning
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <MdWarningAmber size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{t('order.form.deadlineWarning')}</span>
                          </DeadlineWarning>
                        )}
                      </AnimatePresence>
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
                      {isFieldMissing('budget') && (
                        <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {t('order.form.requiredField')}
                        </FieldError>
                      )}
                    </Field>

                    <FormNav>
                      <Button type="button" size="medium" variant="outline" onClick={handleBackToBasics}>
                        <MdArrowBack style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        {t('order.form.back')}
                      </Button>
                      <Button type="button" size="large" onClick={handleNextToDetails}>
                        {t('order.form.next')}
                        <MdChevronRight style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
                      </Button>
                    </FormNav>
                  </motion.div>
                )}

                {/* ── Step 3: Details ── */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    variants={!reducedMotion ? slideVariants : undefined}
                    custom={slideDir}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <StepIndicator>
                      <StepDot $active />
                      <StepDot $active />
                      <StepDot $active />
                      <StepLabel>{t('order.form.stepLabel', { current: 3, total: 3 })} — {t('order.form.stepDetails')}</StepLabel>
                    </StepIndicator>

                    <form onSubmit={handleGenerate} noValidate>
                      <Field>
                        <Label htmlFor="order-description">
                          {t('order.form.description')}
                        </Label>
                        <Textarea
                          $isDark={isDark}
                          id="order-description"
                          name="description"
                          required
                          placeholder={t('order.form.descriptionPlaceholder')}
                          value={form.description}
                          onChange={handleChange}
                        />
                        {isFieldMissing('description') && (
                          <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {t('order.form.requiredField')}
                          </FieldError>
                        )}
                      </Field>

                      <Field>
                        <Label htmlFor="order-contentReady">{t('order.form.contentReady')}</Label>
                        <Select
                          $isDark={isDark}
                          id="order-contentReady"
                          name="contentReady"
                          required
                          value={form.contentReady}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            {t('order.form.contentReadyPlaceholder')}
                          </option>
                          {(t('order.form.contentReadyOptions', { returnObjects: true }) as string[]).map(
                            (opt) => <option key={opt} value={opt}>{opt}</option>
                          )}
                        </Select>
                        {isFieldMissing('contentReady') && (
                          <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {t('order.form.requiredField')}
                          </FieldError>
                        )}
                      </Field>

                      <Field>
                        <Label htmlFor="order-hasDomain">{t('order.form.hasDomain')}</Label>
                        <Select
                          $isDark={isDark}
                          id="order-hasDomain"
                          name="hasDomain"
                          required
                          value={form.hasDomain}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            {t('order.form.hasDomainPlaceholder')}
                          </option>
                          {(t('order.form.hasDomainOptions', { returnObjects: true }) as string[]).map(
                            (opt) => <option key={opt} value={opt}>{opt}</option>
                          )}
                        </Select>
                        {isFieldMissing('hasDomain') && (
                          <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {t('order.form.requiredField')}
                          </FieldError>
                        )}
                      </Field>

                      <Field>
                        <Label htmlFor="order-references">{t('order.form.references')}</Label>
                        <Textarea
                          $isDark={isDark}
                          id="order-references"
                          name="references"
                          placeholder={t('order.form.referencesPlaceholder')}
                          value={form.references}
                          onChange={handleChange}
                          style={{ minHeight: '80px' }}
                        />
                      </Field>

                      <Field>
                        <Label>{t('order.form.attachments')}</Label>
                        <FieldHint>{t('order.form.attachmentsHint')}</FieldHint>
                        <FileInputWrapper
                          $isDark={isDark}
                          $hasError={fileSizeError}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <MdAttachFile size={20} style={{ flexShrink: 0, opacity: 0.6 }} />
                          <FileCount $hasError={fileSizeError}>
                            {fileSizeError
                              ? t('order.form.attachmentsTooBig')
                              : files.length === 0
                                ? t('order.form.attachmentsCount_zero')
                                : files.length === 1
                                  ? t('order.form.attachmentsCount_one')
                                  : t('order.form.attachmentsCount_few', { count: files.length })}
                          </FileCount>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={ACCEPTED_TYPES}
                            onChange={handleFiles}
                          />
                        </FileInputWrapper>
                      </Field>

                      <Field>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={rodoConsent}
                            onChange={(e) => setRodoConsent(e.target.checked)}
                            style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary, #6366f1)' }}
                          />
                          <FieldHint style={{ opacity: 1 }}>{t('order.form.rodoConsent')}</FieldHint>
                        </label>
                        {!rodoConsent && touched.has('description') && (
                          <FieldError initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {t('order.form.rodoRequired')}
                          </FieldError>
                        )}
                      </Field>

                      <FormNav>
                        <Button type="button" size="medium" variant="outline" onClick={handleBackToProject}>
                          <MdArrowBack style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                          {t('order.form.back')}
                        </Button>
                        <Button type="submit" size="large" disabled={fileSizeError}>
                          {t('order.form.generate')}
                          <MdChevronRight
                            style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }}
                          />
                        </Button>
                      </FormNav>
                    </form>
                  </motion.div>
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
                    <SummaryTitle>{t('order.summary.title')}</SummaryTitle>
                    <SummarySubtitle>{t('order.summary.subtitle')}</SummarySubtitle>

                    <IdBox $isDark={isDark} $copied={copied} onClick={handleCopyId} type="button">
                      <div>
                        <IdLabel>{t('order.summary.idLabel')}</IdLabel>
                        <IdValue>{orderId}</IdValue>
                      </div>
                      <IdCopyHint>
                        {copied ? <MdCheck color="currentColor" /> : <MdContentCopy color="currentColor" />}
                      </IdCopyHint>
                    </IdBox>

                    <DownloadRow>
                      <Button
                        size="large"
                        onClick={handleDownloadZip}
                        style={{ width: '100%' }}
                      >
                        <MdDownload style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        {t('order.summary.downloadZip')}
                      </Button>
                    </DownloadRow>

                    <ActionGrid>
                      <Button size="medium" onClick={handleOpenMailClient}>
                        <MdEmail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        {t('order.summary.sendEmail')}
                      </Button>
                      <Button
                        size="medium"
                        variant="outline"
                        onClick={() => setManualOpen((v) => !v)}
                      >
                        {t('order.summary.manual')}
                        <MdChevronRight
                          style={{
                            marginLeft: '0.25rem',
                            verticalAlign: 'middle',
                            transform: manualOpen ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </Button>
                    </ActionGrid>

                    <AnimatePresence>
                      {manualOpen && (
                        <ManualSection
                          $isDark={isDark}
                          key="manual"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ManualTitle>{t('order.summary.manualTitle')}</ManualTitle>
                          <ManualRow>
                            <ManualRowLabel>{t('order.summary.manualTo')}</ManualRowLabel>
                            <ManualRowValue>{socialConfig.email.address}</ManualRowValue>
                          </ManualRow>
                          <ManualRow>
                            <ManualRowLabel>{t('order.summary.manualSubject')}</ManualRowLabel>
                            <ManualRowValue>
                              {t('order.summary.mailSubject', { id: orderId })}
                            </ManualRowValue>
                          </ManualRow>
                          <ManualRow>
                            <ManualRowLabel>{t('order.summary.manualAttach')}</ManualRowLabel>
                            <ManualRowValue>files_for_order.zip</ManualRowValue>
                          </ManualRow>
                        </ManualSection>
                      )}
                    </AnimatePresence>

                    <BackRow>
                      <Button size="medium" variant="outline" onClick={handleBack}>
                        <MdArrowBack style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        {t('order.summary.back')}
                      </Button>
                    </BackRow>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalContainer>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
};
