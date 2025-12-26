// src/models/role.ts
import { model } from "@medusajs/framework/utils";
import { User } from "./user"; 

// Định nghĩa cấu trúc Permission
export interface Permission {
  subject: string;
  actions: ("CREATE" | "READ" | "UPDATE" | "DELETE")[];
}

export const Role = model.define("role", {
  id: model.id().primaryKey(),
  name: model.text().unique(), // Tên vai trò

  permissions: model.text().nullable(),
    // .json<Permission[]>()
    // .default(() => [])
    // .nullable(),

  // Mối quan hệ Một-Nhiều (One-to-Many): Một Role có nhiều User
  // mappedBy: "role" là tên thuộc tính trên Model User
  users: model.hasMany(() => User, { mappedBy: "role" }),
});

export default Role;
