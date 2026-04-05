import { NextRequest, NextResponse } from 'next/server'

// Swish requires Swedish merchant certificates for real integration.
// This simulates the Swish payment request flow for sandbox/demo purposes.
export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json()

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required' }, { status: 400 })
    }

    // Simulate a Swish payment request ID (in production this comes from Swish MSS API)
    const paymentRequestId = `SWISH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    return NextResponse.json({
      id: paymentRequestId,
      status: 'CREATED',
      message: `Payment request sent to ${phone}`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
