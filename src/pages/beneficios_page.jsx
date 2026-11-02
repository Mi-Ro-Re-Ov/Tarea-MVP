import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Icono from '../components/icono'
import { EncabezadoPagina, Estado, Modal } from '../components/ui'
import { useCuenta } from '../context/cuenta_context'
import { BENEFICIOS, HOY } from '../data/datos'
import { clp, fecha, nombreMes } from '../utils/formato'

const mesHoy = HOY.slice(0, 7)
const minus = (t) => t.charAt(0).toLowerCase() + t.slice(1)
const nombreMesHoy = nombreMes(Number(HOY.slice(5, 7)))

const ORIGENES = [
  { id: 'todos', texto: 'Todos' },
  { id: 'USM', texto: 'De la USM' },
  { id: 'Estado', texto: 'Del Estado (CAE, Mineduc)' }
]

const TarjetaBeneficio = ({ b }) => {
  const [historial, setHistorial] = useState(false)
  const recibidos = b.pagos.filter((p) => p.estado === 'recibido')
  const ultimo = recibidos[0]
  const proximo = b.pagos.find((p) => p.estado === 'en-camino')
  const esteMes = ultimo.fecha.slice(0, 7) === mesHoy

  return (
    <article className='beneficio'>
      <header className='beneficio__cabecera'>
        <div>
          <span className={`origen origen--${b.origenTipo === 'USM' ? 'usm' : 'estado'}`}>{b.origen}</span>
          <h2 className='beneficio__nombre'>{b.nombre}</h2>
          <p className='beneficio__frecuencia'>{b.frecuencia}</p>
        </div>
        <Estado estado='recibido' texto={esteMes ? `Llegó este mes` : 'Al día'} />
      </header>

      <div className='beneficio__ultimo'>
        <span className='beneficio__ultimo-etiqueta'>Último {b.id === 'cae' ? 'abono' : 'pago'} recibido</span>
        <span className='beneficio__ultimo-monto'>{clp(ultimo.monto)}</span>
        <span className='beneficio__ultimo-detalle'>
          {ultimo.periodo ? `${ultimo.periodo} · ` : `${ultimo.mes} · `}{ultimo.destino} el {fecha(ultimo.fecha)}
        </span>
      </div>

      <p className='beneficio__como'>
        <strong>¿Cómo llega?</strong>{' '}
        {b.comoLlega}
      </p>

      {b.pasos && (
        <ol className='linea-tiempo' aria-label='Recorrido del CAE este semestre'>
          {b.pasos.map((p) => (
            <li key={p.titulo} className={`linea-tiempo__paso ${p.hecho ? 'linea-tiempo__paso--hecho' : ''}`}>
              <span className='linea-tiempo__marca'><Icono nombre='check' tamano={14} /></span>
              <span className='linea-tiempo__texto'>{p.titulo}</span>
              <span className='linea-tiempo__fecha'>{fecha(p.fecha)}</span>
            </li>
          ))}
        </ol>
      )}

      {proximo && (
        <p className='beneficio__proximo'>
          <Icono nombre='reloj' tamano={16} /> Próximo: <strong>{clp(proximo.monto)}</strong> ({proximo.mes}) · {minus(proximo.destino)} para el {fecha(proximo.fecha)}
        </p>
      )}
      {b.proximo && <p className='beneficio__proximo'><Icono nombre='info' tamano={16} /> {b.proximo.texto}</p>}

      <div className='beneficio__acciones'>
        <button type='button' className='desplegar' aria-expanded={historial} onClick={() => setHistorial(!historial)}>
          {historial ? 'Ocultar historial' : `Ver historial (${b.pagos.length})`}
          <Icono nombre='flecha' tamano={16} className={historial ? 'desplegar__icono--abierto' : ''} />
        </button>
        {b.id === 'cae' && <Link to='/movimientos?periodo=todos&tipo=beneficio' className='enlace'>Ver abonos en mis movimientos</Link>}
        {b.enlace && (
          <a href={b.enlace.url} target='_blank' rel='noreferrer' className='enlace'>
            {b.enlace.texto} <Icono nombre='externo' tamano={14} />
          </a>
        )}
      </div>

      {historial && (
        <ul className='historial-beneficio'>
          {b.pagos.map((p) => (
            <li key={p.mes + p.fecha} className='historial-beneficio__item'>
              <span>
                <strong>{p.periodo || p.mes}</strong>
                <span className='historial-beneficio__sub'>{p.destino} · {fecha(p.fecha)}{p.documento ? ` · Doc. ${p.documento}` : ''}</span>
              </span>
              <span className='historial-beneficio__derecha'>
                <span>{clp(p.monto)}</span>
                <Estado estado={p.estado} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export const BeneficiosPage = () => {
  const { enviarSolicitud } = useCuenta()
  const [origen, setOrigen] = useState('todos')
  const [reporte, setReporte] = useState(false)
  const [form, setForm] = useState({ beneficio: 'cae', mes: 'Octubre 2026', detalle: '' })
  const [error, setError] = useState('')
  const [enviada, setEnviada] = useState(null)

  const lista = BENEFICIOS.filter((b) => origen === 'todos' || b.origenTipo === origen)
  const recibidosMes = BENEFICIOS.flatMap((b) => b.pagos.filter((p) => p.estado === 'recibido' && p.fecha.slice(0, 7) === mesHoy).map((p) => ({ ...p, b })))
  const cae = BENEFICIOS.find((b) => b.id === 'cae').pagos[0]
  const totalSemestre = BENEFICIOS.reduce((s, b) => s + b.pagos.filter((p) => p.estado === 'recibido' && p.fecha >= '2026-07-01').reduce((x, p) => x + p.monto, 0), 0)

  const enviar = (e) => {
    e.preventDefault()
    if (form.detalle.trim().length < 10) return setError('Cuéntanos brevemente qué no calza (mínimo 10 caracteres).')
    const numero = 'SOL-' + (48211 + Math.floor(Math.random() * 500))
    enviarSolicitud({ ...form, numero, fecha: HOY })
    setEnviada(numero)
  }

  const cerrarReporte = () => {
    setReporte(false)
    setEnviada(null)
    setError('')
    setForm({ beneficio: 'cae', mes: 'Octubre 2026', detalle: '' })
  }

  return (
    <div className='pagina'>
      <EncabezadoPagina
        seccion='beneficios'
        icono='beneficio'
        titulo='Becas y beneficios'
        nombreAnterior='Becas y Pagos Recibidos'
        subtitulo='Tu CAE, becas USM y beneficios del Mineduc en un solo lugar.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Mi estado de cuenta', ruta: '/estado-de-cuenta' }, { texto: 'Becas y beneficios' }]}
      />

      <section className='respuesta'>
        <span className='respuesta__icono'><Icono nombre='check' tamano={30} /></span>
        <div>
          <h2 className='respuesta__titulo'>Sí, tus beneficios de {nombreMesHoy} llegaron</h2>
          <ul className='respuesta__lista'>
            {recibidosMes.map((p) => (
              <li key={p.b.id}><strong>{p.b.corto}:</strong> {clp(p.monto)} · {minus(p.destino)} el {fecha(p.fecha)}</li>
            ))}
            <li><strong>CAE del semestre:</strong> {clp(cae.monto)} abonado a tu cuenta USM el {fecha(cae.fecha)}</li>
          </ul>
        </div>
      </section>

      <div className='mini-stats'>
        <div className='mini-stats__item'>
          <span className='mini-stats__valor'>{BENEFICIOS.length}</span>
          <span className='mini-stats__etiqueta'>beneficios activos</span>
        </div>
        <div className='mini-stats__item'>
          <span className='mini-stats__valor'>{clp(totalSemestre)}</span>
          <span className='mini-stats__etiqueta'>recibido este semestre</span>
        </div>
        <div className='mini-stats__item'>
          <span className='mini-stats__valor'>0</span>
          <span className='mini-stats__etiqueta'>con problemas</span>
        </div>
      </div>

      <div className='filtros__chips' role='group' aria-label='Filtrar por origen'>
        {ORIGENES.map((o) => (
          <button
            key={o.id}
            type='button'
            aria-pressed={origen === o.id}
            className={`filtro-chip ${origen === o.id ? 'filtro-chip--activo' : ''}`}
            onClick={() => setOrigen(o.id)}
          >
            {o.texto}
          </button>
        ))}
      </div>

      <div className='beneficios'>
        {lista.map((b) => <TarjetaBeneficio key={b.id} b={b} />)}
      </div>

      <section className='ayuda-caja'>
        <Icono nombre='alerta' tamano={24} />
        <div>
          <h2 className='ayuda-caja__titulo'>¿Falta un beneficio o un monto no calza?</h2>
          <p>Avísanos desde aquí y Finanzas Estudiantiles lo revisa, sin tener que ir a Caja.</p>
          <button type='button' className='boton boton--secundario' onClick={() => setReporte(true)}>Reportar un problema</button>
        </div>
      </section>

      <Modal abierto={reporte} titulo={enviada ? 'Solicitud enviada' : 'Reportar un problema con un beneficio'} onCerrar={cerrarReporte}>
        {enviada
          ? (
            <div className='exito-mini'>
              <span className='exito-mini__icono'><Icono nombre='check' tamano={32} /></span>
              <p>Recibimos tu solicitud <strong>{enviada}</strong>.</p>
              <p className='nota'>Te responderemos a tu correo USM en un máximo de 5 días hábiles. También te avisaremos en la campana de notificaciones.</p>
              <button type='button' className='boton boton--primario boton--bloque' onClick={cerrarReporte}>Entendido</button>
            </div>
            )
          : (
            <form className='formulario' onSubmit={enviar} noValidate>
              <label className='formulario__campo'>
                <span>¿Qué beneficio?</span>
                <select value={form.beneficio} onChange={(e) => setForm({ ...form, beneficio: e.target.value })}>
                  {BENEFICIOS.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                  <option value='otro'>Otro beneficio que no aparece</option>
                </select>
              </label>
              <label className='formulario__campo'>
                <span>¿De qué mes o semestre?</span>
                <select value={form.mes} onChange={(e) => setForm({ ...form, mes: e.target.value })}>
                  <option>Octubre 2026</option>
                  <option>Septiembre 2026</option>
                  <option>Agosto 2026</option>
                  <option>2° Semestre 2026</option>
                  <option>1° Semestre 2026</option>
                </select>
              </label>
              <label className='formulario__campo'>
                <span>¿Qué pasó?</span>
                <textarea
                  rows={4}
                  value={form.detalle}
                  onChange={(e) => { setForm({ ...form, detalle: e.target.value }); setError('') }}
                  placeholder='Ej: Ingresa me dice que el CAE fue pagado, pero no lo veo abonado.'
                />
              </label>
              {error && <p className='formulario__error' role='alert'><Icono nombre='alerta' tamano={16} /> {error}</p>}
              <div className='modal__acciones modal__acciones--form'>
                <button type='button' className='boton boton--secundario' onClick={cerrarReporte}>Cancelar</button>
                <button type='submit' className='boton boton--primario'>Enviar</button>
              </div>
            </form>
            )}
      </Modal>
    </div>
  )
}

export default BeneficiosPage
