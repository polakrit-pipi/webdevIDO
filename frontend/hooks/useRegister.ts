"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. ข้อมูลส่วนตัวหลัก
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // 2. ข้อมูลที่อยู่
  const [addressData, setAddressData] = useState({
    line1: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
  });

  // ฟังก์ชันอัปเดตข้อมูลส่วนตัว
  const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันอัปเดตที่อยู่
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชัน Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      const response = await fetch(`${apiUrl}/api/custom-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          address: addressData, // รวม Object ที่อยู่เข้าไป
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("ลงทะเบียนสำเร็จ! กำลังพาท่านไปหน้าเข้าสู่ระบบ...");
        router.push("/login");
      } else {
        alert(`ลงทะเบียนไม่สำเร็จ: ${data.error?.message || "เกิดข้อผิดพลาด"}`);
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ Server ไม่ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    addressData,
    isLoading,
    handleUserChange,
    handleAddressChange,
    handleSubmit,
  };
};