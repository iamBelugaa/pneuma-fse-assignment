import {
  CreateTransferRatioInput,
  UpdateTransferRatioInput,
} from '@/lib/schemas';
import { TransferRatioRepository } from '@/repositories/transfer-ratio.repository';

export class TransferRatioService {
  constructor(private transferRatioRepository: TransferRatioRepository) {}

  async getTransferRatioById(id: string) {
    const ratio = await this.transferRatioRepository.findById(id);
    if (!ratio) {
      throw new Error('Transfer ratio not found');
    }
    return ratio;
  }

  async createTransferRatio(data: CreateTransferRatioInput, userId: string) {
    return this.transferRatioRepository.create(data, userId);
  }

  async updateTransferRatio(
    id: string,
    data: UpdateTransferRatioInput,
    userId: string
  ) {
    return this.transferRatioRepository.update(id, data, userId);
  }

  async deleteTransferRatio(id: string): Promise<void> {
    return this.transferRatioRepository.delete(id);
  }

  async archiveTransferRatiosByProgram(
    programId: string,
    userId: string
  ): Promise<number> {
    return this.transferRatioRepository.archiveByProgram(programId, userId);
  }
}
