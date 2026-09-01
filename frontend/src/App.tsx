import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cursor } from './components/Cursor';
import { IntroSplash } from './components/IntroSplash';
import { Landing } from './pages/Landing';

// Lazy load all pages except Landing (first paint)
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const FamilyDashboard = lazy(() => import('./pages/FamilyDashboard').then(m => ({ default: m.FamilyDashboard })));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const HelperDashboard = lazy(() => import('./pages/HelperDashboard').then(m => ({ default: m.HelperDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const HowItWorks3D = lazy(() => import('./pages/HowItWorks3D').then(m => ({ default: m.HowItWorks3D })));

function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000008' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,107,26,0.2)', borderTopColor: '#FF6B1A', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <IntroSplash />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/family" element={<FamilyDashboard />} />
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/helper" element={<HelperDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/3d" element={<HowItWorks3D />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
