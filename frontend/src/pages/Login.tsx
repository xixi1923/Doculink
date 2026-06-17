import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated login
    setAuth({ name: 'User', email: email || 'user@example.com' }, 'token')
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => navigate('/')}
      />

      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] relative z-10 animate-in fade-in zoom-in duration-300">

        {/* Left Side - Image */}
        <div className="md:w-1/2 relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000"
            alt="Students in classroom"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-bold mb-2">Share Knowledge</h2>
            <p className="text-lg opacity-90">Grow together with fellow students.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <div className="text-center mb-8">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-6">Welcome to DocuLink!</h3>

            {/* Toggle Switch */}
            <div className="inline-flex bg-[#f3f4f6] dark:bg-gray-800 p-1 rounded-full mb-8 w-full max-w-[280px]">
              <button className="flex-1 py-2 px-6 rounded-full bg-primary text-white text-sm font-medium transition-all">
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 py-2 px-6 rounded-full text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-all"
              >
                Register
              </button>
            </div>
          </div>

          <p className="text-gray-400 dark:text-gray-500 text-xs text-center mb-10 leading-relaxed max-w-[300px] mx-auto">
            Join the largest platform for sharing study materials and exam preparations in Cambodia.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-[350px] mx-auto w-full">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">User name</label>
              <input
                type="text"
                placeholder="Enter your User name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary font-medium">
                Forgot Password?
              </Link>
            </div>

            <button className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
