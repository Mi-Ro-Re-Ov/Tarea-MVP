import React from 'react'

// Íconos de trazo simple (24x24) para no depender de librerías externas
const TRAZOS = {
  inicio: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  pagar: 'M3 6h18v12H3z M3 10h18 M7 15h4',
  cuenta: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z M9 8h6 M9 12h6',
  beneficio: 'M4 10h16v10H4z M2 6h20v4H2z M12 6v14 M12 6c-2-4-6-3-5 0 M12 6c2-4 6-3 5 0',
  ayuda: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17.5v.5',
  campana: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 20a2 2 0 0 0 4 0',
  banco: 'M3 9l9-5 9 5 M5 9v9 M10 9v9 M14 9v9 M19 9v9 M3 20h18',
  historial: 'M4 4v5h5 M4.5 9A8 8 0 1 1 4 13 M12 8v4l3 2',
  lista: 'M8 6h13 M8 12h13 M8 18h13 M3 6h1 M3 12h1 M3 18h1',
  check: 'M5 12l5 5 9-10',
  reloj: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 7v5l3 2',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 11v6 M12 7.5v.5',
  alerta: 'M12 3l10 18H2z M12 10v5 M12 18v.5',
  flecha: 'M9 6l6 6-6 6',
  atras: 'M15 6l-6 6 6 6',
  salir: 'M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10',
  descargar: 'M12 4v11 M7 10l5 5 5-5 M4 20h16',
  cerrar: 'M6 6l12 12 M18 6L6 18',
  usuario: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c1-4 4-6 8-6s7 2 8 6',
  externo: 'M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6',
  candado: 'M6 11h12v10H6z M8 11V7a4 4 0 0 1 8 0v4'
}

export const Icono = ({ nombre, tamano = 20, className = '' }) => (
  <svg
    className={`icono ${className}`}
    width={tamano}
    height={tamano}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    {TRAZOS[nombre].split(' M').map((d, i) => (
      <path key={i} d={i === 0 ? d : 'M' + d} />
    ))}
  </svg>
)

export default Icono
