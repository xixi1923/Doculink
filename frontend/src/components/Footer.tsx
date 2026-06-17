import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#111827] py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
              DocuLink
            </Link>
            <p className="text-gray-400 text-sm">
              Empowering Cambodian students with shared knowledge and quality study materials.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/documents" className="hover:text-primary transition-colors">Documents</Link></li>
              <li><Link to="/books" className="hover:text-primary transition-colors">Books</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DocuLink. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
