# دليل نشر مشروع UniJoy على Render

## الخطوات التفصيلية لنشر الباك إند

### 1. التحضيرات الأولية

#### أ. إنشاء قاعدة بيانات MongoDB Atlas
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب جديد
3. أنشئ cluster جديد (اختر M0 مجاني)
4. أنشئ مستخدم قاعدة بيانات
5. احصل على connection string
6. أضف IP address الخاص بـ Render: `0.0.0.0/0`

#### ب. ربط المستودع بـ Render
1. ادخل إلى حسابك في [Render](https://render.com)
2. اختر "New Web Service"
3. اختر "Build and deploy from a Git repository"
4. ربط حساب GitHub واختر مستودع `unijoy-events`

### 2. إعدادات الـ Web Service

#### الإعدادات الأساسية:
```
Name: unijoy-events-backend
Environment: Node
Region: Europe West (أو الأقرب لجمهورك)
Branch: main
Root Directory: backend
```

#### إعدادات البناء:
```
Build Command: npm install
Start Command: npm start
```

#### Instance Type:
- اختر "Free" للتجربة أو "Starter" للإنتاج

### 3. المتغيرات البيئية (Environment Variables)

أضف هذه المتغيرات في قسم "Environment" في Render:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unijoy-events?retryWrites=true&w=majority
FRONTEND_ORIGIN=https://your-frontend-domain.onrender.com
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

### 4. ملاحظات هامة

#### أ. معالجة الملفات المرفوعة:
- الملفات المرفوعة يتم حفظها مؤقتاً في Render
- للحفظ الدائم استخدم خدمات مثل AWS S3 أو Cloudinary

#### ب. الـ Jobs و Cron Tasks:
- الـ jobs مثل `freeExpiredHalls.js` قد لا تعمل على الخطة المجانية
- تحتاج إلى خطة مدفوعة لـ Background Workers

#### ج. الـ CORS:
- تأكد من إضافة رابط الفرونت إند الصحيح في `FRONTEND_ORIGIN`
- في بيئة التطوير يمكنك استخدام `*`

### 5. بعد النشر

#### أ. التحقق من الخدمة:
1. افتح الرابط الذي يوفره Render
2. جرب اختبار الـ endpoints المختلفة
3. تحقق من logs في لوحة تحكم Render

#### ب. ربط الفرونت إند:
1. انسخ رابط الباك إند من Render
2. حدث الـ API calls في الفرونت إند
3. تأكد من إعداد CORS بشكل صحيح

### 6. استكشاف الأخطاء

#### مشاكل شائعة:
1. **Database Connection Error**: تحقق من `MONGODB_URI` و IP whitelist
2. **CORS Error**: تأكد من `FRONTEND_ORIGIN` صحيح
3. **Port Error**: تأكد من `PORT=10000` في المتغيرات البيئية
4. **Build Failed**: تحقق من `package.json` و dependencies

### 7. تحسينات مقترحة

#### أ. للإنتاج:
- ترقية إلى خطة مدفوعة
- إضافة custom domain
- إعداد SSL certificate
- إضافة monitoring و alerts

#### ب. للأداء:
- إضافة caching (Redis)
- تحسين استعلامات قاعدة البيانات
- إضافة CDN للملفات الثابتة

## أسئلة شائعة

**س: هل يمكنني استخدام الخطة المجانية؟**
ج: نعم، ولكن مع محدوديات مثل 750 ساعة/شهر وبدون background workers

**س: كيف أتعامل مع الملفات المرفوعة؟**
ج: استخدم خدمات خارجية مثل AWS S3 أو Cloudinary للتخزين الدائم

**س: هل أحتاج لتغيير شيء في الكود؟**
ج: لا، الكود جاهز للنشر مع المتغيرات البيئية الصحيحة
