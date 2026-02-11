/*
  Warnings:

  - You are about to drop the column `Fecha_Requerida` on the `SolicitudDotacion` table. All the data in the column will be lost.
  - Added the required column `FechaRequerida` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolicitudDotacion" DROP COLUMN "Fecha_Requerida",
ADD COLUMN     "FechaRequerida" DATE NOT NULL;
