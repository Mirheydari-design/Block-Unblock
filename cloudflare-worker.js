/**
 * 🔥 Cloudflare Worker Proxy for Block/Unblock Admin Panel
 * 
 * این Worker مشکل CORS را حل می‌کند و درخواست‌های admin.html را
 * به API متافا forward می‌کند.
 * 
 * استقرار:
 * 1. به Cloudflare Dashboard برو
 * 2. Workers & Pages > Create Application > Create Worker
 * 3. تمام کد این فایل را کپی کن و جایگزین کد پیش‌فرض کن
 * 4. روی Deploy کلیک کن
 * 5. آدرس Worker را (مثل block-unblock-proxy.YOUR-PROJECT.workers.dev) کپی کن
 * 6. در admin.html، API_BASE_URL را به آدرس Worker تغییر بده
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token, Authorization",
          "Access-Control-Max-Age": "86400", // 24 hours
        },
      });
    }

    // مسیر اصلی API متافا
    const targetBaseURL = "https://mahdaviat.metafa.ir/api/admin/block";

    // مسیر را به همون ساختار /user یا /post پاس بده
    const path = url.pathname.replace(/\/$/, "");

    // URL نهایی برای forward کردن
    const targetURL = targetBaseURL + path;

    console.log(`[Worker] Forwarding ${request.method} ${path} -> ${targetURL}`);

    try {
      // کپی کردن headers از درخواست اصلی
      const headers = new Headers(request.headers);
      
      // اگر Content-Type وجود نداشت، اضافه کن
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      // ساخت درخواست جدید برای API متافا
      const newRequest = new Request(targetURL, {
        method: request.method,
        headers: headers,
        body: request.body,
      });

      // ارسال درخواست به API متافا
      const response = await fetch(newRequest);

      // دریافت محتوای پاسخ
      const responseBody = await response.text();

      // بازگرداندن پاسخ با CORS headers کامل
      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token, Authorization",
          "Content-Type": response.headers.get("Content-Type") || "application/json",
          // کپی کردن سایر headers مهم
          ...(response.headers.get("Cache-Control") && {
            "Cache-Control": response.headers.get("Cache-Control")
          }),
        },
      });
    } catch (error) {
      // مدیریت خطاها
      console.error("[Worker] Error:", error);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Worker Proxy Error",
          message: error.message,
          details: "خطا در ارتباط با سرور متافا. لطفاً بعداً دوباره تلاش کنید."
        }),
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token, Authorization",
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};

