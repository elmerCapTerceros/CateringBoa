/*
  Warnings:

  - Added the required column `descripcion` to the `Movimiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movimiento" ADD COLUMN     "descripcion" VARCHAR(45) NOT NULL;
