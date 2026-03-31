import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { AlmacenModule } from './catering/almacen/almacen.module';
import { ComprasModule } from './core/catering/compras/compras.module';
import { PrismaModule } from './prisma/prisma.module';
import { SolicitudModule } from './catering/solicitud/solicitud.module';
import { CatalogoModule } from './catering/catalogo/catalogo.module';
import { ItemModule } from './catering/item/item.module';
import { IngresoModule } from './catering/ingreso/ingreso.module';
import { MovimientoModule } from './catering/movimiento/movimiento.module';
import { TransferenciaModule } from './catering/transferencia/transferencia.module';
import { StockModule } from './core/catering/stock/stock.module';
import { PlantillasModule } from './core/catering/plantillas/plantillas.module';
import { ItemsModule } from './core/catering/items/items.module';
import { AbastecimientoModule } from './core/catering/abastecimiento/abastecimiento.module';
import { FlotasModule } from './core/catering/flotas/flotas.module';



@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    ComprasModule,
    SolicitudModule,
    CatalogoModule,
    AlmacenModule,
    ItemModule,
    IngresoModule,
    MovimientoModule,
    TransferenciaModule,
    PrismaModule,
    StockModule,
    PlantillasModule,
    ItemsModule,
    AbastecimientoModule,
    FlotasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}