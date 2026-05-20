import { ReactNode } from 'react';

import ChatBody from '@/components/chat/chat-body';


export default async function ChatLayout({ children }: {
  children: ReactNode;
}) {
  return (
    <ChatBody>{children}</ChatBody>
  );
}
