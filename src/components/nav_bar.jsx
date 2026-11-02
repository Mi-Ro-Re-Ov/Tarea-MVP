import React from 'react'
import { NavLink } from 'react-router-dom'

import Icono from './icono'
import { useCuenta } from '../context/cuenta_context'

const ENLACES = [
  { ruta: '/inicio', texto: 'Inicio', icono: 'inicio', seccion: 'inicio' },
  { ruta: '/pagar', texto: 'Pagar', icono: 'pagar', seccion: 'pagar' },
  { ruta: '/estado-de-cuenta', texto: 'Mi estado de cuenta', corto: 'Mi cuenta', icono: 'cuenta', seccion: 'cuenta', incluye: ['/historial', '/movimientos', '/cuenta-bancaria'] },
  { ruta: '/beneficios', texto: 'Becas y beneficios', corto: 'Beneficios', icono: 'beneficio', seccion: 'beneficios' }
]

export const NavBar = ({ rutaActual }) => {
  const { pendientes } = useCuenta()

  const clase = (enlace) => ({ isActive }) => {
    const activo = isActive || (enlace.incluye || []).some((r) => rutaActual.startsWith(r))
    return `nav-bar__link nav-bar__link--${enlace.seccion} ${activo ? 'nav-bar__link--activo' : ''}`
  }

  return (
    <nav className='nav-bar' aria-label='Navegación principal'>
      <div className='nav-bar__contenido'>
        {ENLACES.map((e) => (
          <NavLink key={e.ruta} to={e.ruta} className={clase(e)}>
            <span className='nav-bar__icono'>
              <Icono nombre={e.icono} tamano={22} />
              {e.ruta === '/pagar' && pendientes.length > 0 && <span className='nav-bar__globo'>{pendientes.length}</span>}
            </span>
            <span className='nav-bar__texto nav-bar__texto--largo'>{e.texto}</span>
            <span className='nav-bar__texto nav-bar__texto--corto'>{e.corto || e.texto}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
