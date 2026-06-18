import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Exlr AI — AKUEB Learning Platform',
  description: 'Pakistan ka smartest AKUEB prep platform. SLO-based notes, past papers 2012–2025, AI doubt solver, and personalised study plans. Free for every student.',
  keywords: ['AKUEB', 'SSC', 'HSSC', 'past papers', 'notes', 'Pakistan', 'exam preparation'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.variable}>
        {children}
      </body>
    </html>
  )
}