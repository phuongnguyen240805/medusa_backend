import { Module } from "@medusajs/framework/utils";
import CustomerInfoModuleService from "./service";

export const CUSTOMER_INFO_MODULE = "customer_info";

export default Module(CUSTOMER_INFO_MODULE, {
  service: CustomerInfoModuleService,
});
