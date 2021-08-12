import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  field1: string;

  @Column()
  field2: string;

  @ManyToMany((type) => User, (user) => user.customers, { eager: true })
  @Exclude({ toPlainOnly: true })
  users: User[];
}
