import { ReactNode } from 'react';

import type { Metadata } from "next";

import RootProvider from '@/providers/root-provider';
import { getServerMode } from '@/utils/cookie';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOps Bot",
  description: "An AI Bot help us with DevOps",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const mode = await getServerMode();

  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProvider initialMode={mode}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
