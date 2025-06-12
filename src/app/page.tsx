import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProgramsDashboard } from '@/components/programs/dashboard';
import SignoutButton from '@/components/ui/signout-button';
import { authOptions } from '@/lib/auth';
import { ProgramQueryInput } from '@/lib/schemas';
import { creditCardService } from '@/services';
import { IProgramWithRatios } from '@/types/program';
import { ApiStatus, PaginationMeta } from '@/types/response';

const initialQuery: ProgramQueryInput = {
  page: 0,
  pageSize: 10,
};

const dummyResponse: {
  pagination: PaginationMeta;
  programs: IProgramWithRatios[];
} = {
  programs: [],
  pagination: { page: 0, total: 0, pageSize: 10, totalPages: 0 },
};

const fetchInitialPrograms = async (
  query: ProgramQueryInput
): Promise<typeof dummyResponse> => {
  try {
    const headersList = await headers();

    const host = headersList.get('host');
    const cookie = headersList.get('cookie') || '';

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const searchParams = new URLSearchParams();
    searchParams.set('page', query.page.toString());
    searchParams.set('pageSize', query.pageSize.toString());

    const response = await fetch(
      `${baseUrl}/api/programs?${searchParams.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: cookie,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return dummyResponse;
    const result = await response.json();

    if (result.status !== ApiStatus.OK) return dummyResponse;
    return result.data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    return dummyResponse;
  }
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');

  const [programsResult, creditCards] = await Promise.all([
    fetchInitialPrograms(initialQuery),
    creditCardService.findAll({ archived: false }),
  ]);

  return (
    <section className="min-h-screen bg-background">
      <header className="border-b flex h-16 items-center px-5 md:px-8">
        <div className="flex space-x-4 sm:flex-row flex-col">
          <h1 className="text-base sm:text-xl font-semibold truncate">
            Pneuma FFP Portal
          </h1>
          <p className="sm:hidden text-sm text-muted-foreground">
            Welcome, {session.user?.name || session.user?.email}
          </p>
        </div>
        <div className="ml-auto flex items-center space-x-3 sm:space-x-4">
          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome, {session.user?.name || session.user?.email}
          </p>
          <SignoutButton />
        </div>
      </header>
      <main className="flex-1 space-y-4 px-5 md:px-8 pt-6">
        <ProgramsDashboard
          creditCards={creditCards}
          initialQuery={initialQuery}
          pagination={programsResult.pagination}
          initialPrograms={programsResult.programs}
        />
      </main>
    </section>
  );
}
