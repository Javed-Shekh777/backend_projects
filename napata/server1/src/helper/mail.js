const nodemailer = require("nodemailer");

const sendMail = async (username, email, token) => {

    try {
        const transpoter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_KEY
            }
        });

        const options = {
            from: "mdjavedshekh777@gmail.com",
            to: email,
            subject: "Request for Forgot Password",
            html: `
        <h2>Hi, ${username}</h2>
        <p>This is request for forget password.</p>
        <p>If you don't do this ,ignore this </p>
        <button style="padding:'12px 15px'; border-radius:'8px';color:'#fff';background:'blue';align-self:center;display:flex;justify-content:center;align-items:center;">
        <a href="http://localhost:3000/forget-password?token=${token}" style="text-decoration:none;color:'#fff';">Click Here</a>
        </button>
        <br/>
        <br/>
        <p>Thanks, 🥰❤️</p>
        <h4>Regards Javed Shekh</h4>
        `
        }


        const mailResponse = await transpoter.sendMail(options);
        if (!mailResponse) {
            console.log("Mail not send", mailResponse);
        }

        return mailResponse;
    } catch (error) {
        throw new Error(error.message);
    }
}