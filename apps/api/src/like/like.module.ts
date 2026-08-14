import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LikeResolver, LikeService, PrismaService],
  exports: [LikeService],
})
export class LikeModule {}
