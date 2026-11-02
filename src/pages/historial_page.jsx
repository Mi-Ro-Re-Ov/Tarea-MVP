import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import Icono from '../components/icono'
import { EncabezadoPagina, Estado } from '../components/ui'
import { resumenPeriodo, useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE, PERIODOS, periodoPorId } from '../data/datos'
import { clp, descargarArchivo, fecha } from '../utils/formato'

const etiquetaPeriodo = (p) => (p.actual ? 'Semestre actual' : p.anterior ? 'Semestre pasado' : null)

export const HistorialPage = () => {
  const { movimientos } = useCuenta()
  const [params, setParams] = useSearchParams()
  const [verPagos, setVerPagos] = useState(true)
  const periodoId = params.get('periodo') || PERIODOS.find((p) => p.anterior).id
  const periodo = periodoPorId(periodoId)
  const r = resumenPeriodo(movimientos, periodoId)
  const resumenes = PERIODOS.map((p) => ({ ...p, ...resumenPeriodo(movimientos, p.id) }))
  const maximo = Math.max(...resumenes.map((x) => x.cobrado))
  const pctTu = r.cobrado ? (r.pagadoPorTi / r.cobrado) * 100 : 0
  const pctBen = r.cobrado ? (r.beneficios / r.cobrado) * 100 : 0

  const descargar = () => {
    const filas = [
      ['Resumen por semestre', ESTUDIANTE.nombreCompleto, `Rol ${ESTUDIANTE.rol}`],
      [],
      ['Semestre', 'Total cobrado', 'Pagado por ti', 'Cubierto por beneficios', 'Intereses', 'Saldo final'],
      ...resumenes.map((x) => [x.nombre, x.cobrado, x.pagadoPorTi, x.beneficios, x.intereses, x.saldo]),
      [],
      [`Pagos del ${periodo.nombre}`],
      ['Fecha', 'Detalle', 'Monto', 'Comprobante'],
      ...r.pagos.map((p) => [p.fecha, p.detalle, p.pago, p.recibo])
    ]
    descargarArchivo('resumen-por-semestre.csv', '﻿' + filas.map((f) => f.join(';')).join('\n'), 'text/csv')
  }

  return (
    <div className='pagina'>
      <EncabezadoPagina
        seccion='historial'
        icono='historial'
        titulo='Resumen por semestre'
        nombreAnterior='Resumen Histórico'
        subtitulo='Cuánto te cobraron, cuánto pagaste tú y cuánto cubrieron tus beneficios, semestre a semestre.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Mi estado de cuenta', ruta: '/estado-de-cuenta' }, { texto: 'Resumen por semestre' }]}
      />

      <div className='aviso aviso--movimientos'>
        <Icono nombre='lista' />
        <p>
          Aquí ves <strong>totales por semestre</strong>. ¿Buscas un pago puntual con su fecha?{' '}
          <Link to={`/movimientos?periodo=${periodoId}`}>Ver movimientos uno a uno</Link>
        </p>
      </div>

      <div className='pestanas' role='tablist' aria-label='Semestres'>
        {PERIODOS.map((p) => (
          <button
            key={p.id}
            type='button'
            role='tab'
            aria-selected={p.id === periodoId}
            className={`pestanas__pestana ${p.id === periodoId ? 'pestanas__pestana--activa' : ''}`}
            onClick={() => setParams({ periodo: p.id })}
          >
            {p.corto}
            {etiquetaPeriodo(p) && <span className='pestanas__etiqueta'>{etiquetaPeriodo(p)}</span>}
          </button>
        ))}
      </div>

      <section className='tarjeta tarjeta--historial'>
        <div className='resumen-cabecera'>
          <div>
            <p className='resumen-cabecera__periodo'>{periodo.nombre}{etiquetaPeriodo(periodo) && ` · ${etiquetaPeriodo(periodo)}`}</p>
            <h2 className='resumen-cabecera__etiqueta'>Pagaste tú</h2>
            <p className='cifra'>{clp(r.pagadoPorTi)}</p>
          </div>
          {r.saldo === 0
            ? <Estado estado='pagada' texto='Semestre pagado completo' />
            : <Estado estado='pendiente' texto={`Quedan ${clp(r.saldo)} por pagar`} />}
        </div>

        <div className='barra-apilada' aria-hidden='true'>
          <span className='barra-apilada__parte barra-apilada__parte--tu' style={{ width: `${pctTu}%` }} />
          <span className='barra-apilada__parte barra-apilada__parte--beneficio' style={{ width: `${pctBen}%` }} />
        </div>
        <div className='leyenda'>
          <span><i className='leyenda__punto leyenda__punto--tu' /> Pagaste tú ({Math.round(pctTu)}%)</span>
          <span><i className='leyenda__punto leyenda__punto--beneficio' /> Beneficios ({Math.round(pctBen)}%)</span>
          {r.saldo > 0 && <span><i className='leyenda__punto leyenda__punto--pendiente' /> Pendiente ({Math.round(100 - pctTu - pctBen)}%)</span>}
        </div>

        <dl className='desglose'>
          <div className='desglose__fila'><dt>Matrícula</dt><dd>{clp(r.matricula)}</dd></div>
          <div className='desglose__fila'><dt>Arancel del semestre</dt><dd>{clp(r.arancel)}</dd></div>
          {r.intereses > 0 && <div className='desglose__fila'><dt>Intereses por atraso</dt><dd>{clp(r.intereses)}</dd></div>}
          <div className='desglose__fila desglose__fila--total'><dt>Total que te cobraron</dt><dd>{clp(r.cobrado)}</dd></div>
          <div className='desglose__fila desglose__fila--resta'><dt>Cubierto por tu CAE</dt><dd>− {clp(r.beneficios)}</dd></div>
          <div className='desglose__fila desglose__fila--resta'><dt>Pagado por ti</dt><dd>− {clp(r.pagadoPorTi)}</dd></div>
          <div className='desglose__fila desglose__fila--total'><dt>Saldo al cierre</dt><dd>{clp(r.saldo)}</dd></div>
        </dl>

        <button type='button' className='desplegar' aria-expanded={verPagos} onClick={() => setVerPagos(!verPagos)}>
          {verPagos ? 'Ocultar' : 'Ver'} tus {r.pagos.length} pagos de este semestre
          <Icono nombre='flecha' tamano={16} className={verPagos ? 'desplegar__icono--abierto' : ''} />
        </button>
        {verPagos && (
          <ul className='pagos-lista'>
            {r.pagos.map((p) => (
              <li key={p.id} className='pagos-lista__item'>
                <span className='pagos-lista__fecha'>{fecha(p.fecha)}</span>
                <span className='pagos-lista__detalle'>
                  {p.detalle}
                  <span className='pagos-lista__recibo'>Comprobante N° {p.recibo}</span>
                </span>
                <span className='pagos-lista__monto'>{clp(p.pago)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className='tarjeta__acciones'>
          <button type='button' className='boton boton--secundario' onClick={descargar}>
            <Icono nombre='descargar' tamano={18} /> Descargar resumen (Excel/CSV)
          </button>
        </div>
      </section>

      <section className='seccion'>
        <h2 className='seccion__titulo'>Comparar semestres</h2>
        <div className='comparativa'>
          {resumenes.map((x) => (
            <button
              key={x.id}
              type='button'
              className={`comparativa__fila ${x.id === periodoId ? 'comparativa__fila--activa' : ''}`}
              onClick={() => setParams({ periodo: x.id })}
            >
              <span className='comparativa__nombre'>{x.corto}</span>
              <span className='comparativa__barra' style={{ width: `${(x.cobrado / maximo) * 100}%` }}>
                <span className='barra-apilada__parte barra-apilada__parte--tu' style={{ width: `${(x.pagadoPorTi / x.cobrado) * 100}%` }} />
                <span className='barra-apilada__parte barra-apilada__parte--beneficio' style={{ width: `${(x.beneficios / x.cobrado) * 100}%` }} />
              </span>
              <span className='comparativa__monto'>{clp(x.pagadoPorTi)}</span>
            </button>
          ))}
        </div>
        <p className='nota'>El monto a la derecha es lo que pagaste tú en cada semestre.</p>
      </section>
    </div>
  )
}

export default HistorialPage
