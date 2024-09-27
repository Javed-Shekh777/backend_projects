const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");

const sendEmail = async (username, email, code) => {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_KEY,
            }
        });

        let mailOptions = {
            from: "mdjavedshekh777@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            margin-top: 0;
            font-size: 20px;
            color: #4CAF50;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #666;
        }
        .content a {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .content a:hover {
            background-color: #45a049;
        }
        .footer {
            padding: 10px;
            background-color: #f1f1f1;
            text-align: center;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi ${username},</h2>
            <p>We received a request to reset your password. Please use the verification code below to reset your password:</p>
            <h3 style="color: #333;">${code}</h3>
            <p>This code is valid for the next 10 minutes. If you didn’t request this, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <a href="{{resetLink}}">Reset Password</a>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p>{{resetLink}}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 
    `,

        };

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;
    } catch (error) {
        throw new ApiError(error.message);

    }

}

module.exports = sendEmail;