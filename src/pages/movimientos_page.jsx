import React, { Fragment, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import Icono from '../components/icono'
import Tooltip from '../components/tooltip'
import { EncabezadoPagina, Modal, TipoChip } from '../components/ui'
import { conSaldo, useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE, GLOSARIO, PERIODOS, TIPOS, periodoPorId } from '../data/datos'
import { clp, descargarArchivo, fecha } from '../utils/formato'

// Explicación en lenguaje simple de cada movimiento
const explicar = (m) => {
  const p = periodoPorId(m.periodo).nombre
  switch (m.tipo) {
    case 'cobro':
      return `La USM te cobró ${clp(m.cargo)} por ${m.concepto.toLowerCase()} del ${p}. Esto aumentó lo que debías a ${clp(m.saldo)}.`
    case 'interes':
      return `Recargo de ${clp(m.cargo)} porque una cuota se pagó después de su vencimiento. ${m.detalle || ''}`
    case 'beneficio':
      return `Tu CAE pagó ${clp(m.pago)} de tu arancel por ti. No es dinero que se te deposite: rebaja tu deuda del ${p}.`
    default:
      return `Pagaste ${clp(m.pago)} (${m.detalle?.toLowerCase() || 'pago'}). Después de este pago te quedaban ${clp(m.saldo)} por pagar del ${p}.`
  }
}

const TIPOS_FILTRO = [
  { id: 'todos', texto: 'Todos' },
  { id: 'cobro', texto: 'Cobros' },
  { id: 'pago', texto: 'Pagos' },
  { id: 'beneficio', texto: 'Beneficios' },
  { id: 'interes', texto: 'Intereses' }
]

const Columna = ({ termino, children }) => (
  <Tooltip termino={termino}>
    <span className='columna'>
      <span className='columna__simple'>{children}</span>
      <span className='columna__original'>({GLOSARIO[termino].termino})</span>
    </span>
  </Tooltip>
)

export const MovimientosPage = () => {
  const { movimientos, saldoActual, proximaCuota } = useCuenta()
  const [params, setParams] = useSearchParams()
  const [guiaVisible, setGuiaVisible] = useState(true)
  const [abierto, setAbierto] = useState(movimientos.find((m) => m.nuevo)?.id || null)
  const [recibo, setRecibo] = useState(null)
  const periodo = params.get('periodo') || '202620'
  const tipo = params.get('tipo') || 'todos'

  const filtrar = (cambios) => setParams({ periodo, tipo, ...cambios })

  const lista = conSaldo(movimientos).filter((m) =>
    (periodo === 'todos' || m.periodo === periodo) && (tipo === 'todos' || m.tipo === tipo)
  )

  const descargarRecibo = (m) => {
    const texto = [
      'UNIVERSIDAD TÉCNICA FEDERICO SANTA MARÍA — Comprobante de pago (MVP, datos simulados)',
      '',
      `Comprobante N°: ${m.recibo}`,
      `Fecha: ${fecha(m.fecha)}`,
      `Estudiante: ${ESTUDIANTE.nombreCompleto} · RUT ${ESTUDIANTE.rut}`,
      `Concepto: ${m.detalle}`,
      `Medio: ${m.concepto}`,
      `Monto: ${clp(m.pago)}`,
      `Período: ${periodoPorId(m.periodo).nombre}`
    ].join('\n')
    descargarArchivo(`comprobante-${m.recibo}.txt`, texto)
  }

  const BotonRecibo = ({ m }) => (m.recibo
    ? <button type='button' className='enlace-boton' onClick={(e) => { e.stopPropagation(); setRecibo(m) }}>N° {m.recibo}</button>
    : <span className='tabla__vacio'>—</span>)

  return (
    <div className='pagina'>
      <EncabezadoPagina
        seccion='movimientos'
        icono='lista'
        titulo='Movimientos uno a uno'
        nombreAnterior='Saldos y Movimientos'
        subtitulo='Cada cobro, pago y beneficio con su fecha. Toca una fila para ver qué significa.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Mi estado de cuenta', ruta: '/estado-de-cuenta' }, { texto: 'Movimientos uno a uno' }]}
      />

      <div className='aviso aviso--historial'>
        <Icono nombre='historial' />
        <p>
          ¿Quieres saber <strong>cuánto pagaste en total</strong> en un semestre?{' '}
          <Link to={`/historial${periodo !== 'todos' ? `?periodo=${periodo}` : ''}`}>Ver resumen por semestre</Link>
        </p>
      </div>

      <section className='saldo-franja'>
        <div>
          <span className='saldo-franja__etiqueta'>
            <Tooltip termino='saldoCuenta'>Lo que debes hoy</Tooltip>
          </span>
          <strong className='saldo-franja__monto'>{clp(saldoActual)}</strong>
          {proximaCuota && <span className='saldo-franja__nota'>Próxima cuota vence el {fecha(proximaCuota.vence)}</span>}
        </div>
        {saldoActual > 0 && <Link to='/pagar' className='boton boton--primario'>Pagar</Link>}
      </section>

      {guiaVisible
        ? (
          <section className='guia'>
            <div className='guia__cabecera'>
              <h2 className='guia__titulo'><Icono nombre='ayuda' /> Cómo leer esta tabla</h2>
              <button type='button' className='boton-icono' onClick={() => setGuiaVisible(false)} aria-label='Ocultar guía'>
                <Icono nombre='cerrar' />
              </button>
            </div>
            <ol className='guia__pasos'>
              <li><TipoChip tipo='cobro' etiqueta='Cobro' /> y <TipoChip tipo='interes' etiqueta='Interés' /> suman a lo que debes (columna <em>Te cobraron</em>).</li>
              <li><TipoChip tipo='pago' etiqueta='Pago' /> y <TipoChip tipo='beneficio' etiqueta='Beneficio' /> restan a lo que debes (columna <em>Pagaste / se abonó</em>).</li>
              <li><em>Quedaba por pagar</em> muestra cuánto debías de ese semestre después de cada movimiento. Si llega a $0, quedaste al día.</li>
              <li>Toca <Icono nombre='info' tamano={14} /> en cualquier columna para ver qué significa.</li>
            </ol>
          </section>
          )
        : (
          <button type='button' className='enlace-boton enlace-boton--guia' onClick={() => setGuiaVisible(true)}>
            <Icono nombre='ayuda' tamano={16} /> Mostrar guía para leer la tabla
          </button>
          )}

      <div className='filtros'>
        <label className='filtros__campo'>
          <span>Semestre</span>
          <select value={periodo} onChange={(e) => filtrar({ periodo: e.target.value })}>
            {PERIODOS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            <option value='todos'>Todos los semestres</option>
          </select>
        </label>
        <div className='filtros__chips' role='group' aria-label='Tipo de movimiento'>
          {TIPOS_FILTRO.map((t) => (
            <button
              key={t.id}
              type='button'
              aria-pressed={tipo === t.id}
              className={`filtro-chip ${tipo === t.id ? 'filtro-chip--activo' : ''}`}
              onClick={() => filtrar({ tipo: t.id })}
            >
              {t.texto}
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 && <p className='vacio'>No hay movimientos de este tipo en el semestre elegido.</p>}

      {/* Escritorio: tabla */}
      {lista.length > 0 && (
        <div className='tabla-contenedor'>
          <table className='tabla'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th className='tabla__num'><Columna termino='cargo'>Te cobraron</Columna></th>
                <th className='tabla__num'><Columna termino='pago'>Pagaste / se abonó</Columna></th>
                <th className='tabla__num'><Columna termino='saldo'>Quedaba por pagar</Columna></th>
                <th><Columna termino='recibo'>Comprobante</Columna></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    className={`tabla__fila ${abierto === m.id ? 'tabla__fila--abierta' : ''} ${m.nuevo ? 'tabla__fila--nueva' : ''}`}
                    onClick={() => setAbierto(abierto === m.id ? null : m.id)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setAbierto(abierto === m.id ? null : m.id) }}
                    aria-expanded={abierto === m.id}
                  >
                    <td className='tabla__fecha'>{fecha(m.fecha)}</td>
                    <td>
                      <span className='tabla__concepto'>
                        <TipoChip tipo={m.tipo} etiqueta={TIPOS[m.tipo].etiqueta} />
                        <span>
                          {m.concepto}
                          {m.detalle && <span className='tabla__detalle'>{m.detalle}</span>}
                        </span>
                      </span>
                    </td>
                    <td className='tabla__num tabla__num--cargo'>{m.cargo ? `+ ${clp(m.cargo)}` : ''}</td>
                    <td className='tabla__num tabla__num--pago'>{m.pago ? `− ${clp(m.pago)}` : ''}</td>
                    <td className={`tabla__num tabla__num--saldo ${m.saldo === 0 ? 'tabla__num--cero' : ''}`}>{clp(m.saldo)}</td>
                    <td><BotonRecibo m={m} /></td>
                  </tr>
                  {abierto === m.id && (
                    <tr className='tabla__explicacion'>
                      <td colSpan={6}>
                        <p>{explicar(m)}</p>
                        <p className='tabla__tecnico'>
                          Datos del sistema: período {m.periodo} · <Tooltip termino='codigo'>código {m.codigo}</Tooltip> · “{m.descripcionOriginal}”
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Móvil: tarjetas */}
      <ul className='mov-tarjetas'>
        <li className='mov-tarjetas__leyenda'>
          <Columna termino='cargo'>Te cobraron</Columna>
          <Columna termino='pago'>Pagaste</Columna>
          <Columna termino='saldo'>Quedaba</Columna>
        </li>
        {lista.map((m) => (
          <li key={m.id}>
            <div
              role='button'
              tabIndex={0}
              className={`mov-tarjeta ${m.nuevo ? 'mov-tarjeta--nueva' : ''}`}
              onClick={() => setAbierto(abierto === m.id ? null : m.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') setAbierto(abierto === m.id ? null : m.id) }}
              aria-expanded={abierto === m.id}
            >
              <div className='mov-tarjeta__fila'>
                <TipoChip tipo={m.tipo} etiqueta={TIPOS[m.tipo].etiqueta} />
                <span className='mov-tarjeta__fecha'>{fecha(m.fecha)}</span>
              </div>
              <div className='mov-tarjeta__fila'>
                <span className='mov-tarjeta__concepto'>
                  {m.concepto}
                  {m.detalle && <span className='tabla__detalle'>{m.detalle}</span>}
                </span>
                <span className={`mov-tarjeta__monto mov-tarjeta__monto--${m.cargo ? 'cargo' : 'pago'}`}>
                  {m.cargo ? `+ ${clp(m.cargo)}` : `− ${clp(m.pago)}`}
                </span>
              </div>
              <div className='mov-tarjeta__fila mov-tarjeta__fila--pie'>
                <span>Quedaba por pagar: <strong>{clp(m.saldo)}</strong></span>
                <BotonRecibo m={m} />
              </div>
              {abierto === m.id && <p className='mov-tarjeta__explicacion'>{explicar(m)}</p>}
            </div>
          </li>
        ))}
      </ul>

      <Modal
        abierto={!!recibo}
        titulo='Comprobante de pago'
        onCerrar={() => setRecibo(null)}
        acciones={recibo && (
          <>
            <button type='button' className='boton boton--secundario' onClick={() => setRecibo(null)}>Cerrar</button>
            <button type='button' className='boton boton--primario' onClick={() => descargarRecibo(recibo)}>
              <Icono nombre='descargar' tamano={18} /> Descargar
            </button>
          </>
        )}
      >
        {recibo && (
          <div className='comprobante'>
            <div className='comprobante__sello'><Icono nombre='check' tamano={28} /> Pago recibido</div>
            <dl className='desglose'>
              <div className='desglose__fila'><dt>N° de comprobante</dt><dd>{recibo.recibo}</dd></div>
              <div className='desglose__fila'><dt>Fecha</dt><dd>{fecha(recibo.fecha)}</dd></div>
              <div className='desglose__fila'><dt>Qué pagaste</dt><dd>{recibo.detalle}</dd></div>
              <div className='desglose__fila'><dt>Medio de pago</dt><dd>{recibo.concepto}</dd></div>
              <div className='desglose__fila'><dt>Semestre</dt><dd>{periodoPorId(recibo.periodo).nombre}</dd></div>
              <div className='desglose__fila desglose__fila--total'><dt>Monto</dt><dd>{clp(recibo.pago)}</dd></div>
            </dl>
            <p className='nota'>Muestra este número en Caja si algún pago no aparece reflejado.</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MovimientosPage
