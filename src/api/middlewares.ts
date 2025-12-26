import { defineMiddlewares } from "@medusajs/framework/http";
import { authenticate } from "@medusajs/framework/http";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/change-password",
      method: "POST",
      // Middleware authenticate("store", "bearer") sẽ kiểm tra JWT
      // và tạo ra req.auth_context.auth_user_id
      middlewares: [authenticate("customer", "bearer")],
    },
  ],
});
