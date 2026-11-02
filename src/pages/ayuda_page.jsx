import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import Icono from '../components/icono'
import { EncabezadoPagina } from '../components/ui'
import { GLOSARIO } from '../data/datos'

const DONDE = [
  { pregunta: '¿Llegó mi beca o mi CAE?', ruta: '/beneficios', destino: 'Becas y beneficios' },
  { pregunta: '¿Cuánto pagué el semestre pasado?', ruta: '/historial', destino: 'Resumen por semestre' },
  { pregunta: '¿Cuándo hice un pago y cuál es su comprobante?', ruta: '/movimientos', destino: 'Movimientos uno a uno' },
  { pregunta: '¿Cuánto debo y cuándo vence?', ruta: '/pagar', destino: 'Pagar cuotas' },
  { pregunta: '¿Dónde me depositan la ayudantía?', ruta: '/cuenta-bancaria', destino: 'Mi cuenta bancaria' }
]

const FAQ = [
  { p: '¿Por qué mi cuota es de $389.000 y no de $649.000?', r: 'Porque tu CAE ya pagó $1.300.000 de tu arancel este semestre. El resto ($1.945.000) se divide en 5 cuotas.' },
  { p: 'Ingresa dice que mi CAE fue pagado, pero no lo veo.', r: 'El banco transfiere a la USM y la USM lo abona a tu cuenta; esto puede tardar hasta 10 días hábiles. Si pasó más tiempo, usa “Reportar un problema” en Becas y beneficios.' },
  { p: '¿Qué hago si un pago no aparece?', r: 'Busca el número de comprobante en tu correo y repórtalo en Caja o desde Becas y beneficios. Los pagos hechos aquí aparecen al instante.' },
  { p: '¿Qué es el interés de mora?', r: 'Un recargo pequeño que se cobra cuando pagas una cuota después de su fecha de vencimiento.' }
]

export const AyudaPage = () => {
  const [abierta, setAbierta] = useState(null)
  return (
    <div className='pagina pagina--angosta'>
      <EncabezadoPagina
        seccion='ayuda'
        icono='ayuda'
        titulo='Ayuda y glosario'
        subtitulo='Qué significa cada palabra y dónde encontrar cada cosa.'
        migas={[{ texto: 'Inicio', ruta: '/inicio' }, { texto: 'Ayuda' }]}
      />

      <section className='seccion'>
        <h2 className='seccion__titulo'>¿Dónde encuentro…?</h2>
        <div className='preguntas'>
          {DONDE.map((d) => (
            <Link key={d.ruta} to={d.ruta} className='pregunta'>
              <span className='pregunta__texto'>
                {d.pregunta}
                <span className='pregunta__destino'>→ {d.destino}</span>
              </span>
              <Icono nombre='flecha' className='pregunta__flecha' />
            </Link>
          ))}
        </div>
      </section>

      <section className='seccion'>
        <h2 className='seccion__titulo'>Glosario</h2>
        <dl className='glosario'>
          {Object.values(GLOSARIO).map((g) => (
            <div key={g.termino} className='glosario__item'>
              <dt><strong>{g.termino}</strong> <span className='glosario__simple'>= {g.simple}</span></dt>
              <dd>{g.definicion}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className='seccion'>
        <h2 className='seccion__titulo'>Preguntas frecuentes</h2>
        <div className='faq'>
          {FAQ.map((f, i) => (
            <div key={f.p} className='faq__item'>
              <button type='button' className='faq__pregunta' aria-expanded={abierta === i} onClick={() => setAbierta(abierta === i ? null : i)}>
                {f.p}
                <Icono nombre='flecha' tamano={16} className={abierta === i ? 'desplegar__icono--abierto' : ''} />
              </button>
              {abierta === i && <p className='faq__respuesta'>{f.r}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AyudaPage
