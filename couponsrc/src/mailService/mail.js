var nodemailer = require("nodemailer");


const mail = async function (mailOption) {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.MAILER_USER,
        subject: mailOption.subject,
        to: mailOption.to,
        html: mailOption.text
    };

    try {
        
        var info = await transporter.sendMail(mailOptions);
        console.log(info.response);
        return { status: 200, response: info.response };
    } catch (e) {
        console.log(e);
        return { error: e, status: 500 };
    }
};
module.exports=mail;

