import { Module } from '@nestjs/common';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';
import { userModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { meet, meetSchema } from './schemas/meet.schema';
import { Userservice } from 'src/user/user.service';
import { meetObject, meetObjectSchema } from './schemas/meetObject.schema';

@Module({
  imports: [userModule, MongooseModule.forFeature([
    {name: meet.name, schema: meetSchema},
    
    {name: meetObject.name, schema: meetObjectSchema},
    
  ] )],
  controllers: [MeetController],
  providers: [MeetService],
  exports: [MongooseModule, MeetService]
})
export class MeetModule {}
