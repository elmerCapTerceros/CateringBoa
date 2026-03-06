/*
  Warnings:

  - You are about to drop the column `AlmacenSolicitado_id` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `AlmacenSolicitante_id` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `Usuario_idUsuario` on the `Solicitud` table. All the data in the column will be lost.
  - Added the required column `AlmacenSolicitadoId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AlmacenSolicitanteId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_AlmacenSolicitado_id_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_AlmacenSolicitante_id_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_Usuario_idUsuario_fkey";

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "AlmacenSolicitado_id",
DROP COLUMN "AlmacenSolicitante_id",
DROP COLUMN "Usuario_idUsuario",
ADD COLUMN     "AlmacenSolicitadoId" INTEGER NOT NULL,
ADD COLUMN     "AlmacenSolicitanteId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Movimiento" (
    "id" SERIAL NOT NULL,
    "tipoMovimiento" VARCHAR(45) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "almacenId" INTEGER NOT NULL,
    "aeronaveId" INTEGER NOT NULL,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleMovimiento" (
    "id" SERIAL NOT NULL,
    "movimientoId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleMovimiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_AlmacenSolicitanteId_fkey" FOREIGN KEY ("AlmacenSolicitanteId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_AlmacenSolicitadoId_fkey" FOREIGN KEY ("AlmacenSolicitadoId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
