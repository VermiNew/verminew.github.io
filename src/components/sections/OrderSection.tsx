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
