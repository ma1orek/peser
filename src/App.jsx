import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import SystemPeser from './pages/SystemPeser'
import Rejestr from './pages/Rejestr'
import RobotDetail from './pages/RobotDetail'
import CyfrowaTozsamosc from './pages/CyfrowaTozsamosc'
import Certyfikacja from './pages/Certyfikacja'
import Klasyfikacja from './pages/Klasyfikacja'
import Transparentnosc from './pages/Transparentnosc'
import PanelRejestracji from './pages/PanelRejestracji'
import DlaInwestorow from './pages/DlaInwestorow'
import KontaktApi from './pages/KontaktApi'

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/system" element={<SystemPeser />} />
          <Route path="/rejestr" element={<Rejestr />} />
          <Route path="/rejestr/:id" element={<RobotDetail />} />
          <Route path="/tozsamosc" element={<CyfrowaTozsamosc />} />
          <Route path="/certyfikacja" element={<Certyfikacja />} />
          <Route path="/klasyfikacja" element={<Klasyfikacja />} />
          <Route path="/transparentnosc" element={<Transparentnosc />} />
          <Route path="/rejestracja" element={<PanelRejestracji />} />
          <Route path="/inwestorzy" element={<DlaInwestorow />} />
          <Route path="/kontakt" element={<KontaktApi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
