import './globals.css';
import Navbar from '../app/components/Navbar';
import Header from '../app/components/Header';
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
        <div className="flex min-h-screen">
          <Navbar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
