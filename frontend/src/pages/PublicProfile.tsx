import {
  Plus,
  Mail,
  Play,
  Headphones,
  FileText,
  Eye,
  ChevronRight,
  Monitor
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

const USER_DATA = {
  name: 'Phillip lewis',
  avatar: 'https://i.pravatar.cc/150?u=phillip',
  followers: 18,
  following: 290,
  views: '8,603',
  topPercent: '0.1%',
  bio: 'Curious minds.',
  interests: ['Astrophysics', 'Numerologie', 'Nichiren Buddhism', 'Quantum', 'Philosophy of Cosmology'],
  recentPost: {
    content: 'How Dare you demand, EXPLAIN!, IF YOU DONT UNDERSTAND IT YOU DONT DESRVE IT, I BOW TO NO MAN.',
    time: 'Phillip lewis posted'
  },
  podcasts: [
    {
      id: 1,
      title: 'The Frontiers of Computation: A Unified Synthesis of Theoretical Complexity, Neuromorphic Architecture, and Mathematical Topology',
      duration: '5 min',
      type: 'AI Generated'
    },
    {
      id: 2,
      title: 'Decoding Complexity: The P=NP Mandate and the Frontier of Neuromorphic Intelligence 1. The Central Mystery: The P versus NP Paradigm',
      duration: '5 min',
      type: 'AI Generated'
    }
  ],
  uploads: [
    {
      id: 1,
      title: 'The Frontiers of Computation: A Unified Synthesis of Theoretical Complexity, Neuromorphic Architecture, and Mathematical Topology',
      subtitle: 'Universal Dust Theory P=NP, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=200&h=280'
    }
  ]
}

export default function PublicProfile() {
  const { id } = useParams()
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column - Profile Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl mb-6 ring-1 ring-gray-100 dark:ring-gray-700">
              <img src={USER_DATA.avatar} alt={USER_DATA.name} className="w-full h-full object-cover" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{USER_DATA.name}</h1>

            <div className="flex gap-3 w-full mb-8">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-sm ${
                  isFollowing
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                <Plus size={18} /> {isFollowing ? 'Following' : 'Follow'}
              </button>
              <Link
                to="/messages"
                className="flex-grow flex items-center justify-center gap-2 py-3 border-2 border-primary/20 dark:border-primary/40 text-primary rounded-xl font-bold hover:bg-primary/5 transition-all"
              >
                <Mail size={18} /> Message
              </Link>
            </div>

            <div className="w-full space-y-3 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Followers</span>
                <span className="font-black text-primary">{USER_DATA.followers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Following</span>
                <span className="font-black text-primary">{USER_DATA.following}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Public Views</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-primary">{USER_DATA.views}</span>
                  <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">Top {USER_DATA.topPercent}</span>
                </div>
              </div>
            </div>

            <div className="w-full pt-6 border-t dark:border-gray-800">
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">{USER_DATA.bio}</p>

               <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Interests</h3>
               <div className="flex flex-wrap gap-2 mb-8">
                 {USER_DATA.interests.map(interest => (
                   <span key={interest} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-100 dark:border-gray-700">
                     {interest}
                   </span>
                 ))}
               </div>

               <div className="flex gap-4 text-gray-400">
                 <Monitor size={20} className="hover:text-primary cursor-pointer transition-colors" />
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-8 space-y-10">
          {/* Recent Post */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
             <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{USER_DATA.recentPost.time}</p>
             <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-6">
               {USER_DATA.recentPost.content}
             </p>
             <Link to="#" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
               Show all activity <ChevronRight size={16} />
             </Link>
          </div>

          {/* Podcast Summaries */}
          <section>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              Podcast Summaries
            </h2>
            <div className="space-y-4">
              {USER_DATA.podcasts.map(podcast => (
                <div key={podcast.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 group cursor-pointer hover:border-primary/30 transition-all shadow-sm">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                     {podcast.title}
                   </h3>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-all">
                         <Play size={18} fill="currentColor" className="ml-0.5" />
                       </button>
                       <div className="text-xs">
                         <p className="font-bold text-gray-700 dark:text-gray-300">Listen to Podcast Summary</p>
                         <p className="text-gray-400">Generated with AI • ~{podcast.duration}</p>
                       </div>
                     </div>
                     <div className="text-gray-300 dark:text-gray-600">
                       <Headphones size={20} />
                     </div>
                   </div>
                </div>
              ))}
              <button className="w-full py-4 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                See more
              </button>
            </div>
          </section>

          {/* Uploads */}
          <section>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Uploads</h2>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-widest">Papers by {USER_DATA.name}</p>

            <div className="space-y-6">
              {USER_DATA.uploads.map(upload => (
                <div key={upload.id} className="flex gap-6 group cursor-pointer">
                  <div className="w-24 h-32 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700 flex-shrink-0 shadow-sm">
                    <img src={upload.thumbnail} alt={upload.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <div className="flex-grow py-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                      {upload.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{upload.subtitle}</p>
                    <div className="flex items-center gap-4 text-gray-400 dark:text-gray-600">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <FileText size={14} /> View Paper
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Eye size={14} /> 1.2k views
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
