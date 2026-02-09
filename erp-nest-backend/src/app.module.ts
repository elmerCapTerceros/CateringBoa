import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './core/user/user.module';
<<<<<<< HEAD
import { AlmacenModule } from './catering/almacen/almacen.module';
import { ComprasModule } from './core/catering/compras/compras.module';
import { PrismaModule } from './prisma/prisma.module';
=======

import { AlmacenModule } from './catering/almacen/almacen.module';
>>>>>>> ae6ac67050022dfad8db3f4f6d6f8113b0560645

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
<<<<<<< HEAD
    AlmacenModule,
    ComprasModule,
    PrismaModule
=======
    AlmacenModule
>>>>>>> ae6ac67050022dfad8db3f4f6d6f8113b0560645
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}