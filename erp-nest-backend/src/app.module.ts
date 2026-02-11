import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
import { ComprasModule } from './core/catering/compras/compras.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './core/catering/stock/stock.module';
import { PlantillasModule } from './core/catering/plantillas/plantillas.module';
import { ItemsModule } from './core/catering/items/items.module';
import { AbastecimientoModule } from './core/catering/abastecimiento/abastecimiento.module';



@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    ComprasModule,
    PrismaModule,
    StockModule,
    PlantillasModule,
    ItemsModule,
    AbastecimientoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
