const nodemailer = require('nodemailer');

// export default async function handler(req: VercelRequest, res: VercelResponse) {
   

//     return res.json({ message: 'Hello World' });
//   }

const handler = async (req, res) => {

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'https://vdlf.org');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token, X-Api-Version');
        return res.status(200).send('');
      }
  
  const requestDate = new Date().toISOString();
  const formattedRequestDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(requestDate);

  const { staffEmail, name, email, message } = req.body;
  const myEmail = 'harold@vdlf.org';

  console.log(`
    To: ${staffEmail}
    from: ${email},
    message: ${message}
    `);


  if (!staffEmail || !name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: `${staffEmail}, ${myEmail}`, 
      subject: `Contact from ${name}`,
      text: `On ${formattedRequestDate},
      Name: ${name},
      Email: ${email},  
      wrote: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

export default handler;
