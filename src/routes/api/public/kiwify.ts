import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'crypto'
import { z } from 'zod'

const payloadSchema = z.object({
  order_status: z.string().max(50).optional(),
  order_amount: z.coerce.number().min(0).max(10_000_000).optional(),
  product_id: z.union([z.string().max(120), z.number()]).optional(),
  product_name: z.string().max(200).optional(),
  payment_method: z.string().max(50).optional(),
  customer: z
    .object({
      email: z.string().email().max(320).optional(),
      full_name: z.string().max(200).optional(),
    })
    .optional(),
})

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

// Kiwify appends ?signature=<hmac-sha1 of raw body, keyed with the webhook token>
function isAuthentic(request: Request, rawBody: string, secret: string): boolean {
  const url = new URL(request.url)
  const provided =
    url.searchParams.get('signature') ??
    request.headers.get('x-kiwify-signature') ??
    ''
  if (!provided) return false

  const sha1 = createHmac('sha1', secret).update(rawBody).digest('hex')
  const sha256 = createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqual(provided, sha1) || safeEqual(provided, sha256) || safeEqual(provided, secret)
}

export const Route = createFileRoute('/api/public/kiwify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const secret = process.env['KIWIFY_WEBHOOK_SECRET']
          if (!secret) {
            console.error('KIWIFY_WEBHOOK_SECRET is not configured')
            return new Response('Webhook not configured', { status: 503 })
          }

          const rawBody = await request.text()
          if (!isAuthentic(request, rawBody, secret)) {
            return new Response('Invalid signature', { status: 401 })
          }

          const parsed = payloadSchema.safeParse(JSON.parse(rawBody))
          if (!parsed.success) {
            return new Response('Invalid payload', { status: 400 })
          }
          const body = parsed.data

          if (body.order_status === 'paid' || body.order_status === 'approved') {
            const email = body.customer?.email
            const fullName = body.customer?.full_name
            const productExternalId = body.product_id?.toString()

            if (!email) {
              return new Response('Missing customer email', { status: 400 })
            }

            const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

            // 1. Resolve user
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('email', email)
              .single()

            let userId = profile?.id

            if (!userId) {
              const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                email_confirm: true,
                user_metadata: { full_name: fullName },
              })

              if (authError && authError.message !== 'User already registered') {
                console.error('Error creating auth user:', authError)
                return new Response('Error creating user', { status: 500 })
              }

              if (authUser?.user) {
                userId = authUser.user.id
              } else {
                const { data: existingUser } = await supabaseAdmin
                  .from('profiles')
                  .select('id')
                  .eq('email', email)
                  .single()
                userId = existingUser?.id
              }
            }

            if (!userId) {
              return new Response('User resolution failed', { status: 500 })
            }

            // 2. Resolve Mentorship (only known products are honored)
            if (!productExternalId) {
              return new Response('ok', { status: 200 })
            }

            const { data: mentorship } = await supabaseAdmin
              .from('mentorships')
              .select('id')
              .eq('external_id', productExternalId)
              .single()

            if (mentorship) {
              const { data: enrollment } = await supabaseAdmin
                .from('enrollments')
                .upsert({
                  student_id: userId,
                  mentorship_id: mentorship.id,
                  status: 'ativo',
                  start_date: new Date().toISOString().split('T')[0] as string,
                })
                .select('id')
                .single()

              // 3. Record Payment
              await supabaseAdmin.from('payments').insert({
                student_id: userId,
                enrollment_id: enrollment?.id ?? null,
                amount_cents: Math.round((body.order_amount ?? 0) * 100),
                status: 'pago',
                paid_at: new Date().toISOString(),
                method: body.payment_method ?? 'kiwify',
                description: `Kiwify: ${body.product_name ?? 'Mentoria'}`,
              })
            }
          }

          return new Response('ok', { status: 200 })
        } catch (error) {
          console.error('Webhook error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
  },
})
