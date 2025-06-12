'use client';

import { CreateProgramForm } from '@/components/forms/programs/create-program-form';
import ProgramsDataTable from '@/components/tables/programs/table';
import { CreditCard } from '@/generated/prisma';
import { useDashboardActions } from '@/hooks/use-dashboard-actions';
import { useProgramsApi } from '@/hooks/use-programs-api';
import { useProgramsState } from '@/hooks/use-programs-state';
import {
  CreateProgramInput,
  ProgramQueryInput,
  UpdateProgramInput,
} from '@/lib/schemas';
import { IProgramWithRatios } from '@/types/program';
import { PaginationMeta } from '@/types/response';
import { useCallback, useState } from 'react';
import { EditProgramForm } from '../forms/programs/edit-program-form';
import { ProgramDetailsDrawer } from './details-drawer';
import { DashboardHeader } from './header';
import { DashboardStats } from './stats';

interface IProps {
  creditCards: CreditCard[];
  pagination: PaginationMeta;
  initialQuery: ProgramQueryInput;
  initialPrograms: IProgramWithRatios[];
}

export function ProgramsDashboard({
  creditCards,
  initialQuery,
  initialPrograms,
  pagination: initialPagination,
}: IProps) {
  const programsApi = useProgramsApi();
  const programsState = useProgramsState(
    initialPrograms,
    initialPagination,
    initialQuery
  );
  const actions = useDashboardActions(programsState, programsApi);

  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [isCreatingProgram, setIsCreatingProgram] = useState(false);
  const [isCreateProgramFormOpen, setIsCreateProgramFormOpen] = useState(false);

  const [editingProgram, setEditingProgram] =
    useState<IProgramWithRatios | null>(null);

  const [viewingProgram, setViewingProgram] =
    useState<IProgramWithRatios | null>(null);

  const handleCreateProgram = useCallback(
    async (data: CreateProgramInput) => {
      try {
        setIsCreatingProgram(true);
        await actions.handleCreateProgram(data);
        setIsCreateProgramFormOpen(false);
      } finally {
        setIsCreatingProgram(false);
      }
    },
    [actions]
  );

  const handleUpdateProgram = useCallback(
    async (data: UpdateProgramInput) => {
      if (!editingProgram) return;

      try {
        setIsEditingProgram(true);
        await actions.handleUpdateProgram(editingProgram.id, data);
        setIsCreateProgramFormOpen(false);
        setEditingProgram(null);
      } finally {
        setIsEditingProgram(false);
      }
    },
    [editingProgram, actions]
  );

  const handleToggleCreateForm = useCallback(() => {
    setIsCreateProgramFormOpen((state) => !state);
  }, []);

  const handleToggleEditForm = useCallback(
    (program: IProgramWithRatios | null) => {
      setEditingProgram(program);
    },
    []
  );

  const handleViewDetails = useCallback((program: IProgramWithRatios) => {
    setViewingProgram(program);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setViewingProgram(null);
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader
        isLoading={programsApi.isLoading}
        onRefresh={actions.handleFetchPrograms}
        onAddProgram={handleToggleCreateForm}
      />
      <DashboardStats
        programs={programsState.programs}
        creditCards={creditCards}
        totalPrograms={programsState.pagination.total}
      />
      <ProgramsDataTable
        programs={programsState.programs}
        isLoading={programsApi.isLoading}
        pagination={programsState.pagination}
        onPageChange={actions.handlePageChange}
        onPageSizeChange={actions.handlePageSizeChange}
        onViewDetails={handleViewDetails}
        onEdit={handleToggleEditForm}
        onDelete={actions.handleDeleteProgram}
        onToggleEnabled={actions.handleToggleEnabled}
      />
      <ProgramDetailsDrawer
        program={viewingProgram}
        isOpen={!!viewingProgram}
        onClose={handleCloseDetails}
      />
      <CreateProgramForm
        creditCards={creditCards}
        isLoading={isCreatingProgram}
        onSubmit={handleCreateProgram}
        onClose={handleToggleCreateForm}
        isOpen={isCreateProgramFormOpen}
      />
      {editingProgram && (
        <EditProgramForm
          program={editingProgram}
          creditCards={creditCards}
          isOpen={!!editingProgram}
          isLoading={isEditingProgram}
          onSubmit={handleUpdateProgram}
          onClose={() => handleToggleEditForm(null)}
        />
      )}
    </div>
  );
}
