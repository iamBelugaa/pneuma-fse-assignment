import { ProgramQueryInput } from '@/lib/schemas';
import { IProgramWithRatios } from '@/types/program';
import { PaginationMeta } from '@/types/response';
import { useCallback, useState } from 'react';

export function useProgramsState(
  initialPrograms: IProgramWithRatios[],
  initialPagination: PaginationMeta,
  initialQuery: ProgramQueryInput
) {
  const [programs, setPrograms] =
    useState<IProgramWithRatios[]>(initialPrograms);

  const [pagination, setPagination] = useState({
    ...initialPagination,
    page: Math.max(0, (initialPagination.page || 1) - 1),
  });

  const [currentQuery, setCurrentQuery] = useState({
    ...initialQuery,
    page: Math.max(0, (initialQuery.page || 1) - 1),
  });

  const updatePrograms = useCallback((newPrograms: IProgramWithRatios[]) => {
    setPrograms(newPrograms);
  }, []);

  const updateProgram = useCallback((updatedProgram: IProgramWithRatios) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
  }, []);

  const updatePagination = useCallback((newPagination: PaginationMeta) => {
    setPagination(newPagination);
  }, []);

  const updateQuery = useCallback((newQuery: ProgramQueryInput) => {
    setCurrentQuery(newQuery);
  }, []);

  return {
    programs,
    pagination,
    updateQuery,
    currentQuery,
    updateProgram,
    updatePrograms,
    updatePagination,
  };
}
