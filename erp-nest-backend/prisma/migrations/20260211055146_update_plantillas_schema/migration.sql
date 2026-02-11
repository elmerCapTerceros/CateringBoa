/*
  Warnings:

  - You are about to drop the column `fechaCreacion` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `modeloAeronave` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Plantilla` table. All the data in the column will be lost.
  - You are about to drop the column `ultimaModificacion` on the `Plantilla` table. All the data in the column will be lost.
  - Added the required column `fechaModificacion` to the `Plantilla` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flotaObjetivo` to the `Plantilla` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoVuelo` to the `Plantilla` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plantilla" DROP COLUMN "fechaCreacion",
DROP COLUMN "modeloAeronave",
DROP COLUMN "tipo",
DROP COLUMN "ultimaModificacion",
ADD COLUMN     "fechaModificacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "flotaObjetivo" VARCHAR(100) NOT NULL,
ADD COLUMN     "tipoVuelo" TEXT NOT NULL;
