/*
  Warnings:

  - The primary key for the `DetalleStock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[Stock_idStock,Item_idItem]` on the table `DetalleStock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DetalleStock" DROP CONSTRAINT "DetalleStock_pkey",
ADD CONSTRAINT "DetalleStock_pkey" PRIMARY KEY ("idDetalle_Stock");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleStock_Stock_idStock_Item_idItem_key" ON "DetalleStock"("Stock_idStock", "Item_idItem");
