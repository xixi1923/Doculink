import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, X } from 'lucide-react'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth'
import { useAuthStore } from '../store/authStore'
import { auth, googleProvider } from '../firebase'
import { firebaseLogin } from '@/api/authApi'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const user = credential.user

      await updateProfile(user, {
        displayName: name,
      })

      const response = await firebaseLogin({
        email: user.email,
        name: user.displayName || name,
        uid: user.uid,
      })
      setAuth(response.user, response.token)

      navigate(response.user?.role === 'admin' ? '/admin/dashboard' : '/')
    } catch (err: any) {
      console.error('Firebase register error', err)
      const errorMessage = err?.message || err?.code || 'Registration failed.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const response = await firebaseLogin({
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      })
      setAuth(response.user, response.token)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => navigate('/')} />

      {/* Main Card Container - Matched with Login.tsx size and radius */}
      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] max-h-[90vh] relative z-10 animate-in fade-in zoom-in duration-300">

        {/* Left Side: Image Section */}
        <div className="md:w-1/2 relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
            alt="Students studying"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-bold mb-2">Join DocuLink</h2>
            <p className="text-lg opacity-90">Start your educational journey with us.</p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X size={24} />
          </button>

          {/* Tab Header Navigation */}
          <div className="text-center mb-6">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-6">Welcome to DocuLink!</h3>
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full mb-6 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 py-2 px-6 rounded-full text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary transition-all"
              >
                Login
              </button>
              <button type="button" className="flex-1 py-2 px-6 rounded-full bg-primary text-white text-sm font-medium shadow-sm transition-all">
                Register
              </button>
            </div>
          </div>

          <p className="text-gray-400 dark:text-gray-500 text-xs text-center mb-8 leading-relaxed max-w-[300px] mx-auto">
            Create an account to upload documents and save your favorites.
          </p>

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-[350px] mx-auto w-full">

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* Password & Confirm Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-5 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Confirm</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4"
            >
              {loading ? 'Creating account…' : 'Register Account'}
            </button>

            {/* Divider Line */}
            <div className="relative flex items-center justify-center py-2">
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-800 dark:text-white py-3.5 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
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
