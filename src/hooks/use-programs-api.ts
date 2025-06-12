import {
  CreateProgramInput,
  ProgramQueryInput,
  UpdateProgramInput,
} from '@/lib/schemas';
import { ApiStatus } from '@/types/response';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useProgramsApi() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPrograms = useCallback(async (query: ProgramQueryInput) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();

      if (query.page !== 0) {
        searchParams.set('page', query.page ? query.page.toString() : '0');
      }

      if (query.pageSize !== 20) {
        searchParams.set(
          'pageSize',
          query.pageSize ? query.pageSize.toString() : '10'
        );
      }

      const response = await fetch(`/api/programs?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch programs: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status !== ApiStatus.OK) {
        const errorMessage =
          result.status === ApiStatus.ERROR
            ? result.error?.message || 'Failed to fetch programs'
            : 'Failed to fetch programs';
        throw new Error(errorMessage);
      }

      return {
        programs: result.data.programs,
        pagination: {
          page: Math.max(0, result.data.pagination?.page ?? query.page),
          pageSize: Math.max(
            1,
            result.data.pagination?.pageSize || query.pageSize
          ),
          total: Math.max(
            0,
            result.data.pagination?.total || result.data.total || 0
          ),
          totalPages: Math.max(
            1,
            result.data.pagination?.totalPages ||
              Math.ceil((result.data.total || 0) / query.pageSize)
          ),
        },
      };
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to fetch programs',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateProgram = useCallback(async (data: CreateProgramInput) => {
    const response = await fetch('/api/programs', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok || result.status !== ApiStatus.OK) {
      const errorMessage =
        result.status === ApiStatus.ERROR
          ? result.error?.message || 'Failed to create program'
          : 'Failed to create program';
      throw new Error(errorMessage);
    }

    return result.data;
  }, []);

  const handleUpdateProgram = useCallback(
    async (programId: string, data: UpdateProgramInput) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.status !== ApiStatus.OK) {
        const errorMessage =
          result.status === ApiStatus.ERROR
            ? result.error?.message || 'Failed to update program'
            : 'Failed to update program';
        throw new Error(errorMessage);
      }

      return result.data;
    },
    []
  );

  const handleDeleteProgram = useCallback(async (programId: string) => {
    const response = await fetch(`/api/programs/${programId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const result = await response.json();

    if (!response.ok || result.status !== ApiStatus.OK) {
      const errorMessage =
        result.status === ApiStatus.ERROR
          ? result.error?.message || 'Failed to delete program'
          : 'Failed to delete program';
      throw new Error(errorMessage);
    }

    return result.data;
  }, []);

  const handleToggleProgramEnabled = useCallback(
    async (programId: string, enabled: boolean) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', enabled }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== ApiStatus.OK) {
        const errorMessage =
          result.status === ApiStatus.ERROR
            ? result.error?.message || 'Failed to update program status'
            : 'Failed to update program status';
        throw new Error(errorMessage);
      }

      return result.data;
    },
    []
  );

  return {
    isLoading,
    fetchPrograms: handleFetchPrograms,
    createProgram: handleCreateProgram,
    updateProgram: handleUpdateProgram,
    deleteProgram: handleDeleteProgram,
    toggleProgramEnabled: handleToggleProgramEnabled,
  };
}
