/*
  Warnings:

  - Added the required column `itemId` to the `DetalleDotacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Abastecimiento" ALTER COLUMN "estado" SET DEFAULT 'DESPACHADO';

-- AlterTable
ALTER TABLE "DetalleDotacion" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "stockActual" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "RecepcionItem" ADD CONSTRAINT "RecepcionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleDotacion" ADD CONSTRAINT "DetalleDotacion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
