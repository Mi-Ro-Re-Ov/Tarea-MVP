import React, { useState } from 'react'

import Icono from '../components/icono'
import { EncabezadoPagina } from '../components/ui'
import { useCuenta } from '../context/cuenta_context'
import { BANCOS, ESTUDIANTE, TIPOS_CUENTA } from '../data/datos'
import { fecha } from '../utils/formato'

const vacio = { banco: '', tipo: '', numero: '', confirmacion: '' }

export const CuentaBancariaPage = () => {
  const { cuentaBancaria, actualizarCuenta } = useCuenta()
  const [paso, setPaso] = useState('ver') // ver | editar | revisar | listo
  const [form, setForm] = useState(vacio)
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    setForm({ ...form, [campo]: campo === 'numero' || campo === 'confirmacion' ? e.target.value.replace(/\D/g, '') : e.target.value })
    setErrores({ ...errores, [campo]: null })
  }

  const validar = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.banco) err.banco = 'Elige tu banco.'
    if (!form.tipo) err.tipo = 'Elige el tipo de cuenta.'
    if (form.numero.length < 6) err.numero = 'El número debe tener al menos 6 dígitos.'
    if (form.confirmacion !== form.numero) err.confirmacion = 'Los números no coinciden.'
    setErrores(err)
    if (!Object.keys(err).length) setPaso('revisar')
  }

  const guardar = () => {
    actualizarCuenta({ banco: form.banco, tipo: form.tipo, numero: form.numero, titular: ESTUDIANTE.nombreCompleto, rut: ESTUDIANTE.rut })
    setPaso('listo')
  }

  const Fila = ({ etiqueta, valor }) => (
    <div className='desglose__fila'><dt>{etiqueta}</dt><dd>{valor}</dd></div>
  )

  return (
    <div className='pagina pagina--angosta'>
      <EncabezadoPagina
        seccion='banco'
        icono='banco'
        titulo='Mi cuenta bancaria'
        subtitulo='Aquí te depositamos becas USM (como la ayudantía) y devoluciones.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Mi estado de cuenta', ruta: '/estado-de-cuenta' }, { texto: 'Mi cuenta bancaria' }]}
      />

      {paso === 'listo' && (
        <div className='aviso aviso--ok' role='status'>
          <Icono nombre='check' />
          <p><strong>¡Cuenta actualizada!</strong> Los próximos depósitos (como tu ayudantía de noviembre) llegarán a esta cuenta.</p>
        </div>
      )}

      {(paso === 'ver' || paso === 'listo') && (
        <section className='tarjeta tarjeta--plano'>
          <h2 className='tarjeta__titulo'>Cuenta registrada</h2>
          <dl className='desglose'>
            <Fila etiqueta='Banco' valor={cuentaBancaria.banco} />
            <Fila etiqueta='Tipo de cuenta' valor={cuentaBancaria.tipo} />
            <Fila etiqueta='Número' valor={`···${cuentaBancaria.numero.slice(-4)}`} />
            <Fila etiqueta='Titular' valor={`${cuentaBancaria.titular} · ${cuentaBancaria.rut}`} />
            <Fila etiqueta='Última actualización' valor={fecha(cuentaBancaria.actualizada)} />
          </dl>
          <div className='tarjeta__acciones'>
            <button type='button' className='boton boton--primario' onClick={() => { setForm(vacio); setPaso('editar') }}>
              Cambiar cuenta
            </button>
          </div>
        </section>
      )}

      {paso === 'editar' && (
        <form className='tarjeta tarjeta--plano formulario' onSubmit={validar} noValidate>
          <h2 className='tarjeta__titulo'>Nueva cuenta</h2>
          <p className='nota'>La cuenta debe estar a tu nombre ({ESTUDIANTE.rut}).</p>
          <label className='formulario__campo'>
            <span>Banco</span>
            <select value={form.banco} onChange={cambiar('banco')} aria-invalid={!!errores.banco}>
              <option value=''>Elige un banco</option>
              {BANCOS.map((b) => <option key={b}>{b}</option>)}
            </select>
            {errores.banco && <span className='formulario__error'>{errores.banco}</span>}
          </label>
          <label className='formulario__campo'>
            <span>Tipo de cuenta</span>
            <select value={form.tipo} onChange={cambiar('tipo')} aria-invalid={!!errores.tipo}>
              <option value=''>Elige un tipo</option>
              {TIPOS_CUENTA.map((t) => <option key={t}>{t}</option>)}
            </select>
            {errores.tipo && <span className='formulario__error'>{errores.tipo}</span>}
          </label>
          <label className='formulario__campo'>
            <span>Número de cuenta</span>
            <input inputMode='numeric' value={form.numero} onChange={cambiar('numero')} placeholder='Solo números' aria-invalid={!!errores.numero} />
            {errores.numero && <span className='formulario__error'>{errores.numero}</span>}
          </label>
          <label className='formulario__campo'>
            <span>Repite el número</span>
            <input inputMode='numeric' value={form.confirmacion} onChange={cambiar('confirmacion')} placeholder='Para evitar errores' aria-invalid={!!errores.confirmacion} />
            {errores.confirmacion && <span className='formulario__error'>{errores.confirmacion}</span>}
          </label>
          <div className='acciones-fin'>
            <button type='button' className='boton boton--secundario' onClick={() => setPaso('ver')}>Cancelar</button>
            <button type='submit' className='boton boton--primario'>Revisar</button>
          </div>
        </form>
      )}

      {paso === 'revisar' && (
        <section className='tarjeta tarjeta--plano'>
          <h2 className='tarjeta__titulo'>¿Está todo bien?</h2>
          <dl className='desglose'>
            <Fila etiqueta='Banco' valor={form.banco} />
            <Fila etiqueta='Tipo de cuenta' valor={form.tipo} />
            <Fila etiqueta='Número' valor={form.numero} />
            <Fila etiqueta='Titular' valor={`${ESTUDIANTE.nombreCompleto} · ${ESTUDIANTE.rut}`} />
          </dl>
          <div className='acciones-fin'>
            <button type='button' className='boton boton--secundario' onClick={() => setPaso('editar')}>Corregir</button>
            <button type='button' className='boton boton--primario' onClick={guardar}>Guardar cuenta</button>
          </div>
        </section>
      )}
    </div>
  )
}

export default CuentaBancariaPage
