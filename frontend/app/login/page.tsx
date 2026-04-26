"use client";
import React from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { useLanguage } from "@/app/context/LanguageContext";

function LoginPage() {
  const { formData, isLoading, handleChange, handleSubmit } = useLogin();
  const { t } = useLanguage();
  return (
    <div className="h-[90vh] flex justify-center items-center font-light text-[#333] text-[0.85vw]">
      <form onSubmit={handleSubmit} className="flex text-center flex-col gap-4 p-6 max-w-lg mx-auto w-full">
        <h1 className="text-[1.2vw] font-bold">{t("login.title")}</h1>
        <div className="space-y-2">
          <h3 className="font-bold">{t("login.subtitle")}</h3>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-black transition" required />
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-black transition" required />
        </div>
        <button type="submit" disabled={isLoading} className="bg-black text-white p-3 rounded mt-4 hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-400">
          {isLoading ? t("login.checking") : t("login.submit")}
        </button>
        <div className="text-center mt-2 text-sm text-gray-600 text-[0.75vw]">
          {t("login.noAccount")}{" "}
          <Link href="/register" className="text-black font-bold hover:underline">{t("login.register")}</Link>
        </div>
      </form>
    </div>
  );
}
export default LoginPage;