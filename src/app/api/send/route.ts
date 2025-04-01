import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, details } = await req.json();

        console.log('Received form data:', { name, email, phone, details });

        const emailHTML = `
        <div>
            <h1>Inquiry from ${name}</h1>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Details: ${details}</p>
        </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'you@resend.dev',
            to: ['delivered@resend.dev'],
            subject: 'New Inquiry',
            html: emailHTML,
        });

        if (error) {
            console.error('Error sending email', error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        return new Response(JSON.stringify(data), {status: 200});
    } catch (error: unknown) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'an unexpected error occured' }), { status: 500 });

    }
}