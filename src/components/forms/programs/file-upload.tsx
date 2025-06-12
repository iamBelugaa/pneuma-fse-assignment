import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/use-file-upload';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface IProps {
  fileUpload: ReturnType<typeof useFileUpload>;
}

export function FileUpload({ fileUpload }: IProps) {
  const {
    dragActive,
    handleDrag,
    handleDrop,
    fileInputRef,
    uploadPreview,
    uploadedFile,
    isImageDeleted,
    hasImageChanged,
    handleFileUpload,
    handleRemoveImage,
  } = fileUpload;

  return (
    <div className="space-y-2">
      <Label>Program Logo</Label>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploadPreview && fileInputRef.current?.click()}
      >
        {uploadPreview ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-24 h-24">
              <Image
                fill
                src={uploadPreview}
                alt="Program logo preview"
                className="object-contain rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-3 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              {uploadedFile?.name || 'Current program logo'}
            </p>
            {hasImageChanged && !isImageDeleted && (
              <p className="text-xs text-blue-600">
                New image will be uploaded
              </p>
            )}
            {isImageDeleted && (
              <p className="text-xs text-red-600">Image will be deleted</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose File
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                or drag and drop an image here
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, SVG up to 5MB</p>
            </div>
            {isImageDeleted && (
              <p className="text-xs text-red-600">
                Current image will be deleted
              </p>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </div>
    </div>
  );
}
