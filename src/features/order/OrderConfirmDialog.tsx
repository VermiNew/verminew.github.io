import React from 'react';
import FocusTrap from 'focus-trap-react';
import { AnimatePresence } from 'framer-motion';
import { MdWarningAmber } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
  ConfirmActions,
  ConfirmBackdrop,
  ConfirmBox,
  ConfirmHint,
  ConfirmIcon,
  ConfirmMessage,
} from './styles';

interface OrderConfirmDialogProps {
  action: 'close' | 'clear' | null;
  isDark: boolean;
  reducedMotion: boolean;
  boxRef: React.RefObject<HTMLDivElement>;
  onCancel: () => void;
  onConfirm: () => void;
}

const MESSAGE_ID = 'order-confirm-message';
const HINT_ID = 'order-confirm-hint';

export const OrderConfirmDialog: React.FC<OrderConfirmDialogProps> = ({
  action,
  isDark,
  reducedMotion,
  boxRef,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {action && (
        <ConfirmBackdrop
          key="confirm-backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reducedMotion ? 0 : 0.15 } }}
          exit={reducedMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
          onClick={onCancel}
        >
          <FocusTrap
            focusTrapOptions={{
              initialFocus: () => boxRef.current?.querySelector('button') ?? false,
              returnFocusOnDeactivate: true,
              escapeDeactivates: false,
              allowOutsideClick: true,
            }}
          >
            <ConfirmBox
              ref={boxRef}
              $isDark={isDark}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' },
              }}
              exit={reducedMotion ? undefined : {
                opacity: 0,
                scale: 0.92,
                transition: { duration: 0.15 },
              }}
              onClick={(event) => event.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={MESSAGE_ID}
              aria-describedby={action === 'close' ? HINT_ID : undefined}
            >
              <ConfirmIcon aria-hidden="true"><MdWarningAmber /></ConfirmIcon>
              <ConfirmMessage id={MESSAGE_ID}>
                {action === 'close' ? t('order.modal.confirmClose') : t('order.modal.confirmClear')}
              </ConfirmMessage>
              {action === 'close' && (
                <ConfirmHint id={HINT_ID}>{t('order.modal.confirmCloseHint')}</ConfirmHint>
              )}
              <ConfirmActions>
                <Button size="medium" variant="outline" onClick={onCancel}>
                  {t('order.modal.confirmNo')}
                </Button>
                <Button size="medium" onClick={onConfirm}>
                  {action === 'close'
                    ? t('order.modal.confirmYesClose')
                    : t('order.modal.confirmYesClear')}
                </Button>
              </ConfirmActions>
            </ConfirmBox>
          </FocusTrap>
        </ConfirmBackdrop>
      )}
    </AnimatePresence>
  );
};
