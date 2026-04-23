import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ExpertisePage from './pages/ExpertisePage';
import ProjectsPage from './pages/ProjectsPage';
import PricingPage from './pages/PricingPage';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';
import { useLocation } from 'react-router-dom';

import LoadingScreen from './components/LoadingScreen';

function Layout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  return (
    <div className="font-sans antialiased bg-black text-white selection:bg-[#DAA520] selection:text-black">
      {!isAdminPath && <Navbar />}
      {children}
      {!isAdminPath && <Footer />}
    </div>
  );
}

import { ContentProvider } from './context/ContentContext';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <ContentProvider>
      <BrowserRouter>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/expertise" element={<ExpertisePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ContentProvider>
  );
}

export default App;
