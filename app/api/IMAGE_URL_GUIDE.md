# دليل استخدام روابط الصور في UniJoy

## 🔄 التغيير من رفع الملفات إلى روابط الصور

تم تعديل النظام لاستخدام روابط الصور بدلاً من رفع الملفات المحلية لحل مشاكل التخزين على Render.

## 📝 كيفية الاستخدام

### في طلب إنشاء فعالية:
```json
{
  "title": "فعالية رائعة",
  "description": "وصف الفعالية",
  "date": "2024-12-01",
  "startDate": "2024-12-01T10:00:00.000Z",
  "endDate": "2024-12-01T12:00:00.000Z",
  "time": "10:00 AM",
  "capacity": 100,
  "location": "القاعة الرئيسية",
  "price": 50,
  "category": "640a1b2c3d4e5f6a7b8c9d0e",
  "imageUrl": "https://example.com/image.jpg"
}
```

### في طلب تحديث فعالية:
```json
{
  "title": "عنوان محدث",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

## 🖼️ مصادر الصور المجانية

### 1. Unsplash (موصى به)
- روابط مباشرة تعمل بدون API key
- أبعاد: `https://images.unsplash.com/photo-ID?w=800&h=600&fit=crop`

### 2. Picsum
- روابط عشوائية: `https://picsum.photos/800/600`

### 3. Pexels
- يتطلب API key للكميات الكبيرة

## 🎨 أمثلة على روابط جاهزة

### صور فعاليات تعليمية:
```
https://images.unsplash.com/photo-1492684228672-755b87908021?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop
```

### صور فعاليات اجتماعية:
```
https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1479222724629-152724b6e765?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop
```

### صور فعاليات تقنية:
```
https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=800&h=600&fit=crop
https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop
```

## 🤖 الصور التلقائية

إذا لم يتم توفير `imageUrl`، سيقوم النظام باختيار صورة عشوائية من مجموعة الصور الافتراضية تلقائياً.

## 📱 في الفرونت إند

### تغيير حقل رفع الصورة إلى حقل رابط:
```javascript
// بدلاً من:
const formData = new FormData();
formData.append('image', file);

// استخدم:
const eventData = {
  ...eventData,
  imageUrl: 'https://example.com/image.jpg'
};
```

### أو أضف منتقي روابط الصور:
```javascript
const ImageUrlSelector = ({ onUrlSelect }) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1492684228672-755b87908021?w=800&h=600&fit=crop',
    // ... المزيد من الصور
  ];
  
  return (
    <div className="image-selector">
      {defaultImages.map(url => (
        <img 
          key={url}
          src={url} 
          alt="Option"
          onClick={() => onUrlSelect(url)}
        />
      ))}
    </div>
  );
};
```

## ✨ المزايا

1. **لا مشاكل تخزين** - الصور على خوادم خارجية
2. **أسرع تحميل** - CDN مدمج
3. **لا حدود حجمية** - غير محدود
4. **مجانياً تماماً** - بدون تكاليف
5. **سهل الاستخدام** - فقط نسخ ولصق الرابط

## 🔄 ترحيل البيانات الحالية

لتحديث الفعاليات الحالية:
```javascript
// في قاعدة البيانات، حدث حقل image من مسار محلي إلى رابط
// من:
image: 'images/2025-05-30T13-54-28.599Z-asas.png'
// إلى:
image: 'https://images.unsplash.com/photo-1492684228672-755b87908021?w=800&h=600&fit=crop'
```
