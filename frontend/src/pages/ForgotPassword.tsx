import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2, X } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic (API call)
    setIsSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => navigate('/')}
      />

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] relative z-10 animate-in fade-in zoom-in duration-300">

        {/* Left Side - Image */}
        <div className="md:w-1/2 relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1454165833767-02a698d1316a?auto=format&fit=crop&q=80&w=1000"
            alt="Study desk"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-bold mb-2">Secure Your Account</h2>
            <p className="text-lg opacity-90">We'll help you get back to learning.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <div className="text-center mb-8">
            <h3 className="text-gray-600 text-sm mb-6">Password Recovery</h3>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          </div>

          {!isSubmitted ? (
            <>
              <p className="text-gray-400 text-xs text-center mb-10 leading-relaxed max-w-[300px] mx-auto">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-[350px] mx-auto w-full">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300"
                    />
                    <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all mt-4">
                  Send Reset Link
                </button>

                <div className="text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-primary font-medium transition-colors">
                    <ArrowLeft size={14} />
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 max-w-[350px] mx-auto">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-800">Check your email</h4>
              <p className="text-gray-500 text-sm">
                We've sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox and spam folder.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-full font-bold text-sm transition-all"
              >
                Try another email
              </button>
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-primary font-medium transition-colors">
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
