import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Footer, Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { ToastProvider } from '@/app/context/ToastContext';
import Link from 'next/link';
import { AuthProvider } from './context/authContext';
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
  const items1: MenuProps['items'] = [
    {
      key: 'home',
      label: <Link href='/'>Home</Link>,
    },
    {
      key: 'login',
      label: <Link href='/login'>Login</Link>,
    },
  ];

  return (
    <ToastProvider>
      <AuthProvider>
        <html lang='en'>
          <body className={inter.className}>
            <Layout style={{ minHeight: '100vh' }}>
              <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Title style={{ margin: 0, color: 'white' }}>
                  Courier Service App
                </Title>
                <Menu
                  theme='dark'
                  mode='horizontal'
                  defaultSelectedKeys={['home']}
                  items={items1}
                  style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
                />
              </Header>

              {children}

              <Footer style={{ textAlign: 'center' }}>
                Courier Service App ©{new Date().getFullYear()} Developed by
                Yasitha Ranga
              </Footer>
            </Layout>
          </body>
        </html>
      </AuthProvider>
    </ToastProvider>
  );
}
