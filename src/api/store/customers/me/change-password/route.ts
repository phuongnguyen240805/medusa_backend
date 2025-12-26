// src/api/store/customers/me/change-password/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IAuthModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { current_password, new_password, email } = req.body as any;

  const authUserId = req.auth_context?.actor_id;
  if (!authUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const authModuleService: IAuthModuleService = req.scope.resolve(Modules.AUTH);

  try {
    // Xác thực mật khẩu cũ
    const { success, error } = await authModuleService.authenticate(
      "emailpass",
      {
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: {
          email,
          password: current_password,
        },
        protocol: req.protocol,
      } as any
    );

    if (!success || error) {
      return res.status(400).json({
        message: "Xác thực thất bại: Mật khẩu cũ không chính xác",
        details: error,
      });
    }

    // dổi mật khẩu qua provider
    const { success: updateSuccess, error: updateError } =
      await authModuleService.updateProvider("emailpass", {
        entity_id: email, 
        password: new_password,
      });

    if (!updateSuccess) {
      return res.status(400).json({
        message: "Không thể cập nhật mật khẩu",
        details: updateError,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "lỗi:", error: error.message });
  }
};
