import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomerInfoModuleService from "../../../modules/customer_info/service";
import { CUSTOMER_INFO_MODULE } from "../../../modules/customer_info";
import { checkPermissions } from "../../middlewares/check-permissions";

export const middleware = [checkPermissions("admin", ["READ", "CREATE"])];

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.params; // Lấy tham số [id] từ URL
  const customerInfoService: CustomerInfoModuleService =
    req.scope.resolve(CUSTOMER_INFO_MODULE);

  const customerInfo = await customerInfoService.getCustomerInfoByCustomerId(
    id
  );

  if (!customerInfo) {
    res.status(404).json({
      error: `CustomerInfo with customer_id: ${id} not found`,
    });
    return;
  }

  res.json({
    success: true,
    customer_info: customerInfo,
  });
}

/**
 * PUT /customer-info/:id
 * Cập nhật CustomerInfo theo ID của bảng CustomerInfo
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // GIẢ ĐỊNH: Route này dùng ID của bảng CustomerInfo (chứ không phải customer_id)
  const { id } = req.params;
  const customerInfoService: CustomerInfoModuleService =
    req.scope.resolve(CUSTOMER_INFO_MODULE);

  const updateData = req.validatedBody;

  try {
    const updatedCustomerInfo = await customerInfoService.updateCustomerInfo(
      id,
      updateData
    );

    res.json({
      success: true,
      customer_info: updatedCustomerInfo,
    });
  } catch (error) {
    res.status(404).json({
      error: `CustomerInfo with ID: ${id} not found or update failed.`,
    });
  }
}

/**
 * DELETE /customer-info/:id
 * Xóa CustomerInfo theo ID của bảng CustomerInfo
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // GIẢ ĐỊNH: Route này dùng ID của bảng CustomerInfo
  const { id } = req.params;
  const customerInfoService: CustomerInfoModuleService =
    req.scope.resolve(CUSTOMER_INFO_MODULE);

  try {
    await customerInfoService.deleteCustomerInfo(id);

    res.status(200).json({
      success: true,
      message: `CustomerInfo with ID: ${id} deleted successfully.`,
    });
  } catch (error) {
    res.status(404).json({
      error: `CustomerInfo with ID: ${id} not found or deletion failed.`,
    });
  }
}
