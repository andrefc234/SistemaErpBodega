# Guía de Capacitación Rápida — Sistema CERVECERÍA

## ¿Qué es este sistema?

Un sistema de gestión para la comercialización y distribución de productos. Ayuda a controlar:
- Visitas a tiendas
- Pedidos y entregas
- Inventario en almacén
- Liquidaciones y facturación

---

## El Ciclo Completo (5 pasos)

```
VISITA → PEDIDO → PICKING → LIQUIDACIÓN → FACTURACIÓN
```

| # | Paso | ¿Quién lo hace? | ¿Qué pasa? |
|---|------|-----------------|------------|
| 1 | **Visita** | Promotor | Captura datos de la tienda (altas, bajas, existencia) |
| 2 | **Pedido** | Auto | El sistema crea un pedido con las altas de la visita |
| 3 | **Picking** | Admin/Almacén | Prepara los productos para entrega |
| 4 | **Liquidación** | Admin/Vendedor | Confirma la entrega y registra el monto |
| 5 | **Facturación** | Admin | Emite la factura oficial |

---

## ¿Qué hace cada rol?

| Admin | Promotor |
|-------|----------|
| Ve todo el sistema | Ve solo lo necesario |
| Administra productos, clientes, tiendas | Captura visitas |
| Revisa y libera visitas | Consulta sus visitas |
| Genera picking | Revisa estatus |
| Captura liquidaciones | — |
| Crea facturas | — |
| Configura el sistema | — |

---

## Lo que el Promotor debe hacer CADA DÍA

### Antes de salir
1. Inicia sesión
2. Revisa tu panel

### Durante las visitas
1. Por cada tienda → captura **una visita**
2. Registra con cuidado:
   - **Altas** = lo que dejas (genera pedido)
   - **Bajas** = lo que recoges
   - **Existencia** = lo que hay
   - **Observaciones** importantes

### Al volver
1. Captura las visitas si no lo hiciste en campo
2. Revisa que todas estén registradas

---

## Lo que el Admin debe hacer CADA DÍA

1. **Revisar visitas** → Liberarlas
2. **Generar picking** → Preparar entregas
3. **Capturar liquidaciones** → Confirmar entregas
4. **Revisar stock** → Evitar desabastos

---

## Conceptos Clave

| Término | Significado |
|---------|-------------|
| **TDA** | Código único de cada tienda |
| **Altas** | Producto nuevo que se entrega |
| **Bajas** | Producto que se retira |
| **Existencia** | Inventario actual en tienda |
| **Rotación** | Velocidad de venta (0-100%) |
| **Picking** | Lista de preparación para entrega |
| **Liquidación** | Confirmación de entrega con montos |
| **Remisión** | Nota de entrega (se genera desde liquidación) |
| **Folio** | Número único de identificación |

---

## Errores Comunes y Cómo Evitarlos

| Error | Cómo evitarlo |
|-------|---------------|
| Altas incorrectas | Verifica cantidades antes de guardar |
| Tienda equivocada | Confirma el nombre y TDA |
| Olvidar capturar visita | Registra el mismo día |
| No liberar visitas | Admin debe revisar diario |
| Stock mal contado | Sé preciso con las existencias |

---

## Pantallas Principales

### Dashboard del Promotor
```
┌─────────────────────────────────────────┐
│  Hola, [Nombre]           [avatar] [⏻] │
│                                          │
│  ┌─ Flujo de trabajo ─────────────────┐ │
│  │  1→Visita  2→Pedido  3→Picking    │ │
│  │  4→Liquidación  5→Facturación     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Hoy: 3│ │Pend:1│ │Ped: 5│ │Tdas:8│   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                          │
│  ┌─ [Nueva Visita] ──┐ ┌─[Consultar]──┐ │
│  └───────────────────┘ └──────────────┘ │
└─────────────────────────────────────────┘
```

### Dashboard del Admin
```
┌─────────────────────────────────────────┐
│  Panel de Administración                 │
│                                          │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌──────┐│
│  │Pick: 3│ │Ped: 5 │ │Liq: 12│ │Fac: 8││
│  └───────┘ └───────┘ └───────┘ └──────┘│
│                                          │
│  ┌─ Pickings Pendientes ──────────────┐ │
│  │ Tienda   │ TDA  │  Estatus  │[Rev] │ │
│  │ La Esq.  │ 001  │ ⬤ Pend.  │ →    │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Tiempos Estimados

| Actividad | Tiempo |
|-----------|--------|
| Capturar una visita | 3-5 minutos |
| Revisar 10 visitas | 10-15 minutos |
| Generar 5 picking | 5-10 minutos |
| Capturar 1 liquidación | 3-5 minutos |

---

## Soporte

Si algo no funciona o tienes dudas:
1. Revisa la Guía de Admin o Promotor (según tu rol)
2. Contacta a tu supervisor
3. Reporta el problema con: qué pantalla estabas viendo, qué hiciste, qué esperabas que pasara, y qué pasó en su lugar 
