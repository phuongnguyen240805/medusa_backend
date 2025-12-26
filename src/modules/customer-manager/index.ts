import CustomerManagerModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

// Định nghĩa hằng số để dễ dàng resolve Service sau này
export const CUSTOMER_MANAGER_MODULE = "customerManager";

export default Module(CUSTOMER_MANAGER_MODULE, {
  service: CustomerManagerModuleService,
});
