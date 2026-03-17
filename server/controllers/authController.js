const User = require("../model/userSchema");
const UserOtp = require("../model/userOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

const Role = require("../model/role");

exports.register = async (req, res) => {
    const { person_name, otp, email, mobileNumber, gender } = req.body;

    // Email validation regex
    const emailRegex = /^[^!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+@iitrpr\.ac\.in$/i;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please use a valid IIT Ropar email address" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            console.log("Register Error: User already exists", email);
            return res.status(400).json({ error: "User already exists" });
        }

        const otpEmailed = await UserOtp.findOne({ where: { email: email } });
        if (otpEmailed && otpEmailed.otp == otp) {
            const timeDiff = new Date() - new Date(otpEmailed.updatedAt);
            if (timeDiff > 5 * 60 * 1000) {
                console.log("Register Error: OTP expired");
                return res.status(400).json({ error: "OTP has expired" });
            }

            // Create user
            const register = await User.create({
                person_name,
                email,
                mobileNumber,
                gender
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
            console.log(`Register Error: Invalid OTP. Expected: ${otpEmailed ? otpEmailed.otp : 'None'}, Received: ${otp}`);
            res.status(400).json({ error: "Invalid Otp" });
        }
    } catch (error) {
        console.error("Register Catch Error:", error);
        res.status(400).json({ error: "An error occurred, please try again" });
    }
};

exports.login = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const otpEmailed = await UserOtp.findOne({ where: { email: email } });
        if (!otpEmailed || otpEmailed.otp != otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        const timeDiff = new Date() - new Date(otpEmailed.updatedAt);
        if (timeDiff > 5 * 60 * 1000) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        otpEmailed.isOtpVerified = false;
        await otpEmailed.save();

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
                from: process.env.MAIL,
                to: email,
                subject: "Sending email for otp validation",
                text: `OTP:- ${OTP}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Transporter Error API 1:", error);
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
                from: process.env.MAIL,
                to: email,
                subject: "Sending email for otp validation",
                text: `OTP for Registration:- ${OTP}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Transporter Error API 2:", error);
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

exports.sendLoginOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Email" });
    }

    try {
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const OTP = Math.floor(1000 + Math.random() * 9000);

            const existEmail = await UserOtp.findOne({ where: { email: email } });

            if (existEmail) {
                await UserOtp.update(
                    { otp: OTP },
                    { where: { id: existEmail.id } }
                );

                const mailOptions = {
                    from: process.env.MAIL,
                    to: email,
                    subject: "Login Verification OTP",
                    text: `Your login OTP is:- ${OTP}. It expires in 5 minutes.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Transporter Error API 3:", error);
                        res.status(400).json({ error: "Email not sent" });
                    } else {
                        res.status(200).json({ message: "OTP sent successfully" });
                    }
                });
            } else {
                await UserOtp.create({
                    email,
                    otp: OTP,
                });

                const mailOptions = {
                    from: process.env.MAIL,
                    to: email,
                    subject: "Login Verification OTP",
                    text: `Your login OTP is:- ${OTP}. It expires in 5 minutes.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Transporter Error API 4:", error);
                        res.status(400).json({ error: "Email not sent" });
                    } else {
                        res.status(200).json({ message: "OTP sent successfully" });
                    }
                });
            }
        } else {
            res.status(400).json({ error: "User not found" });
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
            const timeDiff = new Date() - new Date(otpEmailed.updatedAt);
            if (timeDiff > 5 * 60 * 1000) {
                return res.status(400).json({ error: "OTP has expired" });
            }

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
    res.status(400).json({ message: "Password authentication is disabled. Please login using OTP." });
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

exports.updateProfile = async (req, res) => {
    try {
        const token = req.cookies.usertoken;
        if (!token) return res.status(401).json({ error: "Not authorized" });

        const decoded = jwt.verify(token, "abcdef");
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        const { mobileNumber, gender } = req.body;

        user.mobileNumber = mobileNumber || user.mobileNumber;
        user.gender = gender || user.gender;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
