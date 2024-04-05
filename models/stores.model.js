// Import  Order Model Object

const { storeModel, adminModel, categoryModel, productModel, brandModel } = require("../models/all.models");

const CodeGenerator = require("node-code-generator");

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

async function getAllStoresInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Stores Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await storeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getStoresCount(filters) {
    try {
        return {
            msg: "Get Stores Count Process Has Been Successfully !!",
            error: false,
            data: await storeModel.countDocuments(filters),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getStoreDetails(storeId) {
    try {
        const store = await storeModel.findById(storeId);
        if (store) {
            return {
                msg: `Get Details For Store: ${storeId} Process Has Been Successfully !!`,
                error: false,
                data: store,
            }
        }
        return {
            msg: "Sorry, This Store Is Not Found !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function createNewStore(storeDetails) {
    try{
        const store = await storeModel.findOne({ ownerEmail: storeDetails.ownerEmail });
        if (store) {
            return {
                msg: "Sorry, This Email Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        const newStore = new storeModel(storeDetails);
        await newStore.save();
        return {
            msg: "Creating New Store Process Has Been Successfully !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function approveStore(authorizationId, storeId) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findById(storeId);
                if (store) {
                    if (store.status === "approving") {
                        return {
                            msg: `Sorry, This Store Is Already Approved !!`,
                            error: true,
                            data: {},
                        };
                    }
                    if (store.status === "blocking") {
                        return {
                            msg: `Sorry, This Store Is Blocked !!`,
                            error: true,
                            data: {
                                blockingDate: store.blockingDate,
                                blockingReason: store.blockingReason,
                            },
                        };
                    }
                    await storeModel.updateOne({ _id: storeId }, { status: "approving", approveDate: Date.now() });
                    const generator = new CodeGenerator();
                    const generatedPassword = generator.generateCodes("****##**")[0];
                    const newMerchant = new adminModel({
                        firstName: store.ownerFirstName,
                        lastName: store.ownerLastName,
                        email: store.ownerEmail,
                        password: await hash(generatedPassword, 10),
                        isMerchant: true,
                        storeId,
                    });
                    await newMerchant.save();
                    return {
                        msg: `Approve Store: ( Store Id: ${ storeId }) And Create Merchant Account Process Has Been Successfully !!`,
                        error: false,
                        data: {
                            password: generatedPassword,
                        },
                    };
                }
                return {
                    msg: "Sorry, This Store Is Not Found !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Valid !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateStoreInfo(authorizationId, storeId, newStoreDetails) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOneAndUpdate({ _id: storeId }, { ...newStoreDetails });
                if (store) {
                    return {
                        msg: `Update Details For Store That : ( Id: ${ storeId }) Process Has Been Successfully !!`,
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, This Store Is Not Found !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Valid !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteStore(authorizationId, storeId){
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOneAndDelete({ _id: storeId });
                if (store) {
                    await categoryModel.deleteMany({ storeId });
                    await productModel.deleteMany({ storeId });
                    await brandModel.deleteMany({ storeId });
                    await admin.deleteOne({ storeId });
                    return {
                        msg: `Delete Store Process Has Been Successfully !!`,
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, This Store Is Not Found !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        const store = await storeModel.deleteOne({ _id: storeId });
        if (store) {
            return {
                msg: "Deleting This Store Has Been Successfuly !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Store Is Not Found !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
    getStoreDetails,
    createNewStore,
    approveStore,
    updateStoreInfo,
    deleteStore,
}