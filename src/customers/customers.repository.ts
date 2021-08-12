import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';

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

    const customer = this.create({
      field1,
      field2,
      users: [user],
    });

    await this.save(customer);
    return customer;
  }

  /**
   * Custom method to cover all retrieve operations with filter conditions
   * (or all customers if no filters are provided).
   *
   * @param filterDto GetCustomersFilterDto
   * @returns Promise<Customer[]>
   */
  async getCustomers(filterDto: GetCustomersFilterDto): Promise<Customer[]> {
    const { field1, field2, search } = filterDto;
    const query = this.createQueryBuilder('customer');

    if (field1) {
      query.andWhere('customer.field1 = :field1', { field1 });
    }

    if (field2) {
      query.andWhere('customer.field2 = :field2', { field2 });
    }

    if (search) {
      query.andWhere(
        'LOWER(customer.field1) LIKE LOWER(:search) OR LOWER(customer.field2) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const customers = query.getMany();
    return customers;
  }
}
