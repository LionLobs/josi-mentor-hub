import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/api/public/kiwify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          console.log('Kiwify Webhook received:', body)

          // Basic validation of Kiwify payload structure
          // Event: order_approved
          if (body.order_status === 'paid' || body.order_status === 'approved') {
            const email = body.customer?.email
            const fullName = body.customer?.full_name
            const productExternalId = body.product_id?.toString()

            if (!email) {
              return new Response('Missing customer email', { status: 400 })
            }

            const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

            // 1. Ensure user exists in profiles (linked to auth.users via handle_new_user trigger)
            // Note: In a real scenario, you'd might need to create the auth user if they don't exist,
            // but usually, the user signs up or is invited. 
            // For Kiwify, we typically auto-provision.
            
            // Check if user profile exists
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('email', email)
              .single()

            let userId = profile?.id

            if (!userId) {
              // Create auth user if not exists (simplified for this context)
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
                // If user existed but profile didn't (race condition), fetch it
                const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', email).single()
                userId = existingUser?.id
              }
            }

            if (!userId) {
              return new Response('User resolution failed', { status: 500 })
            }

            // 2. Resolve Mentorship or Course by external_id
            const { data: mentorship } = await supabaseAdmin
              .from('mentorships')
              .select('id')
              .eq('external_id', productExternalId)
              .single()

            if (mentorship) {
              await supabaseAdmin.from('enrollments').upsert({
                student_id: userId,
                mentorship_id: mentorship.id,
                status: 'ativo',
                start_date: new Date().toISOString()
              })
            }

            // Also check courses
            const { data: course } = await supabaseAdmin
              .from('courses')
              .select('id')
              .eq('external_id', productExternalId)
              .single()

            if (course) {
              // If there's a specific course enrollment table, use it. 
              // Assuming 'enrollments' handles mentorships and we might need a separate join or generic table.
              // For now, let's assume we log the success.
            }

            // 3. Record Payment
            await supabaseAdmin.from('payments').insert({
              student_id: userId,
              amount_cents: Math.round((body.order_amount || 0) * 100),
              status: 'pago',
              paid_at: new Date().toISOString(),
              method: body.payment_method || 'kiwify'
            })
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
