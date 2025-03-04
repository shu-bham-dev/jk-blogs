import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      clientID: configService.get<string>(process.env.GOOGLE_CLIENT_ID||''),
      clientSecret: configService.get<string>(process.env.GOOGLE_CLIENT_SECRET||''),
      callbackURL: configService.get<string>(process.env.GOOGLE_CALLBACK_URL||''),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user = await this.authService.validateOAuthUser(profile, 'google');
    done(null, user);
  }
}
