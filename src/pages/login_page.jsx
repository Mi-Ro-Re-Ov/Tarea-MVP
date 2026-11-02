import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Icono from '../components/icono'
import { useCuenta } from '../context/cuenta_context'
import { ESTUDIANTE } from '../data/datos'

export const LoginPage = () => {
  const { iniciarSesion } = useCuenta()
  const navegar = useNavigate()
  const [usuario, setUsuario] = useState(ESTUDIANTE.correo)
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    if (!usuario.trim()) return setError('Ingresa tu correo USM.')
    if (!clave) return setError('Ingresa tu contraseña (en esta demo sirve cualquiera).')
    iniciarSesion()
    navegar('/inicio')
  }

  return (
    <div className='login'>
      <div className='login__tarjeta'>
        <div className='login__marca'>
          <span className='cabecera__sello cabecera__sello--grande'>USM</span>
          <div>
            <h1 className='login__titulo'>Autoservicio</h1>
            <p className='login__bajada'>Tu matrícula, pagos y beneficios en un solo lugar</p>
          </div>
        </div>
        <form className='formulario' onSubmit={enviar} noValidate>
          <label className='formulario__campo'>
            <span>Correo USM</span>
            <input type='email' value={usuario} onChange={(e) => { setUsuario(e.target.value); setError('') }} autoComplete='username' />
          </label>
          <label className='formulario__campo'>
            <span>Contraseña</span>
            <input type='password' value={clave} onChange={(e) => { setClave(e.target.value); setError('') }} placeholder='Cualquier contraseña (demo)' autoComplete='current-password' />
          </label>
          {error && <p className='formulario__error' role='alert'><Icono nombre='alerta' tamano={16} /> {error}</p>}
          <button type='submit' className='boton boton--primario boton--bloque'>
            <Icono nombre='candado' tamano={18} /> Ingresar
          </button>
        </form>
        <p className='login__nota'>
          Prototipo (MVP) del curso Diseño de Interfaces Usuarias. No se conecta al sistema real ni guarda datos.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
