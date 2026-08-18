import { Args, Mutation, Resolver, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';
import { AuthPayload } from './entities/auth-payload.entity';
import { SignUpInput } from './dto/signup.input';
import { Auth } from './entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.validateLocalUser(signInInput);

    return await this.authService.login(user);
  }

  @Mutation(() => Auth)
  async CreateUser(@Args('signUpInput') signUpInput: SignUpInput) {
    const user = await this.authService.signup(signUpInput);

    return user;
  }

  @Mutation(() => AuthPayload)
  async refreshToken(@Args('token') token: string) {
    return await this.authService.refreshToken(token);
  }

  @Mutation(() => Boolean)
  async logout(@Args('userId', { type: () => Int }) userId: number) {
    return await this.authService.logout(userId);
  }
}
