import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, phone, details } = await req.json()
    
    const emailHTML = `
        <div>
            <h1>Inquiry from ${name}</h1>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Details: ${details}</p>
        </div>
        `

    const { data, error } = await resend.emails.send({
      from: 'Late Night BBQ <contact@latenightbbq.com>',
      to: ['latenightbbq.htx@gmail.com'],
      subject: 'New Inquiry',
      html: emailHTML,
    })

    if (error) {
      console.error('Error sending email', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error: unknown) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'an unexpected error occured' }), { status: 500 })
  }
}
