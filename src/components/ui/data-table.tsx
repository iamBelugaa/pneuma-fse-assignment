'use client';

import {
  ColumnDef,
  PaginationState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PaginationMeta } from '@/types/response';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  className?: string;
  isLoading?: boolean;
  searchPlaceholder?: string;
  pagination?: PaginationMeta;
  onRowClick?: (row: TData) => void;
  enableServerSidePagination?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  searchKey,
  className,
  onRowClick,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  enableServerSidePagination = false,
  searchPlaceholder = 'Search...',
}: IDataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex:
      enableServerSidePagination && pagination
        ? Math.max(0, pagination.page)
        : 0,
    pageSize:
      enableServerSidePagination && pagination ? pagination.pageSize : 10,
  });

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    ...(enableServerSidePagination
      ? {
          manualPagination: true,
          pageCount: Math.max(1, pagination?.totalPages || 1),
          onPaginationChange: (updater) => {
            const newPagination =
              typeof updater === 'function'
                ? updater(paginationState)
                : updater;

            const safePageIndex = Math.max(
              0,
              Math.min(
                newPagination.pageIndex,
                (pagination?.totalPages || 1) - 1
              )
            );

            const safePagination = {
              ...newPagination,
              pageIndex: safePageIndex,
              pageSize: Math.max(1, newPagination.pageSize),
            };

            setPaginationState(safePagination);

            if (
              safePagination.pageSize !== paginationState.pageSize &&
              safePagination.pageSize > 0
            ) {
              onPageSizeChange?.(safePagination.pageSize);
            } else if (
              safePagination.pageIndex !== paginationState.pageIndex &&
              safePagination.pageIndex >= 0
            ) {
              const uiPage = safePagination.pageIndex + 1;
              if (uiPage >= 1 && uiPage <= (pagination?.totalPages || 1)) {
                onPageChange?.(uiPage);
              }
            }
          },
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: setPaginationState,
        }),

    state: {
      globalFilter,
      rowSelection,
      columnVisibility,
      pagination: paginationState,
    },
  });

  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchKey) table.getColumn(searchKey)?.setFilterValue(value);
      else setGlobalFilter(value);
    },
    [table, searchKey]
  );

  const displayInfo = useMemo(() => {
    if (enableServerSidePagination && pagination) {
      const safePageSize = Math.max(1, pagination.pageSize);
      const safeTotal = Math.max(0, pagination.total);

      return {
        from: safeTotal === 0 ? 0 : pagination.page * safePageSize + 1,
        to:
          safeTotal === 0
            ? 0
            : Math.min((pagination.page + 1) * safePageSize, safeTotal),
        total: safeTotal,
      };
    } else {
      const filteredRowCount = table.getFilteredRowModel().rows.length;
      const pageSize = Math.max(1, table.getState().pagination.pageSize);
      const pageIndex = Math.max(0, table.getState().pagination.pageIndex);

      return {
        from: filteredRowCount === 0 ? 0 : pageIndex * pageSize + 1,
        to:
          filteredRowCount === 0
            ? 0
            : Math.min((pageIndex + 1) * pageSize, filteredRowCount),
        total: filteredRowCount,
      };
    }
  }, [enableServerSidePagination, pagination, table]);

  useEffect(() => {
    if (enableServerSidePagination && pagination) {
      setPaginationState({
        pageIndex: Math.max(0, pagination.page),
        pageSize: pagination.pageSize,
      });
    }
  }, [enableServerSidePagination, pagination]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                searchKey
                  ? (table.getColumn(searchKey)?.getFilterValue() as string) ??
                    ''
                  : globalFilter
              }
              onChange={(event) => handleSearchChange(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: paginationState.pageSize }).map(
                (_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={`skeleton-cell-${colIndex}`}>
                        <div className="h-8 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-muted/50',
                    'transition-colors'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No results found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col space-y-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          {!enableServerSidePagination &&
            table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </span>
            )}
          {(enableServerSidePagination ||
            table.getFilteredSelectedRowModel().rows.length === 0) && (
            <span>
              Showing {displayInfo.from}-{displayInfo.to} of {displayInfo.total}{' '}
              result(s)
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={paginationState.pageSize.toString()}
              onValueChange={(v) => {
                table.setPageSize(Number(v));
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="text-sm font-medium whitespace-nowrap">
              Page {Math.max(1, table.getState().pagination.pageIndex + 1)} of{' '}
              {Math.max(1, table.getPageCount())}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 sm:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage() || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 sm:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage() || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
