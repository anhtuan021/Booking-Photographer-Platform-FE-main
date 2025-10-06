"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function RedirectIfAuth({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const urlId = searchParams.get("id");

    if (urlId) {
      // Lấy user từ localStorage
      const userStr =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_user")
          : "{}";
      let userId = null;
      try {
        userId = JSON.parse(userStr)?.id;
      } catch {
        console.log(e);
      }

      if (userId != urlId) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_login_response");
        router.push("/login");
      } else {
        router.replace("/");
      }
      return;
    } else {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;
      if (token) {
        router.replace("/");
      }
    }
  }, [searchParams, router]);
  return children;
}
