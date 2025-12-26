import { MedusaService } from "@medusajs/framework/utils";
import ProxmoxService from "../../services/proxmox.service";

class ProvisioningService extends MedusaService({}) {
  protected proxmoxService: ProxmoxService;

  constructor(container: any) {
    super(container);
    this.proxmoxService = new ProxmoxService();
  }

  public getProxmoxConnector(): ProxmoxService {
    return this.proxmoxService;
  }
}

export default ProvisioningService;
