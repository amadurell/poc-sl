import { CustomerField3 } from "../customer-field3.enum";

export class GetCustomersFilterDto {
  field1: string;
  field2: string;
  field3: CustomerField3;
  search: string;
}
