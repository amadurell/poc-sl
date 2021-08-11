import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller({
  version: ['', 'v1', 'v2'],
  path: 'customers',
})
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.createCustomer(createCustomerDto);
  }

  // @Get()
  // async getAllCustomers(): Promise<Customer[]> {
  //   const customers = await this.customersService.getAllCustomers();
  //   return customers;
  // }

  @Get('/:id')
  getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customersService.getCustomerById(id);
  }

  // @Delete('/:id')
  // deleteCustomer(@Param('id') id: string): void {
  //   return this.customersService.deleteCustomer(id);
  // }
}
