// POST: /store/auth/register-custom
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
// import { Modules } from "@medusajs/framework/utils";

export const POST = async(req: MedusaRequest, res: MedusaResponse) => {
    const { fullname, email, password } = req.body as any;

    // 1. Kiểm tra đầu vào
    if (!email || !password) {
        return res.json({ message: "Thiếu email hoặc mật khẩu" })
    }

    const authService = req.scope.resolve("auth")
    const customerService = req.scope.resolve("customer")
    const manager = req.scope.resolve("manager")

    try {
        await customerService.createCustomers({
            email: email,
            first_name: fullname, 
            last_name: "", 
            metadata: {
                full_name: fullname, 
                registered_at: new Date().toISOString()
            }
        })

        return res.status(201).json({ message: "Đăng ký thành công" })

    } catch (error) {
        // Nếu email đã tồn tại, Medusa sẽ quăng lỗi
        const errorMessage = error.message.includes("exists") 
            ? "Email này đã được sử dụng" 
            : "Lỗi hệ thống khi đăng ký"
            
        return res.status(400).json({ message: errorMessage })
    }
}