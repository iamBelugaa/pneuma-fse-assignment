import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SigninFormContainer from './form';

const SignInPage = async ({}) => {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <SigninFormContainer />
    </div>
  );
};

export default SignInPage;
