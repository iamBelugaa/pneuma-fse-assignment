/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard } from '@/generated/prisma';
import { useTransferRatios } from '@/hooks/use-transfer-ratios';
import { CreateProgramInput, UpdateProgramInput } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldPath,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

interface IProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  creditCards: CreditCard[];
  register: UseFormRegister<any>;
  errors: FieldErrors<CreateProgramInput | UpdateProgramInput>;
}

const getFieldError = (
  errors: FieldErrors<CreateProgramInput | UpdateProgramInput>,
  path: FieldPath<CreateProgramInput | UpdateProgramInput>
): string | undefined => {
  let current: any = errors;
  const keys = path.split('.');

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current?.message;
};

export function TransferRatiosSection({
  watch,
  errors,
  control,
  register,
  creditCards,
}: IProps) {
  const transferRatios = useTransferRatios({ control, creditCards });
  const watchedRatios = watch('transferRatios') ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Transfer Ratios</Label>
          <p className="text-sm text-gray-500 mt-1">
            Set up transfer ratios with credit card partners
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={transferRatios.handleAddTransferRatio}
          disabled={transferRatios.fields.length >= creditCards.length}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ratio
        </Button>
      </div>

      {/* Transfer Ratio Validation Errors */}
      {getFieldError(errors, 'transferRatios') && (
        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {getFieldError(errors, 'transferRatios')}
        </p>
      )}

      {transferRatios.fields.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            No transfer ratios configured yet. Add some transfer ratios to
            enable credit card point transfers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transferRatios.fields.map((field, index) => {
            const availableCards = transferRatios.getAvailableCreditCards(
              index,
              watchedRatios
            );
            const currentRatio = watchedRatios[index];
            const validation = transferRatios.validateTransferRatio(
              currentRatio,
              index,
              watchedRatios
            );

            return (
              <div
                key={field.id}
                className={cn(
                  'flex items-end space-x-3 p-4 border rounded-lg',
                  validation.hasErrors
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                )}
              >
                {/* Credit Card Selection */}
                <div className="flex-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Credit Card
                  </Label>
                  <Controller
                    name={`transferRatios.${index}.creditCardId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-[15rem] mt-1',
                            validation.isDuplicateCard && 'border-red-500'
                          )}
                        >
                          <SelectValue placeholder="Select a Credit Card" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableCards.map((card) => (
                              <SelectItem value={card.id} key={card.id}>
                                {card.bankName} {card.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {validation.isDuplicateCard && (
                    <p className="text-xs text-red-500 mt-1">
                      Credit card already selected
                    </p>
                  )}
                  {getFieldError(
                    errors,
                    `transferRatios.${index}.creditCardId`
                  ) && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError(
                        errors,
                        `transferRatios.${index}.creditCardId`
                      )}
                    </p>
                  )}
                </div>

                {/* Transfer Ratio Input */}
                <div className="w-32">
                  <Label className="text-xs font-medium text-gray-700">
                    Transfer Ratio
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="10"
                    {...register(`transferRatios.${index}.ratio`, {
                      valueAsNumber: true,
                    })}
                    className={cn(
                      'mt-1',
                      validation.isInvalidRatio && 'border-red-500'
                    )}
                    placeholder="1.0"
                  />
                  {validation.isInvalidRatio && (
                    <p className="text-xs text-red-500 mt-1">
                      Must be between 0.1 and 10
                    </p>
                  )}
                  {getFieldError(errors, `transferRatios.${index}.ratio`) && (
                    <p className="text-xs text-red-500 mt-1">
                      {getFieldError(errors, `transferRatios.${index}.ratio`)}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => transferRatios.remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
