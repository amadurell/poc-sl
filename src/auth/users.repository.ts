import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  /**
   * Custom method to simplify the logic in the AuthService class
   *
   * @param authCredentialsDto AuthCredentialsDto
   */
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // Salty hashed password FTW
    const salt: string = await bcrypt.genSalt();
    const hashword: string = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashword });
    try {
      await this.save(user);
    } catch (error) {
      switch (error.code) {
        case '23505': {
          // Duplicate username
          throw new ConflictException(`Username ${username} already exists`);
          break;
        }
        default: {
          throw new InternalServerErrorException();
          break;
        }
      }
    }
  }
}
