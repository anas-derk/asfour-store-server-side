// Import Admin Model Object

const { adminModel } = require("./all.models");

const { compare, hash } = require("bcryptjs");

const { mongoose } = require("../server");

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
        if (user) {
            return {
                msg: `Get Admin Info For Id: ${user._id} Process Has Been Successfully !!`,
                error: false,
                data: user,
            }
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

async function getAdminsCount(merchantId, filters) {
    try {
        const merchant = await adminModel.findById(merchantId);
        if (merchant) {
            if (merchant.isMerchant) {
                return {
                    msg: "Get Admins Count Process Has Been Successfully !!",
                    error: false,
                    data: await adminModel.countDocuments({ ...filters, storeId: merchant.storeId }),
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Merchant Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllAdminsInsideThePage(merchantId, pageNumber, pageSize, filters) {
    try {
        const merchant = await adminModel.findById(merchantId);
        if (merchant) {
            if (merchant.isMerchant) {
                return {
                    msg: `Get All Admins Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
                    error: false,
                    data: await adminModel.find({ ...filters, storeId: merchant.storeId }).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Merchant Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function addNewAdmin(merchantId, adminInfo) {
    try{
        const admin = await adminModel.findById(merchantId);
        if (admin) {
            if (admin.isMerchant){
                if (!admin.isBlocked) {
                    const adminDetails = await adminModel.findOne({ email: adminInfo.email });
                    if (!adminDetails) {
                        const newAdmin = new adminModel({
                            firstName: adminInfo.firstName,
                            lastName: adminInfo.lastName,
                            email: adminInfo.email,
                            password: await hash(adminInfo.password, 10),
                            storeId: admin.storeId,
                            permissions: [
                                {
                                    name: "Add New Brand",
                                    value: true,
                                },
                                {
                                    name: "Update Brand Info",
                                    value: true,
                                },
                                {
                                    name: "Delete Brand",
                                    value: true,
                                },
                                {
                                    name: "Update Order Info",
                                    value: true,
                                },
                                {
                                    name: "Delete Order",
                                    value: true,
                                },
                                {
                                    name: "Update Order Info",
                                    value: true,
                                },
                                {
                                    name: "Update Order Product Info",
                                    value: true,
                                },
                                {
                                    name: "Delete Order Product",
                                    value: true,
                                },
                                {
                                    name: "Add New Category",
                                    value: true,
                                },
                                {
                                    name: "Update Category Info",
                                    value: true,
                                },
                                {
                                    name: "Delete Category",
                                    value: true,
                                },
                                {
                                    name: "Add New Product",
                                    value: true,
                                },
                                {
                                    name: "Update Product Info",
                                    value: true,
                                },
                                {
                                    name: "Delete Product",
                                    value: true,
                                },
                                {
                                    name: "Show And Hide Sections",
                                    value: false,
                                },
                                {
                                    name: "Change Bussiness Email Password",
                                    value: false,
                                },
                                {
                                    name: "Add New Admin",
                                    value: false,
                                },
                            ],
                        });
                        await newAdmin.save();
                        return {
                            msg: "Create New Admin Process Has Been Successfully !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, This Admin Is Already Exist !!",
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
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateAdminInfo(merchantId, adminId, newAdminDetails) {
    try {
        const admin = await adminModel.findById(merchantId);
        if (admin) {
            if (admin.isMerchant){
                if (!admin.isBlocked) {
                    const adminDetails = await adminModel.findOneAndUpdate({ _id: adminId }, { ...newAdminDetails });
                    if (adminDetails) {
                        return {
                            msg: "Updating Admin Details Process Has Been Successfully !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, This Admin Is Not Exist !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Account Has Been Blocked !!",
                    error: true,
                    data: {
                        blockingDate: admin.blockingDate,
                        blockingReason: admin.blockingReason,
                    },
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteAdmin(merchantId, adminId){
    try{
        const admin = await adminModel.findById(merchantId);
        if (admin) {
            if (admin.isMerchant){
                if ((new mongoose.Types.ObjectId(adminId)).equals(merchantId)) {
                    return {
                        msg: "Sorry, Permission Denied !!",
                        error: true,
                        data: {},
                    }
                }
                const adminDetails = await adminModel.findOneAndDelete({ _id: adminId });
                if (adminDetails) {
                    return {
                        msg: "Delete Admin Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Admin Is Not Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    adminLogin,
    getAdminUserInfo,
    getAdminsCount,
    getAllAdminsInsideThePage,
    addNewAdmin,
    updateAdminInfo,
    deleteAdmin
}