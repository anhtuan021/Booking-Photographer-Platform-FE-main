"use client";
import { Suspense } from "react";
import LoginPage from "./page-content"; // Đổi tên file gốc thành page-content.jsx

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
