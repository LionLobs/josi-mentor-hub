import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/kiwify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          console.log('Kiwify Webhook received:', body)

          // Kiwify sends 'approved' or 'paid' for successful orders
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
                user_metadata: { full_name: fullName }
              })

              if (authError && authError.message !== 'User already registered') {
                console.error('Error creating auth user:', authError)
                return new Response('Error creating user', { status: 500 })
              }
              
              if (authUser?.user) {
                userId = authUser.user.id
              } else {
                const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single()
                userId = existingUser?.id
              }
            }

            if (!userId) {
              return new Response('User resolution failed', { status: 500 })
            }

            // 2. Resolve Mentorship
            const { data: mentorship } = await supabaseAdmin
              .from('mentorships')
              .select('id')
              .eq('external_id', productExternalId)
              .single()

            if (mentorship) {
              const { data: enrollment } = await supabaseAdmin.from('enrollments').upsert({
                student_id: userId,
                mentorship_id: mentorship.id,
                status: 'ativo',
                start_date: new Date().toISOString().split('T')[0] as string
              }).select('id').single()

              // 3. Record Payment
              await supabaseAdmin.from('payments').insert({
                student_id: userId,
                enrollment_id: enrollment?.id ?? null,
                amount_cents: Math.round((body.order_amount || 0) * 100),
                status: 'pago',
                paid_at: new Date().toISOString(),
                method: (body.payment_method as string) || 'kiwify',
                description: `Kiwify: ${body.product_name || 'Mentoria'}`
              })
            }
          }

          return new Response('ok', { status: 200 })
        } catch (error) {
          console.error('Webhook error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      }
    }
  }
})
