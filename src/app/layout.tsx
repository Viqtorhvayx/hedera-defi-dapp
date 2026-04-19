import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hedera DeFi Vault by Viqtorhvayx',
  description: 'A state of the art decentralized application for Saving, Lending, and Borrowing on Hedera.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-textPrimary">
        {children}
      </body>
    </html>
  );
}
