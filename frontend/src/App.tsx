import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from './store/authStore'
import { auth } from './firebase'
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

function App() {
  const token = useAuthStore((state) => state.token)
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        setAuth(
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          token,
        )
      } else {
        logout()
      }
    })

    return unsubscribe
  }, [logout, setAuth])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={token ? <Home /> : <Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="books/:id/read" element={<BookReader />} />
        <Route path="universities" element={<Universities />} />
        <Route path="universities/:id" element={<UniversityDetail />} />
        <Route path="trending" element={<Trending />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/settings" element={<Settings />} />
        <Route path="profile/documents" element={<MyDocuments />} />
        <Route path="articles/create" element={<CreateArticle />} />
        <Route path="community/ask" element={<AskQuestion />} />
        <Route path="documents/:id" element={<DocumentDetail />} />
        <Route path="messages" element={<Messages />} />
        <Route path="upload" element={<UploadDocument />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile/:id" element={<PublicProfile />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="request-book" element={<RequestBook />} />
      </Route>
    </Routes>
  )
}

export default App
