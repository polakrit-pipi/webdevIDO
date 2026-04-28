"use client";

import { UserProfile } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";

interface AddressInfoProps {
  user: UserProfile;
}

export default function AddressInfo({ user }: AddressInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-1">
      <h2 className="text-xl text-gray-300 border-b border-gray-200 pb-3 mb-6">
        {t("account.shippingAddress")}
      </h2>

      <div className="text-base space-y-1 text-gray-600">
        <p className="text-black text-xl font-normal mb-2">
          {user.firstname} {user.lastname}
        </p>

        {user.address ? (
          <>
            <p>{user.address.line1}</p>
            <p>
              {user.address.subdistrict} {user.address.district}
            </p>
            <p>
              {user.address.province} {user.address.zipcode}
            </p>
            <p className="mt-2">Thailand</p>
            <p className="mt-2">{user.phone || "0XX-XXX-XXXX"}</p>
          </>
        ) : (
          <p className="text-gray-400">{t("account.noAddress")}</p>
        )}
      </div>

      <button className="bg-[#222] text-white px-8 py-2.5 rounded-full mt-8 hover:bg-black transition-colors text-sm">
        {t("account.edit")}
      </button>
    </div>
  );
}