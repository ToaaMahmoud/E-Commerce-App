import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 587,
    secure: false,
    auth:{
        user: "toaamahmoud1642003@gmail.com",
        pass: "nwguoifnlfjbuwjs"
    },
    service: "gmail",
    tls:{
        rejectUnauthorized: false
    }
})

export const sendMail = ({ to = "", text = "", html = "", subject = "" }) => {
  transporter.sendMail({
    from: "E-Commerce Site <toaamahmoud1642003@gmail.com>",
    to,
    subject,
    text,
    html,
  });
};