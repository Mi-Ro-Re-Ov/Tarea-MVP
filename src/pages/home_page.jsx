import React from 'react'
import { Link } from 'react-router-dom'

import Icono from '../components/icono'
import { Estado } from '../components/ui'
import { useCuenta } from '../context/cuenta_context'
import { BENEFICIOS, ESTUDIANTE, HOY } from '../data/datos'
import { clp, fecha, fechaLarga } from '../utils/formato'

const mesActual = HOY.slice(0, 7)

// Accesos por pregunta: el usuario llega con una necesidad puntual
const PREGUNTAS = [
  { texto: '¿Llegó mi beca o mi CAE?', ruta: '/beneficios', seccion: 'beneficios', icono: 'beneficio' },
  { texto: '¿Cuánto pagué el semestre pasado?', ruta: '/historial', seccion: 'historial', icono: 'historial' },
  { texto: '¿Qué me cobraron y qué he pagado?', ruta: '/movimientos', seccion: 'movimientos', icono: 'lista' },
  { texto: 'Quiero pagar una cuota', ruta: '/pagar', seccion: 'pagar', icono: 'pagar' },
  { texto: 'Cambiar mi cuenta para depósitos', ruta: '/cuenta-bancaria', seccion: 'banco', icono: 'banco' }
]

export const HomePage = () => {
  const { saldoActual, proximaCuota, pendientes, notificaciones } = useCuenta()

  const beneficiosDelMes = BENEFICIOS.map((b) => {
    const pago = b.pagos.find((p) => p.fecha.slice(0, 7) === mesActual && p.estado === 'recibido') ||
      b.pagos.find((p) => p.estado === 'recibido')
    return { ...b, ultimo: pago }
  })

  return (
    <div className='pagina'>
      <section className='saludo'>
        <h1 className='saludo__titulo'>Hola, {ESTUDIANTE.nombre} 👋</h1>
        <p className='saludo__fecha'>Tu situación al {fechaLarga(HOY)}</p>
      </section>

      <div className='grilla grilla--2'>
        <section className='tarjeta tarjeta--pagar'>
          <h2 className='tarjeta__titulo'><Icono nombre='pagar' /> Lo que debes hoy</h2>
          {pendientes.length > 0
            ? (
              <>
                <p className='cifra'>{clp(saldoActual)}</p>
                <p className='tarjeta__texto'>
                  {pendientes.length} cuota{pendientes.length > 1 ? 's' : ''} por pagar.
                  Próxima: <strong>{clp(proximaCuota.monto)}</strong> vence el <strong>{fecha(proximaCuota.vence)}</strong>.
                </p>
                <Estado estado='pendiente' texto='Al día, sin cuotas vencidas' />
                <div className='tarjeta__acciones'>
                  <Link to='/pagar' className='boton boton--primario'>Pagar cuotas</Link>
                  <Link to='/movimientos' className='boton boton--secundario'>Ver detalle</Link>
                </div>
              </>
              )
            : (
              <>
                <p className='cifra cifra--ok'>$0</p>
                <p className='tarjeta__texto'>No tienes cuotas pendientes este semestre. 🎉</p>
                <div className='tarjeta__acciones'>
                  <Link to='/movimientos' className='boton boton--secundario'>Ver mis movimientos</Link>
                </div>
              </>
              )}
        </section>

        <section className='tarjeta tarjeta--beneficios'>
          <h2 className='tarjeta__titulo'><Icono nombre='beneficio' /> Tus beneficios</h2>
          <p className='tarjeta__resumen'>
            <Icono nombre='check' tamano={18} /> Todo llegó: tus {BENEFICIOS.length} beneficios están al día
          </p>
          <ul className='mini-lista'>
            {beneficiosDelMes.map((b) => (
              <li key={b.id} className='mini-lista__item'>
                <span>
                  <strong>{b.corto}</strong>
                  <span className='mini-lista__sub'>{clp(b.ultimo.monto)} · {fecha(b.ultimo.fecha)}</span>
                </span>
                <Estado estado='recibido' />
              </li>
            ))}
          </ul>
          <div className='tarjeta__acciones'>
            <Link to='/beneficios' className='boton boton--secundario'>Ver todos mis beneficios</Link>
          </div>
        </section>
      </div>

      <section className='seccion'>
        <h2 className='seccion__titulo'>¿Qué necesitas hacer?</h2>
        <div className='preguntas'>
          {PREGUNTAS.map((p) => (
            <Link key={p.ruta} to={p.ruta} className={`pregunta pregunta--${p.seccion}`}>
              <span className='pregunta__icono'><Icono nombre={p.icono} /></span>
              <span className='pregunta__texto'>{p.texto}</span>
              <Icono nombre='flecha' className='pregunta__flecha' />
            </Link>
          ))}
        </div>
      </section>

      <section className='seccion'>
        <h2 className='seccion__titulo'>Novedades recientes</h2>
        <ul className='novedades'>
          {notificaciones.slice(0, 3).map((n) => (
            <li key={n.id}>
              <Link to={n.ruta} className='novedades__item'>
                <span className={`notificaciones__punto notificaciones__punto--${n.tipo}`} />
                <span className='novedades__texto'>{n.texto}</span>
                <span className='novedades__fecha'>{fecha(n.fecha)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default HomePage
