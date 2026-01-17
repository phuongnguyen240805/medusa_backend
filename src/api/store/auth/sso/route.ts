import jwt from "jsonwebtoken";
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context.actor_id;

  if (!customerId) return res.status(401).json({ message: "Chưa đăng nhập" });

  const ssoToken = jwt.sign(
    {
      customer_id: customerId,
      type: "sso_auth",
    },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "60s" }
  );

  res.json({ sso_token: ssoToken });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { token } = req.body as { token: string };
  const configModule = req.scope.resolve("configModule") as any;
  const authModuleService = req.scope.resolve(Modules.AUTH);

  const { projectConfig } = configModule;
  const secret = projectConfig.http.jwtSecret;

  if (!secret) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET không tồn tại trong config!" });
  }

  try {
    const decoded = jwt.verify(token, secret) as any;

    const [authIdentity] = await authModuleService.listAuthIdentities({
      app_metadata: { customer_id: decoded.customer_id },
    });

    if (!authIdentity) {
      return res.status(404).json({ message: "Auth identity not found" });
    }

    const payload = {
      actor_id: decoded.customer_id,
      actor_type: "customer",
      auth_identity_id: authIdentity.id,
      app_metadata: {
        customer_id: decoded.customer_id,
      },
      user_metadata: {},
    };

    const jwtOptions = projectConfig.http.jwtOptions || {
      expiresIn: projectConfig.http.jwtExpiresIn || "1d",
    };

    const medusaToken = jwt.sign(payload, secret!, jwtOptions);

    // trả về token đăng nhập thật
    return res.status(200).json({
      message: "Xác thực SSO thành công",
      token: medusaToken,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: "Xác thực thất bại",
      details: error.message,
    });
  }
}
