import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_BASE

export async function POST(req) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/v1/auth/register/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    const headers = new Headers()
    res.headers.forEach((v, k) => headers.set(k, v))

    return new NextResponse(text, { status: res.status, headers })
  } catch (err) {
    return NextResponse.json({ message: err.message || 'Proxy error' }, { status: 500 })
  }
}
