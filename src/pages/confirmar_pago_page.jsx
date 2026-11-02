import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import Icono from '../components/icono'
import { EncabezadoPagina } from '../components/ui'
import { useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE } from '../data/datos'
import { clp, fecha } from '../utils/formato'

const MEDIOS = [
  { id: 'credito', nombre: 'Tarjeta de crédito', detalle: 'Hasta 12 cuotas según tu banco', codigo: 'POTC', descripcionOriginal: 'PAGO TARJETA CREDITO', concepto: 'Pago con tarjeta de crédito' },
  { id: 'debito', nombre: 'Tarjeta de débito o prepago', detalle: 'Se descuenta al instante', codigo: 'POTD', descripcionOriginal: 'PAGO TARJETA DEBITO', concepto: 'Pago con tarjeta de débito' },
  { id: 'transferencia', nombre: 'Transferencia bancaria', detalle: 'Desde la web de tu banco', codigo: 'POTB', descripcionOriginal: 'PAGO TRANSFERENCIA', concepto: 'Pago por transferencia' }
]

export const ConfirmarPagoPage = () => {
  const { cuotas, pagar } = useCuenta()
  const { state } = useLocation()
  const navegar = useNavigate()
  const [medio, setMedio] = useState('credito')
  const [procesando, setProcesando] = useState(false)

  const elegidas = cuotas.filter((c) => state?.seleccion?.includes(c.id) && !c.pagada)
  if (!elegidas.length && !procesando) return <Navigate to='/pagar' replace />
  const total = elegidas.reduce((s, c) => s + c.monto, 0)

  const confirmar = () => {
    setProcesando(true)
    setTimeout(() => {
      pagar(elegidas.map((c) => c.id), MEDIOS.find((m) => m.id === medio))
      navegar('/pagar/exito', { replace: true })
    }, 1400)
  }

  return (
    <div className='pagina'>
      <EncabezadoPagina
        seccion='pagar'
        icono='pagar'
        titulo='Revisa y confirma'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Pagar cuotas', ruta: '/pagar' }, { texto: 'Confirmar' }]}
      />

      <ol className='pasos-pago' aria-label='Pasos del pago'>
        <li className='pasos-pago__paso pasos-pago__paso--hecho'>1. Elegir cuotas</li>
        <li className='pasos-pago__paso pasos-pago__paso--actual'>2. Confirmar</li>
        <li className='pasos-pago__paso'>3. Listo</li>
      </ol>

      <section className='tarjeta tarjeta--plano'>
        <h2 className='tarjeta__titulo'>Vas a pagar</h2>
        <dl className='desglose'>
          {elegidas.map((c) => (
            <div key={c.id} className='desglose__fila'>
              <dt>Cuota {c.numero} de 5 · vence {fecha(c.vence)}</dt>
              <dd>{clp(c.monto)}</dd>
            </div>
          ))}
          <div className='desglose__fila desglose__fila--total'><dt>Total</dt><dd>{clp(total)}</dd></div>
        </dl>
        <p className='nota'>A nombre de {ESTUDIANTE.nombreCompleto} · RUT {ESTUDIANTE.rut}</p>
      </section>

      <section className='tarjeta tarjeta--plano'>
        <h2 className='tarjeta__titulo'>¿Cómo quieres pagar?</h2>
        <div className='opciones' role='radiogroup'>
          {MEDIOS.map((m) => (
            <label key={m.id} className={`opcion ${medio === m.id ? 'opcion--activa' : ''}`}>
              <input type='radio' name='medio' value={m.id} checked={medio === m.id} onChange={() => setMedio(m.id)} />
              <span>
                <strong>{m.nombre}</strong>
                <span className='opcion__detalle'>{m.detalle}</span>
              </span>
            </label>
          ))}
        </div>
        <p className='nota'><Icono nombre='candado' tamano={14} /> En el sistema real, aquí te llevaríamos a la pasarela de pago. En este MVP el pago es simulado.</p>
      </section>

      <div className='acciones-fin'>
        <button type='button' className='boton boton--secundario' onClick={() => navegar('/pagar')} disabled={procesando}>
          Volver
        </button>
        <button type='button' className='boton boton--primario' onClick={confirmar} disabled={procesando}>
          {procesando ? <><span className='cargando' /> Procesando pago…</> : `Pagar ${clp(total)}`}
        </button>
      </div>
    </div>
  )
}

export default ConfirmarPagoPage
