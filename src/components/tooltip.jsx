import React, { useEffect, useId, useRef, useState } from 'react'

import Icono from './icono'
import { GLOSARIO } from '../data/datos'

// Tooltip accesible: se abre al tocar (móvil) o al pasar el mouse (escritorio)
export const Tooltip = ({ termino, texto, titulo, children }) => {
  const entrada = termino ? GLOSARIO[termino] : null
  const contenido = texto || entrada.definicion
  const encabezado = titulo || (entrada && `${entrada.termino} = ${entrada.simple.toLowerCase()}`)
  const [abierto, setAbierto] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const boton = useRef(null)
  const hover = useRef(false)
  const id = useId()

  const ubicar = () => {
    const r = boton.current.getBoundingClientRect()
    const ancho = Math.min(260, window.innerWidth - 24)
    const left = Math.max(12, Math.min(r.left + r.width / 2 - ancho / 2, window.innerWidth - ancho - 12))
    setPos({ top: r.bottom + 8, left, ancho })
  }

  const abrir = () => { ubicar(); setAbierto(true) }

  useEffect(() => {
    if (!abierto) return
    const cerrar = (e) => { if (!boton.current?.contains(e.target)) setAbierto(false) }
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(false) }
    const scroll = () => ubicar()
    document.addEventListener('mousedown', cerrar)
    document.addEventListener('touchstart', cerrar)
    document.addEventListener('keydown', tecla)
    window.addEventListener('scroll', scroll, true)
    return () => {
      document.removeEventListener('mousedown', cerrar)
      document.removeEventListener('touchstart', cerrar)
      document.removeEventListener('keydown', tecla)
      window.removeEventListener('scroll', scroll, true)
    }
  }, [abierto])

  return (
    <span className='tooltip'>
      {children}
      <button
        ref={boton}
        type='button'
        className='tooltip__boton'
        aria-label={`¿Qué significa ${entrada ? entrada.termino : titulo}?`}
        aria-describedby={abierto ? id : undefined}
        aria-expanded={abierto}
        onClick={(e) => { e.stopPropagation(); if (!abierto) abrir(); else if (!hover.current) setAbierto(false) }}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') { hover.current = true; abrir() } }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') { hover.current = false; setAbierto(false) } }}
      >
        <Icono nombre='info' tamano={15} />
      </button>
      {abierto && (
        <span
          id={id}
          role='tooltip'
          className='tooltip__burbuja'
          style={{ top: pos.top, left: pos.left, width: pos.ancho }}
        >
          {encabezado && <strong className='tooltip__titulo'>{encabezado}</strong>}
          {contenido}
        </span>
      )}
    </span>
  )
}

export default Tooltip
