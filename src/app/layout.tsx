import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Wrapper from '@/components/Wrapper'
import { Toaster } from 'sonner'
import Sidebar from '@/components/Sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'T-BRITE',
  description:
    'Technology-Based Reading for Innovative Teaching and Engagement',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'T-BRITE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster visibleToasts={1} />

        <Wrapper>
          {/* <Navbar /> */}
          {/* <Sidebar /> */}
          <main className="transition-all duration-300">{children}</main>
        </Wrapper>
      </body>
    </html>
  )
}
