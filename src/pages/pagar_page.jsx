import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Icono from '../components/icono'
import Tooltip from '../components/tooltip'
import { EncabezadoPagina, Estado } from '../components/ui'
import { useCuenta } from '../context/cuenta_context'
import { ARANCEL_SEMESTRE, CAE_SEMESTRE } from '../data/datos'
import { clp, fecha } from '../utils/formato'

export const PagarPage = () => {
  const { cuotas, pendientes } = useCuenta()
  const navegar = useNavigate()
  const [seleccion, setSeleccion] = useState(pendientes.length ? [pendientes[0].id] : [])

  const alternar = (id) => {
    setSeleccion(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id])
  }
  const total = cuotas.filter((c) => seleccion.includes(c.id)).reduce((s, c) => s + c.monto, 0)
  const todas = pendientes.length > 0 && seleccion.length === pendientes.length

  return (
    <div className='pagina pagina--con-barra'>
      <EncabezadoPagina
        seccion='pagar'
        icono='pagar'
        titulo='Pagar cuotas'
        nombreAnterior='Pago en Línea'
        subtitulo='Marca las cuotas que quieres pagar. El total se calcula solo.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Pagar cuotas' }]}
      />

      <section className='tarjeta tarjeta--plano'>
        <h2 className='tarjeta__titulo'>Arancel 2° Semestre 2026</h2>
        <p className='tarjeta__texto'>
          Tu arancel es de {clp(ARANCEL_SEMESTRE)}. Tu CAE ya pagó {clp(CAE_SEMESTRE)}, así que te quedan{' '}
          <strong>{clp(ARANCEL_SEMESTRE - CAE_SEMESTRE)}</strong> en 5 cuotas de {clp(cuotas[0].monto)}.{' '}
          <Link to='/beneficios' className='enlace'>Ver mi CAE</Link>
        </p>
      </section>

      {pendientes.length === 0 && (
        <div className='aviso aviso--ok'>
          <Icono nombre='check' />
          <p><strong>¡Estás al día!</strong> No tienes cuotas pendientes este semestre.</p>
        </div>
      )}

      {pendientes.length > 1 && (
        <div className='seleccion-rapida'>
          <button type='button' className='enlace-boton' onClick={() => setSeleccion(todas ? [] : pendientes.map((c) => c.id))}>
            {todas ? 'Quitar todas' : 'Marcar todas las pendientes'}
          </button>
        </div>
      )}

      <ul className='cuotas'>
        {cuotas.map((c) => (
          <li key={c.id}>
            {c.pagada
              ? (
                <div className='cuota cuota--pagada'>
                  <span className='cuota__check cuota__check--pagada'><Icono nombre='check' tamano={18} /></span>
                  <span className='cuota__info'>
                    <strong>Cuota {c.numero} de 5</strong>
                    <span className='cuota__sub'>Vencía el {fecha(c.vence)}{c.recibo ? ` · Comprobante ${c.recibo}` : ''}</span>
                  </span>
                  <span className='cuota__derecha'>
                    <span className='cuota__monto'>{clp(c.monto)}</span>
                    <Estado estado='pagada' />
                  </span>
                </div>
                )
              : (
                <label className={`cuota ${seleccion.includes(c.id) ? 'cuota--marcada' : ''}`}>
                  <input type='checkbox' className='cuota__input' checked={seleccion.includes(c.id)} onChange={() => alternar(c.id)} />
                  <span className='cuota__check'><Icono nombre='check' tamano={18} /></span>
                  <span className='cuota__info'>
                    <strong>Cuota {c.numero} de 5</strong>
                    <span className='cuota__sub'>Vence el {fecha(c.vence)} · Sin intereses</span>
                  </span>
                  <span className='cuota__derecha'>
                    <span className='cuota__monto'>{clp(c.monto)}</span>
                    <Estado estado='pendiente' />
                  </span>
                </label>
                )}
          </li>
        ))}
      </ul>

      <div className='barra-total' aria-live='polite'>
        <div className='barra-total__contenido'>
          <div>
            <span className='barra-total__etiqueta'>
              <Tooltip termino='total'>Vas a pagar</Tooltip>
            </span>
            <strong className='barra-total__monto'>{clp(total)}</strong>
            <span className='barra-total__sub'>{seleccion.length} cuota{seleccion.length === 1 ? '' : 's'} seleccionada{seleccion.length === 1 ? '' : 's'}</span>
          </div>
          <button
            type='button'
            className='boton boton--primario'
            disabled={total === 0}
            onClick={() => navegar('/pagar/confirmar', { state: { seleccion } })}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PagarPage
