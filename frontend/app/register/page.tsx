"use client";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { useLanguage } from "@/app/context/LanguageContext";

export default function RegisterPage() {
  const { formData, addressData, isLoading, handleUserChange, handleAddressChange, handleSubmit } = useRegister();
  const { t } = useLanguage();
  return (
    <div className="h-[90vh] flex justify-center items-center font-light text-[#333] pt-[6vw]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 max-w-lg mx-auto w-full">
        <h1 className="text-[1.2vw] font-bold text-center">{t("register.title")}</h1>
        <div className="space-y-[0.4vw] text-[0.85vw]">
          <h3 className="font-bold">{t("register.personalInfo")}</h3>
          <input name="username" value={formData.username} placeholder="Username" onChange={handleUserChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          <input name="email" type="email" value={formData.email} placeholder="Email" onChange={handleUserChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          <input name="password" type="password" value={formData.password} placeholder="Password" onChange={handleUserChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          <div className="flex gap-[0.4vw]">
            <input name="firstname" value={formData.firstname} placeholder={t("register.firstName")} onChange={handleUserChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
            <input name="lastname" value={formData.lastname} placeholder={t("register.lastName")} onChange={handleUserChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          </div>
        </div>
        <hr className="border-gray-200" />
        <div className="space-y-[0.4vw] text-[0.85vw]">
          <h3 className="font-bold">{t("register.shippingAddress")}</h3>
          <input name="line1" value={addressData.line1} placeholder={t("register.addressLine")} onChange={handleAddressChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          <div className="flex gap-[0.4vw]">
            <input name="subdistrict" value={addressData.subdistrict} placeholder={t("register.subdistrict")} onChange={handleAddressChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
            <input name="district" value={addressData.district} placeholder={t("register.district")} onChange={handleAddressChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          </div>
          <div className="flex gap-[0.4vw]">
            <input name="province" value={addressData.province} placeholder={t("register.province")} onChange={handleAddressChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
            <input name="zipcode" value={addressData.zipcode} placeholder={t("register.zipcode")} onChange={handleAddressChange} className="border p-[0.4vw] w-full rounded focus:outline-none focus:ring-1 focus:ring-black" required />
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="bg-black text-white p-3 rounded mt-4 hover:bg-gray-800 transition cursor-pointer text-[0.85vw] disabled:bg-gray-400">
          {isLoading ? t("register.saving") : t("register.submit")}
        </button>
        <div className="text-center mt-[0.4vw] text-sm text-gray-600 text-[0.75vw]">
          {t("register.hasAccount")}{" "}
          <Link href="/login" className="text-black font-bold hover:underline">{t("register.login")}</Link>
        </div>
      </form>
    </div>
  );
}