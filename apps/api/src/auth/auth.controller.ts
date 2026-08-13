import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/jwt-google/google-auth.guard';
import { AuthUser } from './types/auth-user.type';

interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Guard tự redirect sang Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { user } = req;
    const { accessToken, refreshToken } = await this.authService.generateToken(
      user.id,
    );

    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      id: String(user.id),
      name: user.name ?? '',
      avatar: user.avatar ?? '',
    });

    res.redirect(`http://localhost:3000/auth/success?${params.toString()}`);
  }
}
