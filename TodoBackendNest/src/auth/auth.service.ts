import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }
}
