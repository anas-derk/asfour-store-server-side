function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function transporterObj(bussinessEmailPassword) {
    const nodemailer = require('nodemailer');
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = nodemailer.createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: process.env.BUSSINESS_EMAIL,
            pass: bussinessEmailPassword,
        }
    });
    return transporter;
}

async function sendCodeToUserEmail(email) {
    const { getPasswordForBussinessEmail } = require("../models/global_passwords.model");
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (result !== "Sorry, Email Incorrect !!") {
        const CodeGenerator = require('node-code-generator');
        const generator = new CodeGenerator();
        const generatedCode = generator.generateCodes("####")[0];
        const { join } = require("path");
        const { readFileSync } = require("fs");
        const { compile } = require("ejs");
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
            transporterObj(result).sendMail(mailConfigurations, function (error, info) {
                // في حالة حدث خطأ في الإرسال أرجع خطأ
                if (error) reject(error);
                // في حالة لم يحدث خطأ أعد الكود المولد
                resolve(generatedCode);
            });
        });
    }
    return result;
}

function getResponseObject(msg, isError, data) {
    return {
        msg,
        error: isError,
        data,
    }
}

module.exports = {
    isEmail,
    sendCodeToUserEmail,
    getResponseObject,
}