import { UserProvider } from '@/lib/user-provider';
import { getSession } from '@/lib/session';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <UserProvider initialUser={session?.userId}>
      <div className="m-4">{children}</div>
    </UserProvider>
  );
}
