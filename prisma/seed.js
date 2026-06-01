const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

function today(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

async function main() {
  console.log('🌱  Limpiando datos existentes...')
  await prisma.estatusAlmacenProducto.deleteMany()
  await prisma.estatusAlmacen.deleteMany()
  await prisma.pedidoFabricanteProducto.deleteMany()
  await prisma.pedidoFabricante.deleteMany()
  await prisma.liquidacionProducto.deleteMany()
  await prisma.liquidacion.deleteMany()
  await prisma.facturacion.deleteMany()
  await prisma.cambioProducto.deleteMany()
  await prisma.cambio.deleteMany()
  await prisma.pickingProducto.deleteMany()
  await prisma.picking.deleteMany()
  await prisma.pedidoProducto.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.visitaProducto.deleteMany()
  await prisma.visita.deleteMany()
  await prisma.clienteProducto.deleteMany()
  await prisma.diaEntrega.deleteMany()
  await prisma.diaPromotoria.deleteMany()
  await prisma.tienda.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.user.deleteMany()

  // ──────────────────────────────────────
  // 1. USUARIOS
  // ──────────────────────────────────────
  console.log('👤  Creando usuarios...')
  const users = await Promise.all([
    prisma.user.create({ data: { nombre: 'Administrador', clave: 'admin', role: 'admin', password: await bcrypt.hash('admin123', 10) } }),
    prisma.user.create({ data: { nombre: 'Carlos López', clave: 'promotor', role: 'promotor', password: await bcrypt.hash('promotor123', 10) } }),
    prisma.user.create({ data: { nombre: 'María García', clave: 'vendedor', role: 'admin', password: await bcrypt.hash('vendedor123', 10) } }),
    prisma.user.create({ data: { nombre: 'Juan Pérez', clave: 'repartidor', role: 'admin', password: await bcrypt.hash('repartidor123', 10), telefono: '555-0101' } }),
  ])
  const [adminUser, promotorUser, vendedorUser, repartidorUser] = users

  // ──────────────────────────────────────
  // 2. PRODUCTOS (catálogo base)
  // ──────────────────────────────────────
  console.log('🍺  Creando productos...')
  const products = await Promise.all([
    prisma.producto.create({ data: { nombre: 'Cerveza Clara Lata 355ml', codigoBarras: '750100010001', cantidadAlmacen: 500 } }),
    prisma.producto.create({ data: { nombre: 'Cerveza Oscura Lata 355ml', codigoBarras: '750100020002', cantidadAlmacen: 300 } }),
    prisma.producto.create({ data: { nombre: 'Cerveza Light Lata 355ml', codigoBarras: '750100030003', cantidadAlmacen: 200 } }),
    prisma.producto.create({ data: { nombre: 'Cerveza Premium Botella 355ml', codigoBarras: '750100040004', cantidadAlmacen: 150 } }),
    prisma.producto.create({ data: { nombre: 'Agua Purificada Garrafón 20L', codigoBarras: '750100050005', cantidadAlmacen: 80 } }),
    prisma.producto.create({ data: { nombre: 'Refresco Cola Lata 355ml', codigoBarras: '750100060006', cantidadAlmacen: 400 } }),
  ])
  const [prodClara, prodOscura, prodLight, prodPremium, prodAgua, prodRefresco] = products

  // ──────────────────────────────────────
  // 3. CLIENTES con PRECIOS POR PRODUCTO
  // ──────────────────────────────────────
  console.log('🏢  Creando clientes con precios personalizados...')

  console.log('🏨  Creando cliente HORECA...')

  const clienteHoreca = await prisma.cliente.create({
    data: {
      canal: 'HORECA',
      clave: 'HOR',
      nombreCliente: 'Grupo HORECA',
      productos: {
        create: [
          { nombre: prodClara.nombre, precio: 135, codigoBarras: prodClara.codigoBarras },
          { nombre: prodOscura.nombre, precio: 155, codigoBarras: prodOscura.codigoBarras },
          { nombre: prodLight.nombre, precio: 80, codigoBarras: prodLight.codigoBarras },
          { nombre: prodPremium.nombre, precio: 210, codigoBarras: prodPremium.codigoBarras },
          { nombre: prodAgua.nombre, precio: 26, codigoBarras: prodAgua.codigoBarras },
          { nombre: prodRefresco.nombre, precio: 15, codigoBarras: prodRefresco.codigoBarras },
        ]
      }
    }
  })

  console.log('🛒  Creando cliente Autoservicio...')

  const clienteAutoservicio = await prisma.cliente.create({
    data: {
      canal: 'Autoservicio',
      clave: 'AUT',
      nombreCliente: 'Supermercado El Ahorro',
      productos: {
        create: [
          { nombre: prodClara.nombre, precio: 105, codigoBarras: prodClara.codigoBarras },
          { nombre: prodOscura.nombre, precio: 125, codigoBarras: prodOscura.codigoBarras },
          { nombre: prodLight.nombre, precio: 60, codigoBarras: prodLight.codigoBarras },
          { nombre: prodPremium.nombre, precio: 165, codigoBarras: prodPremium.codigoBarras },
          { nombre: prodAgua.nombre, precio: 20, codigoBarras: prodAgua.codigoBarras },
          { nombre: prodRefresco.nombre, precio: 12, codigoBarras: prodRefresco.codigoBarras },
        ]
      }
    }
  })

  // ──────────────────────────────────────
  // 4. TIENDAS con días de visita y entrega
  // ──────────────────────────────────────
  console.log('🏪  Creando tiendas...')

  const days = { dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6 }

  const createTienda = async (data, promDays, entDays) => {
    const tienda = await prisma.tienda.create({ data: { canal: data.canal, nombreCliente: data.nombreCliente, TDA: data.TDA, nombreTienda: data.nombreTienda } })
    await Promise.all([
      ...promDays.map(dia => prisma.diaPromotoria.create({ data: { tiendaId: tienda.id, dia: days[dia] } })),
      ...entDays.map(dia => prisma.diaEntrega.create({ data: { tiendaId: tienda.id, dia: days[dia] } })),
    ])
    return tienda
  }

  const tiendas = await Promise.all([
    // HORECA tiendas
    createTienda(
      { canal: 'HORECA', nombreCliente: 'Grupo HORECA', TDA: 'HOR001', nombreTienda: 'Hotel Centro' },
      ['lun', 'jue'], ['mar', 'vie']
    ),
    createTienda(
      { canal: 'HORECA', nombreCliente: 'Grupo HORECA', TDA: 'HOR002', nombreTienda: 'Restaurante Campestre' },
      ['mie', 'sab'], ['jue', 'dom']
    ),
    // Autoservicio tiendas
    createTienda(
      { canal: 'Autoservicio', nombreCliente: 'Supermercado El Ahorro', TDA: 'AUT001', nombreTienda: 'El Ahorro Centro' },
      ['lun', 'mie', 'vie'], ['mar', 'jue', 'sab']
    ),
    createTienda(
      { canal: 'Autoservicio', nombreCliente: 'Supermercado El Ahorro', TDA: 'AUT002', nombreTienda: 'El Ahorro Plaza' },
      ['mar', 'jue', 'sab'], ['lun', 'mie', 'vie']
    ),
  ])
  const [tiendaHorC, tiendaHorCamp, tiendaAutC, tiendaAutPlaza] = tiendas

  // ──────────────────────────────────────
  // 5. TRANSACCIONES DE PRUEBA
  // ──────────────────────────────────────
  console.log('📋  Creando datos transaccionales de prueba...')

  const visitaDate = today(-3)
  const liquidacionDate = today(-1)

  // Hotel Centro — Visita + Pedido + Picking + Liquidación
  const visita1 = await prisma.visita.create({
    data: {
      folio: 'VIS-HOR-001',
      nombreTienda: 'Hotel Centro',
      TDA: 'HOR001',
      promotor: promotorUser.nombre,
      fecha: visitaDate,
      altasG: 25,
      bajasG: 2,
      totalP: 120,
      observaciones: 'Hotel con evento corporativo, requirió más Premium.',
      rotacion: '80',
      estatus: 'liberado',
      productos: { create: [
        { nombre: prodClara.nombre, alta: 12, bajas: 1, existencia: 48 },
        { nombre: prodPremium.nombre, alta: 8, bajas: 0, existencia: 24 },
        { nombre: prodAgua.nombre, alta: 5, bajas: 1, existencia: 30 },
      ]}
    }
  })

  const pedido1 = await prisma.pedido.create({
    data: {
      TDA: 'HOR001',
      empleado: repartidorUser.nombre,
      estatus: 'liberado',
      totalPedido: 25,
      fechaPromotoria: visitaDate,
      productos: { create: [
        { nombre: prodClara.nombre, numero: 12, cantidad: 12 },
        { nombre: prodPremium.nombre, numero: 8, cantidad: 8 },
        { nombre: prodAgua.nombre, numero: 5, cantidad: 5 },
      ]}
    }
  })

  const picking1 = await prisma.picking.create({
    data: {
      TDA: 'HOR001',
      fecha: 2,
      empleadoEntrega: repartidorUser.nombre,
      estatus: 'pendiente',
      tienda: 'Hotel Centro',
      idPedido: pedido1.id,
      productos: { create: [
        { nombre: prodClara.nombre, numero: 12, cantidad: 12 },
        { nombre: prodPremium.nombre, numero: 8, cantidad: 8 },
        { nombre: prodAgua.nombre, numero: 5, cantidad: 5 },
      ]}
    }
  })

  const liquidacion1 = await prisma.liquidacion.create({
    data: {
      folioLiquidacion: 'LIQ-HOR-001',
      numeroRemison: 'REM-HOR-001',
      nombreTienda: 'Hotel Centro',
      vendedor: vendedorUser.nombre,
      fechaLiquidacion: liquidacionDate,
      montoFactura: 135 * 12 + 210 * 8 + 26 * 5,
      TDA: 'HOR001',
      piezasEntregadas: 25,
      productos: { create: [
        { nombre: prodClara.nombre, existencia: 12 },
        { nombre: prodPremium.nombre, existencia: 8 },
        { nombre: prodAgua.nombre, existencia: 5 },
      ]}
    }
  })

  // El Ahorro Centro — Visita + Pedido
  const visita2 = await prisma.visita.create({
    data: {
      folio: 'VIS-AUT-001',
      nombreTienda: 'El Ahorro Centro',
      TDA: 'AUT001',
      promotor: promotorUser.nombre,
      fecha: visitaDate,
      altasG: 60,
      bajasG: 5,
      totalP: 320,
      observaciones: 'Supermercado con alta rotación, requirió reposición completa.',
      rotacion: '90',
      estatus: 'pendiente',
      productos: { create: [
        { nombre: prodClara.nombre, alta: 20, bajas: 2, existencia: 120 },
        { nombre: prodOscura.nombre, alta: 15, bajas: 1, existencia: 80 },
        { nombre: prodLight.nombre, alta: 10, bajas: 1, existencia: 50 },
        { nombre: prodRefresco.nombre, alta: 15, bajas: 1, existencia: 70 },
      ]}
    }
  })

  const pedido2 = await prisma.pedido.create({
    data: {
      TDA: 'AUT001',
      empleado: repartidorUser.nombre,
      estatus: 'pendiente',
      totalPedido: 60,
      fechaPromotoria: visitaDate,
      productos: { create: [
        { nombre: prodClara.nombre, numero: 20, cantidad: 20 },
        { nombre: prodOscura.nombre, numero: 15, cantidad: 15 },
        { nombre: prodLight.nombre, numero: 10, cantidad: 10 },
        { nombre: prodRefresco.nombre, numero: 15, cantidad: 15 },
      ]}
    }
  })

  // Restaurante Campestre — Visita + Pedido
  const visita3 = await prisma.visita.create({
    data: {
      folio: 'VIS-HOR-002',
      nombreTienda: 'Restaurante Campestre',
      TDA: 'HOR002',
      promotor: promotorUser.nombre,
      fecha: visitaDate,
      altasG: 15,
      bajasG: 1,
      totalP: 60,
      observaciones: 'Visita de rutina, rotación normal.',
      rotacion: '65',
      estatus: 'pendiente',
      productos: { create: [
        { nombre: prodClara.nombre, alta: 6, bajas: 0, existencia: 24 },
        { nombre: prodOscura.nombre, alta: 4, bajas: 1, existencia: 16 },
        { nombre: prodLight.nombre, alta: 5, bajas: 0, existencia: 20 },
      ]}
    }
  })

  const pedido3 = await prisma.pedido.create({
    data: {
      TDA: 'HOR002',
      empleado: repartidorUser.nombre,
      estatus: 'pendiente',
      totalPedido: 15,
      fechaPromotoria: visitaDate,
      productos: { create: [
        { nombre: prodClara.nombre, numero: 6, cantidad: 6 },
        { nombre: prodOscura.nombre, numero: 4, cantidad: 4 },
        { nombre: prodLight.nombre, numero: 5, cantidad: 5 },
      ]}
    }
  })

  // ──────────────────────────────────────
  // REPORTE FINAL
  // ──────────────────────────────────────
  console.log('\n═══════════════════════════════════════')
  console.log('✅  DATOS DE PRUEBA CARGADOS')
  console.log('═══════════════════════════════════════')
  console.log(`   👤  Usuarios:           ${await prisma.user.count()}`)
  console.log(`   🍺  Productos:          ${await prisma.producto.count()}`)
  console.log(`   🏢  Clientes:           ${await prisma.cliente.count()}`)
  console.log(`   💰  Precios x Cliente:  ${await prisma.clienteProducto.count()}`)
  console.log(`   🏪  Tiendas:            ${await prisma.tienda.count()}`)
  console.log(`   📅  Días Promotoría:    ${await prisma.diaPromotoria.count()}`)
  console.log(`   🚚  Días Entrega:       ${await prisma.diaEntrega.count()}`)
  console.log(`   📋  Visitas:            ${await prisma.visita.count()}`)
  console.log(`   📦  Pedidos:            ${await prisma.pedido.count()}`)
  console.log(`   📋  Picking:            ${await prisma.picking.count()}`)
  console.log(`   💵  Liquidaciones:      ${await prisma.liquidacion.count()}`)
  console.log('─────────────────────────────────────')
  console.log('   Accesos:')
  console.log('     admin    / admin123')
  console.log('     promotor / promotor123')
  console.log('     vendedor / vendedor123')
  console.log('     repartidor / repartidor123')
  console.log('─────────────────────────────────────\n')

  console.log('Precios por Cliente:')
  for (const c of await prisma.cliente.findMany({ include: { productos: true } })) {
    console.log(`  ${c.nombreCliente} (${c.canal}):`)
    for (const p of c.productos) {
      console.log(`    $${p.precio.toString().padStart(3)}  ${p.nombre}`)
    }
  }
  console.log('')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
