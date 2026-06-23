import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, X } from 'lucide-react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useAuthStore } from '../store/authStore'
import { auth, googleProvider } from '../firebase'
import { firebaseLogin } from '@/api/authApi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = credential.user
      const response = await firebaseLogin({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        avatar: user.photoURL,
      })
      setAuth(response.user, response.token)
      navigate(response.user?.role === 'admin' ? '/admin/dashboard' : '/')
    } catch (err: any) {
      console.error('Firebase login error', err)
      const errorMessage = err?.message || err?.code || 'Login failed. Please check your credentials.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      const credential = await signInWithPopup(auth, googleProvider)
      const user = credential.user
      const response = await firebaseLogin({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        avatar: user.photoURL,
      })
      setAuth(response.user, response.token)
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => navigate('/')}
      />

      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] relative z-10 animate-in fade-in zoom-in duration-300">
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

        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <div className="text-center mb-8">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-6">Welcome to DocuLink!</h3>

            <div className="inline-flex bg-[#f3f4f6] dark:bg-gray-800 p-1 rounded-full mb-8 w-full max-w-[280px]">
              <button className="flex-1 py-2 px-6 rounded-full bg-primary text-white text-sm font-medium transition-all">
                Login
              </button>
              <button
                type="button"
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
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
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

            {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-primary font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all mt-4"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-white py-3.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>{loading ? 'Please wait…' : 'Continue with Google'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
