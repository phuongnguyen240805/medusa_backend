import { model } from "@medusajs/framework/utils";

const CustomCustomer = model.define("custom_customer", {
  id: model.id().primaryKey(),
  origin: model.text().nullable(),
  card_id: model.number().nullable(),
  code: model.text().nullable(),
  business_name: model.text().nullable(),
  tax_code: model.text().nullable(),
  // first_name: model.text(),
  // last_name: model.text(),
  // email: model.text().unique(),
  // phone: model.text().nullable(),
  // address: model.text().nullable(),
  // device_id: model.text().unique(),
  // device_list: model.json().nullable(),
});

export default CustomCustomer;
