const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST route to send an email
router.post('/sendMail', async (req, res) => {
  const { from, name, message } = req.body;

  try {
    // Define the site owner's email (fixed recipient)
    const ownerEmail = process.env.OWNER_EMAIL;

    // Create a transporter object using your SMTP provider (e.g., Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    // Define email options
    const mailOptions = {
      from, // the visitor's email
      to: ownerEmail, // the site owner's email (fixed)
      subject: `Message from ${name}`, // e.g., "Message from John Doe"
      text: message, // the visitor's message
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send message');
  }
});

module.exports = router;
