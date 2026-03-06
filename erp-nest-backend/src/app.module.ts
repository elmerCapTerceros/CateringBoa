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

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    AlmacenModule,
    ComprasModule,
    SolicitudModule,
    CatalogoModule,
    ItemModule,
    IngresoModule,
    MovimientoModule,
    TransferenciaModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}