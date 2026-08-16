import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags() {
    return await this.prisma.tag.findMany();
  }
}
