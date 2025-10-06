export async function POST(req){
  try{
    const body = await req.json()
    const { name, email, password } = body || {}
    if(!email || !password || !name) return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 })

    // For demo, just return success
    return new Response(JSON.stringify({ ok: true }), { status: 201 })
  }catch(err){
    return new Response(JSON.stringify({ message: err.message || 'Server error' }), { status: 500 })
  }
}
