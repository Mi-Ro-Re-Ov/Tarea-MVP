const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// $1.300.000
export const clp = (monto) => '$' + Math.round(monto).toLocaleString('es-CL')

// '2026-10-30' -> '30 oct 2026'
export const fecha = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${a}`
}

// '2026-10-30' -> '30 de octubre de 2026'
export const fechaLarga = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES_LARGOS[m - 1]} de ${a}`
}

export const nombreMes = (mes) => MESES_LARGOS[mes - 1]

// Descarga un archivo de texto generado en el navegador
export const descargarArchivo = (nombre, contenido, tipo = 'text/plain') => {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
