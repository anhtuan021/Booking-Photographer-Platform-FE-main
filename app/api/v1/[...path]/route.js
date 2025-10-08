// Trả về header CORS cho preflight request
export function OPTIONS(req) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}
import { NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE
;

async function proxy(req) {
  try {
    // Lấy method, headers, body
    const method = req.method;
    const headers = new Headers();

    req.headers.forEach((v, k) => {
      if (k.toLowerCase() !== "origin") {
        headers.set(k, v);
      }
    });
    let body = undefined;
    if (method !== "GET" && method !== "HEAD") {
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        body = await req.json();
        body = JSON.stringify(body);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        body = await req.text();
      } else {
        body = req.body; // Xử lý FormData/multipart
      }
    }

    const url = new URL(req.url);
    const apiPath = url.pathname.replace(/^\/api\/v1\//, "");
    const targetUrl = `${BACKEND}/api/v1/${apiPath}${url.search}`;
    console.log(`Proxying request to: ${targetUrl}`);

    // const h = {
    //   ...headers,
    //   ...req.headers,
    //   Authorization: `${req.headers.get("authorization")}`,
    // };
    let res = undefined;

    res = await fetch(targetUrl, {
      method,
      headers,
      body,
      duplex: "half",
    });

    const resText = await res.text();
    const resHeaders = new Headers();
    res.headers.forEach((v, k) => resHeaders.set(k, v));

    // Đảm bảo trả về header CORS cho mọi response
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
    resHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );
    return new NextResponse(resText, {
      status: res.status,
      headers: resHeaders,
    });
  } catch (err) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };
    return NextResponse.json(
      { message: err.message || "Proxy error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
