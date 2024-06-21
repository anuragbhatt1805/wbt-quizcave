import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
// import path from 'path';

// Create a transporter using SMTP server information from process.env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // Set to true if using SSL/TLS
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

const handleBarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: 'src/views',
        // layoutsDir: 'src/views',
        defaultLayout: false,
    },
    viewPath: 'src/views',
    extName: '.handlebars',
};

transporter.use('compile', hbs(handleBarOptions));

// Define the email options
export function sendMail(recipient, subject, text, html) {
    const mailOptions = {
        from: 'no-reply@whiteboardtec.com',
        to: recipient,
        subject: subject,
        text: text,
        html: html,
    };
    
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