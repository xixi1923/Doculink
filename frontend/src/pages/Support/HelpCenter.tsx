import { Search, Book, User, Shield, HelpCircle, ArrowRight } from 'lucide-react'

const TOPICS = [
  { icon: User, title: 'Account & Profile', description: 'Manage your personal info and settings.', count: 12 },
  { icon: Book, title: 'Using DocuLink', description: 'How to upload, search, and download papers.', count: 24 },
  { icon: Shield, title: 'Safety & Privacy', description: 'Guidelines for security and data protection.', count: 8 },
  { icon: HelpCircle, title: 'FAQs', description: 'Quick answers to common questions.', count: 15 },
]

export default function HelpCenter() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6">How can we help?</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for articles (e.g. how to upload)"
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Grid Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all group cursor-pointer shadow-sm">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <topic.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{topic.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{topic.count} articles</span>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help? */}
      <div className="bg-primary/5 dark:bg-primary/10 rounded-[40px] p-10 text-center border border-primary/10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Our support team is available to help you with any technical issues or questions.</p>
        <button className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          Contact Support
        </button>
      </div>
    </div>
  )
}
