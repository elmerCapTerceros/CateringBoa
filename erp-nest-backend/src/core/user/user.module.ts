import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/core/auth/auth.module';
import { PrismaModule } from 'src/providers/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthModule,
    PrismaModule,
  ],
  exports: []
})
export class UserModule {}
