import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Discover and manage tech events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fffaf6] text-[#3c2a21] min-h-screen font-sans">
        <div className="flex flex-col min-h-screen">
          <header className="px-6 py-4 border-b border-[#e6dcd3] shadow-sm bg-[#f8f1eb]">
            <h1 className="text-2xl font-bold">EventHub</h1>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="text-center py-4 text-sm text-[#9a7862] bg-[#f8f1eb] border-t border-[#e6dcd3]">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
