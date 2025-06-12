'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { CreateProgramInput } from '@/lib/schemas';
import { createProgramSchema } from '@/lib/schemas/program.schema';
import { generateFileName, uploadFile } from '@/lib/utils';
import { useState } from 'react';
import { FileUpload } from './file-upload';
import { ProgramBasicFields } from './program-basic-fields';
import { TransferRatios } from './transfer-ratios';

interface IProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  creditCards: CreditCard[];
  onSubmit: (data: CreateProgramInput) => Promise<void>;
}

export function CreateProgramForm({
  isOpen,
  onClose,
  onSubmit,
  creditCards,
  isLoading = false,
}: IProps) {
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const fileUpload = useFileUpload();
  const form = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: '',
      enabled: true,
      assetName: '',
      transferRatios: [],
    },
  });

  const handleSubmit = async (data: CreateProgramInput) => {
    let finalAssetName = data.assetName;

    if (fileUpload.uploadedFile) {
      setIsUploadingFile(true);
      try {
        const fileName = generateFileName(
          data.name,
          fileUpload.uploadedFile.name
        );
        finalAssetName = await uploadFile(fileUpload.uploadedFile, fileName);
        setIsUploadingFile(false);
      } catch (uploadError) {
        setIsUploadingFile(false);
        console.warn('File upload failed:', uploadError);
        toast.error('File upload failed');
        return;
      }
    }

    const finalData: CreateProgramInput = {
      ...data,
      assetName: finalAssetName,
      transferRatios: data.transferRatios,
    };

    await onSubmit(finalData);
    handleReset();
  };

  const handleReset = () => {
    form.reset({
      name: '',
      enabled: true,
      assetName: '',
      transferRatios: [],
    });
    fileUpload.resetUpload();
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
          <DialogDescription>
            Create a new frequent flyer program. You can optionally set up
            transfer ratios with credit card partners during creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ProgramBasicFields
            control={form.control}
            register={form.register}
            errors={form.formState.errors}
            enabledValue={form.watch('enabled') ?? false}
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
              disabled={isUploadingFile || isLoading || !form.formState.isValid}
              className="min-w-[120px]"
            >
              {isLoading || isUploadingFile ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                'Create Program'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
