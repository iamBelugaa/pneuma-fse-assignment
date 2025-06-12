import { IProgramWithRatios } from '@/types/program';
import { ApiStatus } from '@/types/response';
import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  style: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (style) {
    case 'long':
      return format(dateObj, 'PPpp');
    case 'relative':
      return formatDistanceToNow(dateObj, { addSuffix: true });
    case 'short':
    default:
      return format(dateObj, 'MMM dd, yyyy');
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export function generateId(length: number = 8): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function uploadFile(
  file: File,
  fileName: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);

  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const uploadResult = await uploadResponse.json();

  if (uploadResult.status === ApiStatus.OK) {
    return uploadResult.data.fileName;
  } else {
    const errorMessage =
      uploadResult.status === ApiStatus.ERROR
        ? uploadResult.error?.message || 'Failed to upload logo'
        : 'Failed to upload logo';
    throw new Error(errorMessage);
  }
}

export async function deleteFile(fileName: string): Promise<void> {
  await fetch(`/api/upload?fileName=${fileName}`, { method: 'DELETE' });
}

export function generateFileName(
  programName: string,
  originalFileName: string
): string {
  const timestamp = Date.now();
  const sanitizedName = programName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const fileExtension = originalFileName.split('.').pop();
  return `logos/${sanitizedName}-${timestamp}.${fileExtension}`;
}

export function formatTransferRatiosForForm(
  transferRatios: IProgramWithRatios['transferRatios']
): { ratio: number; creditCardId: string }[] {
  return transferRatios.map((ratio) => ({
    ratio: ratio.ratio,
    creditCardId: ratio.creditCard?.id,
  }));
}
