import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @IsEmail({}, { message: 'Vui lòng nhập một địa chỉ email hợp lệ.' })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @IsString({ message: 'Mật khẩu phải là một chuỗi văn bản.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  password!: string;
}
