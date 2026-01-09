import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './providers/prisma/prisma.module';
import { UserModule } from './core/user/user.module';
import { PlantillasModule } from './catering/plantillas/plantillas.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlantillasModule } from './catering/plantillas/plantillas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    PlantillasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
