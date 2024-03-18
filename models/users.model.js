// Import User And Product Model Object

const { userModel, productModel } = require("../models/all.models");

// require bcryptjs module for password encrypting

const { hash, compare } = require("bcryptjs");

// Define Create New User Function

async function createNewUser(email, password) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            return {
                msg: "Sorry, Can't Create User Because it is Exist !!",
                error: true,
                data: {},
            }
        }
        // Create New Document From User Schema
        const newUser = new userModel({
            email,
            password: await hash(password, 10),
        });
        // Save The New User As Document In User Collection
        await newUser.save();
        return {
            msg: "Ok !!, Create New User Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function addNewFavoriteProduct(userId, productId) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(productId);
            if (product) {
                const favorite_productIndex = user.favorite_products_list.findIndex((favorite_product) => favorite_product._id == productId);
                if (favorite_productIndex == -1) {
                    await userModel.updateOne({ _id: userId } , { $push: { favorite_products_list: product } });
                    return {
                        msg: "Ok !!, Adding New Favorite Product To This User Process Has Been Successfuly !!",
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, The Product Are Already Exist !!, Please Send Another Product Id !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, The User Is Not Exist !!, Please Send Another User Id ..",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function login(email, password) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            // Check From Password
            const isTruePassword = await compare(password, user.password);
            if (isTruePassword) {
                return {
                    msg: "Logining Process Has Been Successfully !!",
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                    },
                };
            }
            return {
                msg: "Sorry, Email Or Password Incorrect !!",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, Email Or Password Incorrect !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getUserInfo(userId) {
    try {
        // Check If User Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            return {
                msg: "Get User Info Process Has Been Successfully !!",
                error: false,
                data: user,
            };
        }
        return {
            msg: "Sorry, The User Is Not Exist !!, Please Enter Another User Id ..",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function isExistUserAndVerificationEmail(email) {
    try {
        // Check If User Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                return {
                    msg: "This User Is Exist !!",
                    error: false,
                    data: user,
                };
            }
            return {
                msg: "Sorry, The Email For This User Has Been Verified !!",
                error: true,
                data: {},
            };
        };
        return {
            msg: "Sorry, The User Is Not Exist !!, Please Enter Another User Email ..",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function getAllUsers() {
    try {
        return {
            msg: "Get All Users Process Has Been Successfully !!",
            error: false,
            data: await userModel.find({}),
        };
    } catch (err) {
        throw Error(err);
    }
}

async function getFavoriteProductsCount(filters) {
    try {
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user){
            return {
                msg: "Get Favorite Products Count Process Has Been Successfully !!",
                error: false,
                data: user.favorite_products_list.length,
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getWalletProductsCount(filters) {
    try {
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user){
            return {
                msg: "Get Wallet Products Count Process Has Been Successfully !!",
                error: false,
                data: user.wallet_products_list.length,
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllFavoriteProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user) {
            const beginSliceIndex = (pageNumber - 1) * pageSize;
            return {
                msg: `Get Favorite Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
                error: false,
                data: user.favorite_products_list.slice(beginSliceIndex, beginSliceIndex + pageSize),
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllWalletProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user) {
            const beginSliceIndex = (pageNumber - 1) * pageSize;
            return {
                msg: `Get Wallet Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
                error: false,
                data: user.wallet_products_list.slice(beginSliceIndex, beginSliceIndex + pageSize),
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function isUserAccountExist(email) {
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return {
                msg: "User Is Exist !!",
                error: false,
                data: {
                    _id: user._id,
                    isVerified: user.isVerified,
                },
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function updateUserInfo(userId, newUserData) {
    try {
        if (newUserData.password && newUserData.newPassword) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                const isTruePassword = await compare(newUserData.password, userInfo.password);
                if (isTruePassword) {
                    await userModel.updateOne({ _id: userId }, {
                        ...newUserData,
                        password: await hash(newUserData.newPassword, 10),
                    });
                    return {
                        msg: "Updating User Info Process Has Been Successfuly !!",
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, This Password Is Uncorrect !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, This User Is Not Found !!",
                error: true,
                data: {},
            };
        }
        const user = await userModel.findOneAndUpdate({ _id: userId }, {
            ...newUserData,
        });
        if (user) {
            return {
                msg: "Updating User Info Process Has Been Successfuly !!",
                error: false,
                data: {},
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function updateVerificationStatus(email) {
    try{
        const userInfo = await userModel.findOneAndUpdate({ email }, { isVerified: true });
        if(userInfo) {
            return {
                msg: "Updating Verification Status Process Has Been Successfully !!",
                error: false ,
                data: {
                    _id: userInfo._id,
                    isVerified: userInfo.isVerified,
                },
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    }
    catch(err) {
        throw Error(err);
    }
}

async function resetUserPassword(userId, newPassword) {
    try {
        const newEncryptedPassword = await hash(newPassword, 10);
        const user = await userModel.findOneAndUpdate({ _id: userId }, { password: newEncryptedPassword });
        if (user) {
            return {
                msg: "Reseting Password Process Has Been Successfully !!",
                error: false,
                data: {},
            };
        }
        return {
            msg: "Sorry, This User Is Not Found !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function deleteProductFromFavoriteUserProducts(userId, productId) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const newFavoriteProductsList = user.favorite_products_list.filter((favorite_product) => favorite_product._id != productId);
            if (newFavoriteProductsList.length !== user.favorite_products_list.length) {
                await userModel.updateOne({ _id: userId } , { $set: { favorite_products_list: newFavoriteProductsList } });
                return {
                    msg: "Ok !!, Deleting Favorite Product From This User Is Successfuly !!",
                    error: false,
                    data: {
                        newFavoriteProductsList,
                    },
                };
            }
            return {
                msg: "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, The User Is Not Exist !!, Please Send Another User Id ..",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProductFromUserProductsWallet(userId, productId) {
    try {
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const newProductsWallet = user.wallet_products_list.filter((wallet_product) => wallet_product.productId != productId);
            if (newProductsWallet.length !== user.wallet_products_list.length) {
                await userModel.updateOne({ _id: userId } , { $set: { wallet_products_list: newProductsWallet } });
                return {
                    msg: "Ok !!, Deleting Wallet Product From This User Is Successfuly !!",
                    error: false,
                    data: {
                        newProductsWallet,
                    },
                };
            }
            return {
                msg: "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..",
                error: true,
                data: {},
            };
        }
        return {
            msg: "Sorry, The User Is Not Exist !!, Please Send Another User Id ..",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    createNewUser,
    addNewFavoriteProduct,
    login,
    getUserInfo,
    isUserAccountExist,
    isExistUserAndVerificationEmail,
    getAllUsers,
    getFavoriteProductsCount,
    getWalletProductsCount,
    getAllFavoriteProductsInsideThePage,
    getAllWalletProductsInsideThePage,
    updateUserInfo,
    updateVerificationStatus,
    resetUserPassword,
    deleteProductFromFavoriteUserProducts,
    deleteProductFromUserProductsWallet,
}