import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'crypto'
import { z } from 'zod'

const payloadSchema = z.object({
  order_id: z.union([z.string().max(120), z.number()]).optional(),
  order_ref: z.union([z.string().max(120), z.number()]).optional(),
  webhook_event_type: z.string().max(60).optional(),
  order_status: z.string().max(50).optional(),
  order_amount: z.coerce.number().min(0).max(10_000_000).optional(),
  Commissions: z
    .object({ charge_amount: z.coerce.number().min(0).max(10_000_000).optional() })
    .optional(),
  product_id: z.union([z.string().max(120), z.number()]).optional(),
  product_name: z.string().max(200).optional(),
  payment_method: z.string().max(50).optional(),
  Product: z
    .object({
      product_id: z.union([z.string().max(120), z.number()]).optional(),
      product_name: z.string().max(200).optional(),
    })
    .optional(),
  Customer: z
    .object({
      email: z.string().email().max(320).optional(),
      full_name: z.string().max(200).optional(),
      mobile: z.string().max(40).optional(),
    })
    .optional(),
  customer: z
    .object({
      email: z.string().email().max(320).optional(),
      full_name: z.string().max(200).optional(),
      mobile: z.string().max(40).optional(),
    })
    .optional(),
})

const PAID_STATUSES = new Set(['paid', 'approved', 'pago', 'aprovado'])
const REVOKE_STATUSES = new Set([
  'refunded',
  'chargedback',
  'chargeback',
  'canceled',
  'cancelled',
  'refused',
  'subscription_canceled',
])

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
    url.searchParams.get('signature') ?? request.headers.get('x-kiwify-signature') ?? ''
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

          const status = (body.order_status ?? '').toLowerCase()
          const email = (body.Customer?.email ?? body.customer?.email)?.toLowerCase().trim()
          const fullName = body.Customer?.full_name ?? body.customer?.full_name ?? ''
          const phone = body.Customer?.mobile ?? body.customer?.mobile ?? null
          const productExternalId = (body.Product?.product_id ?? body.product_id)?.toString()
          const productName = body.Product?.product_name ?? body.product_name ?? 'Mentoria'
          const orderId = (body.order_id ?? body.order_ref)?.toString() ?? null
          const rawAmount = body.Commissions?.charge_amount ?? body.order_amount ?? 0
          // Kiwify sends charge_amount in cents and order_amount in reais.
          const amountCents = body.Commissions?.charge_amount
            ? Math.round(rawAmount)
            : Math.round(rawAmount * 100)

          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

          const log = async (processed: boolean, message: string) => {
            await supabaseAdmin.from('kiwify_events').upsert(
              {
                order_id: orderId,
                event_type: body.webhook_event_type ?? null,
                order_status: status || null,
                customer_email: email ?? null,
                product_external_id: productExternalId ?? null,
                amount_cents: amountCents,
                processed,
                message,
                payload: JSON.parse(rawBody),
              },
              { onConflict: 'order_id,order_status', ignoreDuplicates: false },
            )
          }

          if (!email) {
            await log(false, 'Pedido sem e-mail do cliente.')
            return new Response('Missing customer email', { status: 400 })
          }

          // ---------- Revogação de acesso (reembolso / chargeback / cancelamento) ----------
          if (REVOKE_STATUSES.has(status)) {
            const { data: student } = await supabaseAdmin
              .from('students')
              .select('id')
              .eq('email', email)
              .maybeSingle()

            if (student && productExternalId) {
              const { data: mentorship } = await supabaseAdmin
                .from('mentorships')
                .select('id')
                .eq('external_id', productExternalId)
                .maybeSingle()

              if (mentorship) {
                await supabaseAdmin
                  .from('enrollments')
                  .update({ status: 'cancelada' })
                  .eq('student_id', student.id)
                  .eq('mentorship_id', mentorship.id)
              }
            }
            await log(true, `Acesso revogado (${status}).`)
            return new Response('ok', { status: 200 })
          }

          if (!PAID_STATUSES.has(status)) {
            await log(false, `Status ignorado (${status || 'desconhecido'}).`)
            return new Response('ok', { status: 200 })
          }

          // ---------- 1. Resolve/cria o usuário ----------
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle()

          let userId = profile?.id ?? null

          if (!userId) {
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email,
              email_confirm: true,
              user_metadata: { full_name: fullName },
            })

            if (authUser?.user) {
              userId = authUser.user.id
            } else {
              if (authError) console.error('Kiwify: createUser', authError.message)
              const { data: existing } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle()
              userId = existing?.id ?? null
            }
          }

          if (!userId) {
            await log(false, 'Não foi possível criar/localizar o usuário.')
            return new Response('User resolution failed', { status: 500 })
          }

          // ---------- 2. Resolve a ficha do aluno (students.id != profiles.id) ----------
          let { data: student } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('profile_id', userId)
            .maybeSingle()

          if (!student) {
            const { data: byEmail } = await supabaseAdmin
              .from('students')
              .select('id')
              .eq('email', email)
              .maybeSingle()
            student = byEmail ?? null
          }

          if (!student) {
            const { data: created, error: studentError } = await supabaseAdmin
              .from('students')
              .insert({
                profile_id: userId,
                full_name: fullName || email,
                email,
                phone,
                status: 'ativo',
                notes: 'Criado automaticamente pela Kiwify.',
              })
              .select('id')
              .single()
            if (studentError) {
              console.error('Kiwify: student insert', studentError.message)
              await log(false, 'Falha ao criar a ficha do aluno.')
              return new Response('Student creation failed', { status: 500 })
            }
            student = created
          }

          // ---------- 3. Matrícula na mentoria mapeada ----------
          let enrollmentId: string | null = null
          let matched = false

          if (productExternalId) {
            const { data: mentorship } = await supabaseAdmin
              .from('mentorships')
              .select('id')
              .eq('external_id', productExternalId)
              .maybeSingle()

            if (mentorship) {
              matched = true
              const { data: enrollment } = await supabaseAdmin
                .from('enrollments')
                .upsert(
                  {
                    student_id: student.id,
                    mentorship_id: mentorship.id,
                    status: 'ativa',
                    start_date: new Date().toISOString().split('T')[0] as string,
                  },
                  { onConflict: 'student_id,mentorship_id' },
                )
                .select('id')
                .single()
              enrollmentId = enrollment?.id ?? null
            }

            // Curso avulso mapeado pelo mesmo external_id → libera publicação
            const { data: course } = await supabaseAdmin
              .from('courses')
              .select('id')
              .eq('external_id', productExternalId)
              .maybeSingle()
            if (course) matched = true
          }

          // ---------- 4. Registra o pagamento ----------
          await supabaseAdmin.from('payments').insert({
            student_id: student.id,
            enrollment_id: enrollmentId,
            amount_cents: amountCents,
            status: 'pago',
            paid_at: new Date().toISOString(),
            method: body.payment_method ?? 'kiwify',
            description: `Kiwify: ${productName}`,
          })

          await log(
            true,
            matched
              ? 'Acesso liberado e pagamento registrado.'
              : `Pagamento registrado. Produto ${productExternalId ?? 's/ ID'} não está mapeado em Mentorias/Cursos.`,
          )

          return new Response('ok', { status: 200 })
        } catch (error) {
          console.error('Webhook error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
  },
})
