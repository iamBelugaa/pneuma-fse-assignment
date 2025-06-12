import { CreditCard } from '@/generated/prisma';
import { IProgramWithRatios } from '@/types/program';

interface IProps {
  totalPrograms: number;
  creditCards: CreditCard[];
  programs: IProgramWithRatios[];
}

export function DashboardStats({
  programs,
  creditCards,
  totalPrograms,
}: IProps) {
  const enabledPrograms = programs.filter((p) => p.enabled).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border p-6">
        <div className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Total Programs</p>
            <p className="text-2xl font-bold">{totalPrograms}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Enabled Programs</p>
            <p className="text-2xl font-bold text-green-600">
              {enabledPrograms}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Credit Card Partners
            </p>
            <p className="text-2xl font-bold">{creditCards.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
