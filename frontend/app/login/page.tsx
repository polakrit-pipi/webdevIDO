"use client";
import React, { useId, useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { useLanguage } from "@/app/context/LanguageContext";

function LoginPage() {
  const { formData, isLoading, handleChange, handleSubmit } = useLogin();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const emailId = useId();
  const pwId = useId();

  return (
    <div className="min-h-[calc(100dvh-7vw)] flex justify-center items-center px-4 py-12 font-light text-[#333]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-6 sm:p-8 max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm"
      >
        <header className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-gray-600">{t("login.subtitle")}</p>
        </header>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="border border-gray-300 p-3 w-full rounded-lg text-base bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F4B8B] focus-visible:border-[#5F4B8B] transition placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={pwId} className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                id={pwId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="border border-gray-300 p-3 pr-12 w-full rounded-lg text-base bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F4B8B] focus-visible:border-[#5F4B8B] transition placeholder:text-gray-400"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#5F4B8B] rounded-r-lg"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="bg-black text-white py-3 px-4 rounded-lg mt-2 min-h-[48px] font-medium hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] flex items-center justify-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
          )}
          {isLoading ? t("login.checking") : t("login.submit")}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t("login.noAccount")}{" "}
          <Link
            href="/register"
            className="text-black font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5F4B8B] rounded-sm"
          >
            {t("login.register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;
