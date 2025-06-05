import './globals.css';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Book your next event experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}