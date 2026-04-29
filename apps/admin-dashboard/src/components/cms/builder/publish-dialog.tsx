import React from 'react';
import { ConfirmationGate } from '../../ai/confirmation-gate';
import { useTranslation } from 'react-i18next';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  aiGeneratedCount: number;
}

export function PublishDialog({
  isOpen,
  onClose,
  onConfirm,
  aiGeneratedCount,
}: PublishDialogProps) {
  const { t } = useTranslation('admin');

  return (
    <ConfirmationGate
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={onConfirm}
      aiContentCount={aiGeneratedCount}
      contentType="landingPage"
      reviewChecklist={[
        t('cms.reviewText', 'I have reviewed all text content'),
        t('cms.reviewImages', 'I have reviewed all images'),
        t('cms.verifyLinks', 'I have verified all links work'),
      ]}
    />
  );
}
