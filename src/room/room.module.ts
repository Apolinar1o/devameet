import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { MeetModule } from 'src/meet/meet.module';
import { userModule } from 'src/user/user.module';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { position, positionSchema } from './schemas/position.schema';

@Module({
  imports:[
    MeetModule, userModule, 
    MongooseModule.forFeature([
      {
        name: position.name, schema:positionSchema
      }
    ])
  ],
  providers: [RoomService],
  controllers: [RoomController]
})
export class RoomModule {

}
