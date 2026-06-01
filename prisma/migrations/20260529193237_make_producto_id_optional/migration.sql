-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CambioProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cambioId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CambioProducto_cambioId_fkey" FOREIGN KEY ("cambioId") REFERENCES "Cambio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CambioProducto" ("cambioId", "id", "nombre", "numero", "productoId") SELECT "cambioId", "id", "nombre", "numero", "productoId" FROM "CambioProducto";
DROP TABLE "CambioProducto";
ALTER TABLE "new_CambioProducto" RENAME TO "CambioProducto";
CREATE TABLE "new_LiquidacionProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liquidacionId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "existencia" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LiquidacionProducto_liquidacionId_fkey" FOREIGN KEY ("liquidacionId") REFERENCES "Liquidacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LiquidacionProducto" ("existencia", "id", "liquidacionId", "nombre", "productoId") SELECT "existencia", "id", "liquidacionId", "nombre", "productoId" FROM "LiquidacionProducto";
DROP TABLE "LiquidacionProducto";
ALTER TABLE "new_LiquidacionProducto" RENAME TO "LiquidacionProducto";
CREATE TABLE "new_PedidoFabricanteProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoFabricanteId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PedidoFabricanteProducto_pedidoFabricanteId_fkey" FOREIGN KEY ("pedidoFabricanteId") REFERENCES "PedidoFabricante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PedidoFabricanteProducto" ("cantidad", "id", "nombre", "pedidoFabricanteId", "productoId") SELECT "cantidad", "id", "nombre", "pedidoFabricanteId", "productoId" FROM "PedidoFabricanteProducto";
DROP TABLE "PedidoFabricanteProducto";
ALTER TABLE "new_PedidoFabricanteProducto" RENAME TO "PedidoFabricanteProducto";
CREATE TABLE "new_PedidoProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0,
    "cantidad" INTEGER,
    CONSTRAINT "PedidoProducto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PedidoProducto" ("cantidad", "id", "nombre", "numero", "pedidoId", "productoId") SELECT "cantidad", "id", "nombre", "numero", "pedidoId", "productoId" FROM "PedidoProducto";
DROP TABLE "PedidoProducto";
ALTER TABLE "new_PedidoProducto" RENAME TO "PedidoProducto";
CREATE TABLE "new_PickingProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickingId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "numero" INTEGER NOT NULL DEFAULT 0,
    "cantidad" INTEGER,
    CONSTRAINT "PickingProducto_pickingId_fkey" FOREIGN KEY ("pickingId") REFERENCES "Picking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PickingProducto" ("cantidad", "id", "nombre", "numero", "pickingId", "productoId") SELECT "cantidad", "id", "nombre", "numero", "pickingId", "productoId" FROM "PickingProducto";
DROP TABLE "PickingProducto";
ALTER TABLE "new_PickingProducto" RENAME TO "PickingProducto";
CREATE TABLE "new_VisitaProducto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitaId" TEXT NOT NULL,
    "productoId" TEXT,
    "nombre" TEXT NOT NULL,
    "alta" INTEGER NOT NULL DEFAULT 0,
    "bajas" INTEGER NOT NULL DEFAULT 0,
    "existencia" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VisitaProducto_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VisitaProducto" ("alta", "bajas", "existencia", "id", "nombre", "productoId", "visitaId") SELECT "alta", "bajas", "existencia", "id", "nombre", "productoId", "visitaId" FROM "VisitaProducto";
DROP TABLE "VisitaProducto";
ALTER TABLE "new_VisitaProducto" RENAME TO "VisitaProducto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
