-- CreateTable
CREATE TABLE "Ingreso" (
    "idIngreso" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" VARCHAR(255),
    "Almacen_idAlmacen" INTEGER NOT NULL,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("idIngreso")
);

-- CreateTable
CREATE TABLE "DetalleIngreso" (
    "idDetalleIngreso" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "ingresoId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "DetalleIngreso_pkey" PRIMARY KEY ("idDetalleIngreso")
);

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_Almacen_idAlmacen_fkey" FOREIGN KEY ("Almacen_idAlmacen") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIngreso" ADD CONSTRAINT "DetalleIngreso_ingresoId_fkey" FOREIGN KEY ("ingresoId") REFERENCES "Ingreso"("idIngreso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleIngreso" ADD CONSTRAINT "DetalleIngreso_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
