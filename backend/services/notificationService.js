// Import required modules
const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Email username
    pass: process.env.EMAIL_PASSWORD, // Email password
  },
});

// Send an email notification
async function sendEmailNotification(to, subject, text, html = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email notification');
  }
}

// Send a notification for a completed transaction
async function sendTransactionNotification(userEmail, transactionDetails) {
  const subject = 'Transaction Completed';
  const text = `Your transaction with ID ${transactionDetails.id} has been completed successfully. Amount: ${transactionDetails.amount} ${transactionDetails.currency}`;
  const html = `
    <p>Your transaction with ID <strong>${transactionDetails.id}</strong> has been completed successfully.</p>
    <p>Amount: <strong>${transactionDetails.amount} ${transactionDetails.currency}</strong></p>
  `;

  return sendEmailNotification(userEmail, subject, text, html);
}

module.exports = {
  sendEmailNotification,
  sendTransactionNotification,
};
