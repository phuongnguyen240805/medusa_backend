import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomerInfoModuleService from "../../modules/customer_info/service";
import { CUSTOMER_INFO_MODULE } from "../../modules/customer_info";
import { checkPermissions } from "../middlewares/check-permissions";

// Áp dụng middleware kiểm tra quyền hạn
export const middleware = [checkPermissions("admin", ["READ", "CREATE"])];

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerInfoService: CustomerInfoModuleService =
    req.scope.resolve(CUSTOMER_INFO_MODULE);

  const customerInfos = await customerInfoService.getListCustomers();

  res.json({
    success: true,
    customerInfos,
  });
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerInfoService: CustomerInfoModuleService =
    req.scope.resolve(CUSTOMER_INFO_MODULE);

  const data = req.body;

  try {
    const newCustomerInfo = await customerInfoService.createCustomerInfo({
      data,
    });

    res.status(201).json({
      customer_info: newCustomerInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
