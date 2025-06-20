import './globals.css';
import type { Metadata } from 'next';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from '../context/AuthContext';

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
        <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
