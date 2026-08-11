import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cursor } from './components/Cursor';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { MemberDashboard } from './pages/MemberDashboard';
import { HelperDashboard } from './pages/HelperDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { HowItWorks3D } from './pages/HowItWorks3D';

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
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
    </BrowserRouter>
  );
}
