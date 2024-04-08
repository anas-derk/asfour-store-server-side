// Import Admin Model Object

const { adminModel, mongoose } = require("./all.models");

const { compare } = require("bcryptjs");

async function adminLogin(email, password) {
    try {
        const admin = await adminModel.findOne({ email });
        if (admin) {
            if (!admin.isBlocked) {
                const isTruePassword = await compare(password, admin.password);
                if (isTruePassword)
                    return {
                        msg: "Admin Logining Process Has Been Successfully !!",
                        error: false,
                        data: {
                            _id: admin._id,
                        },
                    };
                return {
                    msg: "Sorry, The Email Or Password Is Not Valid !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: `Sorry, This Account Has Been Blocked !!`,
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: "Sorry, The Email Or Password Is Not Valid !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAdminUserInfo(userId) {
    try {
        // Check If User Is Exist
        const user = await adminModel.findById(userId);
        if (user) return {
            msg: `Get Admin Info For Id: ${user._id} Process Has Been Successfully !!`,
            error: false,
            data: user,
        }
        return {
            msg: "Sorry, The User Is Not Exist, Please Enter Another User Id !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    adminLogin,
    getAdminUserInfo,
}