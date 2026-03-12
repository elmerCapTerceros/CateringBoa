/*
  Warnings:

  - Added the required column `fecha` to the `ControlConsumo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ControlConsumo" ADD COLUMN     "fecha" DATE NOT NULL;
