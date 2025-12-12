
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Your Resend API Key
const RESEND_API_KEY = 're_AwS9C2Xc_Mx3kDkSwLZkc4mUD22JuqiqL';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json()

    console.log(`Sending email to ${to} with subject: ${subject}`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Default sender. Works if 'to' is the account owner email.
        to: to,
        subject: subject,
        html: html
      })
    })

    const data = await res.json()

    if (!res.ok) {
        console.error('Resend API Error:', data);
        return new Response(JSON.stringify(data), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
