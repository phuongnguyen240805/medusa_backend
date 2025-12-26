import { MedusaService } from "@medusajs/framework/utils";
import CustomCustomer from "./models/customer";

class CustomerManagerModuleService extends MedusaService({
  CustomCustomer, // Đăng ký Model đã tạo
}) {
  /**
   * Phương thức để liệt kê tất cả khách hàng
   */
  async listCustomers() {
    return await this.listCustomCustomers();
  }

  /**
   *  Phương thức để tạo một khách hàng mới
   */
  async createCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    device_id: string;
    device_list?: Record<string, unknown> | null;
  }) {
    // return await this.createCustomCustomers(data);
  }

  /**
   * Cập nhật danh sách thiết bị của khách hàng
   */
  // async updateDeviceList(
  //   customerId: string,
  //   device_list: Record<string, unknown> | null
  // ) {
  //   return await this.updateCustomCustomers({
  //     id: customerId,
  //     device_list,
  //   });
  // }
}

export default CustomerManagerModuleService;
