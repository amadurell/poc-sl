import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller({
  version: ['', 'v1', 'v2'],
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  /**
   * DANGER ZONE: Performs a TRUNCATE on the users table
   *
   * @returns Promise<void>
   */
  @Delete('/users')
  deleteUsers(): Promise<void> {
    return this.authService.deleteUsers();
  }
}
