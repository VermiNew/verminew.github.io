import styled from 'styled-components';
import { motion } from 'framer-motion';

// ── Preview styled components ──────────────────────────────────────────────────
export const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Description = styled(motion.p)`
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 640px;
  margin: 0 auto;
`;

export const PreviewCard = styled(motion.button)<{ $isDark: boolean }>`
  appearance: none;
  width: 100%;
  padding: 2.5rem;
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
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 4px;
  }

  transition: border-color 0.25s, box-shadow 0.25s;
`;

export const PreviewOverlay = styled.div`
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

export const PreviewCta = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const PreviewHint = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Skeleton field for the preview
export const PreviewField = styled.div`
  margin-bottom: 1.25rem;
`;

export const PreviewLabel = styled.div<{ $w?: string }>`
  height: 0.75rem;
  width: ${({ $w }) => $w ?? '35%'};
  border-radius: 4px;
  background: ${({ theme }) => `${theme.colors.primary}25`};
  margin-bottom: 0.5rem;
`;

export const PreviewInput = styled.div`
  height: 2.75rem;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.colors.textSecondary}10`};
  border: 1.5px solid ${({ theme }) => `${theme.colors.primary}15`};
`;

export const PreviewTextarea = styled(PreviewInput)`
  height: 7rem;
`;

export const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Modal styled components ────────────────────────────────────────────────────
export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndices.modal};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 600px) {
    padding: 0;
    align-items: stretch;
  }
`;

export const ModalContainer = styled(motion.div)<{ $isDark: boolean }>`
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

  @media (max-width: 600px) {
    min-height: 100dvh;
    margin: 0;
    padding: 4.25rem 1.25rem 1.5rem;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }
`;

export const ModalCloseButton = styled.button`
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

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-right: 2.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const ClearButton = styled.button`
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
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => `${theme.colors.error}18`};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Form styled components ─────────────────────────────────────────────────────
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const Label = styled.label<{ $required?: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.3px;

  ${({ $required, theme }) => $required && `
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

export const FieldHint = styled.span`
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

export const Input = styled.input<{ $isDark: boolean }>`
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

export const Select = styled.select<{ $isDark: boolean }>`
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

export const Textarea = styled.textarea<{ $isDark: boolean }>`
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

export const FileInputWrapper = styled.label<{ $isDark: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1.5px ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : `${theme.colors.primary}30`} dashed;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}cc` : `${theme.colors.surface}cc`};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-within {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

export const FileCount = styled.span<{ $hasError: boolean }>`
  font-size: 0.9rem;
  color: ${({ $hasError, theme }) =>
    $hasError ? theme.colors.error : theme.colors.textSecondary};
`;

export const DeadlineWarning = styled(motion.div)`
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => `${theme.colors.warning}14`};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  line-height: 1.5;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

export const FormNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
`;

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;

  &:focus {
    outline: none;
  }
`;

export const ProgressBarTrack = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => `${theme.colors.primary}20`};
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $progress }) => $progress}%;
  transition: width 0.4s ease;
`;

export const StepLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

export const FieldError = styled(motion.span)`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.text};
  margin-top: -0.15rem;
  padding-left: 0.55rem;
  border-left: 3px solid ${({ theme }) => theme.colors.error};
`;

export const ValidationSummary = styled.div`
  margin: -0.75rem 0 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  background: ${({ theme }) => `${theme.colors.error}12`};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;


export const CheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const CheckboxInput = styled.input`
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
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
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
    border-color: ${({ theme }) => theme.colors.onPrimary};
  }
`;

export const CheckboxText = styled(FieldHint)`
  opacity: 1;

  label {
    cursor: pointer;
  }
`;
// ───────────────────────────────────────────────────────────────────────────────

export const InlineLinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: ${({ theme }) => theme.colors.link};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.linkHover};
    text-decoration: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

// ── Confirm dialog styled components ───────────────────────────────────────────
export const ConfirmBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(3px);
  z-index: ${({ theme }) => theme.zIndices.modal + 100};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ConfirmBox = styled(motion.div)<{ $isDark: boolean }>`
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

export const ConfirmIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.onError};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const ConfirmMessage = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem;
  white-space: pre-line;
`;

export const ConfirmHint = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 1.5rem;
  padding: 0.65rem 0.75rem;
  border-left: 3px solid ${({ theme }) => theme.colors.info};
  text-align: left;
`;

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;
// ───────────────────────────────────────────────────────────────────────────────

// ── Summary styled components ──────────────────────────────────────────────────
export const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem 0;

  &:focus {
    outline: none;
  }
`;

export const SummarySubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 2rem 0;
`;

export const SummaryNotice = styled.p<{ $complete: boolean }>`
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid ${({ theme, $complete }) => $complete ? theme.colors.success : theme.colors.warning};
  background: ${({ theme, $complete }) => `${$complete ? theme.colors.success : theme.colors.warning}12`};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const IdBox = styled.button<{ $isDark: boolean; $copied: boolean }>`
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

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

export const IdLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  text-align: left;
`;

export const IdValue = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-all;
  text-align: left;
`;

export const IdCopyHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  margin-left: 0.5rem;
  flex-shrink: 0;
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const DownloadRow = styled.div`
  margin-bottom: 1.5rem;
`;

export const ManualSection = styled(motion.div)<{ $isDark: boolean }>`
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) =>
    $isDark ? `${theme.colors.background}99` : `${theme.colors.surface}99`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

export const ManualTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
`;

export const ManualRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ManualRowLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ManualRowValue = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Courier New', monospace;
  word-break: break-all;
`;

export const BackRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
`;
// ───────────────────────────────────────────────────────────────────────────────
