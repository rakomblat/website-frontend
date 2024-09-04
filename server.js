const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the cors package
require('dotenv').config(); // Import dotenv to load environment variables from a .env file

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port or default to 3001

app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());

app.post('/report', (req, res) => {
  const { domain, isp } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Use environment variable
    port: process.env.SMTP_PORT, // Use environment variable
    secure: false, // Use secure only if true
    auth: {
      user: process.env.SMTP_USER, // Use environment variable
      pass: process.env.SMTP_PASS, // Use environment variable
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM, // Use environment variable
    to: process.env.EMAIL_TO, // Use environment variable
    subject: `Report for ${domain}`,
    text: `The domain ${domain} is not accessible via ${isp}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Report submitted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
