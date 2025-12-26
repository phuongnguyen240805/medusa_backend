import { MedusaService } from "@medusajs/framework/utils";
import CustomerInfo from "./models/customer_info";

class CustomerInfoModuleService extends MedusaService({
  customer_info: CustomerInfo,
}) {
  async getListCustomers() {
    return await this.listCustomer_infoes();
  }

  async getCustomerInfoByCustomerId(customerId: string) {
    const result = await this.listCustomer_infoes(
      { customer_id: customerId },
      { take: 1 }
    );

    return result[0] || null;
  }

  async createCustomerInfo({ data }) {
    return await this.createCustomer_infoes(data);
  }

  async updateCustomerInfo(id: string, data) {
    return await this.updateCustomer_infoes({ id }, data);
  }

  async deleteCustomerInfo(id: string) {
    return await this.deleteCustomer_infoes(id);
  }
}

export default CustomerInfoModuleService;
