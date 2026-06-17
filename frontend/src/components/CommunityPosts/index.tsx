import { MessageSquare, ThumbsUp, Share2, Tag as TagIcon } from 'lucide-react'

const POSTS = [
  {
    id: 1,
    user: 'Sokea M.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    content: 'Does anyone have the Grade 12 Mathematics national exam keys for last year? Specifically the calculus section.',
    tags: ['Mathematics', 'Grade 12', 'ExamKeys'],
    likes: 24,
    comments: 8,
    time: '2 hours ago'
  },
  {
    id: 2,
    user: 'Leakena T.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    content: 'Tips for university entrance exams at RUPP: Focus heavily on the logic and general knowledge section, not just your major subjects!',
    tags: ['University', 'RUPP', 'Tips'],
    likes: 56,
    comments: 15,
    time: '5 hours ago'
  }
]

export default function CommunityPosts() {
  return (
    <div className="space-y-6">
      {POSTS.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-4">
            <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-bold text-gray-800 text-sm">{post.user}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.time}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {post.content}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                <TagIcon size={10} />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors">
                <ThumbsUp size={16} />
                {post.likes}
              </button>
              <button className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors">
                <MessageSquare size={16} />
                {post.comments}
              </button>
            </div>
            <button className="hover:text-primary transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-[30px] text-sm font-bold text-gray-400 hover:border-primary hover:text-primary transition-all">
        See all community posts
      </button>
    </div>
  )
}
