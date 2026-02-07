/*
  Warnings:

  - You are about to drop the `ComprasExteriores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entrega` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComprasExteriores" DROP CONSTRAINT "ComprasExteriores_Item_idItem_fkey";

-- DropForeignKey
ALTER TABLE "Entrega" DROP CONSTRAINT "Entrega_Compras_exteriores_idCompras_exteriores_fkey";

-- DropForeignKey
ALTER TABLE "Entrega" DROP CONSTRAINT "Entrega_Stock_idStock_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "unidadMedida" TEXT DEFAULT 'Unidad';

-- AlterTable
ALTER TABLE "Ruta" ADD COLUMN     "codigo" TEXT;

-- DropTable
DROP TABLE "ComprasExteriores";

-- DropTable
DROP TABLE "Entrega";

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "idOrdenCompra" SERIAL NOT NULL,
    "codigoOrden" TEXT NOT NULL,
    "proveedor" VARCHAR(100) NOT NULL,
    "fechaSolicitud" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" DATE,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    "costoTotalEstimado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costoTotalReal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "almacenDestinoId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("idOrdenCompra")
);

-- CreateTable
CREATE TABLE "DetalleOrdenCompra" (
    "idDetalle" SERIAL NOT NULL,
    "ordenCompraId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cantidadSolicitada" INTEGER NOT NULL,
    "cantidadRecibida" INTEGER NOT NULL DEFAULT 0,
    "costoUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleOrdenCompra_pkey" PRIMARY KEY ("idDetalle")
);

-- CreateTable
CREATE TABLE "Recepcion" (
    "idRecepcion" SERIAL NOT NULL,
    "ordenCompraId" INTEGER NOT NULL,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioRecibio" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "Recepcion_pkey" PRIMARY KEY ("idRecepcion")
);

-- CreateTable
CREATE TABLE "RecepcionItem" (
    "id" SERIAL NOT NULL,
    "recepcionId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cantidadRecibida" INTEGER NOT NULL,

    CONSTRAINT "RecepcionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_codigoOrden_key" ON "OrdenCompra"("codigoOrden");

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_almacenDestinoId_fkey" FOREIGN KEY ("almacenDestinoId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "OrdenCompra"("idOrdenCompra") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recepcion" ADD CONSTRAINT "Recepcion_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "OrdenCompra"("idOrdenCompra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecepcionItem" ADD CONSTRAINT "RecepcionItem_recepcionId_fkey" FOREIGN KEY ("recepcionId") REFERENCES "Recepcion"("idRecepcion") ON DELETE CASCADE ON UPDATE CASCADE;
