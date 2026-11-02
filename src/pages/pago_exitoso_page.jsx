import React from 'react'
import { Link, Navigate } from 'react-router-dom'

import Icono from '../components/icono'
import { useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE } from '../data/datos'
import { clp, descargarArchivo, fecha } from '../utils/formato'

export const PagoExitosoPage = () => {
  const { ultimoPago, saldoActual, proximaCuota } = useCuenta()
  if (!ultimoPago) return <Navigate to='/pagar' replace />
  const { recibo, total, cuotas, medio } = ultimoPago

  const descargar = () => {
    descargarArchivo(`comprobante-${recibo}.txt`, [
      'UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA — Comprobante de pago (MVP, datos simulados)',
      '',
      `Comprobante N°: ${recibo}`,
      `Fecha: ${fecha(ultimoPago.fecha)}`,
      `Estudiante: ${ESTUDIANTE.nombreCompleto} · RUT ${ESTUDIANTE.rut}`,
      ...cuotas.map((c) => `Cuota ${c.numero} de 5 (vence ${fecha(c.vence)}): ${clp(c.monto)}`),
      `Medio de pago: ${medio}`,
      `TOTAL PAGADO: ${clp(total)}`
    ].join('\n'))
  }

  return (
    <div className='pagina'>
      <ol className='pasos-pago' aria-label='Pasos del pago'>
        <li className='pasos-pago__paso pasos-pago__paso--hecho'>1. Elegir cuotas</li>
        <li className='pasos-pago__paso pasos-pago__paso--hecho'>2. Confirmar</li>
        <li className='pasos-pago__paso pasos-pago__paso--actual'>3. Listo</li>
      </ol>

      <section className='exito'>
        <span className='exito__icono'><Icono nombre='check' tamano={44} /></span>
        <h1 className='exito__titulo'>¡Pago realizado!</h1>
        <p className='exito__monto'>{clp(total)}</p>
        <p className='exito__texto'>Ya está reflejado en tu cuenta. No necesitas esperar el correo de confirmación.</p>

        <dl className='desglose desglose--centrado'>
          <div className='desglose__fila'><dt>N° de comprobante</dt><dd>{recibo}</dd></div>
          <div className='desglose__fila'><dt>Fecha</dt><dd>{fecha(ultimoPago.fecha)}</dd></div>
          <div className='desglose__fila'><dt>Pagaste</dt><dd>{cuotas.map((c) => `Cuota ${c.numero}`).join(' y ')}</dd></div>
          <div className='desglose__fila'><dt>Medio</dt><dd>{medio}</dd></div>
          <div className='desglose__fila desglose__fila--total'>
            <dt>Ahora debes</dt>
            <dd>{clp(saldoActual)}</dd>
          </div>
        </dl>
        {proximaCuota
          ? <p className='nota'>Tu próxima cuota ({clp(proximaCuota.monto)}) vence el {fecha(proximaCuota.vence)}.</p>
          : <p className='nota'>🎉 Pagaste todo el arancel del semestre.</p>}

        <div className='exito__acciones'>
          <button type='button' className='boton boton--secundario' onClick={descargar}>
            <Icono nombre='descargar' tamano={18} /> Descargar comprobante
          </button>
          <Link to='/movimientos' className='boton boton--secundario'>Verlo en mis movimientos</Link>
          <Link to='/inicio' className='boton boton--primario'>Volver al inicio</Link>
        </div>
      </section>
    </div>
  )
}

export default PagoExitosoPage
