import { Customer } from './entities/customer.entity.js';
import { CustomerResponseDto } from './dto/customer-response.dto.js';

export function toCustomerResponse(customer: Customer): CustomerResponseDto {
  return {
    idCustomer: customer.id_customer,
    nameCustomer: customer.name_customer,
    phoneCustomer: customer.phone_customer,
    emailCustomer: customer.email_customer,
    createdAt: customer.created_at.toISOString(),
    updatedAt: customer.updated_at.toISOString(),
  };
}
