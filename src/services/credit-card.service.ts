import { CreditCardRepository } from '@/repositories/credit-card.repository';
import { ICreateCreditCardData } from '@/types/card';

export class CreditCardService {
  constructor(private creditCardRepository: CreditCardRepository) {}

  async findAll(
    options: { archived?: boolean; includeTransferRatios?: boolean } = {}
  ) {
    return this.creditCardRepository.findAll(options);
  }

  async findById(id: string) {
    return this.creditCardRepository.findById(id);
  }

  async create(data: ICreateCreditCardData) {
    return this.creditCardRepository.create(data);
  }

  async createMany(cards: ICreateCreditCardData[]) {
    return this.creditCardRepository.createMany(cards);
  }
}
