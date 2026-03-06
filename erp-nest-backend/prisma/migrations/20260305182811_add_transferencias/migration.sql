-- CreateTable
CREATE TABLE "Transferencia" (
    "idTransferencia" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" VARCHAR(255),
    "almacenOrigenId" INTEGER NOT NULL,
    "almacenDestinoId" INTEGER NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("idTransferencia")
);

-- CreateTable
CREATE TABLE "DetalleTransferencia" (
    "idDetalleTransferencia" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "transferenciaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "DetalleTransferencia_pkey" PRIMARY KEY ("idDetalleTransferencia")
);

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_almacenOrigenId_fkey" FOREIGN KEY ("almacenOrigenId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_almacenDestinoId_fkey" FOREIGN KEY ("almacenDestinoId") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleTransferencia" ADD CONSTRAINT "DetalleTransferencia_transferenciaId_fkey" FOREIGN KEY ("transferenciaId") REFERENCES "Transferencia"("idTransferencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleTransferencia" ADD CONSTRAINT "DetalleTransferencia_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
