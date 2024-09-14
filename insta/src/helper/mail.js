const nodemailer = require("nodemailer");


const sendEmail = async (email, subject, htmlContent) => {
    try {


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_KEY,
            },
        });

        console.log("Email : ",process.env.AUTH_EMAIL);
        console.log("Pass: ",process.env.AUTH_KEY);

        let mailOptions = {
            from: 'mdjavedshekh777@gmail.com>', // Sender address
            to: email, // Receiver's email
            subject: subject, // Subject line
            html: htmlContent, // HTML body content
        };




        console.log("Transporter : ", transporter.options);

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log(" Email response : ", mailResponse);
        return mailResponse;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports =  sendEmail;