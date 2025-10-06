"use client";
import { Suspense } from "react";
import RegisterPage from "./page-content"; // Đổi tên file gốc thành page-content.jsx

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
