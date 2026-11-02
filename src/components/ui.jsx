import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import Icono from './icono'

export const Modal = ({ titulo, abierto, onCerrar, children, acciones }) => {
  useEffect(() => {
    if (!abierto) return
    const tecla = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null
  return (
    <div className='modal' onClick={onCerrar}>
      <div className='modal__caja' role='dialog' aria-modal='true' aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className='modal__cabecera'>
          <h2 className='modal__titulo'>{titulo}</h2>
          <button type='button' className='boton-icono' onClick={onCerrar} aria-label='Cerrar'>
            <Icono nombre='cerrar' />
          </button>
        </div>
        <div className='modal__cuerpo'>{children}</div>
        {acciones && <div className='modal__acciones'>{acciones}</div>}
      </div>
    </div>
  )
}

const ESTADOS = {
  recibido: { texto: 'Recibido', icono: 'check' },
  'en-camino': { texto: 'Programado', icono: 'reloj' },
  atencion: { texto: 'Requiere atención', icono: 'alerta' },
  pagada: { texto: 'Pagada', icono: 'check' },
  pendiente: { texto: 'Pendiente', icono: 'reloj' },
  vencida: { texto: 'Vencida', icono: 'alerta' },
  info: { texto: 'Información', icono: 'info' }
}

export const Estado = ({ estado, texto }) => {
  const e = ESTADOS[estado]
  return (
    <span className={`estado estado--${estado}`}>
      <Icono nombre={e.icono} tamano={14} />
      {texto || e.texto}
    </span>
  )
}

export const TipoChip = ({ tipo, etiqueta }) => (
  <span className={`tipo-chip tipo-chip--${tipo}`}>{etiqueta}</span>
)

// Migas de pan: [{ texto, ruta }]
export const Migas = ({ items }) => (
  <nav className='migas' aria-label='Estás aquí'>
    {items.map((item, i) => (
      <span key={item.texto} className='migas__item'>
        {i > 0 && <Icono nombre='flecha' tamano={14} className='migas__sep' />}
        {item.ruta ? <Link to={item.ruta}>{item.texto}</Link> : <span aria-current='page'>{item.texto}</span>}
      </span>
    ))}
  </nav>
)

// Encabezado de página con color de sección (diferenciación visual, H3)
export const EncabezadoPagina = ({ seccion, icono, titulo, subtitulo, migas, nombreAnterior }) => (
  <header className={`encabezado encabezado--${seccion}`}>
    {migas && <Migas items={migas} />}
    <div className='encabezado__fila'>
      <span className='encabezado__icono'><Icono nombre={icono} tamano={26} /></span>
      <div>
        <h1 className='encabezado__titulo'>{titulo}</h1>
        {nombreAnterior && <p className='encabezado__antes'>Antes se llamaba “{nombreAnterior}”</p>}
      </div>
    </div>
    {subtitulo && <p className='encabezado__subtitulo'>{subtitulo}</p>}
  </header>
)
