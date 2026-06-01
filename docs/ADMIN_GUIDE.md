# Guía de Administrador — Sistema de Gestión CERVECERÍA

## 1. Acceso al Sistema

1. Abre el navegador y ve a la dirección del sistema.
2. Haz clic en **Iniciar Sesión**.
3. Ingresa tu **clave de usuario** y **contraseña**.
4. Haz clic en **Entrar**.

> Si olvidaste tu contraseña, contacta al soporte técnico.

---

## 2. Panel de Control (Dashboard)

Al iniciar sesión como administrador, verás el **Panel de Administración** con:

### Tarjetas de resumen (KPIs)
- **Pendientes de Picking** — Número de picking list por liberar.
- **Pedidos Pendientes** — Pedidos que aún no se han procesado.
- **Liquidaciones** — Total de liquidaciones registradas y monto acumulado.
- **Facturas** — Total de facturas emitidas.

### Secciones del panel
- **Pickings Pendientes** — Lista de pickings que requieren acción. Haz clic en "Revisar" para ir a la vista completa.
- **Últimas Liquidaciones** — Las liquidaciones más recientes con montos.
- **Alertas** — Productos con stock bajo (menos de 50 unidades).

---

## 3. Navegación por el Sistema

El menú lateral izquierdo está organizado en secciones:

| Sección | Descripción |
|---------|-------------|
| **Datos Maestros** | Productos, Tiendas, Clientes |
| **Almacén** | Fabricante, Consulta de Pedidos, Productos en Almacén |
| **Capturas** | Registro de Visitas |
| **Picking List** | Consultar Picking List, Pendientes |
| **Liquidaciones** | Captura de Folios, Liquidaciones Diarias, Remisión |
| **Facturación** | Captura de Facturas, Facturación por Mes |
| **Promotoría** | Consultar Visitas |
| **Configuración Base** | Agregar Cliente, Producto, Tienda, Empleado |

Haz clic en una sección para expandir las opciones, y luego en la opción deseada para navegar.

---

## 4. Gestión de Datos Maestros

### Productos
1. Ve a **Datos Maestros > Productos**.
2. Revisa la lista de productos con su código de barras y stock actual.
3. Para agregar un nuevo producto: **Configuración Base > Agregar Producto**.
4. Completa el formulario: nombre, código de barras, cantidad inicial en almacén.

### Clientes
1. Ve a **Datos Maestros > Clientes**.
2. Cada cliente puede tener **precios personalizados por producto**.
3. Para agregar: **Configuración Base > Agregar Cliente**.
4. Ingresa: nombre, canal (Tradicional/Restaurante/Bar), y los precios por producto.

### Tiendas
1. Ve a **Datos Maestros > Tiendas**.
2. Las tiendas pertenecen a un cliente y tienen un TDA único.
3. Configura los **días de promotoría** (cuándo visita el promotor) y **días de entrega**.
4. Para agregar: **Configuración Base > Agregar Tienda**.

### Empleados
1. Ve a **Configuración Base > Agregar Empleado**.
2. Crea usuarios con rol de admin o promotor.
3. Los promotores solo ven las secciones que necesitan para su trabajo.

---

## 5. Flujo de Trabajo: Visita → Liquidación

### Paso 1: Revisar Visitas
1. Ve a **Promotoría > Consultar Visitas**.
2. Filtra por fecha para ver las visitas del día.
3. Revisa los datos capturados: altas, bajas, existencia, rotación.
4. **Cambia el estatus a "liberado"** para indicar que la visita fue aprobada.

### Paso 2: Generar Picking
1. Ve a **Almacén > Consulta de Pedidos**.
2. Verás los pedidos generados automáticamente desde las visitas.
3. Selecciona el día de entrega y el empleado encargado.
4. Haz clic en **"Crear Picking"** para generar el picking list.
5. El pedido cambia a estatus "liberado".

### Paso 3: Revisar Pickings
1. Ve a **Picking List > Consultar Picking List**.
2. Revisa los pickings pendientes y asígnalos al repartidor.

### Paso 4: Capturar Liquidación
1. Ve a **Liquidaciones > Captura de Folios**.
2. Selecciona el cliente, la tienda y el TDA.
3. Ingresa: folio de liquidación, número de remisión, monto facturado.
4. Por cada producto, ingresa las piezas entregadas.
5. La liquidación se guarda con estatus completado.

### Paso 5: Ver Liquidaciones
1. Ve a **Liquidaciones > Liquidaciones Diarias**.
2. Usa el filtro de rango de fechas (Desde / Hasta).
3. Usa los botones de acceso rápido: Hoy, 7 días, 30 días, Este mes.
4. Haz clic en **"Consultar"** para ver los resultados.
5. Los totales se muestran en las tarjetas superiores.

### Paso 6: Facturación
1. Ve a **Facturación > Captura de Facturas**.
2. Ingresa los datos de la factura asociada a una liquidación.
3. Consulta las facturas por mes en **Facturación > Facturación por Mes**.

---

## 6. Almacén e Inventario

### Consultar Productos en Almacén
1. Ve a **Almacén > Productos en Almacén**.
2. Revisa el stock actual de todos los productos.
3. Puedes ver los pedidos pendientes que consumirán inventario.

### Pedidos a Fabricante
1. Ve a **Almacén > Fabricante**.
2. Crea pedidos al fabricante para reabastecer el almacén.
3. Ingresa las cantidades necesarias por producto.

### Estatus de Almacén
1. Dentro de la sección Almacén, usa la opción "Revisión Almacén".
2. Captura fotos del estado actual del almacén para registro.

---

## 7. Configuración y Administración

### Roles de Usuario
- **admin** — Acceso completo a todas las secciones, incluyendo Configuración Base.
- **promotor** — Acceso limitado a las secciones operativas (sin Configuración Base).

### Recomendaciones
- Revisa las visitas diariamente para liberar pedidos a tiempo.
- Mantén los precios de clientes actualizados, especialmente cuando cambien los costos.
- Revisa el stock bajo semanalmente para evitar desabastos.
- Capacita a los promotores usando la Guía de Promotor. 
