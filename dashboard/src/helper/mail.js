const nodemailer = require("nodemailer");

const forgetMail = async (username, email, token, otp) => {
  try {
    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_KEY,
      },
    });

    const options = {
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: "Request for Forgot Password",
      html: `
        <h2>Hi, ${username}</h2>
        <p>This is request for forgot password.</p>
         <p>Your OTP for verification:</p>
          <div style="font-size: 20px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
        <p>If the OTP is not visible or you prefer a one-click verification, click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:8080/api/v1/user/forget-password?token=${token}&email=${email}" 
              style="display: inline-block; padding: 12px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          
          <p>If you did not request this, you can safely ignore this email.</p>
        
        <br/>
        <br/>
          <p>Thanks,</p>
          <p><strong>Javed Shekh</strong></p>
          <p style="font-size: 12px; color: #aaa; text-align: center;">This is an automated email. Please do not reply.</p>
        `,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyMail = async (username, email, token, otp) => {
  try {
    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_KEY,
      },
    });

    const options = {
      from: "mdjavedshekh777@gmail.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #4CAF50;">Hi, ${username}</h2>
          <p>Welcome! Thank you for registering. To complete your registration, please verify your email address.</p>
          
          <p>Your OTP for verification:</p>
          <div style="font-size: 20px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          
          <p>If the OTP is not visible or you prefer a one-click verification, click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:8080/api/v1/user/verify-email?token=${token}&email=${email}" 
              style="display: inline-block; padding: 12px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          
          <p>If you did not request this, you can safely ignore this email.</p>
          
          <br/>
          <p>Thanks,</p>
          <p><strong>Javed Shekh</strong></p>
          <p style="font-size: 12px; color: #aaa; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const mailResponse = await transpoter.sendMail(options);
    if (!mailResponse) {
      console.log("Mail not send", mailResponse);
    }

    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = { forgetMail, verifyMail };
