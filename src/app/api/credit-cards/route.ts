import { getServerSession } from 'next-auth';

import { authOptions, getCurrentUserId } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/response';
import { creditCardService } from '@/services';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = getCurrentUserId(session);
    if (!userId) {
      return ResponseBuilder.error(
        ResponseBuilder.toAppError({ statusCode: 401, message: 'Unauthorized' })
      );
    }

    const creditCards = await creditCardService.findAll();
    return ResponseBuilder.success(200, creditCards);
  } catch (error) {
    console.error('GET /api/credit-cards error:', error);
    return ResponseBuilder.error(
      ResponseBuilder.toAppError({
        statusCode: 500,
        message: 'Failed to fetch credit cards',
      })
    );
  }
}
