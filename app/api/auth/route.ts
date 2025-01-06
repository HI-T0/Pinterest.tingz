import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  
  // In a real application, you would check the email against a database
  const isAdmin = email.toLowerCase() === 'pinterest.tingz2@gmail.com'

  return NextResponse.json({ success: true, isAdmin })
}

