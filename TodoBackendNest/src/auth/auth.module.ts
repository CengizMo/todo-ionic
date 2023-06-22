import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { config as dotenvConfig } from 'dotenv';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

dotenvConfig({ path: './jwt.env' });
const secretKey = process.env.SECRET_KEY;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: secretKey,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [AuthService, {provide: APP_GUARD, useClass: AuthGuard}],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}