/*
  Warnings:

  - The primary key for the `Abastecimiento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Item_idItem` on the `Abastecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `Stock_idStock` on the `Abastecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `Usuario_idUsuario` on the `Abastecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `clase` on the `Abastecimiento` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Abastecimiento` table. All the data in the column will be lost.
  - The primary key for the `Carga` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Abastecimiento_Item_idItem` on the `Carga` table. All the data in the column will be lost.
  - You are about to drop the column `Abastecimiento_idAbastecimiento` on the `Carga` table. All the data in the column will be lost.
  - You are about to drop the column `Aeronave_idAeronave` on the `Carga` table. All the data in the column will be lost.
  - The primary key for the `Configuracion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Carga_Aeronave_idAeronave` on the `Configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `Carga_idCarga` on the `Configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `confi_id` on the `Configuracion` table. All the data in the column will be lost.
  - The primary key for the `ControlConsumo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `detalle_carga_Carga_Aeronave_idAeronave` on the `ControlConsumo` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_Carga_idCarga` on the `ControlConsumo` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_Item_idItem` on the `ControlConsumo` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_iddetalle_carga` on the `ControlConsumo` table. All the data in the column will be lost.
  - You are about to drop the column `idControl_consumo` on the `ControlConsumo` table. All the data in the column will be lost.
  - The primary key for the `DetalleCarga` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Carga_Aeronave_idAeronave` on the `DetalleCarga` table. All the data in the column will be lost.
  - You are about to drop the column `Carga_idCarga` on the `DetalleCarga` table. All the data in the column will be lost.
  - You are about to drop the column `Item_idItem` on the `DetalleCarga` table. All the data in the column will be lost.
  - You are about to drop the column `iddetalle_carga` on the `DetalleCarga` table. All the data in the column will be lost.
  - The primary key for the `DetalleDotacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Solicitud_Dotacion_idSolicitud_Dotacion` on the `DetalleDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `idDetalle_dotacion` on the `DetalleDotacion` table. All the data in the column will be lost.
  - The primary key for the `DetalleSolicitud` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Item_idItem1` on the `DetalleSolicitud` table. All the data in the column will be lost.
  - You are about to drop the column `Solicitud_idSolicitud` on the `DetalleSolicitud` table. All the data in the column will be lost.
  - You are about to drop the column `idDetalle_solicitud` on the `DetalleSolicitud` table. All the data in the column will be lost.
  - The primary key for the `DetalleStock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clase` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_Carga_Aeronave_idAeronave` on the `Remanente` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_Carga_idCarga` on the `Remanente` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_Item_idItem` on the `Remanente` table. All the data in the column will be lost.
  - You are about to drop the column `detalle_carga_iddetalle_carga` on the `Remanente` table. All the data in the column will be lost.
  - You are about to drop the column `AlmacenSolicitado_id` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `AlmacenSolicitante_id` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `Usuario_idUsuario` on the `Solicitud` table. All the data in the column will be lost.
  - The primary key for the `SolicitudDotacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Aeronave_idAeronave` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `Almacen_idAlmacen` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `Descripcion` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `Estado` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `Usuario_idUsuario` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - You are about to drop the column `idSolicitud_Dotacion` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - Added the required column `aeronaveId` to the `Abastecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `almacenId` to the `Abastecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoVuelo` to the `Abastecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Abastecimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aeronaveId` to the `Carga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargaId` to the `Configuracion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detalleCargaId` to the `ControlConsumo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargaId` to the `DetalleCarga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `DetalleCarga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitudDotacionId` to the `DetalleDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `DetalleSolicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solicitudId` to the `DetalleSolicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detalleCargaId` to the `Remanente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `almacenSolicitadoId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `almacenSolicitanteId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aeronaveId` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `almacenId` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Abastecimiento" DROP CONSTRAINT "Abastecimiento_Item_idItem_fkey";

-- DropForeignKey
ALTER TABLE "Abastecimiento" DROP CONSTRAINT "Abastecimiento_Stock_idStock_fkey";

-- DropForeignKey
ALTER TABLE "Abastecimiento" DROP CONSTRAINT "Abastecimiento_Usuario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Carga" DROP CONSTRAINT "Carga_Abastecimiento_idAbastecimiento_Abastecimiento_Item__fkey";

-- DropForeignKey
ALTER TABLE "Carga" DROP CONSTRAINT "Carga_Aeronave_idAeronave_fkey";

-- DropForeignKey
ALTER TABLE "Configuracion" DROP CONSTRAINT "Configuracion_Carga_idCarga_Carga_Aeronave_idAeronave_fkey";

-- DropForeignKey
ALTER TABLE "ControlConsumo" DROP CONSTRAINT "ControlConsumo_detalle_carga_iddetalle_carga_detalle_carga_fkey";

-- DropForeignKey
ALTER TABLE "DetalleCarga" DROP CONSTRAINT "DetalleCarga_Carga_Aeronave_idAeronave_fkey";

-- DropForeignKey
ALTER TABLE "DetalleCarga" DROP CONSTRAINT "DetalleCarga_Carga_idCarga_Carga_Aeronave_idAeronave_fkey";

-- DropForeignKey
ALTER TABLE "DetalleCarga" DROP CONSTRAINT "DetalleCarga_Item_idItem_fkey";

-- DropForeignKey
ALTER TABLE "DetalleDotacion" DROP CONSTRAINT "DetalleDotacion_Solicitud_Dotacion_idSolicitud_Dotacion_fkey";

-- DropForeignKey
ALTER TABLE "DetalleSolicitud" DROP CONSTRAINT "DetalleSolicitud_Item_idItem1_fkey";

-- DropForeignKey
ALTER TABLE "DetalleSolicitud" DROP CONSTRAINT "DetalleSolicitud_Solicitud_idSolicitud_fkey";

-- DropForeignKey
ALTER TABLE "Remanente" DROP CONSTRAINT "Remanente_detalle_carga_iddetalle_carga_detalle_carga_Item_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_AlmacenSolicitado_id_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_AlmacenSolicitante_id_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_Usuario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "SolicitudDotacion" DROP CONSTRAINT "SolicitudDotacion_Aeronave_idAeronave_fkey";

-- DropForeignKey
ALTER TABLE "SolicitudDotacion" DROP CONSTRAINT "SolicitudDotacion_Almacen_idAlmacen_fkey";

-- DropForeignKey
ALTER TABLE "SolicitudDotacion" DROP CONSTRAINT "SolicitudDotacion_Usuario_idUsuario_fkey";

-- AlterTable
ALTER TABLE "Abastecimiento" DROP CONSTRAINT "Abastecimiento_pkey",
DROP COLUMN "Item_idItem",
DROP COLUMN "Stock_idStock",
DROP COLUMN "Usuario_idUsuario",
DROP COLUMN "clase",
DROP COLUMN "fecha",
ADD COLUMN     "aeronaveId" INTEGER NOT NULL,
ADD COLUMN     "almacenId" INTEGER NOT NULL,
ADD COLUMN     "codigoVuelo" VARCHAR(45) NOT NULL,
ADD COLUMN     "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
ADD COLUMN     "fechaDespacho" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "usuarioId" TEXT NOT NULL,
ADD CONSTRAINT "Abastecimiento_pkey" PRIMARY KEY ("idAbastecimiento");

-- AlterTable
ALTER TABLE "Carga" DROP CONSTRAINT "Carga_pkey",
DROP COLUMN "Abastecimiento_Item_idItem",
DROP COLUMN "Abastecimiento_idAbastecimiento",
DROP COLUMN "Aeronave_idAeronave",
ADD COLUMN     "abastecimientoId" INTEGER,
ADD COLUMN     "aeronaveId" INTEGER NOT NULL,
ADD CONSTRAINT "Carga_pkey" PRIMARY KEY ("idCarga");

-- AlterTable
ALTER TABLE "Configuracion" DROP CONSTRAINT "Configuracion_pkey",
DROP COLUMN "Carga_Aeronave_idAeronave",
DROP COLUMN "Carga_idCarga",
DROP COLUMN "confi_id",
ADD COLUMN     "cargaId" INTEGER NOT NULL,
ADD COLUMN     "confiId" SERIAL NOT NULL,
ADD CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("confiId");

-- AlterTable
ALTER TABLE "ControlConsumo" DROP CONSTRAINT "ControlConsumo_pkey",
DROP COLUMN "detalle_carga_Carga_Aeronave_idAeronave",
DROP COLUMN "detalle_carga_Carga_idCarga",
DROP COLUMN "detalle_carga_Item_idItem",
DROP COLUMN "detalle_carga_iddetalle_carga",
DROP COLUMN "idControl_consumo",
ADD COLUMN     "detalleCargaId" INTEGER NOT NULL,
ADD COLUMN     "idControlConsumo" SERIAL NOT NULL,
ADD CONSTRAINT "ControlConsumo_pkey" PRIMARY KEY ("idControlConsumo");

-- AlterTable
ALTER TABLE "DetalleCarga" DROP CONSTRAINT "DetalleCarga_pkey",
DROP COLUMN "Carga_Aeronave_idAeronave",
DROP COLUMN "Carga_idCarga",
DROP COLUMN "Item_idItem",
DROP COLUMN "iddetalle_carga",
ADD COLUMN     "cargaId" INTEGER NOT NULL,
ADD COLUMN     "idDetalleCarga" SERIAL NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "DetalleCarga_pkey" PRIMARY KEY ("idDetalleCarga");

-- AlterTable
ALTER TABLE "DetalleDotacion" DROP CONSTRAINT "DetalleDotacion_pkey",
DROP COLUMN "Solicitud_Dotacion_idSolicitud_Dotacion",
DROP COLUMN "idDetalle_dotacion",
ADD COLUMN     "idDetalleDotacion" SERIAL NOT NULL,
ADD COLUMN     "solicitudDotacionId" INTEGER NOT NULL,
ADD CONSTRAINT "DetalleDotacion_pkey" PRIMARY KEY ("idDetalleDotacion");

-- AlterTable
ALTER TABLE "DetalleSolicitud" DROP CONSTRAINT "DetalleSolicitud_pkey",
DROP COLUMN "Item_idItem1",
DROP COLUMN "Solicitud_idSolicitud",
DROP COLUMN "idDetalle_solicitud",
ADD COLUMN     "idDetalleSolicitud" SERIAL NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "solicitudId" INTEGER NOT NULL,
ADD CONSTRAINT "DetalleSolicitud_pkey" PRIMARY KEY ("idDetalleSolicitud");

-- AlterTable
ALTER TABLE "DetalleStock" DROP CONSTRAINT "DetalleStock_pkey",
ADD CONSTRAINT "DetalleStock_pkey" PRIMARY KEY ("idDetalle_Stock");

-- AlterTable
ALTER TABLE "Plantilla" DROP COLUMN "clase",
ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'Nacional';

-- AlterTable
ALTER TABLE "Remanente" DROP COLUMN "detalle_carga_Carga_Aeronave_idAeronave",
DROP COLUMN "detalle_carga_Carga_idCarga",
DROP COLUMN "detalle_carga_Item_idItem",
DROP COLUMN "detalle_carga_iddetalle_carga",
ADD COLUMN     "detalleCargaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "AlmacenSolicitado_id",
DROP COLUMN "AlmacenSolicitante_id",
DROP COLUMN "Usuario_idUsuario",
ADD COLUMN     "almacenSolicitadoId" INTEGER NOT NULL,
ADD COLUMN     "almacenSolicitanteId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SolicitudDotacion" DROP CONSTRAINT "SolicitudDotacion_pkey",
DROP COLUMN "Aeronave_idAeronave",
DROP COLUMN "Almacen_idAlmacen",
DROP COLUMN "Descripcion",
DROP COLUMN "Estado",
DROP COLUMN "Usuario_idUsuario",
DROP COLUMN "idSolicitud_Dotacion",
ADD COLUMN     "aeronaveId" INTEGER NOT NULL,
ADD COLUMN     "almacenId" INTEGER NOT NULL,
ADD COLUMN     "descripcion" VARCHAR(45) NOT NULL,
ADD COLUMN     "estado" VARCHAR(45) NOT NULL,
ADD COLUMN     "idSolicitudDotacion" SERIAL NOT NULL,
ADD COLUMN     "usuarioId" TEXT NOT NULL,
ADD CONSTRAINT "SolicitudDotacion_pkey" PRIMARY KEY ("idSolicitudDotacion");

-- CreateTable
CREATE TABLE "DetalleAbastecimiento" (
    "idDetalle" SERIAL NOT NULL,
    "abastecimientoId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleAbastecimiento_pkey" PRIMARY KEY ("idDetalle")
);

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAbastecimiento" ADD CONSTRAINT "DetalleAbastecimiento_abastecimientoId_fkey" FOREIGN KEY ("abastecimientoId") REFERENCES "Abastecimiento"("idAbastecimiento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAbastecimiento" ADD CONSTRAINT "DetalleAbastecimiento_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carga" ADD CONSTRAINT "Carga_abastecimientoId_fkey" FOREIGN KEY ("abastecimientoId") REFERENCES "Abastecimiento"("idAbastecimiento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carga" ADD CONSTRAINT "Carga_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarga" ADD CONSTRAINT "DetalleCarga_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "Carga"("idCarga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarga" ADD CONSTRAINT "DetalleCarga_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_almacenSolicitanteId_fkey" FOREIGN KEY ("almacenSolicitanteId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_almacenSolicitadoId_fkey" FOREIGN KEY ("almacenSolicitadoId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("idSolicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlConsumo" ADD CONSTRAINT "ControlConsumo_detalleCargaId_fkey" FOREIGN KEY ("detalleCargaId") REFERENCES "DetalleCarga"("idDetalleCarga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remanente" ADD CONSTRAINT "Remanente_detalleCargaId_fkey" FOREIGN KEY ("detalleCargaId") REFERENCES "DetalleCarga"("idDetalleCarga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracion" ADD CONSTRAINT "Configuracion_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "Carga"("idCarga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleDotacion" ADD CONSTRAINT "DetalleDotacion_solicitudDotacionId_fkey" FOREIGN KEY ("solicitudDotacionId") REFERENCES "SolicitudDotacion"("idSolicitudDotacion") ON DELETE RESTRICT ON UPDATE CASCADE;
