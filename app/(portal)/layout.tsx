import { Space_Grotesk } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={spaceGrotesk.variable} style={{
      display: 'flex', minHeight: '100vh',
      background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <Sidebar />
      <main style={{ flex: 1, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
