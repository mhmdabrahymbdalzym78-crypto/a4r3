# نشر Eagle Circuit على Vercel

## المتطلبات قبل النشر

- مستودع GitHub/GitLab/Bitbucket يحتوي مجلد المشروع كاملًا.
- مشروع Supabase جاهز للحسابات والمكتبة السحابية ولوحة المشرف. المحاكي نفسه يعمل دون Supabase.
- لا ترفع ملف `.env.local` أو أي مفتاح إداري إلى Git أو Vercel.

## خطوات النشر

1. ارفع هذا المجلد إلى مستودع Git.
2. من Vercel اختر **Add New → Project**، ثم استورد المستودع واختر مجلد `Eagle-Circuit-v1.0` بوصفه **Root Directory** إذا كان داخل مجلد أكبر.
3. إعدادات Vite تُكتشف تلقائيًا، وقد أُثبتت في `vercel.json`:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. في إعدادات المشروع على Vercel، أضف متغيرَي البيئة التاليين لكل بيئة تريد تشغيلها (Production، وPreview عند الحاجة):
   - `VITE_SUPABASE_URL` = عنوان مشروع Supabase.
   - `VITE_SUPABASE_ANON_KEY` = مفتاح Supabase العام `anon` أو `publishable`.
5. انشر المشروع. بعد إضافة/تعديل متغيرات البيئة، أعد النشر حتى تدخل في البناء.

## إعداد Supabase

1. نفّذ `supabase/migrations/202611200001_eagle_initial.sql` في SQL Editor لمشروع Supabase.
2. انشر وظيفة حذف المستخدمين من جهازك باستخدام Supabase CLI:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy admin-users
   ```

3. في Authentication → Providers → Email، فعّل موفر البريد وخيار **Confirm email**.
4. في Authentication → URL Configuration، اجعل **Site URL** رابط الإنتاج على Vercel، وأضف روابط الإنتاج والمعاينة و`http://localhost:5173/**` إلى **Redirect URLs**. التسجيل يعيد المستخدم إلى جذر الموقع؛ لا يوجد مسار `/auth/callback` منفصل في هذا التطبيق.
5. في Authentication → Email Templates → Confirm signup، أدخل موضوعًا مثل «فعّل حسابك في Eagle Circuit ⚡»، ثم انسخ محتوى `supabase-confirm-signup.html` كاملًا إلى HTML Body. لا تحذف متغيرات `{{ .ConfirmationURL }}` أو `{{ .Email }}` أو `{{ .SiteURL }}`.
6. صورة الرسالة موجودة في `public/eagle-circuit-email-hero.png`، وستُنشر على `https://YOUR-VERCEL-DOMAIN/eagle-circuit-email-hero.png`. قد يحجب Gmail الصور الخارجية افتراضيًا؛ يحتوي القالب على نص وزر ورابط احتياطي أيضًا.
7. أنشئ حساب المشرف بنفسك باستخدام البريد الوحيد المحدد في سياسات المشروع: `mhmdabrahymbdalzym78@gmail.com`، ثم افتح رسالة التفعيل قبل تسجيل الدخول. لا توجد كلمة مرور افتراضية.
8. اختبر إنشاء حساب عادي: يجب أن تصله رسالة التفعيل، وأن يعود رابطها إلى الموقع ويؤكد جلسته. تأكد كذلك من عدم قدرته على فتح لوحة المشرف أو الوصول لبيانات الآخرين.

## اختبارات محلية قبل النشر

```bash
npm ci
npm run check
```

يتضمن `check` فحص TypeScript والاختبارات وبناء الإنتاج. النسخة المستقلة للمحاكي ستكون متاحة أيضًا على:

`https://YOUR-VERCEL-DOMAIN/Eagle-Circuit-Offline.html`

## الأمان

`VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY` قيم عامة مخصصة للمتصفح؛ تُحمى البيانات بواسطة سياسات RLS. **لا تضف أبدًا** `SUPABASE_SERVICE_ROLE_KEY` أو أي سر إداري إلى متغير يبدأ بـ`VITE_` أو إلى إعدادات Vercel الأمامية. مفتاح Service Role يبقى في بيئة Supabase الخادمية فقط. قواعد SQL ووظيفة Edge تتحقق من بريد المشرف المحدد على الخادم.
