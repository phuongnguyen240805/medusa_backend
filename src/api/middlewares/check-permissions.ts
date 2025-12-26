// src/api/middlewares/check-permissions.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http";
import RbacModuleService from "../../modules/rbac/secvice";
import { Permission } from "../../modules/rbac/models/role";

const hasPermission = (
  permissions: Permission[],
  subject: string,
  action: string[]
): boolean => {
  return permissions.some((permission) =>
    permission.subject === subject 
  // && action.includes(permission.actions)
  );
};

export const checkPermissions = (subject: string, action: string[]) => {
  return (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const userId = req.auth_context.actor_id;

    // Lấy Service từ scope
    const rbacService =
      req.scope.resolve<RbacModuleService>("rbacModuleService");

    // 1. Lấy quyền hạn
    rbacService
      .getUserPermissions(userId)
      .then((permissions: Permission[] | null) => {
        if (!permissions) {
          return res
            .status(403)
            .json({ message: "Forbidden: No role assigned." });
        }

        // 2. Thực hiện kiểm tra quyền
        if (hasPermission(permissions, subject, action)) {
          next();
        } else {
          return res.status(403).json({
            message: `Forbidden: Missing permission for ${action} on ${subject}.`,
          });
        }
      })
      .catch((err) => {
        console.error("Authorization Error:", err);
        return res
          .status(500)
          .json({ message: "Internal Server Error during authorization." });
      });
  };
};
