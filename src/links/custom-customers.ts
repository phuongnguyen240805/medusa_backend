// src/links/customer-vn-info.ts
import { defineLink } from "@medusajs/framework/utils";
import CustomerInfoModule from "../modules/customer_info";
import CustomerModule from "@medusajs/medusa/customer";

export default defineLink(
  CustomerModule.linkable.customer,
  CustomerInfoModule.linkable.customerInfo
);
