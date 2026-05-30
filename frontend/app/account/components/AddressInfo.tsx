"use client";

import { useState } from "react";
import { UserProfile, UserAddress } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";

interface AddressInfoProps {
  user: UserProfile;
}

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function AddressInfo({ user }: AddressInfoProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    phone: user.phone || "",
    line1: user.address?.line1 || "",
    subdistrict: user.address?.subdistrict || "",
    district: user.address?.district || "",
    province: user.address?.province || "",
    zipcode: user.address?.zipcode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          address: {
            line1: form.line1,
            subdistrict: form.subdistrict,
            district: form.district,
            province: form.province,
            zipcode: form.zipcode,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error?.message || "บันทึกไม่สำเร็จ");
        return;
      }

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      phone: user.phone || "",
      line1: user.address?.line1 || "",
      subdistrict: user.address?.subdistrict || "",
      district: user.address?.district || "",
      province: user.address?.province || "",
      zipcode: user.address?.zipcode || "",
    });
    setSaveError("");
    setIsEditing(false);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition";

  return (
    <div className="lg:col-span-1">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
        <h2 className="text-xl text-gray-300">{t("account.shippingAddress")}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("account.edit")}
          </button>
        )}
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          บันทึกข้อมูลสำเร็จ
        </div>
      )}

      {/* Error banner */}
      {saveError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {saveError}
        </div>
      )}

      {isEditing ? (
        /* ── Edit Mode ── */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">ชื่อ</label>
              <input name="firstname" value={form.firstname} onChange={handleChange} className={inputClass} placeholder="ชื่อ" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">นามสกุล</label>
              <input name="lastname" value={form.lastname} onChange={handleChange} className={inputClass} placeholder="นามสกุล" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">เบอร์โทรศัพท์</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="0XX-XXX-XXXX" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">ที่อยู่ (บ้านเลขที่ ถนน)</label>
            <input name="line1" value={form.line1} onChange={handleChange} className={inputClass} placeholder="123/4 ถนนสุขุมวิท" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">แขวง/ตำบล</label>
              <input name="subdistrict" value={form.subdistrict} onChange={handleChange} className={inputClass} placeholder="แขวง/ตำบล" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">เขต/อำเภอ</label>
              <input name="district" value={form.district} onChange={handleChange} className={inputClass} placeholder="เขต/อำเภอ" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">จังหวัด</label>
              <input name="province" value={form.province} onChange={handleChange} className={inputClass} placeholder="จังหวัด" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">รหัสไปรษณีย์</label>
              <input name="zipcode" value={form.zipcode} onChange={handleChange} className={inputClass} placeholder="10000" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  กำลังบันทึก...
                </>
              ) : "บันทึก"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        /* ── View Mode ── */
        <div className="text-base space-y-1 text-gray-600">
          <p className="text-black text-xl font-normal mb-2">
            {form.firstname || user.firstname} {form.lastname || user.lastname}
          </p>

          {form.line1 || user.address ? (
            <>
              <p>{form.line1 || user.address?.line1}</p>
              <p>
                {form.subdistrict || user.address?.subdistrict}{" "}
                {form.district || user.address?.district}
              </p>
              <p>
                {form.province || user.address?.province}{" "}
                {form.zipcode || user.address?.zipcode}
              </p>
              <p className="mt-2">Thailand</p>
              {(form.phone || user.phone) && (
                <p className="mt-2 flex items-center gap-1.5 text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {form.phone || user.phone}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400">{t("account.noAddress")}</p>
          )}
        </div>
      )}
    </div>
  );
}