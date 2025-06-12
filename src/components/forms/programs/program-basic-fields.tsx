/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreateProgramInput, UpdateProgramInput } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';

interface IProps {
  control: Control<any>;
  enabledValue: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<CreateProgramInput | UpdateProgramInput>;
}

export function ProgramBasicFields({
  errors,
  control,
  register,
  enabledValue,
}: IProps) {
  return (
    <>
      {/* Program Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Program Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., United MileagePlus"
          className={cn(
            errors.name && 'border-red-500 focus-visible:ring-red-500'
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>

      {/* Program Status */}
      <div className="space-y-2">
        <Label htmlFor="enabled">Program Status</Label>
        <div className="flex items-center space-x-2">
          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <Switch
                id="enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <span className="text-sm text-gray-600">
            Program is {enabledValue ? 'enabled' : 'disabled'}
          </span>
        </div>
      </div>
    </>
  );
}
