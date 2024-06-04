const { Types } = require("mongoose");

const { getPasswordForBussinessEmail } = require("../models/global_passwords.model");

const { createTransport } = require("nodemailer");

const CodeGenerator = require("node-code-generator");

const { join } = require("path");

const { readFileSync } = require("fs");

const { compile } = require("ejs");

function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function isValidPassword(password) {
    return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
}

function isValidName(name) {
    return name.match(/^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/);
}

function calcOrderAmount(order_lines) {
    let newOrderAmount = 0;
    for (let i = 0; i < order_lines.length; i++) {
        newOrderAmount += order_lines[i].total_amount;
    }
    return newOrderAmount;
}

function transporterObj(bussinessEmailPassword) {
    // إنشاء ناقل بيانات لسيرفر SMTP مع إعداده 
    const transporter = createTransport({
        host: "smtppro.zoho.com",
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

async function sendVerificationCodeToUserEmail(email) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const generator = new CodeGenerator();
        const generatedCode = generator.generateCodes("####")[0];
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "email_template.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ generatedCode });
        const mailConfigurations = {
            from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
            to: email,
            subject: "Account Verification Code On Ubuyblue Store",
            html: htmlContentAfterCompilingEjsTemplateFile,
        };
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail(mailConfigurations, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Confirmation Code Process Has Been Successfully !!",
                    error: false,
                    data: generatedCode,
                });
            });
        });
    }
    return result;
}

async function sendApproveStoreEmail(email, password, adminId, storeId, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "accept_add_store_request.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ password, adminId, storeId, language });
        const mailConfigurations = {
            from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
            to: email,
            subject: "Approve The Store Addition Request At Ubuyblues",
            html: htmlContentAfterCompilingEjsTemplateFile,
        };
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail(mailConfigurations, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Approve Email On Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendRejectStoreEmail(email, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Reject The Store Addition Request At Ubuyblues",
                html: readFileSync(join(__dirname, "..", "assets", "email_templates", "reject_add_store_request.ejs"), "utf-8"),
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Reject Email On Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendBlockStoreEmail(email, adminId, storeId, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "block_store.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ adminId, storeId, language });
        const mailConfigurations = {
            from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
            to: email,
            subject: "Block Store On Ubuyblues",
            html: htmlContentAfterCompilingEjsTemplateFile,
        };
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail(mailConfigurations, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Block Email The Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
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

function checkIsExistValueForFieldsAndDataTypes(fieldNamesAndValuesAndDataTypes) {
    for (let fieldnameAndValueAndDataType of fieldNamesAndValuesAndDataTypes) {
        if (fieldnameAndValueAndDataType.isRequiredValue) {
            if (!fieldnameAndValueAndDataType.fieldValue) 
                return getResponseObject(
                    `Invalid Request, Please Send ${fieldnameAndValueAndDataType.fieldName} Value !!`,
                    true,
                    {}
                );
        }
        if (fieldnameAndValueAndDataType.fieldValue) {
            if (fieldnameAndValueAndDataType.dataType === "number" && isNaN(fieldnameAndValueAndDataType.fieldValue)) {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            } 
            if (fieldnameAndValueAndDataType.dataType === "ObjectId" && !Types.ObjectId.isValid(fieldnameAndValueAndDataType.fieldValue))  {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            }
            if (typeof fieldnameAndValueAndDataType.fieldValue !== fieldnameAndValueAndDataType.dataType && fieldnameAndValueAndDataType.dataType !== "ObjectId")
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
        }
    }
    return getResponseObject("Success In Check Is Exist Value For Fields And Data Types !!", false, {});
}

function validateIsExistValueForFieldsAndDataTypes(fieldsDetails, res, nextFunc) {
    const checkResult = checkIsExistValueForFieldsAndDataTypes(fieldsDetails);
    if (checkResult.error) {
        res.status(400).json(checkResult);
        return;
    }
    nextFunc();
}

module.exports = {
    isEmail,
    isValidPassword,
    isValidName,
    calcOrderAmount,
    sendVerificationCodeToUserEmail,
    sendApproveStoreEmail,
    sendRejectStoreEmail,
    sendBlockStoreEmail,
    getResponseObject,
    checkIsExistValueForFieldsAndDataTypes,
    validateIsExistValueForFieldsAndDataTypes,
}