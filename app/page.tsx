import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Features from '@/components/Features'
import Subjects from '@/components/Subjects'
import HowItWorks from '@/components/HowItWorks'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Subjects />
      <HowItWorks />
      <Contact />
      <Footer />
    </main>
  )
}