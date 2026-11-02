// Datos simulados del MVP. Montos y códigos basados en los registros reales
// observados en autoservicio.usm.cl durante la evaluación del sistema existente
// (Entrega 2), ajustados a la Persona "Alejandro González" (estudiante con CAE parcial).

// Fecha de referencia de los datos de la demo
export const HOY = '2026-10-30'

export const ESTUDIANTE = {
  nombre: 'Alejandro',
  nombreCompleto: 'Alejandro González Rojas',
  rut: '21.345.678-9',
  rol: '202310045-3',
  correo: 'alejandro.gonzalez@usm.cl',
  carrera: 'Ingeniería Civil Informática',
  campus: 'Campus San Joaquín',
  jornada: 'Diurno'
}

export const PERIODOS = [
  { id: '202620', nombre: '2° Semestre 2026', corto: '2S 2026', actual: true },
  { id: '202610', nombre: '1° Semestre 2026', corto: '1S 2026', anterior: true },
  { id: '202520', nombre: '2° Semestre 2025', corto: '2S 2025' },
  { id: '202510', nombre: '1° Semestre 2025', corto: '1S 2025' }
]

export const periodoPorId = (id) => PERIODOS.find((p) => p.id === id)

// Tipos de movimiento, en lenguaje simple
export const TIPOS = {
  cobro: { etiqueta: 'Cobro', ayuda: 'La universidad te cobró este monto.' },
  interes: { etiqueta: 'Interés', ayuda: 'Recargo por pagar una cuota después de su vencimiento.' },
  pago: { etiqueta: 'Pago', ayuda: 'Dinero que tú pagaste.' },
  beneficio: { etiqueta: 'Beneficio', ayuda: 'Un beneficio (CAE o beca) que pagó parte de tu deuda por ti.' }
}

const DESCRIPCIONES = {
  MTRD: 'MATRICULA PREGRADO DIURNO',
  1773: 'ARA DIU SJQ ING CIVIL INFORMAT',
  POTC: 'PAGO TARJETA CREDITO',
  MORA: 'INTERES DE MORA',
  CAE: 'ABONO CREDITO AVAL DEL ESTADO'
}

const CONCEPTOS = {
  MTRD: 'Matrícula del semestre',
  1773: 'Arancel del semestre',
  POTC: 'Pago con tarjeta de crédito',
  MORA: 'Interés por pago atrasado',
  CAE: 'Abono del CAE (Crédito con Aval del Estado)'
}

const TIPO_POR_CODIGO = { MTRD: 'cobro', 1773: 'cobro', POTC: 'pago', MORA: 'interes', CAE: 'beneficio' }

let secuencia = 0
const mov = (fecha, periodo, codigo, monto, extra = {}) => {
  const tipo = TIPO_POR_CODIGO[codigo]
  const esCargo = tipo === 'cobro' || tipo === 'interes'
  secuencia += 1
  return {
    id: `m${secuencia}`,
    fecha,
    periodo,
    codigo: String(codigo),
    descripcionOriginal: DESCRIPCIONES[codigo],
    concepto: extra.concepto || CONCEPTOS[codigo],
    tipo,
    cargo: esCargo ? monto : 0,
    pago: esCargo ? 0 : monto,
    recibo: extra.recibo || null,
    detalle: extra.detalle || null
  }
}

export const MOVIMIENTOS_INICIALES = [
  // 1° Semestre 2025 — arancel $3.140.000, CAE $1.250.000, cuotas de $378.000
  mov('2025-01-14', '202510', 'MTRD', 130000),
  mov('2025-01-14', '202510', 1773, 3140000),
  mov('2025-01-16', '202510', 'POTC', 130000, { recibo: '771032', detalle: 'Matrícula' }),
  mov('2025-03-28', '202510', 'POTC', 378000, { recibo: '774510', detalle: 'Cuota 1 de 5 del arancel' }),
  mov('2025-04-18', '202510', 'CAE', 1250000, { detalle: 'CAE asignado al 1° semestre 2025' }),
  mov('2025-04-29', '202510', 'POTC', 378000, { recibo: '776884', detalle: 'Cuota 2 de 5 del arancel' }),
  mov('2025-05-30', '202510', 'POTC', 378000, { recibo: '779120', detalle: 'Cuota 3 de 5 del arancel' }),
  mov('2025-07-02', '202510', 'MORA', 325, { detalle: 'Cuota 4 pagada 2 días después de su vencimiento (30 jun)' }),
  mov('2025-07-02', '202510', 'POTC', 378325, { recibo: '781547', detalle: 'Cuota 4 de 5 del arancel + interés' }),
  mov('2025-07-29', '202510', 'POTC', 378000, { recibo: '783902', detalle: 'Cuota 5 de 5 del arancel' }),

  // 2° Semestre 2025
  mov('2025-07-14', '202520', 'MTRD', 130000),
  mov('2025-07-14', '202520', 1773, 3140000),
  mov('2025-07-16', '202520', 'POTC', 130000, { recibo: '784011', detalle: 'Matrícula' }),
  mov('2025-08-28', '202520', 'POTC', 378000, { recibo: '786530', detalle: 'Cuota 1 de 5 del arancel' }),
  mov('2025-09-19', '202520', 'CAE', 1250000, { detalle: 'CAE asignado al 2° semestre 2025' }),
  mov('2025-09-29', '202520', 'POTC', 378000, { recibo: '789214', detalle: 'Cuota 2 de 5 del arancel' }),
  mov('2025-10-30', '202520', 'POTC', 378000, { recibo: '792208', detalle: 'Cuota 3 de 5 del arancel' }),
  mov('2025-11-27', '202520', 'POTC', 378000, { recibo: '795671', detalle: 'Cuota 4 de 5 del arancel' }),
  mov('2025-12-29', '202520', 'POTC', 378000, { recibo: '798845', detalle: 'Cuota 5 de 5 del arancel' }),

  // 1° Semestre 2026 — arancel $3.245.000, CAE $1.300.000, cuotas de $389.000
  mov('2026-01-14', '202610', 'MTRD', 137500),
  mov('2026-01-14', '202610', 1773, 3245000),
  mov('2026-01-16', '202610', 'POTC', 137500, { recibo: '806580', detalle: 'Matrícula' }),
  mov('2026-03-24', '202610', 'POTC', 389000, { recibo: '811207', detalle: 'Cuota 1 de 5 del arancel' }),
  mov('2026-04-15', '202610', 'CAE', 1300000, { detalle: 'CAE asignado al 1° semestre 2026' }),
  mov('2026-05-04', '202610', 'MORA', 298, { detalle: 'Cuota 2 pagada 4 días después de su vencimiento (30 abr)' }),
  mov('2026-05-04', '202610', 'POTC', 389298, { recibo: '815354', detalle: 'Cuota 2 de 5 del arancel + interés' }),
  mov('2026-05-29', '202610', 'POTC', 389000, { recibo: '819637', detalle: 'Cuota 3 de 5 del arancel' }),
  mov('2026-06-28', '202610', 'POTC', 389000, { recibo: '826622', detalle: 'Cuota 4 de 5 del arancel' }),
  mov('2026-07-27', '202610', 'POTC', 389000, { recibo: '830118', detalle: 'Cuota 5 de 5 del arancel' }),

  // 2° Semestre 2026 (actual)
  mov('2026-07-14', '202620', 'MTRD', 137500),
  mov('2026-07-14', '202620', 1773, 3245000),
  mov('2026-07-16', '202620', 'POTC', 137500, { recibo: '831204', detalle: 'Matrícula' }),
  mov('2026-09-05', '202620', 'MORA', 1082, { detalle: 'Cuota 1 pagada 5 días después de su vencimiento (31 ago)' }),
  mov('2026-09-05', '202620', 'POTC', 390082, { recibo: '835421', detalle: 'Cuota 1 de 5 del arancel + interés' }),
  mov('2026-09-22', '202620', 'CAE', 1300000, { detalle: 'CAE asignado al 2° semestre 2026' }),
  mov('2026-09-29', '202620', 'POTC', 389000, { recibo: '838877', detalle: 'Cuota 2 de 5 del arancel' }),
  mov('2026-10-28', '202620', 'POTC', 389000, { recibo: '842310', detalle: 'Cuota 3 de 5 del arancel' })
]

// Plan de cuotas del semestre actual (arancel – CAE = $1.945.000 en 5 cuotas)
export const CUOTAS_INICIALES = [
  { id: 'c1', numero: 1, codigo: '1773', vence: '2026-08-31', monto: 389000, pagada: true },
  { id: 'c2', numero: 2, codigo: '1773', vence: '2026-09-30', monto: 389000, pagada: true },
  { id: 'c3', numero: 3, codigo: '1773', vence: '2026-10-31', monto: 389000, pagada: true },
  { id: 'c4', numero: 4, codigo: '1773', vence: '2026-11-30', monto: 389000, pagada: false },
  { id: 'c5', numero: 5, codigo: '1773', vence: '2026-12-31', monto: 389000, pagada: false }
]

export const ARANCEL_SEMESTRE = 3245000
export const CAE_SEMESTRE = 1300000

// Beneficios: USM + CAE (Ingresa) + Mineduc/JUNAEB
// estado: 'recibido' | 'en-camino' | 'atencion'
export const BENEFICIOS = [
  {
    id: 'cae',
    nombre: 'Crédito con Aval del Estado (CAE)',
    corto: 'CAE',
    origen: 'Comisión Ingresa',
    origenTipo: 'Estado',
    comoLlega: 'No se deposita a ti: se abona a tu cuenta USM y rebaja tu arancel. Por eso tus cuotas son de $389.000 y no de $649.000.',
    frecuencia: 'Una vez por semestre',
    monto: 1300000,
    pagos: [
      { periodo: '2S 2026', mes: 'Septiembre 2026', fecha: '2026-09-22', monto: 1300000, estado: 'recibido', destino: 'Abonado a tu cuenta USM' },
      { periodo: '1S 2026', mes: 'Abril 2026', fecha: '2026-04-15', monto: 1300000, estado: 'recibido', destino: 'Abonado a tu cuenta USM' },
      { periodo: '2S 2025', mes: 'Septiembre 2025', fecha: '2025-09-19', monto: 1250000, estado: 'recibido', destino: 'Abonado a tu cuenta USM' },
      { periodo: '1S 2025', mes: 'Abril 2025', fecha: '2025-04-18', monto: 1250000, estado: 'recibido', destino: 'Abonado a tu cuenta USM' }
    ],
    proximo: { texto: 'Renovación CAE 2027: Ingresa la realiza automáticamente si mantienes avance académico.', estado: 'info' },
    enlace: { texto: 'Ver mi crédito en Ingresa', url: 'https://portal.ingresa.cl' },
    pasos: [
      { titulo: 'Ingresa asigna el crédito', fecha: '2026-03-27', hecho: true },
      { titulo: 'El banco transfiere a la USM', fecha: '2026-09-15', hecho: true },
      { titulo: 'La USM lo abona a tu cuenta', fecha: '2026-09-22', hecho: true },
      { titulo: 'Tus cuotas se rebajan', fecha: '2026-09-22', hecho: true }
    ]
  },
  {
    id: 'ayudantia',
    nombre: 'Beca de Ayudantía',
    corto: 'Ayudantía',
    origen: 'Departamento de Informática USM',
    origenTipo: 'USM',
    comoLlega: 'Depósito directo a tu cuenta bancaria registrada, a fines de cada mes trabajado. Ayudantía de INF-134 Estructuras de Datos.',
    frecuencia: 'Mensual (marzo a julio y agosto a diciembre)',
    monto: 95250,
    pagos: [
      { mes: 'Noviembre 2026', fecha: '2026-11-27', monto: 95250, estado: 'en-camino', destino: 'Depósito programado' },
      { mes: 'Octubre 2026', fecha: '2026-10-28', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26102801' },
      { mes: 'Septiembre 2026', fecha: '2026-09-29', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26092901' },
      { mes: 'Agosto 2026', fecha: '2026-08-28', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26082801' },
      { mes: 'Junio 2026', fecha: '2026-06-27', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26062501' },
      { mes: 'Mayo 2026', fecha: '2026-05-29', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '260527001' },
      { mes: 'Abril 2026', fecha: '2026-04-28', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26042901' },
      { mes: 'Marzo 2026', fecha: '2026-04-08', monto: 95250, estado: 'recibido', destino: 'Depositado en BancoEstado ···5678', documento: '26040601' }
    ]
  },
  {
    id: 'baes',
    nombre: 'Beca de Alimentación (BAES)',
    corto: 'BAES',
    origen: 'JUNAEB · Mineduc',
    origenTipo: 'Estado',
    comoLlega: 'Se carga en tu tarjeta de alimentación JUNAEB los primeros días de cada mes (marzo a diciembre). No pasa por tu cuenta USM.',
    frecuencia: 'Mensual (10 cargas al año)',
    monto: 47000,
    pagos: [
      { mes: 'Noviembre 2026', fecha: '2026-11-02', monto: 47000, estado: 'en-camino', destino: 'Carga programada en tarjeta JUNAEB' },
      { mes: 'Octubre 2026', fecha: '2026-10-01', monto: 47000, estado: 'recibido', destino: 'Cargado en tarjeta JUNAEB' },
      { mes: 'Septiembre 2026', fecha: '2026-09-01', monto: 47000, estado: 'recibido', destino: 'Cargado en tarjeta JUNAEB' },
      { mes: 'Agosto 2026', fecha: '2026-08-03', monto: 47000, estado: 'recibido', destino: 'Cargado en tarjeta JUNAEB' }
    ],
    enlace: { texto: 'Consultar en JUNAEB', url: 'https://www.junaeb.cl' }
  }
]

export const CUENTA_BANCARIA_INICIAL = {
  banco: 'BancoEstado',
  tipo: 'CuentaRUT',
  numero: '21345678',
  titular: ESTUDIANTE.nombreCompleto,
  rut: ESTUDIANTE.rut,
  actualizada: '2025-03-10'
}

export const BANCOS = ['BancoEstado', 'Banco de Chile', 'Banco Santander', 'Banco BCI', 'Scotiabank', 'Banco Itaú', 'Banco Falabella', 'Banco Ripley', 'Tenpo', 'Mercado Pago']
export const TIPOS_CUENTA = ['CuentaRUT / Cuenta Vista', 'Cuenta Corriente', 'Cuenta de Ahorro']

export const NOTIFICACIONES_INICIALES = [
  { id: 'n1', fecha: '2026-10-28', texto: 'Te depositamos $95.250 de tu Beca de Ayudantía de octubre.', ruta: '/beneficios', leida: false, tipo: 'beneficio' },
  { id: 'n2', fecha: '2026-10-28', texto: 'Recibimos tu pago de $389.000 (cuota 3 de 5). Comprobante N° 842310.', ruta: '/movimientos', leida: false, tipo: 'pago' },
  { id: 'n3', fecha: '2026-10-25', texto: 'Tu cuota 4 de $389.000 vence el 30 de noviembre.', ruta: '/pagar', leida: false, tipo: 'aviso' },
  { id: 'n4', fecha: '2026-09-22', texto: 'Tu CAE del 2° semestre ($1.300.000) fue abonado a tu cuenta USM.', ruta: '/beneficios', leida: true, tipo: 'beneficio' }
]

// Glosario usado en tooltips y en la página de ayuda (H2)
export const GLOSARIO = {
  cargo: {
    termino: 'Cargo',
    simple: 'Te cobraron',
    definicion: 'Monto que la universidad te cobra: matrícula, arancel o intereses. Aumenta lo que debes.'
  },
  pago: {
    termino: 'Pago',
    simple: 'Pagaste / se abonó',
    definicion: 'Dinero que entró a tu cuenta USM: tus pagos o beneficios como el CAE. Disminuye lo que debes.'
  },
  saldo: {
    termino: 'Saldo',
    simple: 'Lo que quedaba por pagar',
    definicion: 'Lo que debías en ese semestre justo después de ese movimiento. Si es $0, ese semestre quedó al día.'
  },
  recibo: {
    termino: 'Recibo',
    simple: 'N° de comprobante',
    definicion: 'Número del comprobante de un pago. Sirve para demostrar que pagaste si algo no calza en caja.'
  },
  codigo: {
    termino: 'Código',
    simple: 'Código interno',
    definicion: 'Código contable de la USM (ej. 1773 = arancel de tu carrera, MTRD = matrícula, POTC = pago con tarjeta). No necesitas usarlo.'
  },
  periodo: {
    termino: 'Período',
    simple: 'Semestre',
    definicion: 'Semestre al que pertenece el movimiento. 202620 = 2° semestre 2026; 202610 = 1° semestre 2026.'
  },
  saldoCuenta: {
    termino: 'Saldo de cuenta',
    simple: 'Lo que debes hoy',
    definicion: 'Suma de todo lo que aún no has pagado, incluidas cuotas que todavía no vencen.'
  },
  total: {
    termino: 'Total seleccionado para pagar',
    simple: 'Lo que vas a pagar ahora',
    definicion: 'Suma de las cuotas que marcaste. Se calcula sola al marcar o desmarcar.'
  }
}
