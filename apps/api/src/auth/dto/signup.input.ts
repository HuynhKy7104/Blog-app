import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Tên không được để trống.' })
  @IsString({ message: 'Tên phải là một chuỗi văn bản.' })
  @MaxLength(50, { message: 'Tên không được vượt quá 50 ký tự.' })
  name!: string;

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
