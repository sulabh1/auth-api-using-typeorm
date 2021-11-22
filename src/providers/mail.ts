import nodemailer from "nodemailer"
const sendMail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASSWORD
        }
    })
    const mailOption = {
        from: "Sulabh Adhikari",
        to: option.email,
        subject: option.subject,
        html: option.message,
        text: option.text
    }
    await transporter.sendMail(mailOption)
}
export default sendMail