export async function POST(req){
  try{
    const body = await req.json()
    const { email, password } = body || {}
    if(!email || !password) return new Response(JSON.stringify({ message: 'Missing credentials' }), { status: 400 })

    // Mock authentication: accept any non-empty credentials and return a token
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    return new Response(JSON.stringify({ token }), { status: 200 })
  }catch(err){
    return new Response(JSON.stringify({ message: err.message || 'Server error' }), { status: 500 })
  }
}
