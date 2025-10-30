"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ContactInfo from "../ui/ContactInfo";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    subject: "",
    date: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const next = { ...errors };
      delete next[e.target.name];
      setErrors(next);
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.fullName.trim()) next.fullName = "الاسم مطلوب";
    if (!formData.phone.trim()) next.phone = "الهاتف مطلوب";
    if (!formData.subject.trim()) next.subject = "الموضوع مطلوب";
    if (!formData.date.trim()) next.date = "التاريخ مطلوب";
    if (!formData.message.trim()) next.message = "الرسالة مطلوبة";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "لم يتم الإرسال",
        description: "يرجى تعبئة الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "تم الإرسال", description: "شكراً لتواصلك معنا" });
      setFormData({ fullName: "", phone: "", subject: "", date: "", message: "" });
    } catch (err) {
      toast({ title: "حدث خطأ", description: "حاول مرة أخرى", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
          initial="initial"
          animate="animate"
          variants={{}}
        >
          {/* Info panel with illustration and map */}
          <motion.aside
            {...fadeIn}
            className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur border border-amber-100 shadow-sm"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">💬</span>
                <h2 className="text-xl font-semibold text-amber-900">يسعدنا تواصلك</h2>
              </div>

              <p className="text-amber-800/80 leading-relaxed">
                نحن هنا لمساعدتك. أرسل لنا تفاصيلك وسنعود إليك قريباً.
              </p>

              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop"
                alt="Friendly team"
                className="w-full h-40 md:h-48 object-cover rounded-xl shadow-sm"
                loading="lazy"
              />

              <div className="space-y-3">
                <ContactInfo />
              </div>
            </div>
            <div className="h-56 md:h-64">
              <iframe
                title="موقعنا"
                src="https://maps.google.com/maps?q=splash%20n%20party&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded-b-2xl border-t"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </motion.aside>

          {/* Form card */}
          <motion.section
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.05 }}
            className="rounded-2xl bg-white/80 backdrop-blur border border-amber-100 shadow-sm p-6 md:p-8"
          >
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="text-center md:text-right">
                <h1 className="text-2xl md:text-3xl font-bold text-amber-900">ابقَ على تواصل معنا</h1>
                <p className="text-amber-800/70 mt-2">سعداء بسماع اقتراحاتك وأسئلتك</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-amber-900 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/70 focus:bg-white outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${
                      errors.fullName ? "border-rose-300" : "border-amber-200"
                    }`}
                    placeholder="محمد أحمد"
                    aria-invalid={!!errors.fullName}
                    aria-describedby="fullName-error"
                    required
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-rose-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-amber-900 mb-2">
                    الهاتف
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/70 focus:bg-white outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${
                      errors.phone ? "border-rose-300" : "border-amber-200"
                    }`}
                    placeholder="05xxxxxxxx"
                    aria-invalid={!!errors.phone}
                    aria-describedby="phone-error"
                    required
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-rose-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-amber-900 mb-2">
                    الموضوع
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/70 focus:bg-white outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${
                      errors.subject ? "border-rose-300" : "border-amber-200"
                    }`}
                    placeholder="عنوان رسالتك"
                    aria-invalid={!!errors.subject}
                    aria-describedby="subject-error"
                    required
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-rose-600">
                      {errors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-amber-900 mb-2">
                    التاريخ
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/70 focus:bg-white outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${
                      errors.date ? "border-rose-300" : "border-amber-200"
                    }`}
                    aria-invalid={!!errors.date}
                    aria-describedby="date-error"
                    required
                  />
                  {errors.date && (
                    <p id="date-error" className="mt-1 text-sm text-rose-600">
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-amber-900 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white/70 focus:bg-white outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 ${
                    errors.message ? "border-rose-300" : "border-amber-200"
                  }`}
                  placeholder="اكتب تفاصيل رسالتك هنا"
                  aria-invalid={!!errors.message}
                  aria-describedby="message-error"
                  required
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-rose-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-end">
                <motion.button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-amber-700 active:bg-amber-800 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                      جارٍ الإرسال
                    </span>
                  ) : (
                    <span>إرسال</span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;