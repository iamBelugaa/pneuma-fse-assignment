'use client';

import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditCard } from '@/generated/prisma';
import { useFileUpload } from '@/hooks/use-file-upload';
import { UpdateProgramInput } from '@/lib/schemas';
import { updateProgramSchema } from '@/lib/schemas/program.schema';
import {
  deleteFile,
  formatTransferRatiosForForm,
  generateFileName,
  uploadFile,
} from '@/lib/utils';
import { IProgramWithRatios } from '@/types/program';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FileUpload } from './file-upload';
import { ProgramBasicFields } from './program-basic-fields';
import { TransferRatios } from './transfer-ratios';

interface IProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  creditCards: CreditCard[];
  program: IProgramWithRatios;
  onSubmit: (data: UpdateProgramInput & { id: string }) => Promise<void>;
}

export function EditProgramForm({
  isOpen,
  program,
  onClose,
  onSubmit,
  creditCards,
  isLoading = false,
}: IProps) {
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const fileUpload = useFileUpload();
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(updateProgramSchema),
    defaultValues: {
      name: program.name,
      enabled: program.enabled,
      assetName: program.assetName ?? '',
      transferRatios: formatTransferRatiosForForm(program.transferRatios),
    },
  });

  const handleSubmit = async (data: UpdateProgramInput) => {
    let finalAssetName = data.assetName;

    if (fileUpload.isImageDeleted && program.assetName) {
      try {
        setIsUploadingFile(true);
        await deleteFile(program.assetName);
        finalAssetName = '';
        setIsUploadingFile(false);
      } catch (error) {
        setIsUploadingFile(false);
        console.warn('Failed to delete old image:', error);
        toast.error('Failed to delete old image');
      }
    }

    if (fileUpload.uploadedFile && fileUpload.hasImageChanged) {
      if (program.assetName && !fileUpload.isImageDeleted) {
        try {
          await deleteFile(program.assetName);
        } catch (error) {
          console.warn('Failed to delete old image:', error);
          toast.error('Failed to delete old image');
        }
      }

      try {
        const fileName = generateFileName(
          data.name,
          fileUpload.uploadedFile.name
        );
        finalAssetName = await uploadFile(fileUpload.uploadedFile, fileName);
      } catch (uploadError) {
        console.warn('File upload failed:', uploadError);
        toast.error('File upload failed');
        return;
      }
    }

    const finalData = {
      ...data,
      id: program.id,
      assetName: finalAssetName,
      transferRatios: data.transferRatios,
    };

    await onSubmit(finalData);
    handleReset();
  };

  const hasFormChanged = () => {
    const currentData = form.getValues();
    const originalRatios = program.transferRatios;
    const currentRatios = currentData.transferRatios ?? [];

    if (
      currentData.name !== program.name ||
      currentData.enabled !== program.enabled
    ) {
      return true;
    }

    if (fileUpload.hasImageChanged || fileUpload.isImageDeleted) {
      return true;
    }

    if (currentRatios.length !== originalRatios.length) {
      return true;
    }

    return currentRatios.some((currentRatio) => {
      const originalRatio = originalRatios.find(
        (orig) => orig.creditCard?.id === currentRatio.creditCardId
      );
      return !originalRatio || originalRatio.ratio !== currentRatio.ratio;
    });
  };

  const handleReset = () => {
    form.reset();
    fileUpload.resetUpload();
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  useEffect(() => {
    if (!program || !isOpen) return;

    const existingTransferRatios = formatTransferRatiosForForm(
      program.transferRatios
    );

    form.reset({
      name: program.name,
      enabled: program.enabled,
      assetName: program.assetName || '',
      transferRatios: existingTransferRatios,
    });

    fileUpload.setInitialPreview(program.imageUrl || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>
            Update the frequent flyer program details and manage transfer ratios
            with credit card partners.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ProgramBasicFields
            register={form.register}
            control={form.control}
            errors={form.formState.errors}
            enabledValue={form.watch('enabled')}
          />
          <FileUpload fileUpload={fileUpload} />
          <TransferRatios
            control={form.control}
            register={form.register}
            watch={form.watch}
            errors={form.formState.errors}
            creditCards={creditCards}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isUploadingFile}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isUploadingFile ||
                isLoading ||
                !form.formState.isValid ||
                !hasFormChanged()
              }
              className="min-w-[120px]"
            >
              {isLoading || isUploadingFile ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                'Update Program'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
