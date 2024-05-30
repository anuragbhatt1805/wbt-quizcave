import { sendMail } from "../util/mail.js";

export const sendRegistrationMail= async (name, email, userId, password) => {
    const subject = "Registration Successful";
    const text = `Dear ${name},\n\nYour registration was successful. Your user ID is ${userId} and password is ${password}.`;
    const html = `<p>Dear ${name},</p><p>Your registration was successful. Your user ID is <strong>${userId}</strong> and password is <strong>${password}</strong>.</p>`;

    await sendMail(email, subject, text, html);
}

export const sendDeclaredResult = async (email, name, userId, marks, result) => {
    const subject = "Result Declared";
    const text = `Dear ${name} [${userId}],\n\nYour result has been declared. You scored ${marks} marks and your result is ${result}.`;
    const html = `<p>Dear ${name},</p><p>Your result has been declared. You scored <strong>${marks}</strong> marks and your result is <strong>${result}</strong>.</p>`;

    await sendMail(email, subject, text, html);
}