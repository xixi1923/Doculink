import { useState } from 'react'
import { FileText, Eye, Download, ThumbsUp, MessageSquare, MoreVertical, Edit3, Trash2, BarChart2 } from 'lucide-react'

const TABS = [
  { id: 'published', label: 'Published', count: 8 },
  { id: 'drafts', label: 'Drafts', count: 2 },
  { id: 'pending', label: 'Pending Review', count: 1 },
  { id: 'rejected', label: 'Rejected', count: 0 },
]

const MOCK_DOCS = [
  {
    id: 1,
    title: 'Grade 12 Physics - All Formulas Summary',
    category: 'Summaries',
    uploadDate: 'Oct 12, 2023',
    views: 1240,
    downloads: 450,
    likes: 85,
    comments: 12,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1636466484294-28c2404ef79e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    title: 'Chemistry National Exam Preparation 2024',
    category: 'Exam Prep',
    uploadDate: 'Nov 05, 2023',
    views: 850,
    downloads: 120,
    likes: 42,
    comments: 5,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1603126010784-996373295283?auto=format&fit=crop&q=80&w=200'
  }
]

export default function MyDocuments() {
  const [activeTab, setActiveTab] = useState('published')

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 mt-1">Manage and track the performance of your shared content.</p>
        </div>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          Upload New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 mb-8 overflow-x-auto pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {MOCK_DOCS.length > 0 ? (
          MOCK_DOCS.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/5 rounded-md">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">Uploaded {doc.uploadDate}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-1">{doc.title}</h3>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} className="text-gray-300" />
                    <span className="text-sm font-semibold">{doc.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download size={16} className="text-gray-300" />
                    <span className="text-sm font-semibold">{doc.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp size={16} className="text-gray-300" />
                    <span className="text-sm font-semibold">{doc.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-gray-300" />
                    <span className="text-sm font-semibold">{doc.comments}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:border-l md:border-gray-50 md:pl-6 w-full md:w-auto">
                <button className="flex-1 md:flex-none p-3 hover:bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all" title="Edit">
                  <Edit3 size={20} />
                </button>
                <button className="flex-1 md:flex-none p-3 hover:bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all" title="Statistics">
                  <BarChart2 size={20} />
                </button>
                <button className="flex-1 md:flex-none p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all" title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-bold">No documents found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
