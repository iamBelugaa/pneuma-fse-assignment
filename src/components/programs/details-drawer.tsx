'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { IProgramWithRatios } from '@/types/program';
import { CreditCardIcon, ImageIcon, InfoIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  program: IProgramWithRatios | null;
}

export function ProgramDetailsDrawer({ isOpen, onClose, program }: IProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!program) return null;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="pb-4 px-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Program Logo */}
              <div className="flex-shrink-0">
                {program.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-lg border overflow-hidden">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                    {!imageError ? (
                      <Image
                        src={program.imageUrl}
                        alt={`${program.name} logo`}
                        width={64}
                        height={64}
                        className={`object-contain w-full h-full transition-opacity duration-200 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <DrawerTitle className="text-2xl font-bold">
                  {program.name}
                </DrawerTitle>
                <DrawerDescription className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant={program.enabled ? 'default' : 'secondary'}
                    className={
                      program.enabled ? 'bg-green-100 text-green-800' : ''
                    }
                  >
                    {program.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-6 px-6">
          {/* Program Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Program Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium">
                    {new Date(program.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Last Modified
                </label>
                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium">
                    {new Date(program.modifiedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transfer Ratios */}
          <div className="space-y-4 pb-6 max-h-[50vh] overflow-y-scroll pr-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Transfer Ratios</h3>
              </div>
              <Badge variant="outline">
                {program.transferRatios?.length || 0} Credit Cards
              </Badge>
            </div>
            {program.transferRatios && program.transferRatios.length > 0 ? (
              <div className="space-y-3">
                {program.transferRatios.map((ratio) => (
                  <div key={ratio.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ratio.creditCard.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ratio.creditCard.bankName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {ratio.ratio}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Transfer Ratio
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCardIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transfer ratios configured</p>
                <p className="text-sm">
                  Add credit card partners to enable point transfers.
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
