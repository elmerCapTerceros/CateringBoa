/*
  Warnings:

  - You are about to drop the column `nombre_almacer` on the `Almacen` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_almacen` on the `Almacen` table. All the data in the column will be lost.
  - Added the required column `nombreAlmacen` to the `Almacen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoAlmacen` to the `Almacen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Almacen" DROP COLUMN "nombre_almacer",
DROP COLUMN "tipo_almacen",
ADD COLUMN     "nombreAlmacen" VARCHAR(45) NOT NULL,
ADD COLUMN     "tipoAlmacen" VARCHAR(45) NOT NULL;
