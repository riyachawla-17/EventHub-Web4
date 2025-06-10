import './globals.css';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'EventHub',
  description: 'Book your next event experience',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}