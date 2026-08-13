import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field()
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;
}
