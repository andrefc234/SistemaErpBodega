# Sistema ERP Bodega

Web app para la gestión de visitas de promotoría, pedidos, picking, liquidaciones y facturación de una cervecería/distribuidora.

## Tecnologías

- **Next.js** (Pages Router)
- **React 19**
- **Tailwind CSS** + **react-bootstrap**
- **Prisma ORM** + **SQLite**
- **SQLite** (archivo local, sin servidor de base de datos)

## Requisitos

- Node.js 18+
- npm

## Setup rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Crear BD y cargar datos de prueba
npm run seed

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Accesos de prueba

| Usuario     | Clave        | Rol      |
|-------------|-------------|----------|
| admin       | admin123    | admin    |
| promotor    | promotor123 | promotor |
| vendedor    | vendedor123 | admin    |
| repartidor  | repartidor123 | admin  |

## Estructura del proyecto

```
components/
├── Almacen/          # Pedidos, picking, fabricante
├── Crear/            # Formularios de creación (producto, cliente, tienda, etc.)
├── Dashboard/        # Panel principal y enrutador de vistas
├── DatosMaestros/    # CRUD de productos, clientes, tiendas
├── Layout/           # Sidebar, navegación
├── Liquidacion/      # Liquidaciones diarias
├── Promotoria/       # Visitas (crear y consultar)
└── ui/               # Componentes reutilizables (Button, Table, Card, Badge, etc.)

pages/
├── api/              # API REST (Prisma)
├── index.js          # Única página (SPA con vistas internas)
└── login.js          # Página de inicio de sesión

prisma/
├── schema.prisma     # Modelo de datos
└── seed.js           # Datos de prueba
```

## Flujo principal

1. **Visita de promotoría** — El promotor visita una tienda, registra altas/bajas/existencia de cada producto. Si hay altas > 0, se genera automáticamente un pedido.
2. **Pedido** — Queda en estatus `pendiente` hasta que se libera.
3. **Picking** — Al liberar un pedido se crea un picking list para el almacén.
4. **Liquidación** — Cuando se entrega, se registra la liquidación con montos y piezas.
5. **Facturación** — Las liquidaciones pasan a facturación mensual.

## Comandos útiles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run seed       # Recargar datos de prueba (borra todo y recrea)
```

## ENOSPC (file watchers)

Si aparece `Watchpack Error (watcher): Error: ENOSPC` al hacer `npm run dev`:

```bash
sudo sysctl -w fs.inotify.max_user_watches=524288
```
