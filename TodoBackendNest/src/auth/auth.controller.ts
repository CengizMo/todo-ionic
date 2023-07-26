import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService,) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login', description: 'Login'})
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', example: 'Example Name', description: 'The username name', minLength: 1 },
        password: { type: 'string', example: 'Example Password', description: 'The password', minLength: 1 },
      },
      required: ['username', 'password'],
      example: {
        username: 'Example Name',
        password: 'Example Password'
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'dd2131bind123819hd12unduiwandiu210.3125eQ' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'SignUp', description: 'SignUp'})
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: "User created successfully" },
        user: {
          type: 'object',
          properties:{
          username: { type: 'string', example: "Example Name" },
          password: { type: 'string', example: "Example Password"},
          id: {type: 'number', example: 0}
        }
      }
      },
    },
  })
  @Post('signup')
  async signUp(@Body() signUpDto: { username: string; password: string; }) {
    const user = await this.usersService.create(signUpDto);
    return { message: 'User created successfully', user };
  }

  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 0 },
        username: { type: 'string', example: "Example Name" },
        password: { type: 'string', example: "Example Password" }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' }
      },
    },
  })
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.sub);
    return user;
  }
}