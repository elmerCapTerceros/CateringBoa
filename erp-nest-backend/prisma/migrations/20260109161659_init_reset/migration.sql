-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flota" (
    "idFlota" SERIAL NOT NULL,
    "Nombre_flota" VARCHAR(45) NOT NULL,
    "descripcion" VARCHAR(45) NOT NULL,

    CONSTRAINT "Flota_pkey" PRIMARY KEY ("idFlota")
);

-- CreateTable
CREATE TABLE "Aeronave" (
    "idAeronave" SERIAL NOT NULL,
    "matricula" VARCHAR(45) NOT NULL,
    "tipo_aeronave" VARCHAR(45) NOT NULL,
    "Flota_idFlota" INTEGER NOT NULL,

    CONSTRAINT "Aeronave_pkey" PRIMARY KEY ("idAeronave")
);

-- CreateTable
CREATE TABLE "Almacen" (
    "idAlmacen" SERIAL NOT NULL,
    "nombre_almacer" VARCHAR(45) NOT NULL,
    "tipo_almacen" VARCHAR(45) NOT NULL,
    "ubicacion" VARCHAR(45) NOT NULL,
    "codigo" VARCHAR(45) NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("idAlmacen")
);

-- CreateTable
CREATE TABLE "Stock" (
    "idStock" SERIAL NOT NULL,
    "Almacen_idAlmacen" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("idStock")
);

-- CreateTable
CREATE TABLE "Item" (
    "idItem" SERIAL NOT NULL,
    "nombre_item" VARCHAR(45) NOT NULL,
    "tipo_item" VARCHAR(45) NOT NULL,
    "categoria_item" VARCHAR(45) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("idItem")
);

-- CreateTable
CREATE TABLE "Abastecimiento" (
    "idAbastecimiento" SERIAL NOT NULL,
    "Stock_idStock" INTEGER NOT NULL,
    "Item_idItem" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "Usuario_idUsuario" TEXT NOT NULL,
    "clase" VARCHAR(45) NOT NULL,

    CONSTRAINT "Abastecimiento_pkey" PRIMARY KEY ("idAbastecimiento","Item_idItem")
);

-- CreateTable
CREATE TABLE "Carga" (
    "idCarga" SERIAL NOT NULL,
    "Aeronave_idAeronave" INTEGER NOT NULL,
    "Abastecimiento_idAbastecimiento" INTEGER NOT NULL,
    "Abastecimiento_Item_idItem" INTEGER NOT NULL,

    CONSTRAINT "Carga_pkey" PRIMARY KEY ("idCarga","Aeronave_idAeronave")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "idSolicitud" SERIAL NOT NULL,
    "Usuario_idUsuario" TEXT NOT NULL,
    "descripcion" VARCHAR(45) NOT NULL,
    "fecha" DATE NOT NULL,
    "prioridad" VARCHAR(45) NOT NULL,
    "Estado" VARCHAR(45) NOT NULL,
    "AlmacenSolicitante_id" INTEGER NOT NULL,
    "AlmacenSolicitado_id" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("idSolicitud")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "idRuta" SERIAL NOT NULL,
    "origen" VARCHAR(45) NOT NULL,
    "destino" VARCHAR(45) NOT NULL,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("idRuta")
);

-- CreateTable
CREATE TABLE "AeronaveHasRuta" (
    "Aeronave_idAeronave" INTEGER NOT NULL,
    "Ruta_idRuta" INTEGER NOT NULL,

    CONSTRAINT "AeronaveHasRuta_pkey" PRIMARY KEY ("Aeronave_idAeronave","Ruta_idRuta")
);

-- CreateTable
CREATE TABLE "ComprasExteriores" (
    "idCompras_exteriores" SERIAL NOT NULL,
    "Item_idItem" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "ComprasExteriores_pkey" PRIMARY KEY ("idCompras_exteriores")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id_parcial" SERIAL NOT NULL,
    "tipo_entrega" VARCHAR(45) NOT NULL,
    "fecha" DATE NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "Compras_exteriores_idCompras_exteriores" INTEGER NOT NULL,
    "Stock_idStock" INTEGER NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id_parcial","Compras_exteriores_idCompras_exteriores","Stock_idStock")
);

-- CreateTable
CREATE TABLE "DetalleSolicitud" (
    "idDetalle_solicitud" SERIAL NOT NULL,
    "Item_idItem1" INTEGER NOT NULL,
    "Solicitud_idSolicitud" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleSolicitud_pkey" PRIMARY KEY ("idDetalle_solicitud","Item_idItem1","Solicitud_idSolicitud")
);

-- CreateTable
CREATE TABLE "DetalleCarga" (
    "iddetalle_carga" SERIAL NOT NULL,
    "Item_idItem" INTEGER NOT NULL,
    "Carga_idCarga" INTEGER NOT NULL,
    "Carga_Aeronave_idAeronave" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleCarga_pkey" PRIMARY KEY ("iddetalle_carga","Item_idItem","Carga_idCarga","Carga_Aeronave_idAeronave")
);

-- CreateTable
CREATE TABLE "ControlConsumo" (
    "idControl_consumo" SERIAL NOT NULL,
    "estado" VARCHAR(45) NOT NULL,
    "detalle_carga_iddetalle_carga" INTEGER NOT NULL,
    "detalle_carga_Item_idItem" INTEGER NOT NULL,
    "detalle_carga_Carga_idCarga" INTEGER NOT NULL,
    "detalle_carga_Carga_Aeronave_idAeronave" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ControlConsumo_pkey" PRIMARY KEY ("idControl_consumo")
);

-- CreateTable
CREATE TABLE "DetalleStock" (
    "idDetalle_Stock" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "Stock_idStock" INTEGER NOT NULL,
    "Item_idItem" INTEGER NOT NULL,

    CONSTRAINT "DetalleStock_pkey" PRIMARY KEY ("idDetalle_Stock","Item_idItem")
);

-- CreateTable
CREATE TABLE "Remanente" (
    "idRemanente" SERIAL NOT NULL,
    "cantidad" INTEGER,
    "detalle_carga_iddetalle_carga" INTEGER NOT NULL,
    "detalle_carga_Item_idItem" INTEGER NOT NULL,
    "detalle_carga_Carga_idCarga" INTEGER NOT NULL,
    "detalle_carga_Carga_Aeronave_idAeronave" INTEGER NOT NULL,

    CONSTRAINT "Remanente_pkey" PRIMARY KEY ("idRemanente")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "confi_id" SERIAL NOT NULL,
    "Carga_idCarga" INTEGER NOT NULL,
    "Carga_Aeronave_idAeronave" INTEGER NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("confi_id")
);

-- CreateTable
CREATE TABLE "SolicitudDotacion" (
    "idSolicitud_Dotacion" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "Estado" VARCHAR(45) NOT NULL,
    "Descripcion" VARCHAR(45) NOT NULL,
    "Almacen_idAlmacen" INTEGER NOT NULL,
    "Usuario_idUsuario" TEXT NOT NULL,
    "Aeronave_idAeronave" INTEGER NOT NULL,

    CONSTRAINT "SolicitudDotacion_pkey" PRIMARY KEY ("idSolicitud_Dotacion")
);

-- CreateTable
CREATE TABLE "DetalleDotacion" (
    "idDetalle_dotacion" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "Solicitud_Dotacion_idSolicitud_Dotacion" INTEGER NOT NULL,

    CONSTRAINT "DetalleDotacion_pkey" PRIMARY KEY ("idDetalle_dotacion","Solicitud_Dotacion_idSolicitud_Dotacion")
);

-- CreateTable
CREATE TABLE "Plantilla" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "modeloAeronave" TEXT NOT NULL,
    "clase" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaModificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plantilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePlantilla" (
    "id" SERIAL NOT NULL,
    "plantillaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetallePlantilla_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Aeronave" ADD CONSTRAINT "Aeronave_Flota_idFlota_fkey" FOREIGN KEY ("Flota_idFlota") REFERENCES "Flota"("idFlota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_Almacen_idAlmacen_fkey" FOREIGN KEY ("Almacen_idAlmacen") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_Stock_idStock_fkey" FOREIGN KEY ("Stock_idStock") REFERENCES "Stock"("idStock") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_Item_idItem_fkey" FOREIGN KEY ("Item_idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_Usuario_idUsuario_fkey" FOREIGN KEY ("Usuario_idUsuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carga" ADD CONSTRAINT "Carga_Aeronave_idAeronave_fkey" FOREIGN KEY ("Aeronave_idAeronave") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carga" ADD CONSTRAINT "Carga_Abastecimiento_idAbastecimiento_Abastecimiento_Item__fkey" FOREIGN KEY ("Abastecimiento_idAbastecimiento", "Abastecimiento_Item_idItem") REFERENCES "Abastecimiento"("idAbastecimiento", "Item_idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_Usuario_idUsuario_fkey" FOREIGN KEY ("Usuario_idUsuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_AlmacenSolicitante_id_fkey" FOREIGN KEY ("AlmacenSolicitante_id") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_AlmacenSolicitado_id_fkey" FOREIGN KEY ("AlmacenSolicitado_id") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AeronaveHasRuta" ADD CONSTRAINT "AeronaveHasRuta_Aeronave_idAeronave_fkey" FOREIGN KEY ("Aeronave_idAeronave") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AeronaveHasRuta" ADD CONSTRAINT "AeronaveHasRuta_Ruta_idRuta_fkey" FOREIGN KEY ("Ruta_idRuta") REFERENCES "Ruta"("idRuta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprasExteriores" ADD CONSTRAINT "ComprasExteriores_Item_idItem_fkey" FOREIGN KEY ("Item_idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_Compras_exteriores_idCompras_exteriores_fkey" FOREIGN KEY ("Compras_exteriores_idCompras_exteriores") REFERENCES "ComprasExteriores"("idCompras_exteriores") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_Stock_idStock_fkey" FOREIGN KEY ("Stock_idStock") REFERENCES "Stock"("idStock") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_Item_idItem1_fkey" FOREIGN KEY ("Item_idItem1") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_Solicitud_idSolicitud_fkey" FOREIGN KEY ("Solicitud_idSolicitud") REFERENCES "Solicitud"("idSolicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarga" ADD CONSTRAINT "DetalleCarga_Item_idItem_fkey" FOREIGN KEY ("Item_idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarga" ADD CONSTRAINT "DetalleCarga_Carga_idCarga_Carga_Aeronave_idAeronave_fkey" FOREIGN KEY ("Carga_idCarga", "Carga_Aeronave_idAeronave") REFERENCES "Carga"("idCarga", "Aeronave_idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarga" ADD CONSTRAINT "DetalleCarga_Carga_Aeronave_idAeronave_fkey" FOREIGN KEY ("Carga_Aeronave_idAeronave") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlConsumo" ADD CONSTRAINT "ControlConsumo_detalle_carga_iddetalle_carga_detalle_carga_fkey" FOREIGN KEY ("detalle_carga_iddetalle_carga", "detalle_carga_Item_idItem", "detalle_carga_Carga_idCarga", "detalle_carga_Carga_Aeronave_idAeronave") REFERENCES "DetalleCarga"("iddetalle_carga", "Item_idItem", "Carga_idCarga", "Carga_Aeronave_idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleStock" ADD CONSTRAINT "DetalleStock_Stock_idStock_fkey" FOREIGN KEY ("Stock_idStock") REFERENCES "Stock"("idStock") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleStock" ADD CONSTRAINT "DetalleStock_Item_idItem_fkey" FOREIGN KEY ("Item_idItem") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remanente" ADD CONSTRAINT "Remanente_detalle_carga_iddetalle_carga_detalle_carga_Item_fkey" FOREIGN KEY ("detalle_carga_iddetalle_carga", "detalle_carga_Item_idItem", "detalle_carga_Carga_idCarga", "detalle_carga_Carga_Aeronave_idAeronave") REFERENCES "DetalleCarga"("iddetalle_carga", "Item_idItem", "Carga_idCarga", "Carga_Aeronave_idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracion" ADD CONSTRAINT "Configuracion_Carga_idCarga_Carga_Aeronave_idAeronave_fkey" FOREIGN KEY ("Carga_idCarga", "Carga_Aeronave_idAeronave") REFERENCES "Carga"("idCarga", "Aeronave_idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_Almacen_idAlmacen_fkey" FOREIGN KEY ("Almacen_idAlmacen") REFERENCES "Almacen"("idAlmacen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_Usuario_idUsuario_fkey" FOREIGN KEY ("Usuario_idUsuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudDotacion" ADD CONSTRAINT "SolicitudDotacion_Aeronave_idAeronave_fkey" FOREIGN KEY ("Aeronave_idAeronave") REFERENCES "Aeronave"("idAeronave") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleDotacion" ADD CONSTRAINT "DetalleDotacion_Solicitud_Dotacion_idSolicitud_Dotacion_fkey" FOREIGN KEY ("Solicitud_Dotacion_idSolicitud_Dotacion") REFERENCES "SolicitudDotacion"("idSolicitud_Dotacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePlantilla" ADD CONSTRAINT "DetallePlantilla_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "Plantilla"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePlantilla" ADD CONSTRAINT "DetallePlantilla_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("idItem") ON DELETE RESTRICT ON UPDATE CASCADE;
