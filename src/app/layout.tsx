import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/app/context/ToastContext';
import { AuthProvider } from '@/app/context/AuthContext';
import MainLayout from './components/MainLayout';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Courier Tracking Apps',
  description: 'Developed by Yasitha Ranga',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
