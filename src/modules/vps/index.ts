import ProvisioningService from "./service";
import { Module } from "@medusajs/framework/utils";

export const PROXMOX_PROVISIONING_MODULE = "provisioningService";

export default Module(PROXMOX_PROVISIONING_MODULE, {
  service: ProvisioningService,
});
