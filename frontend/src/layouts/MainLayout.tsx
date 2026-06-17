import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import BottomNav from '../components/BottomNav'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <BottomNav />
    </div>
  )
}
