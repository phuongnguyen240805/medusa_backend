// src/modules/rbac-module/index.ts
import { Module } from "@medusajs/framework/utils";
import RbacModuleService from "./secvice";

export const RBAC_MODULE = "rbacModule";

export default Module(RBAC_MODULE, {
  service: RbacModuleService,
});
