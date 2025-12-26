import { Medusa } from "medusa-sdk";

const medusa = new Medusa({
    baseUrl: "http://localhost:9000",
    maxRetries: 3,
});

await medusa.admin.auth.create({ email: "admin@...", password: "..." });
await medusa.admin.products.create({
    "title": "Cloud VN #1",
    "subtitle": "VPS AMD EPYC 7402P – 2GB RAM – 50GB NVMe",
    "description": "Gói VPS giá rẻ nhất tại Việt Nam, băng thông 1Gbps, NVMe tốc độ cao.",
    "handle": "cloud-vn-1",
    "is_giftcard": false,
    "discountable": false,
    "thumbnail": "/assets/products/cloud-vn-1.jpg",
    "images": '',
    "collection_id": "col_vps_vietnam",
    "type_id": "type_vps",
    "tags": ["vps-vn", "amd", "nvme"],
    "options": [
        { "title": "Billing Cycle" }   // sẽ tạo variant theo chu kỳ
    ],
    "variants": [
        {
            "title": "1 Tháng",
            "prices": [
                { "amount": 500, "currency_code": "usd" },
                { "amount": 115000, "currency_code": "vnd" }
            ],
            "options": [{ "value": "1-month" }],
            "metadata": { "cycle": "monthly", "discount": 0 }
        },
        {
            "title": "3 Tháng (-10%)",
            "prices": [{ "amount": 1350, "currency_code": "usd" }],
            "options": [{ "value": "3-months" }],
            "metadata": { "cycle": "quarterly", "discount": 10 }
        },
        {
            "title": "6 Tháng (-20%)",
            "prices": [{ "amount": 2400, "currency_code": "usd" }],
            "options": [{ "value": "6-months" }],
            "metadata": { "cycle": "half-year", "discount": 20 }
        },
        {
            "title": "1 Năm (-30%)",
            "prices": [{ "amount": 4200, "currency_code": "usd" }],
            "options": [{ "value": "12-months" }],
            "metadata": { "cycle": "yearly", "discount": 30 }
        }
    ],
    "metadata": {
        "cpu": "1 core AMD EPYC 7402P",
        "ram": "2 GB",
        "storage": "50 GB NVMe",
        "bandwidth": "1 TB",
        "port": "1 Gbps",
        "location": "Việt Nam",
        "os_options": ["Ubuntu", "CentOS", "Debian", "Windows", "AlmaLinux"]
    }
});