const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");

const resetPasswordEmail = async (username, email, token, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_KEY,
      },
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
            <p>We received a request to reset your password.</p>
            <p>This code is valid for the next 10 minutes. If you didn’t request this, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <a href="http://localhost:8080/verify.html?token=${token}&email=${email}">Reset Password</a>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
             
        </div>
        <div class="footer">
            <p>&copy; 2024  Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 
    `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(mailResponse);

    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message);
  }
};

const verifyEmail = async (username, email, token, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_KEY,
      },
    });

    let mailOptions = {
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
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
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thank you for signing up! To complete your registration, please verify your email address.</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete your verification.</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="http://localhost:8080/api/v1/user/verify/${token}">Verify Email</a>
            <p>This code is valid for the next 10 minutes. If you didn’t request this, please ignore this email.</p>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p></p>
             
        </div>
        <div class="footer">
        <p>Best regards,<br>The E-commerce Team</p>
        <p>If you have any questions, feel free to contact us at test@gmail.com.</p>
        <p>&copy; 2024  Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 
    `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(mailResponse);

    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message);
  }
};

const lowStockEmail = async (username, email, inventory) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_KEY,
      },
    });

    let mailOptions = {
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: `Low Stock Alert: Product ${inventory.product_id}`,
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      background-color: #ffffff;
      width: 80%;
      margin: 0 auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #0044cc;
      color: #ffffff;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
    }
    .content {
      margin-top: 20px;
      font-size: 16px;
      color: #333333;
    }
    .content p {
      margin-bottom: 20px;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .product-table th,
    .product-table td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: left;
    }
    .product-table th {
      background-color: #f7f7f7;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 14px;
      color: #777;
    }
    .footer a {
      color: #0044cc;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Email Header -->
    <div class="header">
      <h1>Low Stock Alert</h1>
    </div>

    <!-- Email Content -->
    <div class="content">
      <p>Dear ${username},</p>
      <p>This is an automatic notification that the stock for one or more of your products has fallen below the restock threshold. Please review the details below and take the necessary actions to restock the items.</p>

      <!-- Product Table -->
      <table class="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Current Stock</th>
            <th>Restock Threshold</th>
            <th>Supplier Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${inventory?.product_id}</td>
            <td>${inventory?.product_name}</td>
            <td>${inventory?.stock}</td>
            <td>${inventory?.restock_threshold}</td>
            <td>${inventory?.supplier_info.toString()}</td>
          </tr>
          <!-- Repeat for other products if needed -->
        </tbody>
      </table>

      <p>Please restock as soon as possible to avoid inventory shortages.</p>
      <p>If you have any questions, feel free to contact us.</p>
    </div>

    <!-- Email Footer -->
    <div class="footer">
      <p>Thank you for your prompt attention to this matter.</p>
      <p><a href="mailto:support@yourcompany.com">Contact Support</a></p>
    </div>
  </div>
</body>
</html>

      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log(mailResponse);

    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new ApiError(error.message);
  }
};

module.exports = { resetPasswordEmail, verifyEmail, lowStockEmail };
