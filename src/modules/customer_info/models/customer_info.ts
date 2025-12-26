import { model } from "@medusajs/framework/utils";

const CustomerInfo = model.define("customer_info", {
  id: model.id().primaryKey(),
  // Liên kết logic với customer qua module link
  customer_id: model.text().nullable(),
  account_type: model.text().default("personal"), // "personal" | "business"
  // first_name: model.text().nullable(),
  // last_name: model.text().nullable(),
  // email: model.text().unique(),
  // phone: model.number().nullable(),
  password: model.text().nullable(),
  address: model.text().nullable(),
  national: model.text().default("Vietnam"), // Quốc tịch
  card_id: model.text().nullable(), // Số CCCD
  code: model.text().nullable(), // Mã giới thiệu
  business_name: model.text().default(""), // Tên công ty
  tax_code: model.text().nullable(), // Mã số thuế

  // CUSTOM FIELDS
  // full_name: model.text().nullable(), // Họ và tên
  // card_id: model.text().nullable(), // Số CCCD
  // origin: model.text().nullable(), // Nguồn khách (Facebook, Zalo, TikTok…)
  // business_name: model.text().nullable(), // Tên công ty
  // tax_code: model.text().nullable(), // Mã số thuế
  // account_type: model.text().default("personal"), // "personal" | "business"
  // balance: model.number().default(0), // Số dư tài khoản
});

export default CustomerInfo;
