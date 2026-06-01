-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "telefono" TEXT,
    "numLicencia" TEXT,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "descripcion" TEXT,
    "img" TEXT,
    "cantidadAlmacen" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canal" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "razonSocial" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ClienteProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "codigoBarras" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tienda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canal" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "TDA" TEXT NOT NULL,
    "nombreTienda" TEXT NOT NULL,
    "empleadoPromotoriaId" TEXT,
    "empleadoEntregaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DiaPromotoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tiendaId" TEXT NOT NULL,
    "dia" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DiaEntrega" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tiendaId" TEXT NOT NULL,
    "dia" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "TDA" TEXT NOT NULL,
    "fechaP" TEXT,
    "fechaE" TEXT,
    "nombreCliente" TEXT,
    "canal" TEXT,
    "empleado" TEXT,
    "estatus" TEXT NOT NULL DEFAULT 'pendiente',
    "totalPedido" INTEGER,
    "fechaPromotoria" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PedidoProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0,
    "cantidad" INTEGER
);

-- CreateTable
CREATE TABLE "Picking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "TDA" TEXT NOT NULL,
    "fecha" INTEGER,
    "empleadoEntrega" TEXT,
    "estatus" TEXT NOT NULL DEFAULT 'pendiente',
    "tienda" TEXT,
    "idPedido" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PickingProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickingId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0,
    "cantidad" INTEGER
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT,
    "img" TEXT,
    "nombreTienda" TEXT NOT NULL,
    "TDA" TEXT NOT NULL,
    "promotor" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "bajasG" INTEGER NOT NULL DEFAULT 0,
    "altasG" INTEGER NOT NULL DEFAULT 0,
    "totalP" INTEGER NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "rotacion" TEXT,
    "estatus" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VisitaProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "alta" INTEGER NOT NULL DEFAULT 0,
    "bajas" INTEGER NOT NULL DEFAULT 0,
    "existencia" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Liquidacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folioLiquidacion" TEXT NOT NULL,
    "numeroRemison" TEXT,
    "nombreTienda" TEXT NOT NULL,
    "vendedor" TEXT,
    "fechaLiquidacion" TEXT NOT NULL,
    "montoFactura" REAL,
    "TDA" TEXT NOT NULL,
    "piezasEntregadas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LiquidacionProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liquidacionId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Facturacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folioLiquidacion" TEXT NOT NULL,
    "folioInterno" TEXT,
    "fechaLiquidacion" TEXT NOT NULL,
    "fechaFacturacion" TEXT NOT NULL,
    "TDA" TEXT NOT NULL,
    "nombreTienda" TEXT,
    "montoFactura" REAL,
    "numeroFactura" TEXT,
    "nombreCliente" TEXT,
    "piezasEntregadas" INTEGER,
    "nombre" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cambio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" TEXT NOT NULL,
    "TDA" TEXT NOT NULL,
    "tipoMovimiento" TEXT NOT NULL,
    "nombreTienda" TEXT,
    "nombre" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CambioProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cambioId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "PedidoFabricante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PedidoFabricanteProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoFabricanteId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "EstatusAlmacen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EstatusAlmacenProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "estatusAlmacenId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "img" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clave_key" ON "User"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoBarras_key" ON "Producto"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_clave_key" ON "Cliente"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Tienda_TDA_key" ON "Tienda"("TDA");

-- CreateIndex
CREATE UNIQUE INDEX "Picking_idPedido_key" ON "Picking"("idPedido");

-- CreateIndex
CREATE UNIQUE INDEX "Visita_folio_key" ON "Visita"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Liquidacion_folioLiquidacion_key" ON "Liquidacion"("folioLiquidacion");
