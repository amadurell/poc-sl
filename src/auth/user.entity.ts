import { Customer } from 'src/customers/customer.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @JoinTable()
  @ManyToMany((_type) => Customer, (customer) => customer.users, {
    eager: false,
  })
  customers: Customer[];
}
