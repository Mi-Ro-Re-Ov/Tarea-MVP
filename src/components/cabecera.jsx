import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Icono from './icono'
import { useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE } from '../data/datos'
import { fecha } from '../utils/formato'

const useClickFuera = (abierto, cerrar) => {
  const ref = useRef(null)
  useEffect(() => {
    if (!abierto) return
    const fn = (e) => { if (!ref.current?.contains(e.target)) cerrar() }
    const tecla = (e) => { if (e.key === 'Escape') cerrar() }
    document.addEventListener('mousedown', fn)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fn)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto, cerrar])
  return ref
}

const Notificaciones = () => {
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas } = useCuenta()
  const [abierto, setAbierto] = useState(false)
  const ref = useClickFuera(abierto, () => setAbierto(false))
  const navegar = useNavigate()

  const abrirNotificacion = (n) => {
    marcarLeida(n.id)
    setAbierto(false)
    navegar(n.ruta)
  }

  return (
    <div className='desplegable' ref={ref}>
      <button
        type='button'
        className='cabecera__boton'
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label={`Notificaciones${noLeidas ? `, ${noLeidas} sin leer` : ''}`}
      >
        <Icono nombre='campana' tamano={22} />
        {noLeidas > 0 && <span className='cabecera__globo'>{noLeidas}</span>}
      </button>
      {abierto && (
        <div className='desplegable__panel desplegable__panel--ancho'>
          <div className='desplegable__cabecera'>
            <strong>Notificaciones</strong>
            {noLeidas > 0 && (
              <button type='button' className='enlace-boton' onClick={marcarTodasLeidas}>Marcar todas como leídas</button>
            )}
          </div>
          <ul className='notificaciones'>
            {notificaciones.map((n) => (
              <li key={n.id}>
                <button
                  type='button'
                  className={`notificaciones__item ${n.leida ? '' : 'notificaciones__item--nueva'}`}
                  onClick={() => abrirNotificacion(n)}
                >
                  <span className={`notificaciones__punto notificaciones__punto--${n.tipo}`} />
                  <span>
                    <span className='notificaciones__texto'>{n.texto}</span>
                    <span className='notificaciones__fecha'>{fecha(n.fecha)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const MenuUsuario = () => {
  const { cerrarSesion } = useCuenta()
  const [abierto, setAbierto] = useState(false)
  const ref = useClickFuera(abierto, () => setAbierto(false))
  const navegar = useNavigate()

  const salir = () => {
    cerrarSesion()
    navegar('/')
  }

  return (
    <div className='desplegable' ref={ref}>
      <button
        type='button'
        className='cabecera__usuario'
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label='Menú de usuario'
      >
        <span className='cabecera__avatar'>AG</span>
        <span className='cabecera__nombre'>{ESTUDIANTE.nombre}</span>
      </button>
      {abierto && (
        <div className='desplegable__panel'>
          <div className='desplegable__perfil'>
            <strong>{ESTUDIANTE.nombreCompleto}</strong>
            <span>Rol {ESTUDIANTE.rol}</span>
            <span>{ESTUDIANTE.carrera}</span>
          </div>
          <Link className='desplegable__opcion' to='/cuenta-bancaria' onClick={() => setAbierto(false)}>
            <Icono nombre='banco' /> Mi cuenta bancaria
          </Link>
          <Link className='desplegable__opcion' to='/ayuda' onClick={() => setAbierto(false)}>
            <Icono nombre='ayuda' /> Ayuda y glosario
          </Link>
          <button type='button' className='desplegable__opcion' onClick={salir}>
            <Icono nombre='salir' /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export const Cabecera = () => (
  <header className='cabecera'>
    <div className='cabecera__contenido'>
      <Link to='/inicio' className='cabecera__marca' aria-label='Ir al inicio'>
        <span className='cabecera__sello'>USM</span>
        <span className='cabecera__marca-texto'>
          <strong>Autoservicio</strong>
          <span>Mis finanzas</span>
        </span>
      </Link>
      <div className='cabecera__acciones'>
        <Link to='/ayuda' className='cabecera__boton cabecera__boton--escritorio' aria-label='Ayuda'>
          <Icono nombre='ayuda' tamano={22} />
        </Link>
        <Notificaciones />
        <MenuUsuario />
      </div>
    </div>
  </header>
)

export default Cabecera
