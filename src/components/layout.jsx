import React, { useEffect } from 'react'
import { HashRouter, MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { CuentaProvider } from '../context/cuenta_context'
import Cabecera from './cabecera'
import NavBar from './nav_bar'

import LoginPage from '../pages/login_page'
import HomePage from '../pages/home_page'
import EstadoCuentaPage from '../pages/estado_cuenta_page'
import HistorialPage from '../pages/historial_page'
import MovimientosPage from '../pages/movimientos_page'
import BeneficiosPage from '../pages/beneficios_page'
import PagarPage from '../pages/pagar_page'
import ConfirmarPagoPage from '../pages/confirmar_pago_page'
import PagoExitosoPage from '../pages/pago_exitoso_page'
import CuentaBancariaPage from '../pages/cuenta_bancaria_page'
import AyudaPage from '../pages/ayuda_page'

const Portal = () => {
  const { pathname } = useLocation()

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  if (pathname === '/') return <LoginPage />

  return (
    <div className='layout'>
      <Cabecera />
      <NavBar rutaActual={pathname} />
      <main className='layout__page'>
        <Routes>
          <Route path='/inicio' element={<HomePage />} />
          <Route path='/estado-de-cuenta' element={<EstadoCuentaPage />} />
          <Route path='/historial' element={<HistorialPage />} />
          <Route path='/movimientos' element={<MovimientosPage />} />
          <Route path='/beneficios' element={<BeneficiosPage />} />
          <Route path='/pagar' element={<PagarPage />} />
          <Route path='/pagar/confirmar' element={<ConfirmarPagoPage />} />
          <Route path='/pagar/exito' element={<PagoExitosoPage />} />
          <Route path='/cuenta-bancaria' element={<CuentaBancariaPage />} />
          <Route path='/ayuda' element={<AyudaPage />} />
          <Route path='*' element={<Navigate to='/inicio' replace />} />
        </Routes>
      </main>
      <footer className='layout__pie'>
        MVP académico · Diseño de Interfaces Usuarias USM · Datos simulados al 30 de octubre de 2026
      </footer>
    </div>
  )
}

// HashRouter permite publicar el MVP en GitHub Pages sin configurar el servidor.
// En vistas previas protegidas (iframes sin acceso al historial) se usa MemoryRouter.
const historialDisponible = () => {
  try {
    if (window.location.protocol === 'about:') return false
    window.history.replaceState(window.history.state, '', window.location.href)
    return true
  } catch (e) {
    return false
  }
}

const Router = historialDisponible() ? HashRouter : MemoryRouter

const Layout = () => (
  <CuentaProvider>
    <Router>
      <Portal />
    </Router>
  </CuentaProvider>
)

export default Layout
