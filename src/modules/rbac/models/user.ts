// src/models/user.ts
import { model } from "@medusajs/framework/utils"
import { Role } from "./role" 

export const User = model.define("user", {
  id: model.id().primaryKey(),
  account_type: model.text().default("personal"), // "personal" | "business"
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  email: model.text().unique(), 
  phone: model.number().nullable(), 
  password: model.text().nullable(), 
  address: model.text().nullable(), 
  national: model.text().default('Vietnam'), // Quốc tịch
  card_id: model.text().nullable(), // Số CCCD
  code: model.text().nullable(), // Mã giới thiệu

  business_name: model.text().default(''), // Tên công ty
  tax_code: model.text().nullable(), // Mã số thuế
  
  role: model.belongsTo(() => Role, { mappedBy: "users" }),
})

export default User