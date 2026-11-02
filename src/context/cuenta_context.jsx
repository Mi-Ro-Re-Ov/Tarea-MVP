import React, { createContext, useContext, useMemo, useReducer } from 'react'

import {
  CUENTA_BANCARIA_INICIAL,
  CUOTAS_INICIALES,
  HOY,
  MOVIMIENTOS_INICIALES,
  NOTIFICACIONES_INICIALES
} from '../data/datos'
import { clp } from '../utils/formato'

const CuentaContext = createContext(null)

const estadoInicial = {
  sesionIniciada: false,
  movimientos: MOVIMIENTOS_INICIALES,
  cuotas: CUOTAS_INICIALES,
  cuentaBancaria: CUENTA_BANCARIA_INICIAL,
  notificaciones: NOTIFICACIONES_INICIALES,
  ultimoPago: null,
  solicitudes: []
}

let siguienteRecibo = 845102

const reducer = (estado, accion) => {
  switch (accion.type) {
    case 'iniciarSesion':
      return { ...estado, sesionIniciada: true }
    case 'cerrarSesion':
      return { ...estadoInicial }
    case 'pagar': {
      const { idsCuotas, medio } = accion
      const cuotas = estado.cuotas.filter((c) => idsCuotas.includes(c.id))
      const total = cuotas.reduce((s, c) => s + c.monto, 0)
      const recibo = String(siguienteRecibo++)
      const numeros = cuotas.map((c) => c.numero).join(' y ')
      const nuevoMov = {
        id: `pago-${recibo}`,
        fecha: HOY,
        periodo: '202620',
        codigo: medio.codigo,
        descripcionOriginal: medio.descripcionOriginal,
        concepto: medio.concepto,
        tipo: 'pago',
        cargo: 0,
        pago: total,
        recibo,
        detalle: `Cuota${cuotas.length > 1 ? 's' : ''} ${numeros} de 5 del arancel`,
        nuevo: true
      }
      return {
        ...estado,
        cuotas: estado.cuotas.map((c) => (idsCuotas.includes(c.id) ? { ...c, pagada: true, recibo } : c)),
        movimientos: [...estado.movimientos.map((m) => ({ ...m, nuevo: false })), nuevoMov],
        ultimoPago: { recibo, total, cuotas, medio: medio.nombre, fecha: HOY, movimientoId: nuevoMov.id },
        notificaciones: [
          { id: `n-${recibo}`, fecha: HOY, texto: `Recibimos tu pago de ${clp(total)}. Comprobante N° ${recibo}.`, ruta: '/movimientos', leida: false, tipo: 'pago' },
          ...estado.notificaciones
        ]
      }
    }
    case 'actualizarCuenta':
      return {
        ...estado,
        cuentaBancaria: { ...accion.cuenta, actualizada: HOY },
        notificaciones: [
          { id: `n-cta-${Date.now()}`, fecha: HOY, texto: `Actualizaste tu cuenta bancaria a ${accion.cuenta.banco} ···${accion.cuenta.numero.slice(-4)}.`, ruta: '/cuenta-bancaria', leida: false, tipo: 'aviso' },
          ...estado.notificaciones
        ]
      }
    case 'marcarLeida':
      return { ...estado, notificaciones: estado.notificaciones.map((n) => (n.id === accion.id ? { ...n, leida: true } : n)) }
    case 'marcarTodasLeidas':
      return { ...estado, notificaciones: estado.notificaciones.map((n) => ({ ...n, leida: true })) }
    case 'enviarSolicitud':
      return { ...estado, solicitudes: [...estado.solicitudes, accion.solicitud] }
    default:
      return estado
  }
}

// Saldo corrido por semestre: lo que quedaba por pagar después de cada movimiento
export const conSaldo = (movimientos) => {
  const orden = [...movimientos].sort((a, b) => (a.fecha === b.fecha ? 0 : a.fecha < b.fecha ? -1 : 1))
  const saldos = {}
  const resultado = orden.map((m) => {
    saldos[m.periodo] = (saldos[m.periodo] || 0) + m.cargo - m.pago
    return { ...m, saldo: saldos[m.periodo] }
  })
  return resultado.reverse()
}

export const resumenPeriodo = (movimientos, periodoId) => {
  const delPeriodo = movimientos.filter((m) => m.periodo === periodoId)
  const suma = (fn) => delPeriodo.reduce((s, m) => s + fn(m), 0)
  const cobrado = suma((m) => m.cargo)
  const pagadoPorTi = suma((m) => (m.tipo === 'pago' ? m.pago : 0))
  const beneficios = suma((m) => (m.tipo === 'beneficio' ? m.pago : 0))
  const intereses = suma((m) => (m.tipo === 'interes' ? m.cargo : 0))
  return {
    cobrado,
    pagadoPorTi,
    beneficios,
    intereses,
    saldo: cobrado - pagadoPorTi - beneficios,
    matricula: suma((m) => (m.codigo === 'MTRD' ? m.cargo : 0)),
    arancel: suma((m) => (m.codigo === '1773' ? m.cargo : 0)),
    pagos: delPeriodo.filter((m) => m.tipo === 'pago').sort((a, b) => (a.fecha < b.fecha ? -1 : 1)),
    abonos: delPeriodo.filter((m) => m.tipo === 'beneficio')
  }
}

export const CuentaProvider = ({ children }) => {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  const valor = useMemo(() => {
    const pendientes = estado.cuotas.filter((c) => !c.pagada)
    return {
      ...estado,
      pendientes,
      saldoActual: pendientes.reduce((s, c) => s + c.monto, 0),
      proximaCuota: pendientes[0] || null,
      noLeidas: estado.notificaciones.filter((n) => !n.leida).length,
      iniciarSesion: () => dispatch({ type: 'iniciarSesion' }),
      cerrarSesion: () => dispatch({ type: 'cerrarSesion' }),
      pagar: (idsCuotas, medio) => dispatch({ type: 'pagar', idsCuotas, medio }),
      actualizarCuenta: (cuenta) => dispatch({ type: 'actualizarCuenta', cuenta }),
      marcarLeida: (id) => dispatch({ type: 'marcarLeida', id }),
      marcarTodasLeidas: () => dispatch({ type: 'marcarTodasLeidas' }),
      enviarSolicitud: (solicitud) => dispatch({ type: 'enviarSolicitud', solicitud })
    }
  }, [estado])

  return <CuentaContext.Provider value={valor}>{children}</CuentaContext.Provider>
}

export const useCuenta = () => useContext(CuentaContext)
