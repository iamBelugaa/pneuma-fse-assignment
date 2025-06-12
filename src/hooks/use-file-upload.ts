import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/form.constants';
import { formatFileSize } from '@/lib/utils';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, SVG, or WebP)');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`
      );
      return false;
    }

    return true;
  }, []);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      setUploadedFile(file);
      setHasImageChanged(true);
      setIsImageDeleted(false);

      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [validateFile]
  );

  const handleRemoveImage = useCallback(() => {
    setUploadedFile(null);
    setUploadPreview(null);
    setHasImageChanged(true);
    setIsImageDeleted(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const resetUpload = useCallback(() => {
    setUploadedFile(null);
    setUploadPreview(null);
    setHasImageChanged(false);
    setIsImageDeleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const setInitialPreview = useCallback((imageUrl: string | null) => {
    setUploadPreview(imageUrl);
    setHasImageChanged(false);
    setIsImageDeleted(false);
    setUploadedFile(null);
  }, []);

  return {
    dragActive,
    fileInputRef,
    uploadedFile,
    uploadPreview,
    hasImageChanged,
    isImageDeleted,
    handleDrag,
    handleDrop,
    resetUpload,
    handleFileUpload,
    handleRemoveImage,
    setInitialPreview,
  };
}
