import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './store/useAppStore';
import api from './api/axios';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import SpotDetail from './pages/SpotDetail';
import Cities from './pages/Cities';
import Collection from './pages/Collection';
import Submit from './pages/Submit';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Philosophy from './pages/Philosophy';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Journal from './pages/Journal';
import Help from './pages/Help';
import Map from './pages/Map';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Guides from './pages/Guides';
import GuideDetail from './pages/GuideDetail';
import Stories from './pages/Stories';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { setUser } = useAppStore();

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    // Check if logged in on load
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then((res) => {
          const user = res.data?.data?.user || res.data?.data || res.data?.user || null;
          setUser(user);
        })
        .catch((error) => {
          // Only clear session on actual auth failure; keep token on transient/network errors.
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        });
    }
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/map" element={<Map />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/spot/:id" element={<SpotDetail />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
            <Route path="/philosophy" element={<Philosophy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/help" element={<Help />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experience/:id" element={<ExperienceDetail />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:citySlug" element={<GuideDetail />} />
            <Route path="/stories" element={<Stories />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
