import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Creates a new User
   *
   * @param authCredentialsDto AuthCredentialsDto
   * @returns Promise<void>
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  /**
   * Authenticates a User
   *
   * @param authCredentialsDto AuthCredentialsDto object containing username and password
   * @returns Promise<string>
   * @throws UnauthorizedException if either the user doesn't exist or the password doesn't match
   */
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  /**
   * DANGER ZONE:
   * Just a quick and dirty TRUNCATE on the users table.
   */
  async deleteUsers(): Promise<void> {
    await this.usersRepository.clear();
  }
}
