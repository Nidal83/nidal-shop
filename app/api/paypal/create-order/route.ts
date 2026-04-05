import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/lib/products'

const PAYPAL_BASE = 'https://api-m.sandbox.paypal.com'

async function getPayPalToken() {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token as string
}

interface CartItemPayload {
  productId: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItemPayload[] } = await req.json()

    let total = 0
    const lineItems = []
    for (const item of items) {
      const product = getProductById(item.productId)
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      total += product.price * item.quantity
      lineItems.push({
        name: product.name,
        quantity: String(item.quantity),
        unit_amount: { currency_code: 'USD', value: product.price.toFixed(2) },
      })
    }

    const token = await getPayPalToken()
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: 'USD', value: total.toFixed(2) },
              },
            },
            items: lineItems,
          },
        ],
      }),
    })

    const order = await res.json()
    return NextResponse.json({ orderID: order.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
