import {
  Download,
  Share2,
  Eye,
  FileText,
  UserPlus,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Globe,
  Layers,
  ChevronLeft,
  ThumbsUp,
  MessageSquare,
  Send
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_COMMENTS = [
  {
    id: 1,
    user: {
      name: 'Sopheak K.',
      avatar: 'https://i.pravatar.cc/150?u=sopheak',
    },
    text: 'This paper is incredibly helpful for my research on mitochondrial metabolism. The explanation of nanotubes is very clear.',
    time: '2 days ago',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 101,
        user: {
          name: 'Jacques P.',
          avatar: 'https://i.pravatar.cc/150?u=jacques',
        },
        text: 'Glad you found it useful! Feel free to ask if you have any specific questions about the methodology.',
        time: '1 day ago',
        likes: 3,
        isLiked: true,
      }
    ]
  },
  {
    id: 2,
    user: {
      name: 'Vibol R.',
      avatar: 'https://i.pravatar.cc/150?u=vibol',
    },
    text: 'Does anyone have the supplementary data for Figure 3?',
    time: '3 hours ago',
    likes: 0,
    isLiked: false,
    replies: []
  }
]

const RELATED_PAPERS = [
  {
    id: 1,
    title: 'Revisiting concepts of mitochondrial transport and energy metabolism in health and cancer',
    author: 'SALVATORE PASSARELLA',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    title: 'Mitochondrial DNA in Tumor Initiation, Progression, and Metastasis: Role of Horizontal mtDNA Transfer',
    author: 'Michael Berridge',
    image: 'https://images.unsplash.com/photo-1532187875605-2fe358a3d4f2?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    title: 'Somatic alterations in mitochondrial DNA produce changes in cell growth and metabolism supporting a tumorigenic phenotype',
    author: 'Kimberly Norman, Jana Jandova',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=100'
  }
]

const MORE_BY_AUTHOR = [
  { id: 101, title: 'The Level of Major Urinary Proteins is Socially Regulated in Wild Mus...', views: '40', pages: '10' },
  { id: 102, title: 'Toxoplasma gondii decreases the reproductive fitness in mice', views: '39', pages: '11' },
  { id: 103, title: 'Horizontal transfer of whole mitochondria restores tumorigenic...', views: '30', pages: '22' },
  { id: 104, title: 'Complementary roles of mouse lipocalins in chemical communication...', views: '23', pages: '7' },
]

export default function DocumentDetail() {
  const [activeTab, setActiveTab] = useState('original')
  const [isExpanded, setIsExpanded] = useState(false)

  const abstract = `Recently, we showed that generation of tumours in syngeneic mice by cells devoid of mitochondrial (mt) DNA (r 0 cells) is linked to the acquisition of the host mtDNA. However, the mechanism of mtDNA movement between cells remains unresolved. To determine whether the transfer of mtDNA involves whole mitochondria, we injected B16r 0 mouse melanoma cells into syngeneic C57BL/6 mice. After a variable lag period, tumours formed and were found to have acquired mtDNA from the host. We used a variety of approaches, including high-resolution imaging and flow cytometry, to demonstrate that the transfer of mtDNA from host cells to r 0 cells occurs via the formation of tunneling nanotubes. This horizontal transfer of whole mitochondria was found to restore mitochondrial function, including oxidative phosphorylation and tumorigenic potential in the recipient r 0 cells. These findings provide new insights into the role of mitochondrial transfer in cancer progression and suggest that targeting this process could offer new therapeutic opportunities.`

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white leading-tight mb-4">
              Horizontal transfer of whole mitochondria restores tumorigenic potential in mitochondrial DNA-deficient cancer cells
            </h1>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              By <span className="hover:underline cursor-pointer">Pavel Stopka</span> and <span className="hover:underline cursor-pointer">Katerina Dvorakova-Hortova</span>
            </div>

            <div className="flex items-center gap-6 text-[13px] text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1.5"><Eye size={16} /> 30 Views</span>
              <span className="flex items-center gap-1.5"><FileText size={16} /> 22 Pages</span>
              <span className="flex items-center gap-1.5"><Layers size={16} /> 1 File</span>
            </div>

            <div className="text-[13px] text-blue-600 dark:text-blue-400 mb-8 hover:underline cursor-pointer">
              https://doi.org/10.7554/ELIFE.22187.001
            </div>

            <div className="relative mb-10">
              <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {abstract}
              </p>
              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-sm font-bold text-gray-900 dark:text-white hover:underline mt-1"
                >
                  Read more
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <button className="bg-[#1a56db] hover:bg-[#1e429f] text-white px-8 py-3 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors">
                <Download size={18} /> Download PDF
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors">
                <Layers size={18} className="text-yellow-600" /> Download Full PDF Package
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors">
                <Globe size={18} className="text-yellow-600" /> Translate PDF
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded font-bold text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare size={18} className="text-blue-600" /> Discussion
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700 p-3 rounded shadow-sm transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('original')}
                  className={`px-10 py-4 text-sm font-medium border-t-2 border-x-2 rounded-t-lg transition-all ${
                    activeTab === 'original'
                    ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Original PDF <span className="text-[10px] ml-2 font-normal opacity-60">44 minute read</span>
                </button>
                <button
                  onClick={() => setActiveTab('related')}
                  className={`px-10 py-4 text-sm font-medium border-t-2 border-x-2 rounded-t-lg transition-all ${
                    activeTab === 'related'
                    ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Related
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-10 py-4 text-sm font-medium border-t-2 border-x-2 rounded-t-lg transition-all ${
                    activeTab === 'comments'
                    ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Discussion <span className="text-[10px] ml-2 font-normal opacity-60">{MOCK_COMMENTS.length}</span>
                </button>
              </div>
            </div>

            {/* Content Area Based on Tabs */}
            {activeTab === 'comments' ? (
              <div className="space-y-10 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Comment Input */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    SK
                  </div>
                  <div className="flex-grow relative">
                    <textarea
                      placeholder="Share your thoughts or ask a question..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm dark:text-gray-200 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all resize-none min-h-[100px]"
                    />
                    <button className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-8">
                  {MOCK_COMMENTS.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex gap-4">
                        <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{comment.user.name}</h4>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{comment.time}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{comment.text}</p>
                          <div className="flex items-center gap-6">
                            <button className={`flex items-center gap-1.5 text-xs font-bold transition-all ${comment.isLiked ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}>
                              <ThumbsUp size={14} fill={comment.isLiked ? 'currentColor' : 'none'} />
                              {comment.likes > 0 && comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-all">
                              <MessageSquare size={14} /> Reply
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-6 space-y-6 pl-6 border-l-2 border-gray-50 dark:border-gray-800">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-4">
                                  <img src={reply.user.avatar} alt={reply.user.name} className="w-8 h-8 rounded-full" />
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{reply.user.name}</h4>
                                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{reply.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{reply.text}</p>
                                    <div className="flex items-center gap-6">
                                      <button className={`flex items-center gap-1.5 text-xs font-bold transition-all ${reply.isLiked ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary'}`}>
                                        <ThumbsUp size={12} fill={reply.isLiked ? 'currentColor' : 'none'} />
                                        {reply.likes > 0 && reply.likes} Like
                                      </button>
                                      <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-all">
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'original' ? (
              /* PDF Preview Mock */
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-10 min-h-[800px] shadow-inner mb-16">
                 <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-2xl p-12 min-h-[600px]">
                    <div className="flex justify-between items-start mb-12">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">e</div>
                          <div>
                             <p className="font-bold text-2xl tracking-tighter dark:text-white">eLIFE</p>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500">elifesciences.org</p>
                          </div>
                       </div>
                       <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
                          RESEARCH ARTICLE
                       </div>
                    </div>

                    <h2 className="text-3xl font-bold text-[#002b5c] dark:text-blue-300 leading-tight mb-8">
                      Horizontal transfer of whole mitochondria restores tumorigenic potential in mitochondrial DNA-deficient cancer cells
                    </h2>

                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-12">
                      Lan-Feng Dong*, Jaromira Kovarova*, Martina Bajzikova*, ...
                    </p>

                    <div className="space-y-4 opacity-40">
                       <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                       <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                       <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                       <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                       <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400 dark:text-gray-600">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>Related content and citations would appear here.</p>
              </div>
            )}

            {/* More Papers by Author Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
               <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-8">More Papers by Pavel Stopka</h3>
               <div className="relative group">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {MORE_BY_AUTHOR.map(paper => (
                      <div key={paper.id} className="space-y-3">
                        <div className="aspect-[3/4] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded p-4 flex flex-col justify-center items-center hover:shadow-md dark:hover:shadow-gray-800/50 transition-shadow cursor-pointer">
                           <FileText size={48} className="text-gray-100 dark:text-gray-800" />
                        </div>
                        <h4 className="text-[13px] font-medium text-blue-600 dark:text-blue-400 leading-snug line-clamp-3 hover:underline cursor-pointer">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Pavel Stopka</p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                           <span className="flex items-center gap-1"><Eye size={12} /> {paper.views} views</span>
                           <span className="flex items-center gap-1"><FileText size={12} /> {paper.pages} pages</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="absolute -left-5 top-1/3 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="absolute -right-5 top-1/3 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </button>
               </div>
            </div>

            {/* Premium Membership Banner */}
            <div className="mt-16 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <span className="bg-yellow-400 text-[10px] font-black uppercase px-2 py-0.5 rounded text-white tracking-widest">Premium List</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Because You Read "Self-Regulation: Calm, Alert, and Learning"</p>
               </div>
               <div className="flex items-center gap-6">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Premium members get full access to lists across all of Academia.edu</p>
                  <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Upgrade Now</button>
               </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 border-l border-gray-100 dark:border-gray-800 pl-10">
            <div className="sticky top-24 space-y-12">

              {/* About Authors */}
              <section>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">About the authors</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <img src="https://i.pravatar.cc/150?u=pavel" className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm" alt="Pavel" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-[15px] hover:underline cursor-pointer">Pavel Stopka</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Charles University, Prague, Faculty Member</p>
                      <div className="flex items-center gap-4 mt-3">
                         <button className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"><UserPlus size={14} /> Follow</button>
                         <button className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"><Mail size={14} /> Message</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600">
                       <UserPlus size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-[15px] hover:underline cursor-pointer">Katerina Dvorakova-Hortova</h4>
                      <div className="flex items-center gap-4 mt-3">
                         <button className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"><UserPlus size={14} /> Follow</button>
                         <button className="text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"><Mail size={14} /> Message</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related Papers */}
              <section>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Related papers</h3>
                <div className="space-y-8">
                  {RELATED_PAPERS.map(paper => (
                    <div key={paper.id} className="flex gap-4 group">
                      <div className="flex-grow">
                        <h4 className="text-[13px] font-medium text-gray-900 dark:text-gray-200 leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer line-clamp-3">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-3">{paper.author}</p>
                        <div className="flex items-center gap-4">
                           <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"><Download size={12} /> Download</button>
                           <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">More options</button>
                        </div>
                      </div>
                      <div className="w-16 h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded overflow-hidden flex-shrink-0 shadow-sm">
                         <img src={paper.image} className="w-full h-full object-cover opacity-80" alt="Paper" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Links (Academia style) */}
              <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/jobs" className="hover:underline">Jobs</Link>
                    <Link to="/blog" className="hover:underline">Blog</Link>
                    <Link to="/terms" className="hover:underline">Terms</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/copyright" className="hover:underline">Copyright</Link>
                    <Link to="/contact" className="hover:underline">We're Hiring!</Link>
                 </div>
                 <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-4">© 2024 DocuLink</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
