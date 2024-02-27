// Import Mongoose And User Model Object

const { mongoose, userModel, productModel } = require("../models/all.models");

// require bcryptjs module for password encrypting

const bcrypt = require("bcryptjs");

// Define Create New User Function

async function createNewUser(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Create User Because it is Exist !!!";
        } else {
            // Create New Document From User Schema
            const newUser = new userModel({
                email,
                password: await bcrypt.hash(password, 10),
            });
            // Save The New User As Document In User Collection
            await newUser.save();
            // Disconnect In DB
            await mongoose.disconnect();
            return "Ok !!, Create New User Is Successfuly !!";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function addNewFavoriteProduct(userId, productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(productId);
            if (product) {
                const favorite_productIndex = user.favorite_products_list.findIndex((favorite_product) => favorite_product._id == productId);
                if (favorite_productIndex == -1) {
                    await userModel.updateOne({ _id: userId } , { $push: { favorite_products_list: product } });
                    await mongoose.disconnect();
                    return "Ok !!, Adding New Favorite Product To This User Is Successfuly !!";
                }
                await mongoose.disconnect();
                return "Sorry, The Product Are Already Exist !!, Please Send Another Product Id ..";
            }
            await mongoose.disconnect();
            return "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..";
        }
        await mongoose.disconnect();
        return "Sorry, The User Is Not Exist !!, Please Send Another User Id ..";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function login(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findOne({ email });
        if (user) {
            // Check From Password
            const isTruePassword = await bcrypt.compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user;
            return "Sorry, Email Or Password Incorrect !!";
        }
        await mongoose.disconnect();
        return "Sorry, Email Or Password Incorrect !!";
    }
    catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getUserInfo(userId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        let user = await userModel.findById(userId);
        await mongoose.disconnect();
        if (user) return user;
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Id ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function isExistUserAndVerificationEmail(email) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        const user = await userModel.findOne({ email });
        await mongoose.disconnect();
        if (user) {
            if (!user.isVerified) return user;
            return "Sorry, The Email For This User Has Been Verified !!";
        };
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Email ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllUsers() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const users = await userModel.find({});
        await mongoose.disconnect();
        return users;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getFavoriteProductsCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user){
            await mongoose.disconnect();
            return user.favorite_products_list.length;
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getWalletProductsCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user){
            await mongoose.disconnect();
            return user.products_wallet.length;
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllFavoriteProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user) {
            await mongoose.disconnect();
            const beginSliceIndex = (pageNumber - 1) * pageSize;
            return user.favorite_products_list.slice(beginSliceIndex, beginSliceIndex + pageSize);
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllWalletProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const user = await userModel.findOne({ _id: filters.customerId });
        if (user) {
            await mongoose.disconnect();
            const beginSliceIndex = (pageNumber - 1) * pageSize;
            return user.products_wallet.slice(beginSliceIndex, beginSliceIndex + pageSize);
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function isUserAccountExist(email) {
    try {
        await mongoose.connect(process.env.DB_URL);
        const user = await userModel.findOne({ email });
        if (user) {
            await mongoose.disconnect();
            return {
                _id: user._id,
                isVerified: user.isVerified,
            };
        }
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateUserInfo(userId, newUserData) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        if (newUserData.password && newUserData.newPassword) {
            const userInfo = await userModel.findById(userId);
            if (userInfo) {
                const isTruePassword = await bcrypt.compare(newUserData.password, userInfo.password);
                if (isTruePassword) {
                    await userModel.updateOne({ _id: userId }, {
                        ...newUserData,
                        password: await bcrypt.hash(newUserData.newPassword, 10),
                    });
                    await mongoose.disconnect();
                    return "Updating User Info Process Has Been Successfuly ...";
                } else {
                    await mongoose.disconnect();
                    return "Sorry, This Password Is Uncorrect !!";
                }
            } else {
                await mongoose.disconnect();
                return "Sorry, Invalid User Id";
            }
        } else {
            await userModel.updateOne({ _id: userId }, {
                ...newUserData,
            });
            await mongoose.disconnect();
            return "Updating User Info Process Has Been Successfuly ...";
        }
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateVerificationStatus(email) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const userInfo = await userModel.findOne({ email });
        await userModel.updateOne({ email }, { isVerified: true });
        await mongoose.disconnect();
        return userInfo._id;
    }
    catch(err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function resetUserPassword(userId, newPassword) {
    try {
        await mongoose.connect(process.env.DB_URL);
        const newEncryptedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({ _id: userId }, { password: newEncryptedPassword });
        return "Reseting Password Process Has Been Successfully !!";
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteProductFromFavoriteUserProducts(userId, productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const newFavoriteProductsList = user.favorite_products_list.filter((favorite_product) => favorite_product._id != productId);
            if (newFavoriteProductsList.length !== user.favorite_products_list.length) {
                await userModel.updateOne({ _id: userId } , { $set: { favorite_products_list: newFavoriteProductsList } });
                await mongoose.disconnect();
                return {
                    msg: "Ok !!, Deleting Favorite Product From This User Is Successfuly !!",
                    newFavoriteProductsList: newFavoriteProductsList,
                };
            }
            await mongoose.disconnect();
            return "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..";
        }
        await mongoose.disconnect();
        return "Sorry, The User Is Not Exist !!, Please Send Another User Id ..";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteProductFromUserProductsWallet(userId, productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await userModel.findById(userId);
        if (user) {
            const newProductsWallet = user.products_wallet.filter((wallet_product) => wallet_product._id != productId);
            if (newProductsWallet.length !== user.products_wallet.length) {
                await userModel.updateOne({ _id: userId } , { $set: { products_wallet: newProductsWallet } });
                await mongoose.disconnect();
                return {
                    msg: "Ok !!, Deleting Wallet Product From This User Is Successfuly !!",
                    newProductsWallet: newProductsWallet,
                };
            }
            await mongoose.disconnect();
            return "Sorry, The Product Is Not Exist !!, Please Send Another Product Id ..";
        }
        await mongoose.disconnect();
        return "Sorry, The User Is Not Exist !!, Please Send Another User Id ..";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
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