"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ฟังก์ชันเวลากรอกข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชัน Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      const response = await fetch(`${apiUrl}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login ผ่าน
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // alert อาจจะดูเก่าไปหน่อยใน UX สมัยใหม่ แต่ใช้ได้ครับ
        alert("เข้าสู่ระบบสำเร็จ!"); 
        router.push("/"); 
      } else {
        // ❌ Login ไม่ผ่าน
        alert("เข้าสู่ระบบไม่สำเร็จ: " + (data.error?.message || "ข้อมูลไม่ถูกต้อง"));
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
    isLoading,
    handleChange,
    handleSubmit,
  };
};