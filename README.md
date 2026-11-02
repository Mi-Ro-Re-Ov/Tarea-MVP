# Autoservicio USM · Mis finanzas (MVP)

MVP en React para la Tarea 10 de Diseño de Interfaces Usuarias (USM). Rediseña el
flujo financiero del Portal de Autoservicio (autoservicio.usm.cl) para la Persona
**Alejandro González** (estudiante de pregrado con CAE parcial), a partir de la
evaluación del sistema existente (Entrega 2).

Solo frontend: los datos son simulados (al 30 de octubre de 2026) y se guardan en
memoria mientras la pestaña está abierta.

## Metas de usuario implementadas

| Hipótesis | Meta del usuario | Dónde |
|---|---|---|
| H1 | Confirmar sin dudas que su beca y su CAE llegaron | **Becas y beneficios** (`#/beneficios`) |
| H2 | Entender “Cargo”, “Pago”, “Saldo” y “Recibo” | **Movimientos uno a uno** (`#/movimientos`) |
| H3 | Encontrar lo que pagó el semestre pasado sin confundir vistas | **Mi estado de cuenta → Resumen por semestre** (`#/historial`) |
| H4 | Calcular el total a pagar sin pasos redundantes | **Pagar** (`#/pagar`) |
| H5 | Verificar que un pago se efectuó sin depender del correo | **Pagar → Confirmar → ¡Pago realizado!** |
| H6 | Actualizar su cuenta bancaria en menos pasos | **Mi cuenta bancaria** (`#/cuenta-bancaria`) |

## Cómo ejecutar

Requisitos: Node >= 16.13.1, npm >= 8.1.2

```
npm install
npm run dev     # http://localhost:5050
npm run prod    # genera dist/ (se puede publicar en GitHub Pages)
```

En el login sirve cualquier contraseña.

## Estructura

```
src/
  components/   cabecera, barra de navegación, tooltip, modal y piezas comunes
  context/      estado de la cuenta (pagos, cuotas, notificaciones) con useReducer
  data/         datos simulados: movimientos, cuotas, beneficios, glosario
  pages/        una página por vista
  stylesheets/  SCSS con estructura BEM; un color por sección
  utils/        formato de montos (CLP) y fechas
```

Se usa `HashRouter` para que el MVP funcione en GitHub Pages sin configurar el servidor.

Basado en [alexarenasf/frontend-sample-app](https://github.com/alexarenasf/frontend-sample-app).
