const nodemailer = require('nodemailer');

const handler = async (req, res) => {
  // Get the current date and time, and check if it's valid
  let requestDate = new Date();
  
  // Check if requestDate is valid
  if (isNaN(requestDate.getTime())) {
    requestDate = new Date(); // Fallback to the current date/time if the date is invalid
  }

  try {
    // Format the request date for better readability
    const formattedRequestDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(requestDate);

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', 'https://vdlf.org');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token, X-Api-Version');
      return res.status(200).send('');
    }

    const { staffEmail, name, email, message } = req.body;
    const myEmail = 'harold@vdlf.org';

    console.log(`
      Date: ${formattedRequestDate}
      To: ${staffEmail}
      From: ${email}
      Message: ${message}
    `);

    if (!staffEmail || !name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

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
            text: `
            On ${formattedRequestDate},
            Name: ${name},
            Email: ${email},  
            wrote: ${message}
            `,
          };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

export default handler;
