import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import ProvisioningService from "../modules/vps/service";
import { PROXMOX_PROVISIONING_MODULE } from "../modules/vps";
// import { IOrderModuleService } from "@medusajs/types";
// import { OrderService } from "@medusajs/order";

// Hàm xử lý sự kiện
export default async function vpsOrderCreationHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve("order");
  // container.resolve<IOrderModuleService>("orderModuleService");
  // console.log(orderService);
  const provisioningService = container.resolve<ProvisioningService>(
    PROXMOX_PROVISIONING_MODULE
  );

  const vpsOrderId = data.id;
  const vpsOrder = await orderService.retrieveOrder(vpsOrderId);

  const metadata = vpsOrder.metadata || {};

  if (metadata?.product_type !== "vps") {
    return;
  }

  try {
    //  Lấy Proxmox Connector từ Provisioning Service
    const proxmox = provisioningService.getProxmoxConnector();

    //  Gọi hàm tạo VPS
    const result = await proxmox.createVPS({ id: vpsOrderId, metadata });

    //  Cập nhật trạng thái vào Order metadata (sử dụng OrderService)
    await orderService.updateOrders(
      { id: [vpsOrderId] },
      {
        metadata: {
          ...metadata,
          vps_vmid: result.vmid,
          vps_status: "created",
          proxmox_task_data: JSON.stringify(result.data),
        },
      }
    );
    console.log(
      `Khởi tạo tác vụ tạo VPS cho Đơn Hàng ID: ${vpsOrderId}. VMID: ${result.vmid}`
    );
  } catch (error: any) {
    console.error(`Lỗi khi tạo VPS cho Đơn Hàng ${vpsOrderId}:`, error.message); // 5. Cập nhật trạng thái lỗi
    await orderService.updateOrders(
      { id: [vpsOrderId] },
      {
        metadata: {
          ...metadata,
          vps_status: "failed",
          error: error.message.substring(0, 255),
        },
      }
    );
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
