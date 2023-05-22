import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './user/user.module';
import { jwtAuthGuard } from './auth/guards/jwt.guard';
import {APP_GUARD} from "@nestjs/core" 
import { MeetModule } from './meet/meet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    Authmodule,
    userModule,
    MeetModule
    
  ],
  controllers: [],
  providers: [
    {provide: APP_GUARD, useClass: jwtAuthGuard},
  ],
})
export class AppModule {}
