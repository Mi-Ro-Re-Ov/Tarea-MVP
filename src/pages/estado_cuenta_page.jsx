import React from 'react'
import { Link } from 'react-router-dom'

import Icono from '../components/icono'
import { EncabezadoPagina } from '../components/ui'

// H3: cada sección se presenta por la pregunta que responde, con color e ícono propio,
// en vez de nombres parecidos ("Resumen Histórico" vs "Saldos y Movimientos").
const SECCIONES = [
  {
    ruta: '/historial',
    seccion: 'historial',
    icono: 'historial',
    titulo: 'Resumen por semestre',
    antes: 'Resumen Histórico',
    pregunta: '¿Cuánto pagué el semestre pasado?',
    descripcion: 'Totales de cada semestre: cuánto te cobraron, cuánto pagaste tú y cuánto cubrieron tus beneficios.',
    ejemplo: 'Ej: “En el 1° semestre 2026 pagué $2.082.798”'
  },
  {
    ruta: '/movimientos',
    seccion: 'movimientos',
    icono: 'lista',
    titulo: 'Movimientos uno a uno',
    antes: 'Saldos y Movimientos',
    pregunta: '¿Qué me cobraron y cuándo pagué?',
    descripcion: 'Cada cobro, pago, interés y abono con su fecha y número de comprobante.',
    ejemplo: 'Ej: “El 28 oct pagué $389.000, comprobante 842310”'
  },
  {
    ruta: '/beneficios',
    seccion: 'beneficios',
    icono: 'beneficio',
    titulo: 'Becas y beneficios',
    antes: 'Becas y Pagos Recibidos',
    pregunta: '¿Llegó mi beca o mi CAE?',
    descripcion: 'CAE, becas USM y beneficios Mineduc/JUNAEB en un solo panel, con su estado.',
    ejemplo: 'Ej: “Mi ayudantía de octubre llegó el 28 oct”'
  },
  {
    ruta: '/cuenta-bancaria',
    seccion: 'banco',
    icono: 'banco',
    titulo: 'Mi cuenta bancaria',
    antes: 'Cuenta Bancaria',
    pregunta: '¿Dónde me depositan?',
    descripcion: 'La cuenta donde la USM te deposita becas y devoluciones. Puedes cambiarla aquí.',
    ejemplo: 'Ej: “BancoEstado CuentaRUT ···5678”'
  }
]

export const EstadoCuentaPage = () => (
  <div className='pagina'>
    <EncabezadoPagina
      seccion='cuenta'
      icono='cuenta'
      titulo='Mi estado de cuenta'
      subtitulo='Elige según lo que quieres saber.'
      migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Mi estado de cuenta' }]}
    />
    <div className='secciones'>
      {SECCIONES.map((s) => (
        <Link key={s.ruta} to={s.ruta} className={`seccion-tarjeta seccion-tarjeta--${s.seccion}`}>
          <span className='seccion-tarjeta__icono'><Icono nombre={s.icono} tamano={26} /></span>
          <span className='seccion-tarjeta__pregunta'>{s.pregunta}</span>
          <span className='seccion-tarjeta__titulo'>{s.titulo}</span>
          <span className='seccion-tarjeta__descripcion'>{s.descripcion}</span>
          <span className='seccion-tarjeta__ejemplo'>{s.ejemplo}</span>
          <span className='seccion-tarjeta__antes'>Antes: “{s.antes}”</span>
          <span className='seccion-tarjeta__ir'>Entrar <Icono nombre='flecha' tamano={16} /></span>
        </Link>
      ))}
    </div>
  </div>
)

export default EstadoCuentaPage
