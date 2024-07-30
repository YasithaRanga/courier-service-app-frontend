'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import NavBar from './NavBar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavBar />
      {children}
      <Footer style={{ textAlign: 'center' }}>
        Courier Service App ©{new Date().getFullYear()} Developed by Yasitha
        Ranga
      </Footer>
    </Layout>
  );
}
