import { MedusaService } from "@medusajs/framework/utils";
import CustomerInfo from "./models/customer_info";

class CustomerInfoModuleService extends MedusaService({
  customer_info: CustomerInfo,
}) {
  async getListCustomers() {
    return await this.listCustomer_infos();
  }

  async getCustomerInfoByCustomerId(customerId: string) {
    const result = await this.listCustomer_infos(
      { customer_id: customerId },
      { take: 1 }
    );

    return result[0] || null;
  }

  async createCustomerInfo({ data }) {
    return await this.createCustomer_infos(data);
  }

  async updateCustomerInfo(id: string, data) {
    return await this.updateCustomer_infos({ id }, data);
  }

  async deleteCustomerInfo(id: string) {
    return await this.deleteCustomer_infos(id);
  }
}

export default CustomerInfoModuleService;
