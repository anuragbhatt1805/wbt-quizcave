import nodemailer from 'nodemailer';
// import path from 'path';

// Create a transporter using SMTP server information from process.env
const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // Set to true if using SSL/TLS
	secureConnection: false,
	requireTLS: true,
	debug: true,
    auth: {
        user: "engineering.tests@whiteboardtec.com",
        pass: "Vision**%%21",
    },
    tls: {
       ciphers: 'SSLv3'
    }
});

// Define the email options
export function sendMail(recipient, subject, text, html) {
    const mailOptions = {
        from: 'engineering.tests@whiteboardtec.com',
        to: recipient,
        subject: subject,
        text: text,
        html: html,
    };

    console.log(mailOptions);
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return error;
        } else {
            console.log('Email sent:', info.response);
            return info.response;
        }
    });
}
