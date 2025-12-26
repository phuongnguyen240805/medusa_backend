import axios from "axios";
import Bottleneck from "bottleneck";
import * as https from "https"; // Thêm thư viện https

// Khắc phục lỗi SSL/Chứng chỉ tự ký của Proxmox
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Rate limiting: 1 request/giây
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

class ProxmoxService {
  private host: string;
  private username: string;
  private tokenID: string;
  private tokenSecret: string;
  private headers: { Authorization?: string } = {};

  constructor() {
    this.host = process.env.PROXMOX_HOST!;
    this.username = process.env.PROXMOX_USERNAME!;
    this.tokenID = process.env.PROXMOX_TOKEN_ID!;
    this.tokenSecret = process.env.PROXMOX_TOKEN_SECRET!;

    // Gọi authenticate ngay trong constructor để thiết lập Header
    this.authenticate();
  }

  private static MIN_VMID = 10000;
  private static MAX_VMID = 99999;
  private static MAX_ATTEMPTS = 50;

  // Lấy danh sách tất cả các VMID hiện đang được sử dụng.
  private async getUsedVMIDs(): Promise<Set<number>> {
    const response = await this.makeRequest(
      "GET",
      "/api2/json/cluster/resources",
      { type: "vm" }
    );

    const usedIDs = new Set<number>();

    if (response?.data) {
      for (const resource of response.data) {
        if (resource.vmid) {
          usedIDs.add(resource.vmid);
        }
      }
    }
    return usedIDs;
  }

  // Sinh ra một VMID ngẫu nhiên duy nhất chưa được sử dụng.
  private async generateUniqueVMID(): Promise<number> {
    const usedIDs = await this.getUsedVMIDs();

    for (let i = 0; i < ProxmoxService.MAX_ATTEMPTS; i++) {
      const candidateID =
        Math.floor(
          Math.random() *
            (ProxmoxService.MAX_VMID - ProxmoxService.MIN_VMID + 1)
        ) + ProxmoxService.MIN_VMID;

      if (!usedIDs.has(candidateID)) {
        console.log(`[Proxmox] Found unique VMID: ${candidateID}`);
        return candidateID;
      }
    }

    throw new Error(
      "Không thể tạo VMID duy nhất sau số lần thử giới hạn. Vui lòng kiểm tra pool ID."
    );
  }

  //Thiết lập Header xác thực bằng API Token.
  private authenticate() {
    const TOKEN_ID = this.tokenID;

    const API_TOKEN_STRING = `${TOKEN_ID}=${this.tokenSecret}`;

    this.headers = {
      Authorization: `PVEAPIToken=${API_TOKEN_STRING}`,
    };
    console.log("[ProxmoxService] Xác thực API Token đã thiết lập.");
  }

  private async makeRequest(method: string, endpoint: string, data?: any) {
    try {
      const config: any = {
        method,
        headers: this.headers,
        data: data,
        url: `${this.host}${endpoint}`,
        // *** KHẮC PHỤC SSL ***
        httpsAgent: httpsAgent,
      };

      const response = await limiter.schedule(() => axios(config));
      return response.data;
    } catch (error: any) {
      // Với API Token, nếu lỗi 401, thường là do Token sai
      if (error.response?.status === 401) {
        throw new Error(
          "API Token không hợp lệ hoặc không đủ quyền. Vui lòng kiểm tra lại Token ID/Secret và Permissions."
        );
      }

      if (error.response) {
        throw new Error(
          `Lỗi API Proxmox (${error.response.status}): ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        throw new Error(
          `Không nhận phản hồi từ Proxmox (Lỗi Mạng/SSL): ${error.request}`
        );
      } else {
        throw new Error(`Lỗi thiết lập request: ${error.message}`);
      }
    }
  }

  // tạo vps
  public async createVPS(orderData: { id: string; metadata: any }) {
    const node = process.env.PROXMOX_NODE!;

    const vmid = await this.generateUniqueVMID();

    const cpuCores = orderData.metadata.cpu || 1;
    const ramMB = (orderData.metadata.ram || 2) * 1024;
    const diskGB = orderData.metadata.disk || 30;

    // Cấu hình VM
    const vmConfig = {
      vmid,
      name: `gofiber-${orderData.id}`,
      cores: cpuCores,
      cpu: "host",
      cpulimit: cpuCores.toString(),
      memory: ramMB,
      balloon: 0,
      virtio0: `local-zfs:${diskGB},size=${diskGB}G,iothread=1,cache=directsync,discard=on,ssd=1`,
      scsihw: "virtio-scsi-single",
      net0: "virtio,bridge=vmbr0,rate=18.75",
      boot: "order=virtio0",
      ostype: "l26",
      agent: 1,
      firewall: 1,
      unprivileged: 0,
      ipconfig0: "ip=dhcp",
      ciuser: "admin",
      cipassword: "GoFiber2025!",
    };

    // tạo VM
    const createResponse = await this.makeRequest(
      "POST",
      `/api2/json/nodes/${node}/qemu`,
      vmConfig
    );

    // Khởi động VM
    await this.makeRequest(
      "POST",
      `/api2/json/nodes/${node}/qemu/${vmid}/status/start`
    );

    return { vmid, data: createResponse };
  }
}

export default ProxmoxService;
