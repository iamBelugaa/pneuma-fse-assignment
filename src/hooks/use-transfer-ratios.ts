/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard } from '@/generated/prisma';
import { useCallback } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

interface TransferRatio {
  creditCardId: string;
  ratio: number;
}

interface IProps {
  fieldName?: string;
  control: Control<any>;
  creditCards: CreditCard[];
}

export function useTransferRatios({
  control,
  creditCards,
  fieldName = 'transferRatios',
}: IProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const handleAddTransferRatio = useCallback(() => {
    if (fields.length >= creditCards.length) return;
    append({ creditCardId: '', ratio: 1.0 });
  }, [fields.length, creditCards.length, append]);

  const getAvailableCreditCards = useCallback(
    (currentIndex: number, watchedRatios: TransferRatio[]): CreditCard[] => {
      const selectedIds = watchedRatios
        .map((ratio, index) =>
          index !== currentIndex ? ratio.creditCardId : null
        )
        .filter(Boolean);

      return creditCards.filter((card) => !selectedIds.includes(card.id));
    },
    [creditCards]
  );

  const validateTransferRatio = useCallback(
    (ratio: TransferRatio, index: number, watchedRatios: TransferRatio[]) => {
      const isDuplicateCard =
        ratio.creditCardId &&
        watchedRatios.some(
          (r, i) => i !== index && r.creditCardId === ratio.creditCardId
        );

      const isInvalidRatio =
        ratio.creditCardId &&
        ((ratio.ratio ?? 0) <= 0 || (ratio.ratio ?? 0) > 10);

      return {
        isDuplicateCard,
        isInvalidRatio,
        hasErrors: isDuplicateCard || isInvalidRatio,
      };
    },
    []
  );

  return {
    fields,
    append,
    remove,
    validateTransferRatio,
    handleAddTransferRatio,
    getAvailableCreditCards,
  };
}
