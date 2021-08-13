import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  /**
   * Custom method to simplify the logic in the Customer Service file
   *
   * @param createCustomerDto CreateCustomerDto
   * @returns Promise<Customer>
   */
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<Customer> {
    const { field1, field2 } = createCustomerDto;

    let customer = this.create({
      field1,
      field2,
      users: [user],
    });

    try {
      await this.save(customer);
      return customer;
    } catch (error) {
      console.log(error.code);
      console.log(error);
      switch (error.code) {
        case '23505': {
          /* 
            We've let the Customer entity @Column decorator prevent a duplicate field1 value.
            Let's find out whether the current user is already associated to it or not.
          */
          customer = await this.findOne({ field1 });
          let msg = `Customer ${field1} already exists`;
          msg += customer.users.some((owner) => owner.id === user.id)
            ? '.'
            : `, but... you're not in the list.`;
          throw new ConflictException(msg);
          break;
        }
        default: {
          throw new InternalServerErrorException();
          break;
        }
      }
    }
  }

  /**
   * Custom method to cover all retrieve operations with filter conditions
   * (or all customers related to the signed in user, if no filters are provided).
   *
   * @param filterDto GetCustomersFilterDto
   * @param user User
   * @returns Promise<Customer[]>
   */
  async getCustomers(
    filterDto: GetCustomersFilterDto,
    user: User,
  ): Promise<Customer[]> {
    const { field1, field2, field3, search } = filterDto;

    const qb = this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.users', 'user')
      .where('user.id = :userId', { userId: user.id });

    if (field1) {
      qb.andWhere('customer.field1 = :field1', { field1 });
    }

    if (field2) {
      qb.andWhere('customer.field2 = :field2', { field2 });
    }

    if (field3) {
      qb.andWhere('customer.field3 = :field3', { field3 });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(customer.field1) LIKE LOWER(:search) OR LOWER(customer.field2) LIKE LOWER(:search) OR LOWER(customer.field4) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const customers = qb.getMany();
    return customers;
  }

  /**
   * Custom method to keep the service update method cleaner.
   *
   * @param id string The id of the customer to update.
   * @param updateCustomerDto UpdateCustomerDto A partial Customer entity containing the data to update.
   * @returns Promise<Customer>
   * @throws NotFoundException if the provided id doesn't match any existing customer.
   * @throws UnauthorizedException if the user is not entitled to apply the update.
   */
  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    user: User,
  ): Promise<Customer> {
    const customer: Customer = await this.preload({
      id,
      ...updateCustomerDto,
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    if (!customer.users.some((owner) => owner.id === user.id)) {
      throw new UnauthorizedException(
        `You're not authorized to modify the requested customer.`,
      );
    }

    return this.save(customer);
  }
}
