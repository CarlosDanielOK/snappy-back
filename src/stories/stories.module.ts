import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stories } from './entities/stories.entity';
import { User } from 'src/users/entities/user.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stories, User]), FilesModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
