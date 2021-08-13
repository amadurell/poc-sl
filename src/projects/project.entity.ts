import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Customer } from 'src/customers/customer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  field1: string;

  @ManyToOne((type) => Customer, (customer) => customer.projects, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  customer: Customer;
}
