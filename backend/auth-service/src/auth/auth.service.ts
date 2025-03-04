import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateOAuthUser(profile: any, provider: 'google' | 'facebook') {
    let user = await this.userModel.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await this.userModel.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        [`${provider}Id`]: profile.id,
      });
    }

    return this.generateJwtToken(user);
  }

  generateJwtToken(user: UserDocument) {
    return this.jwtService.sign({ userId: user._id, email: user.email });
  }
}
