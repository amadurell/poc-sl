import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Connection } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private customersRepository: CustomersRepository;

  /**
   * Official NestJS documentation suggests ingesting the CustomersRepository directly in the constructor
   * with the @InjectRepository decorator, but the routes failed with an "undefined" object instead.
   * Check https://github.com/nestjs/typeorm/issues/405#issuecomment-610852491 for more info.
   *
   * @param connection Connection from the typeorm library.
   */
  constructor(private readonly connection: Connection) {
    this.customersRepository =
      this.connection.getCustomRepository(CustomersRepository);
  }

  /**
   * The "Create" in CRUD
   *
   * @param createCustomerDto CreateCustomerDto. The Data Transfer Object for Customer creation.
   * @param user User. The currently signed in User.
   * @returns Promise<Customer>
   */
  createCustomer(
    createCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<Customer> {
    return this.customersRepository.createCustomer(createCustomerDto, user);
  }

  /**
   * The "Retrieve" in CRUD.
   *
   * @param filterDto GetCustomersFilterDto Query parameters to filter the collection with. For instance, ?field1=Cliente Samsung.
   * @param user User. The currently signed in User.
   * @returns Promise<Customer[]>
   */
  getCustomers(
    filterDto: GetCustomersFilterDto,
    user: User,
  ): Promise<Customer[]> {
    return this.customersRepository.getCustomers(filterDto, user);
  }

  /**
   * The "Retrieve one" in CRUD (shouldn't we say CRrUD?).
   *
   * @param id string. The id of the one customer to retrieve.
   * @returns Promise<Customer>
   * @throws NotFoundException if the provided id doesn't match any existing customer
   */
  async getCustomerById(id: string, user: User): Promise<Customer> {
    const customer = await this.customersRepository.findOne(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    if (!customer.users.some((owner) => owner.id === user.id)) {
      throw new UnauthorizedException(
        `The currently signed in user is not authorized to access this customer's data.`,
      );
    }

    return customer;
  }

  /**
   * The "Update" in CRUD
   *
   * @param id string The id of the customer to update.
   * @param updateCustomerDto UpdateCustomerDto A partial Customer entity containing the data to update.
   * @param user User. The currently signed in User.
   * @returns Promise<Customer>
   */
  updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    user: User,
  ): Promise<Customer> {
    return this.customersRepository.updateCustomer(id, updateCustomerDto, user);
  }

  /**
   * The "Delete" in CRUD
   *
   * @param id string The id of the customer
   * @throws NotFoundException if the provided id doesn't match any existing customer (hence, no deletion has occurred)
   */
  async deleteCustomer(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
  }
}
