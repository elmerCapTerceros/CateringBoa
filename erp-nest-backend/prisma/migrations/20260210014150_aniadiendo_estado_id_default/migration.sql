/*
  Warnings:

  - Added the required column `Fecha_Requerida` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Prioridad` to the `SolicitudDotacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolicitudDotacion" ADD COLUMN     "Fecha_Requerida" DATE NOT NULL,
ADD COLUMN     "Prioridad" VARCHAR(10) NOT NULL,
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "Estado" SET DEFAULT 'Pendiente',
ALTER COLUMN "Usuario_idUsuario" SET DEFAULT 'admin1234';
