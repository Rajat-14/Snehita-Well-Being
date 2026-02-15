const User = require("../model/userSchema");
const UserOtp = require("../model/userOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const Role = require("../model/role");

exports.register = async (req, res) => {
    const { person_name, otp, email, password } = req.body;

    // Email validation regex
    const emailRegex = /^[^!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+@iitrpr\.ac\.in$/i;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please use a valid IIT Ropar email address" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const otpEmailed = await UserOtp.findOne({ where: { email: email } });
        if (otpEmailed && otpEmailed.otp == otp) {
            // Create user (password hashing is handled by BeforeSave hook in model)
            const register = await User.create({
                person_name,
                email,
                password,
            });

            // Create Role entry
            await Role.create({
                email: email,
                role: "client",
            });

            otpEmailed.isOtpVerified = false;
            await otpEmailed.save();

            const userToken = jwt.sign(
                {
                    id: register.id,
                },
                "abcdef"
            );

            res
                .cookie("usertoken", userToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                })
                .status(200)
                .json({ message: "Success!", user: register });
        } else {
            res.status(400).json({ error: "Invalid Otp" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "An error occurred, please try again" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const roleEntry = await Role.findOne({ where: { email: email } });
        const role = roleEntry ? roleEntry.role : "client";

        const userToken = jwt.sign(
            {
                id: user.id,
                role: role,
            },
            "abcdef"
        );

        res
            .cookie("usertoken", userToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
            })
            .status(200)
            .json({ message: "Success!", user: { ...user.toJSON(), role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred, please try again" });
    }
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Email" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) {
        return res.status(400).json({ error: "This user already exists" });
    }

    try {
        const OTP = Math.floor(1000 + Math.random() * 9000);

        const existEmail = await UserOtp.findOne({ where: { email: email } });

        if (existEmail) {
            await UserOtp.update(
                { otp: OTP },
                { where: { id: existEmail.id } }
            );

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Sending email for otp validation",
                text: `OTP:- ${OTP}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(400).json({ error: "Email Not Sent" });
                } else {
                    res.status(200).json({ message: "Email Sent Successfully" });
                }
            });
        } else {
            await UserOtp.create({
                email,
                otp: OTP,
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Sending email for otp validation",
                text: `OTP for Registration:- ${OTP}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(400).json({ error: "Email Not Sent" });
                } else {
                    res.status(200).json({ message: "Email Sent Successfully" });
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid Details", error });
    }
};

exports.sendOtpForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Registered Email" });
    }

    try {
        const presuer = await User.findOne({ where: { email: email } });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await UserOtp.findOne({ where: { email: email } });

            if (existEmail) {
                await UserOtp.update(
                    { otp: OTP },
                    { where: { id: existEmail.id } }
                );

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For Otp Validation",
                    text: `OTP for forgot password:- ${OTP}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(400).json({ error: "email not send" });
                    } else {
                        res.status(200).json({ message: "Email sent Successfully" });
                    }
                });
            } else {
                await UserOtp.create({
                    email,
                    otp: OTP,
                });

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For Otp Validation",
                    text: `OTP:- ${OTP}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(400).json({ error: "email not send" });
                    } else {
                        res.status(200).json({ message: "Email sent Successfully" });
                    }
                });
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Database" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid Details", error });
    }
};

exports.otpVerify = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpEmailed = await UserOtp.findOne({ where: { email: email } });
        if (otpEmailed && otpEmailed.otp == otp) {
            otpEmailed.isOtpVerified = true;
            await otpEmailed.save();
            res.status(200).json({
                message: "OTP verified successfully",
                email: email,
                otp: otp,
            });
        } else {
            res.status(400).json({
                message: "Incorrect OTP",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "Error verifying OTP",
            error: error,
        });
    }
};

exports.changePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        const otpEmailed = await UserOtp.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!otpEmailed.isOtpVerified) {
            return res.status(400).json({ message: "OTP not verified" });
        }

        user.password = password;
        await user.save();

        otpEmailed.isOtpVerified = false;
        await otpEmailed.save();

        res.status(200).json({
            message: "Password reset successfully",
            myuser: user,
        });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error });
    }
};

exports.getLoginSuccess = async (req, res) => {
    const token = req.cookies.usertoken;

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, "abcdef");
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error();
        }

        const roleEntry = await Role.findOne({ where: { email: user.email } });
        const role = roleEntry ? roleEntry.role : "client";

        res
            .status(200)
            .json({ message: "User logged in successfully", user: { ...user.toJSON(), role } });
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("usertoken");
    res.redirect(BASE_URL);
};
