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
import Search from './pages/Search'
import Universities from './pages/Universities'
import UniversityDetail from './pages/Universities/UniversityDetail'
import Trending from './pages/Trending'
import Profile from './pages/Profile'
import Settings from './pages/Profile/Settings'
import MyDocuments from './pages/Profile/MyDocuments'
import CreateArticle from './pages/Articles/CreateArticle'
import AskQuestion from './pages/Community/AskQuestion'
import DocumentDetail from './pages/DocumentDetail'
import Messages from './pages/Messages'
import Landing from './pages/Landing'
import UploadDocument from './pages/UploadDocument'
import Notifications from './pages/Notifications'
import PublicProfile from './pages/PublicProfile'
import HelpCenter from './pages/Support/HelpCenter'
import ContactUs from './pages/Support/ContactUs'
import TermsOfService from './pages/Legal/TermsOfService'
import PrivacyPolicy from './pages/Legal/PrivacyPolicy'
import RequestBook from './pages/RequestBook'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminUsers from './pages/Admin/Users'
import AdminDocuments from './pages/Admin/Documents'
import AdminCategories from './pages/Admin/Categories'
import AdminProfile from './pages/Admin/Profile'
import AdminSettings from './pages/Admin/Settings'
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

  const adminElement = token ? (
    authReady ? (
      isAdmin ? (
        <AdminLayout />
      ) : (
        <Navigate to="/" replace />
      )
    ) : (
      <div className="min-h-screen flex items-center justify-center">Loading admin...</div>
    )
  ) : (
    <Navigate to="/" replace />
  )

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : token ? <Home /> : <Landing />}
        />
        <Route
          path="login"
          element={token && isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Login />}
        />
        <Route
          path="register"
          element={token && isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Register />}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="books" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Books />} />
        <Route path="books/:id" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <BookDetail />} />
        <Route path="books/:id/read" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <BookReader />} />
        <Route path="universities" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Universities />} />
        <Route path="universities/:id" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <UniversityDetail />} />
        <Route path="trending" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Trending />} />
        <Route path="search" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Search />} />
        <Route path="profile" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Profile />} />
        <Route path="profile/settings" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Settings />} />
        <Route path="profile/documents" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <MyDocuments />} />
        <Route path="articles/create" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <CreateArticle />} />
        <Route path="community/ask" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AskQuestion />} />
        <Route path="documents/:id" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <DocumentDetail />} />
        <Route path="messages" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Messages />} />
        <Route path="upload" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <UploadDocument />} />
        <Route path="notifications" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Notifications />} />
        <Route path="profile/:id" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <PublicProfile />} />
        <Route path="help" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <HelpCenter />} />
        <Route path="contact" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <ContactUs />} />
        <Route path="terms" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <TermsOfService />} />
        <Route path="privacy" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <PrivacyPolicy />} />
        <Route path="request-book" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <RequestBook />} />
      </Route>

      <Route path="admin" element={adminElement}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
