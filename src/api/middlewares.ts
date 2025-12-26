import { defineMiddlewares } from "@medusajs/framework/http";
import { authenticate } from "@medusajs/framework/http";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/customers/me/change-password",
      middlewares: [authenticate("customer", "bearer")],
    },
  ],
});
