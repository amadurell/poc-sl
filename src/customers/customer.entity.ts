import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Project } from '../projects/project.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerField3 } from './customer-field3.enum';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  field1: string;

  @Column()
  field2: string;

  @Column({
    type: 'enum',
    enum: CustomerField3,
    default: String(CustomerField3.VALUE_1),
  })
  field3: CustomerField3;

  @Column({ length: 512, nullable: true })
  field4?: string;

  @ManyToMany((type) => User, (user) => user.customers, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  users: User[];

  @OneToMany((type) => Project, (project) => project.customer, { eager: true })
  projects: Project[];
}
