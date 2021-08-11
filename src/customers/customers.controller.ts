import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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
    console.log(createCustomerDto);
    return this.customersService.createCustomer(createCustomerDto);
  }

  @Get('/:id')
  getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customersService.getCustomerById(id);
  }

  @Get()
  getCustomers(@Query() filterDto: GetCustomersFilterDto): Promise<Customer[]> {
    return this.customersService.getCustomers(filterDto);
  }

  @Patch('/:id')
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.updateCustomer(id, updateCustomerDto);
  }

  @Delete('/:id')
  deleteCustomer(@Param('id') id: string): Promise<void> {
    return this.customersService.deleteCustomer(id);
  }

  @Delete()
  deleteCustomers(): Promise<void> {
    return this.customersService.deleteCustomers();
  }
}
