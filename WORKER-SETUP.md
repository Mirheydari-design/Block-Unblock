# 🚀 راهنمای استقرار Cloudflare Worker Proxy

این Worker مشکل **CORS** را به طور قطعی حل می‌کند و درخواست‌های پنل ادمین را به API متافا forward می‌کند.

---

## 📋 مراحل استقرار

### ✅ گام ۱: ساخت Worker در Cloudflare

1. به **Cloudflare Dashboard** برو: [dash.cloudflare.com](https://dash.cloudflare.com)

2. از منوی سمت چپ، روی **Workers & Pages** کلیک کن

3. روی دکمه **Create Application** کلیک کن

4. **Create Worker** را انتخاب کن

5. یک نام برای Worker انتخاب کن، مثلاً:
   ```
   block-unblock-proxy
   ```

6. روی **Deploy** کلیک کن (فعلاً کد پیش‌فرض deploy می‌شود)

---

### ✅ گام ۲: جایگزینی کد Worker

1. بعد از deploy، روی **Edit Code** یا **Quick Edit** کلیک کن

2. **تمام کد موجود** را پاک کن

3. محتوای فایل `cloudflare-worker.js` را کپی کن

4. در ادیتور Cloudflare، کد کپی شده را paste کن

5. روی **Save and Deploy** کلیک کن

---

### ✅ گام ۳: کپی کردن آدرس Worker

بعد از deploy، آدرس Worker شما چیزی شبیه این خواهد بود:

```
https://block-unblock-proxy.YOUR-PROJECT.workers.dev
```

یا اگر در یک account خاص باشید:

```
https://block-unblock-proxy.YOUR-SUBDOMAIN.workers.dev
```

این آدرس را **کپی** کن.

---

### ✅ گام ۴: ویرایش admin.html

1. فایل `admin.html` را باز کن

2. خط زیر را پیدا کن (حدود خط ۶۴۴):

```javascript
const API_BASE_URL = 'https://block-unblock-proxy.YOUR-PROJECT.workers.dev';
```

3. عبارت `YOUR-PROJECT` را با نام واقعی Worker خودت جایگزین کن:

```javascript
const API_BASE_URL = 'https://block-unblock-proxy.my-real-project.workers.dev';
```

4. فایل را **ذخیره** کن

---

### ✅ گام ۵: آپلود admin.html به Cloudflare Pages

حالا `admin.html` آماده است و می‌تواند از طریق Worker به API متافا درخواست بزند.

#### آپلود مستقیم (Drag & Drop):

1. به **Cloudflare Dashboard** > **Workers & Pages** > **Create Application** برو

2. **Pages** > **Upload assets** را انتخاب کن

3. یک نام برای project انتخاب کن (مثلاً `admin-panel`)

4. فایل `admin.html` را drag & drop کن

5. روی **Deploy Site** کلیک کن

6. بعد از deploy، لینک سایت را دریافت می‌کنی:
   ```
   https://admin-panel.pages.dev
   ```

---

## 🧪 تست کردن

1. به آدرس Cloudflare Pages که دریافت کردی برو

2. یک User ID یا Post ID وارد کن

3. روی **Block** یا **Unblock** کلیک کن

4. اگر همه چیز درست باشد، باید پیام موفقیت دریافت کنی

---

## ⚡ مزایای این روش

✅ **حل کامل مشکل CORS** - Worker به عنوان proxy عمل می‌کند

✅ **امنیت بیشتر** - توکن ادمین در درخواست‌های مرورگر مخفی می‌ماند

✅ **مقیاس‌پذیری** - Cloudflare Workers رایگان تا ۱۰۰,۰۰۰ درخواست در روز

✅ **Performance بالا** - Workers در edge locations اجرا می‌شوند

✅ **صفر هزینه** - تا سقف رایگان استفاده می‌شود

---

## 🔧 عیب‌یابی

### ❌ "CORS policy blocked"

اگر همچنان این خطا را می‌بینی:

1. مطمئن شو که `API_BASE_URL` در `admin.html` به آدرس **Worker** اشاره کند نه مستقیم به متافا

2. در Cloudflare Dashboard، لاگ‌های Worker را چک کن

3. مطمئن شو Worker به درستی deploy شده است

### ❌ "Worker not found" یا 404

1. مطمئن شو آدرس Worker را درست کپی کرده‌ای

2. در Cloudflare Dashboard، بخش Workers را چک کن تا ببینی Worker فعال است یا نه

### ❌ "Internal Server Error" (500)

1. لاگ‌های Worker را در Cloudflare Dashboard بررسی کن

2. مطمئن شو API متافا در دسترس است

3. توکن ادمین (`X-Admin-Token`) را چک کن

---

## 📊 ساختار نهایی

```
project/
├── admin.html                 ← پنل ادمین (آپلود به Pages)
├── index.html                 ← صفحه اصلی (اختیاری)
├── cloudflare-worker.js       ← کد Worker (برای Cloudflare Workers)
├── WORKER-SETUP.md            ← این فایل راهنما
└── Admin Block API.postman... ← Collection برای تست
```

---

## 🎯 نتیجه

حالا admin.html می‌تواند:

```
[Browser] → [Cloudflare Worker Proxy] → [Metafa API]
            ↓
         با CORS کامل ✅
```

بدون هیچ مشکل CORS! 🚀

---

## 💡 نکته مهم

اگر می‌خواهی Worker را به یک **Custom Domain** وصل کنی:

1. در Cloudflare Dashboard > Workers > Worker خودت

2. **Triggers** > **Add Custom Domain** را انتخاب کن

3. دامنه‌ای که در Cloudflare داری را وارد کن (مثلاً `proxy.yourdomain.com`)

4. بعد از تنظیم، `API_BASE_URL` را در `admin.html` به این دامنه تغییر بده

---

**ساخته شده با ❤️ برای Platform Mahdavi**

