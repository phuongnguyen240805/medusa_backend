// src/services/rbac-module.ts
import { MedusaService } from "@medusajs/framework/utils";
import { Permission } from "./models/role";
import { Role } from "./models/role";
import { User } from "./models/user";

// Tên module Service
class RbacModuleService extends MedusaService({
  role: Role,
  user: User,
}) {
  // Phương thức tiện lợi để lấy Permissions của User
  async getUserPermissions(userId: string): Promise<Permission[] | null> {
    // 1. Lấy User và bao gồm mối quan hệ 'role'
    const user = await this.retrieveUser(userId, {
      select: ["id", "role"],
      relations: ["role"],
    });

    if (!user || !user.role) {
      // Trả về null nếu không tìm thấy User hoặc Role
      return null;
    }

    // 2. Trả về permissions từ Role
    return user.role.permissions as Permission[] | null;
  }
}

export default RbacModuleService;
