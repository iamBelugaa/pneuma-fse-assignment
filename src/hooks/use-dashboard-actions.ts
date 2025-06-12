import {
  CreateProgramInput,
  ProgramQueryInput,
  UpdateProgramInput,
} from '@/lib/schemas';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useProgramsApi } from './use-programs-api';
import { useProgramsState } from './use-programs-state';

export function useDashboardActions(
  programsState: ReturnType<typeof useProgramsState>,
  programsApi: ReturnType<typeof useProgramsApi>
) {
  const {
    programs,
    updateQuery,
    currentQuery,
    updatePrograms,
    updateProgram,
    updatePagination,
  } = programsState;

  const {
    fetchPrograms,
    createProgram,
    deleteProgram,
    toggleProgramEnabled,
    updateProgram: apiUpdateProgram,
  } = programsApi;

  const handleFetchPrograms = useCallback(
    async (query: ProgramQueryInput = currentQuery) => {
      const result = await fetchPrograms(query);
      updatePrograms(result.programs);
      updatePagination(result.pagination);
      updateQuery(query);
    },
    [currentQuery, fetchPrograms, updatePrograms, updatePagination, updateQuery]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      const apiPage = Math.max(0, newPage - 1);
      const maxApiPage = Math.max(
        0,
        (programsState.pagination.totalPages || 1) - 1
      );
      const safeApiPage = Math.min(apiPage, maxApiPage);

      if (safeApiPage === (currentQuery.page || 0)) return;
      const newQuery = { ...currentQuery, page: safeApiPage };
      await handleFetchPrograms(newQuery);
    },
    [currentQuery, handleFetchPrograms, programsState.pagination.totalPages]
  );

  const handlePageSizeChange = useCallback(
    async (newPageSize: number) => {
      const safePageSize = Math.max(1, newPageSize);
      if (safePageSize === currentQuery.pageSize) return;

      const newQuery = { ...currentQuery, page: 0, pageSize: safePageSize };
      await handleFetchPrograms(newQuery);
    },
    [currentQuery, handleFetchPrograms]
  );

  const handleCreateProgram = useCallback(
    async (data: CreateProgramInput) => {
      try {
        const newProgram = await createProgram(data);
        toast.success('Success', {
          description: `Program "${newProgram.name}" created successfully`,
        });
        await handleFetchPrograms();
      } catch (error) {
        console.error('Error creating program:', error);
        toast.error('Error', {
          description:
            error instanceof Error ? error.message : 'Failed to create program',
        });
        throw error;
      }
    },
    [createProgram, handleFetchPrograms]
  );

  const handleUpdateProgram = useCallback(
    async (programId: string, data: UpdateProgramInput) => {
      try {
        const updatedProgram = await apiUpdateProgram(programId, data);
        updateProgram(updatedProgram);
        toast.success('Success', {
          description: `Program "${updatedProgram.name}" updated successfully`,
        });
      } catch (error) {
        console.error('Error updating program:', error);
        toast.error('Error', {
          description:
            error instanceof Error ? error.message : 'Failed to update program',
        });
        throw error;
      }
    },
    [apiUpdateProgram, updateProgram]
  );

  const handleDeleteProgram = useCallback(
    async (programId: string) => {
      const programToDelete = programs.find((p) => p.id === programId);
      if (!programToDelete) return;

      try {
        await deleteProgram(programId);
        toast.success('Success', {
          description: `Program "${programToDelete.name}" archived successfully`,
        });
        await handleFetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        toast.error('Error', {
          description:
            error instanceof Error ? error.message : 'Failed to delete program',
        });
      }
    },
    [programs, deleteProgram, handleFetchPrograms]
  );

  const handleToggleEnabled = useCallback(
    async (programId: string, enabled: boolean) => {
      const originalProgram = programs.find((p) => p.id === programId);
      if (!originalProgram) return;

      try {
        updateProgram({ ...originalProgram, enabled });
        const updatedProgram = await toggleProgramEnabled(programId, enabled);

        updateProgram(updatedProgram);
        toast.success('Success', {
          description: `Program ${
            enabled ? 'enabled' : 'disabled'
          } successfully`,
        });
      } catch (error) {
        updateProgram(originalProgram);
        console.error('Error toggling program status:', error);
        toast.error('Error', {
          description:
            error instanceof Error
              ? error.message
              : 'Failed to update program status',
        });
      }
    },
    [programs, updateProgram, toggleProgramEnabled]
  );

  return {
    handlePageChange,
    handleFetchPrograms,
    handleCreateProgram,
    handleUpdateProgram,
    handleDeleteProgram,
    handleToggleEnabled,
    handlePageSizeChange,
  };
}
