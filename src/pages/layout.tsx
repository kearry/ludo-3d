// app/layout.tsx

import { Inter } from 'next/font/google'
//import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {children}
          </main>
      
      </body>
    </html>
  )
}