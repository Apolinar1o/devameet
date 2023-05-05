import { Module } from '@nestjs/common';
import { Authmodule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './user/schemas/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    Authmodule,
    userModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
