require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD,
    },
});

module.exports = transporter;
