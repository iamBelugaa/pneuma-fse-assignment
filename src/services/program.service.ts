import {
  CreateProgramInput,
  ProgramQueryInput,
  UpdateProgramInput,
} from '@/lib/schemas';
import { ProgramRepository } from '@/repositories/program.repository';

export class ProgramService {
  constructor(private programRepository: ProgramRepository) {}

  async getAllPrograms(input: ProgramQueryInput) {
    return this.programRepository.findAll(input);
  }

  async getProgramById(id: string) {
    const program = await this.programRepository.findById(id);
    if (!program) throw new Error('Program not found');
    return program;
  }

  async createProgram(data: CreateProgramInput, userId: string) {
    if (!data.name?.trim()) {
      throw new Error('Program name is required');
    }

    if (data.transferRatios && data.transferRatios.length > 0) {
      for (const ratio of data.transferRatios) {
        if (!ratio.creditCardId) {
          throw new Error('Credit card is required for transfer ratio');
        }
        if (ratio.ratio <= 0 || ratio.ratio > 5) {
          throw new Error('Transfer ratio must be between 0.1 and 5');
        }
      }
    }

    const createData: CreateProgramInput = {
      name: data.name.trim(),
      assetName: data.assetName?.trim(),
      enabled: data.enabled,
      transferRatios:
        data.transferRatios?.map((ratio) => ({
          creditCardId: ratio.creditCardId,
          ratio: Number(ratio.ratio),
        })) || [],
    };

    return this.programRepository.create(createData, userId);
  }

  async updateProgram(id: string, data: UpdateProgramInput, userId: string) {
    if (!data.name?.trim()) {
      throw new Error('Program name is required');
    }

    if (data.transferRatios && data.transferRatios.length > 0) {
      for (const ratio of data.transferRatios) {
        if (!ratio.creditCardId) {
          throw new Error('Credit card is required for transfer ratio');
        }
        if (ratio.ratio <= 0 || ratio.ratio > 5) {
          throw new Error('Transfer ratio must be between 0.1 and 5');
        }
      }
    }

    const updateData: UpdateProgramInput = {
      name: data.name.trim(),
      assetName: data.assetName?.trim() || undefined,
      enabled: data.enabled,
      transferRatios:
        data.transferRatios?.map((ratio) => ({
          programId: id,
          ratio: Number(ratio.ratio),
          creditCardId: ratio.creditCardId,
        })) || [],
    };

    return this.programRepository.update(id, updateData, userId);
  }

  async deleteProgram(id: string) {
    return this.programRepository.delete(id);
  }

  async toggleProgramEnabled(id: string, enabled: boolean, userId: string) {
    return this.programRepository.toggleEnabled(id, enabled, userId);
  }

  async getProgramStats() {
    return this.programRepository.getStats();
  }
}
