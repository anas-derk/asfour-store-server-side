function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function transporterObj() {
    const nodemailer = require('nodemailer');
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = nodemailer.createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: "info@asfourintlco.com",
            pass: "Asfour@intlco3853",
        }
    });
    return transporter;
}

const { join } = require("path");
const { readFileSync } = require("fs");
const { compile } = require("ejs");

function sendCodeToUserEmail(email) {
    const CodeGenerator = require('node-code-generator');
    const generator = new CodeGenerator();
    const generatedCode = generator.generateCodes("####")[0];
    const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_template.ejs"), "utf-8");
    const compiledTemplate = compile(templateContent);
    const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ generatedCode });
    // إعداد الرسالة قبل إرسالها
    const mailConfigurations = {
        from: "info@asfourintlco.com",
        to: email,
        subject: "Account Verification Code On Asfour International Store",
        html: htmlContentAfterCompilingEjsTemplateFile,
    };
    return new Promise((resolve, reject) => {
        // إرسال رسالة الكود إلى الإيميل
        transporterObj().sendMail(mailConfigurations, function (error, info) {
            // في حالة حدث خطأ في الإرسال أرجع خطأ
            if (error) reject(error);
            // في حالة لم يحدث خطأ أعد الكود المولد
            resolve(generatedCode);
        });
    });
}

module.exports = {
    isEmail,
    sendCodeToUserEmail
}