'use client';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { IProgramWithRatios } from '@/types/program';
import { PaginationMeta } from '@/types/response';
import { useMemo } from 'react';
import { createProgramColumns, IProgramTableActions } from './columns';

interface IProps {
  title?: string;
  className?: string;
  isLoading?: boolean;
  description?: string;
  programs: IProgramWithRatios[];
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDelete: (programId: string) => void;
  onEdit: (program: IProgramWithRatios) => void;
  onViewDetails: (program: IProgramWithRatios) => void;
  onToggleEnabled: (programId: string, enabled: boolean) => void;
}

export function ProgramsDataTable({
  onEdit,
  programs,
  onDelete,
  className,
  pagination,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onToggleEnabled,
  isLoading = false,
  title = 'Frequent Flyer Programs',
  description = 'Manage airline loyalty programs and their transfer ratios',
}: IProps) {
  const actions: IProgramTableActions = useMemo(
    () => ({
      onEdit,
      onDelete,
      onViewDetails,
      onToggleEnabled,
    }),
    [onEdit, onDelete, onToggleEnabled, onViewDetails]
  );

  const columns = useMemo(() => createProgramColumns(actions), [actions]);
  const stats = useMemo(() => {
    const totalPrograms = programs.length;
    const enabledPrograms = programs.filter(
      (p) => p.enabled && !p.archived
    ).length;

    const archivedPrograms = programs.filter((p) => p.archived).length;
    const programsWithRatios = programs.filter(
      (p) => (p.transferRatios?.length || 0) > 0
    ).length;

    return {
      total: totalPrograms,
      enabled: enabledPrograms,
      archived: archivedPrograms,
      withRatios: programsWithRatios,
    };
  }, [programs]);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {pagination.total} Total
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              {stats.enabled} Enabled (Current Page)
            </Badge>
            {stats.archived > 0 && (
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-200"
              >
                {stats.archived} Archived (Current Page)
              </Badge>
            )}
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {stats.withRatios} With Ratios (Current Page)
            </Badge>
          </div>
        </div>
      </div>
      <DataTable
        searchKey="name"
        columns={columns}
        isLoading={isLoading}
        data={programs}
        pagination={pagination}
        onRowClick={onViewDetails}
        onPageChange={onPageChange}
        enableServerSidePagination={true}
        onPageSizeChange={onPageSizeChange}
        searchPlaceholder="Search programs..."
      />
    </div>
  );
}

export default ProgramsDataTable;
