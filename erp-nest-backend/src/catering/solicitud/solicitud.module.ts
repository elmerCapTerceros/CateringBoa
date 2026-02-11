import { Module } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { PrismaModule } from 'src/providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SolicitudController],
  providers: [SolicitudService],
  exports: [SolicitudService]
})
export class SolicitudModule {}
