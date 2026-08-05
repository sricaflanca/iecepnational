import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Events from '@/pages/Events';
import MemberSearch from '@/pages/MemberSearch';
import Resolutions from '@/pages/Resolutions';
import IECEPistle from '@/pages/IECEPistle';
import ChapterCorner from '@/pages/ChapterCorner';
import CorporateMembers from '@/pages/CorporateMembers';
import StudentCorner from '@/pages/StudentCorner';
import SocialClubs from '@/pages/SocialClubs';
import SpecializationsCorner from '@/pages/SpecializationsCorner';
import Partners from '@/pages/Partners';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app. This is a public site — only /admin is gated, via
  // ProtectedRoute below, which falls back to AdminLogin when signed out.
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/member-search" element={<MemberSearch />} />
        <Route path="/resolutions" element={<Resolutions />} />
        <Route path="/iecepistle" element={<IECEPistle />} />
        <Route path="/chapter-corner" element={<ChapterCorner />} />
        <Route path="/corporate-members" element={<CorporateMembers />} />
        <Route path="/student-corner" element={<StudentCorner />} />
        <Route path="/social-clubs" element={<SocialClubs />} />
        <Route path="/specializations" element={<SpecializationsCorner />} />
        <Route path="/partners" element={<Partners />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<AdminLogin />} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App