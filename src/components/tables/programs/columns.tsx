'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn, formatDate } from '@/lib/utils';
import { IProgramWithRatios } from '@/types/program';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from 'lucide-react';

export interface IProgramTableActions {
  onDelete: (programId: string) => void;
  onEdit: (program: IProgramWithRatios) => void;
  onViewDetails: (program: IProgramWithRatios) => void;
  onToggleEnabled: (programId: string, enabled: boolean) => void;
}

export const createProgramColumns = (
  actions: IProgramTableActions
): ColumnDef<IProgramWithRatios>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        Program Name
      </Button>
    ),
    cell: ({ row }) => {
      const program = row.original;
      return <p className="font-medium ml-3">{program.name}</p>;
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: 'includesString',
    size: 300,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const program = row.original;

      if (program.archived) {
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-300"
          >
            <Eye className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      }

      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-2"
        >
          <Switch
            checked={program.enabled}
            disabled={program.archived}
            onChange={(e) => e.stopPropagation()}
            onCheckedChange={(enabled) =>
              actions.onToggleEnabled(program.id, enabled)
            }
          />
          <Badge
            variant={program.enabled ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              program.enabled
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            )}
          >
            {program.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      );
    },
    enableHiding: true,
    enableSorting: false,
    size: 150,
  },
  {
    id: 'transferRatios',
    header: 'Partnerships',
    cell: ({ row }) => {
      const program = row.original;
      const ratios = program.transferRatios || [];
      const activeRatios = ratios.filter((r) => !r.archived);

      if (activeRatios.length === 0) {
        return (
          <div className="text-sm text-muted-foreground">No partnerships</div>
        );
      }

      return (
        <p className="font-medium text-sm">
          {activeRatios.length} partner{activeRatios.length !== 1 ? 's' : ''}
        </p>
      );
    },
    enableHiding: true,
    enableSorting: false,
    size: 120,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        Created
      </Button>
    ),
    cell: ({ row }) => {
      const program = row.original;
      return (
        <div>
          <p className="text-sm font-medium">
            {formatDate(program.createdAt, 'short')}
          </p>
          <p className="text-xs text-muted-foreground">
            by {program.createdBy?.email || 'Unknown'}
          </p>
        </div>
      );
    },
    enableHiding: true,
    enableSorting: false,
    size: 120,
  },
  {
    accessorKey: 'modifiedAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        Modified
      </Button>
    ),
    cell: ({ row }) => {
      const program = row.original;

      return (
        <div>
          <p className="text-sm font-medium">
            {formatDate(program.modifiedAt, 'short')}
          </p>
          <p className="text-xs text-muted-foreground">
            by {program.modifiedBy?.email || 'Unknown'}
          </p>
        </div>
      );
    },
    enableHiding: true,
    enableSorting: false,
    size: 120,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const program = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {/* View details option */}
            {actions.onViewDetails && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onViewDetails!(program);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />

            {/* Edit option */}
            <DropdownMenuItem
              disabled={program.archived}
              onClick={(e) => {
                e.stopPropagation();
                actions.onEdit(program);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Program
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Toggle enabled/disabled */}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                actions.onToggleEnabled(program.id, !program.enabled);
              }}
              disabled={program.archived}
            >
              {program.enabled ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Disable Program
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Enable Program
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Delete/Archive option */}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                actions.onDelete(program.id);
              }}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {program.archived ? 'Delete Permanently' : 'Archive Program'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 80,
  },
];
