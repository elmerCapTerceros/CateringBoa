/*
  Warnings:

  - The primary key for the `DetalleDotacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[Solicitud_Dotacion_idSolicitud_Dotacion,Item_idItem]` on the table `DetalleDotacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Item_idItem` to the `DetalleDotacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetalleDotacion" DROP CONSTRAINT "DetalleDotacion_pkey",
ADD COLUMN     "Item_idItem" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DetalleDotacion_Solicitud_Dotacion_idSolicitud_Dotacion_Ite_key" ON "DetalleDotacion"("Solicitud_Dotacion_idSolicitud_Dotacion", "Item_idItem");

-- AddForeignKey
ALTER TABLE "DetalleDotacion" ADD CONSTRAINT "DetalleDotacion_Item_idItem_fkey" FOREIGN KEY ("Item_idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
