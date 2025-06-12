'use client';

import { signOut } from 'next-auth/react';
import { Button } from './button';

const SignoutButton = () => {
  return (
    <Button
      type="submit"
      onClick={async () => await signOut({ redirect: true })}
    >
      Sign Out
    </Button>
  );
};

export default SignoutButton;
