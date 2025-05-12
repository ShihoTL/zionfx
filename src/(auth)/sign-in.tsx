import { SignIn } from '@clerk/clerk-react';

export default function SiginInPage() {
  return (
    <main className="flex h-[100dvh] w-full items-center justify-center">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
