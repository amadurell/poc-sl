import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';

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
    this.customersRepository = this.connection.getCustomRepository(CustomersRepository);
  }

  /**
   * The "Create" in CRUD
   *
   * @param createCustomerDto CreateCustomerDto. The Data Transfer Object for Customer creation.
   * @returns Promise<Customer>
   */
  createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { field1, field2 } = createCustomerDto;

    const customer = this.customersRepository.create({
      field1,
      field2,
    });

    return this.customersRepository.save(customer);
  }

  // getAllCustomers(): Customer[] {
  //   return [new Customer()];
  // }

  /**
   * The "Retrieve one" in CRUD (shouldn't we say CRrUD?).
   *
   * @param id string. The id of the one customer to retrieve.
   * @returns Promise<Customer>
   * @throws NotFoundException if the provided id doesn't match any existing customer
   */
  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne(id);

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  }

  // deleteCustomer(@Param('id') id: string): void {
  //   // this.customers = this.tasks.filter((task) => task.id != id);
  // }
}
