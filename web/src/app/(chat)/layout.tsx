import { ReactNode } from 'react';


export default async function ChatLayout({ children }: {
  children: ReactNode;
}) {
  return (
    <>{children}</>
  );
}
