/*
  Warnings:

  - Added the required column `Proveedor_idProveedor` to the `ComprasExteriores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `almacen_destino` to the `ComprasExteriores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costo_unitario` to the `ComprasExteriores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComprasExteriores" ADD COLUMN     "Proveedor_idProveedor" INTEGER NOT NULL,
ADD COLUMN     "almacen_destino" VARCHAR(80) NOT NULL,
ADD COLUMN     "costo_unitario" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "observaciones" VARCHAR(255);

-- CreateTable
CREATE TABLE "Proveedor" (
    "idProveedor" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("idProveedor")
);

-- AddForeignKey
ALTER TABLE "ComprasExteriores" ADD CONSTRAINT "ComprasExteriores_Proveedor_idProveedor_fkey" FOREIGN KEY ("Proveedor_idProveedor") REFERENCES "Proveedor"("idProveedor") ON DELETE RESTRICT ON UPDATE CASCADE;
