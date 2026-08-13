import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, ...user } = createUserInput;
    const validPassword = password || '123456';
    const hashedPassword = await hash(validPassword);

    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    // Kiểm tra user có tồn tại không trước khi update
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);
    }

    const { password, ...user } = updateUserInput;

    const data = password ? { ...user, password: await hash(password) } : user;

    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
