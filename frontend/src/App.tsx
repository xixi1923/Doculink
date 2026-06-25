import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import BookReader from './pages/BookReader'
import SubscriptionVerify from './pages/SubscriptionVerify'
import Search from './pages/Search'
import Universities from './pages/Universities'
import UniversityDetail from './pages/Universities/UniversityDetail'
import MyProfile from './pages/Profile/MyProfile'
import PublicProfile from './pages/Profile/PublicProfile'
import Settings from './pages/Profile/Settings'
import MyDocuments from './pages/Profile/MyDocuments'
import Community from './pages/Community'
import AskQuestion from './pages/Community/AskQuestion'
import QuestionDetail from './pages/Community/QuestionDetail'
import DocumentDetail from './pages/DocumentDetail'
import Trending from './pages/Trending'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Landing from './pages/Landing'
import UploadDocument from './pages/UploadDocument'
import HelpCenter from './pages/Support/HelpCenter'
import ContactUs from './pages/Support/ContactUs'
import TermsOfService from './pages/Legal/TermsOfService'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy'
import { getProfile } from '@/api/authApi'

function App() {
  const { token, user, setAuth, logout } = useAuthStore()
  const [authReady, setAuthReady] = useState(!token || Boolean(user))

  useEffect(() => {
    let isMounted = true

    if (token && (!user || !user.role)) {
      getProfile()
        .then((profile) => {
          if (!isMounted) return
          setAuth(profile, token)
        })
        .catch(() => {
          if (!isMounted) return
          logout()
        })
        .finally(() => {
          if (!isMounted) return
          setAuthReady(true)
        })
    } else {
      setAuthReady(true)
    }

    return () => {
      isMounted = false
    }
  }, [token, user, setAuth, logout])

  const isAdmin = user?.role === 'admin'

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={token ? <Home /> : <Landing />}
        />
        <Route
          path="login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:slug" element={<BookDetail />} />
        <Route path="books/:id/read" element={<BookReader />} />
        <Route path="subscription/verify" element={<SubscriptionVerify />} />
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:id" element={<UniversityDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="trending" element={<Trending />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="user/:id" element={<PublicProfile />} />
        <Route path="profile/:username" element={<PublicProfile />} />
        <Route path="profile/settings" element={<Settings />} />
        <Route path="profile/documents" element={<MyDocuments />} />
        <Route path="community" element={<Community />} />
        <Route path="community/ask" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AskQuestion />} />
        <Route path="community/questions/:slug" element={<QuestionDetail />} />
        <Route path="documents/:id" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <DocumentDetail />} />
        <Route path="upload" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <UploadDocument />} />
        <Route path="help" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <HelpCenter />} />
        <Route path="contact" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <ContactUs />} />
        <Route path="terms" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <TermsOfService />} />
        <Route path="privacy" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <PrivacyPolicy />} />
      </Route>

      {/* Redirect all other /admin routes to the backend admin portal */}
      <Route path="admin/*" element={<div className="min-h-screen flex items-center justify-center">Redirecting to Admin Portal...</div>} />
    </Routes>
  )
}

export default App
